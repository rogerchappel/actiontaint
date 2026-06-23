#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const expectedFiles = [
  "src/index.js",
  "src/cli.js",
  "fixtures/workflows/token-bearing-message.yml",
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CODE_OF_CONDUCT.md"
];

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"]
});

const [pack] = JSON.parse(output);
const publishedFiles = new Set(pack.files.map((file) => file.path));
const missing = expectedFiles.filter((file) => !publishedFiles.has(file));

if (missing.length > 0) {
  console.error("actiontaint package smoke failed; missing expected file(s):");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
if (packageJson.bin?.actiontaint !== "./src/index.js") {
  console.error("actiontaint package smoke failed; expected actiontaint bin in package metadata.");
  process.exit(1);
}

console.log(`actiontaint package smoke passed with ${pack.files.length} packed file(s).`);
