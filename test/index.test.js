import { describe, it } from 'node:test';
import assert from 'node:assert';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

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

    const version = await execFileAsync(process.execPath, ['src/index.js', '--version']);
    assert.match(version.stdout, /^0\.1\.0\s*$/);
  });
});
