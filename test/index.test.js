import assert from 'node:assert/strict';
import test from 'node:test';

import { describe, name, version } from '../src/index.js';

test('exports package metadata', () => {
  assert.equal(name, 'actiontaint');
  assert.equal(version, '0.1.0');
  assert.equal(describe().purpose.includes('GitHub Actions'), true);
});
