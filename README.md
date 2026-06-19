# actiontaint

actiontaint is an early-stage local-first developer tool.

## Status

This repository is early-stage. The README now reflects the current project intent from `docs/PRD.md`, but behavior should still be treated as pre-1.0 until implementation, examples, and release checks mature.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/actiontaint.git
cd actiontaint
npm install
```

## Use

Scan a workflow directory for risky uses of untrusted GitHub event text:

```sh
npx actiontaint scan .github/workflows
npx actiontaint scan .github/workflows --json
```

From a checkout, the same smoke path is:

```sh
node src/index.js scan .github/workflows
```

## Verification

```sh
npm test
npm run package:smoke
npm run release:check
```

`npm run release:check` runs the Node test suite, syntax check, CLI smoke test,
and package dry run so the documented release path matches CI.

## Limitations

- The package is still a v0.1.0 project and the scanner uses conservative line-based workflow checks rather than full YAML or expression evaluation.
- Treat the PRD as direction, not a guarantee that every listed capability is implemented.
- Do not use the package as the only control for production security, compliance, or release decisions until fixtures cover your workflow patterns.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, update the PRD or README when scope changes, and include the exact verification command in every pull request.

## Security

See [SECURITY.md](SECURITY.md). Do not include secrets, private tokens, proprietary dependency data, or sensitive logs in public issues or examples.

## License

MIT

## Package contents

The npm package allowlist includes the runnable source and public support
documents: `README.md`, `LICENSE`, `SECURITY.md`, `CHANGELOG.md`,
`CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md`.

## Release Verification

Before publishing or tagging a release, run the local verification path that matches CI:

- `npm run release:check`
- `npm run package:smoke`

The release checklist in `docs/release-readiness.md` captures the package surface, CLI bins, and reviewer notes for future release PRs.
