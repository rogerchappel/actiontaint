import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { scanWorkflowText } from '../src/index.js';

const execFileAsync = promisify(execFile);

describe('actiontaint', () => {
  it('should export from src/index.js', async () => {
    const mod = await import('../src/index.js');
    assert.ok(mod, 'module should load');
  });

  it('should have a package.json with required fields', async () => {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    assert.ok(pkg.default.name, 'name should exist');
    assert.ok(pkg.default.version, 'version should exist');
    assert.ok(pkg.default.license, 'license should exist');
    assert.ok(pkg.default.author, 'author should exist');
    assert.ok(pkg.default.repository, 'repository should exist');
    assert.ok(pkg.default.bugs, 'bugs should exist');
    assert.ok(pkg.default.homepage, 'homepage should exist');
  });

  it('should have test script in package.json', async () => {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    assert.ok(pkg.default.scripts.test, 'test script should exist');
    assert.ok(pkg.default.scripts['package:smoke'], 'package:smoke should exist');
    assert.ok(pkg.default.scripts['release:check'], 'release:check should exist');
  });

  it('should include LICENSE in npm pack', async () => {
    const pkg = await import('../package.json', { with: { type: 'json' } });
    assert.ok(pkg.default.files.includes('LICENSE'), 'LICENSE should be in files');
  });

  it('should expose help and version output from the CLI', async () => {
    const help = await execFileAsync(process.execPath, ['src/index.js', '--help']);
    assert.match(help.stdout, /Usage:/);
    assert.match(help.stdout, /actiontaint --version/);
    assert.match(help.stdout, /actiontaint scan/);

    const version = await execFileAsync(process.execPath, ['src/index.js', '--version']);
    assert.match(version.stdout, /^0\.1\.0\s*$/);
  });

  it('flags untrusted pull request text in shell steps', () => {
    const findings = scanWorkflowText(`
name: risky
jobs:
  triage:
    steps:
      - run: echo "\${{ github.event.pull_request.title }}"
`, 'risky.yml');

    assert.equal(findings.length, 1);
    assert.equal(findings[0].severity, 'high');
    assert.equal(findings[0].sink, 'run');
    assert.deepEqual(findings[0].contexts, ['github.event.pull_request.title']);
  });

  it('prints JSON scan output for workflow directories', async () => {
    const root = await makeTempWorkflowDir();
    try {
      await writeFile(join(root, 'safe.yml'), 'name: safe\njobs:\n  ok:\n    steps:\n      - run: echo safe\n');
      await writeFile(join(root, 'risky.yaml'), 'name: risky\njobs:\n  audit:\n    steps:\n      - run: echo "${{ github.event.issue.body }}"\n');

      await assert.rejects(
        execFileAsync(process.execPath, ['src/index.js', 'scan', root, '--json']),
        (error) => {
          const report = JSON.parse(error.stdout);
          assert.equal(error.code, 1);
          assert.equal(report.scannedFiles, 2);
          assert.equal(report.findings.length, 1);
          assert.equal(report.findings[0].contexts[0], 'github.event.issue.body');
          return true;
        }
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});

async function makeTempWorkflowDir() {
  const root = join(tmpdir(), `actiontaint-${process.pid}-${Date.now()}`);
  await mkdir(root, { recursive: true });
  return root;
}
