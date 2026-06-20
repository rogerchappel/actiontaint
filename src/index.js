#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const help = `actiontaint

Local-first GitHub Actions workflow scanner for risky untrusted event use.

Usage:
  actiontaint --help
  actiontaint --version
  actiontaint scan [path] [--json]

Examples:
  actiontaint scan .github/workflows
  actiontaint scan .github/workflows --json

The scanner is intentionally conservative while the project is pre-1.0.`;

const version = "0.1.0";
const untrustedContextPattern = /github\.event\.(issue|pull_request|comment|review|release|discussion)\.(body|title|name|comment|description)|github\.event\.comment\.body|github\.event\.pull_request\.body/g;
const sensitiveSinkPattern = /^\s*(?:-\s*)?(run:|env:|with:|prompt:|body:|message:|script:|args:)/;
const tokenPattern = /GITHUB_TOKEN|secrets\.|contents:\s*write|pull-requests:\s*write|issues:\s*write|id-token:\s*write/i;

export async function scanPath(targetPath = ".github/workflows") {
  const files = await collectWorkflowFiles(targetPath);
  const findings = [];

  for (const file of files) {
    const text = await readFile(file, "utf8");
    findings.push(...scanWorkflowText(text, file));
  }

  return {
    schemaVersion: 1,
    scannedFiles: files.length,
    findings
  };
}

export function scanWorkflowText(text, file = "<inline>") {
  const lines = text.split(/\r?\n/);
  const findings = [];
  let tokenBearingStep = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/^\s*-\s+name:/.test(line) || /^\s*-\s+uses:/.test(line) || /^\s*-\s+run:/.test(line)) {
      tokenBearingStep = false;
    }

    if (tokenPattern.test(line)) {
      tokenBearingStep = true;
    }

    const contexts = [...line.matchAll(untrustedContextPattern)].map((match) => match[0]);
    if (contexts.length === 0) {
      continue;
    }

    const sinkMatch = line.match(sensitiveSinkPattern);
    const sink = sinkMatch ? sinkMatch[1].replace(/:$/, "") : "expression";
    const severity = tokenBearingStep || sink === "run" || sink === "script" ? "high" : "medium";

    findings.push({
      severity,
      file,
      line: index + 1,
      sink,
      contexts: [...new Set(contexts)],
      evidence: line.trim(),
      remediation: "Avoid flowing untrusted event text directly into shell, prompt, or token-bearing steps; validate, quote, or route through a reviewed fixture."
    });
  }

  return findings;
}

async function collectWorkflowFiles(targetPath) {
  const entry = await stat(targetPath);

  if (entry.isFile()) {
    return isWorkflowFile(targetPath) ? [targetPath] : [];
  }

  const files = [];
  for (const name of await readdir(targetPath)) {
    const child = join(targetPath, name);
    const childStat = await stat(child);
    if (childStat.isDirectory()) {
      files.push(...await collectWorkflowFiles(child));
    } else if (isWorkflowFile(child)) {
      files.push(child);
    }
  }

  return files.sort();
}

function isWorkflowFile(file) {
  return /\.(ya?ml)$/i.test(file);
}

function formatMarkdown(result) {
  if (result.findings.length === 0) {
    return `# actiontaint report\n\nScanned ${result.scannedFiles} workflow file(s). No risky untrusted event flows found.\n`;
  }

  const lines = [
    "# actiontaint report",
    "",
    `Scanned ${result.scannedFiles} workflow file(s). Found ${result.findings.length} potential risky flow(s).`,
    ""
  ];

  for (const finding of result.findings) {
    lines.push(
      `## ${finding.severity.toUpperCase()} ${finding.file}:${finding.line}`,
      "",
      `- Sink: \`${finding.sink}\``,
      `- Context: ${finding.contexts.map((context) => `\`${context}\``).join(", ")}`,
      `- Evidence: \`${finding.evidence.replaceAll("`", "'")}\``,
      `- Remediation: ${finding.remediation}`,
      ""
    );
  }

  return `${lines.join("\n")}\n`;
}

async function main(argv) {
  const [command, maybePath, maybeJson] = argv;

  if (command === "--version" || command === "-v") {
    console.log(version);
    return 0;
  }

  if (command === "scan") {
    const targetPath = maybePath && maybePath !== "--json" ? maybePath : ".github/workflows";
    const json = maybePath === "--json" || maybeJson === "--json";
    const result = await scanPath(targetPath);
    console.log(json ? JSON.stringify(result, null, 2) : formatMarkdown(result));
    return result.findings.some((finding) => finding.severity === "high") ? 1 : 0;
  }

  console.log(help);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
