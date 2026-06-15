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
- `npm run smoke`: `node src/index.js --help && node src/index.js --version`
- `npm run package:smoke`: `npm run build && npm pack --dry-run`
- `npm run release:check`: `npm test && npm run build && npm run smoke && npm run package:smoke`

Run `npm run release:check` when available before opening a release PR. When a command is unavailable, use the closest listed command and record the reason in the PR.

## Reviewer Notes

- Confirm README examples still match the CLI or module exports.
- Confirm `npm pack --dry-run` does not include local fixtures, generated logs, or build caches beyond the intended allowlist.
- Confirm GitHub Actions runs the same install and package smoke path used locally.
