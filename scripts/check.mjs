#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { execFileSync } from "node:child_process";

const requiredFiles = [
  "src/index.js",
  "src/cli.js",
  "fixtures/workflows/token-bearing-message.yml",
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CHANGELOG.md"
];

for (const file of requiredFiles) {
  await access(file, constants.R_OK);
}

const packageJson = JSON.parse(await readFile("package.json", "utf8"));

if (packageJson.type !== "module") {
  throw new Error("package.json must declare type=module for the ESM CLI.");
}

if (packageJson.bin?.actiontaint !== "./src/index.js") {
  throw new Error("package.json bin.actiontaint must point at ./src/index.js.");
}

if (!packageJson.scripts?.["release:check"]?.includes("npm run check")) {
  throw new Error("release:check must include npm run check.");
}

for (const file of ["src/index.js", "src/cli.js", "scripts/pack-smoke.mjs"]) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

console.log("actiontaint check passed.");
