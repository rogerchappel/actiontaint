#!/usr/bin/env node
import { describe, version } from './index.js';

function printHelp() {
  console.log(`actiontaint

Usage:
  actiontaint --help
  actiontaint --version
  actiontaint describe [--json]

Commands:
  describe  Print the current package purpose while scanner implementation is in progress.
`);
}

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h' || command === 'help') {
  printHelp();
} else if (command === '--version' || command === '-v') {
  console.log(version);
} else if (command === 'describe') {
  const info = describe();
  if (args.includes('--json')) {
    console.log(JSON.stringify(info, null, 2));
  } else {
    console.log(`${info.name} ${info.version}: ${info.purpose}`);
  }
} else {
  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}
