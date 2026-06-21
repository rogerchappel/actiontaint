# actiontaint

Action workflow trust and taint analysis for repositories.

## Status

This repository is an early v0.1.0 implementation. It contains a conservative local-first workflow scanner plus project governance, product notes, and release hygiene files. Treat it as preview software until more workflow patterns and fixtures are covered.

## Install

For local development:

```sh
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

`scan` exits with status `1` when a high-severity finding is present. That makes
it suitable for a local pre-review check, but keep the first rollout advisory
until the workflow fixtures match the patterns in your repository.

## Verify

Run the repository checks before opening a pull request:

```sh
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

`npm run release:check` is the same release-readiness gate used by CI. It
combines tests, syntax validation, the CLI smoke path, and a dry-run npm pack.

## Package Surface

The npm package exposes:

```sh
actiontaint
```

Published files are limited by the `files` allowlist in `package.json` to the
runtime, README, license, security policy, changelog, contributing guide, and
code of conduct.

## Limitations

- The package is still a v0.1.0 project and the scanner uses conservative line-based workflow checks rather than full YAML or expression evaluation.
- Treat the PRD as direction, not a guarantee that every listed capability is implemented.
- Do not use the package as the only control for production security, compliance, or release decisions until fixtures cover your workflow patterns.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT
