import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, '..');

test('package.json has valid structure', () => {
  const pkgPath = join(pkgRoot, 'package.json');
  assert.ok(existsSync(pkgPath), 'package.json should exist');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  assert.strictEqual(pkg.name, 'actiontaint');
  assert.ok(pkg.version, 'version should be defined');
  assert.ok(Array.isArray(pkg.keywords) && pkg.keywords.length > 0, 'keywords should not be empty');
  assert.ok(pkg.repository?.url, 'repository URL should be defined');
  assert.ok(pkg.bugs?.url, 'bugs URL should be defined');
  assert.ok(pkg.homepage, 'homepage should be defined');
});

test('LICENSE file exists and is included in files', () => {
  const licensePath = join(pkgRoot, 'LICENSE');
  assert.ok(existsSync(licensePath), 'LICENSE file should exist');
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
  assert.ok(pkg.files.includes('LICENSE'), 'LICENSE should be listed in files');
});

test('package:smoke script is defined', () => {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts['package:smoke'], 'package:smoke script should be defined');
});

test('release:check script is defined', () => {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts['release:check'], 'release:check script should be defined');
});

test('check script validates syntax', () => {
  const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'));
  assert.ok(pkg.scripts.check, 'check script should be defined');
});
