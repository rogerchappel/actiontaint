# Release Readiness

Use this checklist before cutting a release or asking a reviewer to trust the package contents.

## Public Package Surface

- Package: `actiontaint`
- Repository: `https://github.com/rogerchappel/actiontaint`
- Published files are controlled by the `files` allowlist in `package.json`.

## CLI Surface

- `actiontaint` -> `./src/index.js`

## Verification Commands

- `npm run test`: `node --test`
- `npm run build`: `node --check src/index.js`
- `npm run smoke`: `node src/index.js --help && node src/index.js --version && node src/cli.js --help && node src/index.js scan .github/workflows`
- `npm run package:smoke`: `npm run build && node scripts/pack-smoke.mjs`
- `npm run release:check`: `npm test && npm run build && npm run smoke && npm run package:smoke`

Run `npm run release:check` when available before opening a release PR. When a command is unavailable, use the closest listed command and record the reason in the PR.
The package smoke script verifies the dry-run pack contents, CLI bin mapping,
repository links, issue tracker, README homepage, and release-check wiring.

## Reviewer Notes

- Confirm README examples still match the CLI or module exports.
- Confirm `npm pack --dry-run` does not include local fixtures, generated logs, or build caches beyond the intended allowlist.
- Confirm GitHub Actions runs the same install and package smoke path used locally.
- Confirm the first release keeps scanner failures advisory unless the release
  notes explicitly document enforcing high-severity findings in CI.
