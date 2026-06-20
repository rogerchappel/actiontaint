# actiontaint Orchestration

## Release Readiness Flow

1. Run `npm run release:check`.
2. Run `node /Users/roger/Developer/my-opensource/releasebox/bin/releasebox.js check .` when ReleaseBox is available locally.
3. Confirm `npm pack --dry-run` includes `src`, docs, license, security, changelog, and contributing files.

## Promotion Notes

- Do not publish until the scanner command has fixture-backed workflow analysis.
- Keep network access out of default checks.
- Treat the current CLI as a readiness placeholder for package metadata and discovery.
