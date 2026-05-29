# PRD: actiontaint

Status: in-progress
Decision: build now
Factory run: 2026-05-29 PM

## Pitch

`actiontaint` is a local GitHub Actions workflow scanner for agentic injection risk. It finds untrusted event fields flowing into prompts, shell commands, issue comments, and release automation before an AI workflow ships. 🛡️

## Source Attribution

Inspired by the 2026 paper "Demystifying and Detecting Agentic Workflow Injection Vulnerabilities in GitHub Actions" and recent developer-tooling discussion around agent workflows in CI. This is reframed as a small deterministic local CLI, not a copy of TaintAWI or any external implementation.

## Problem

AI-assisted GitHub Actions often mix pull request titles, issue bodies, comments, and changed file text with prompts or command steps. Reviewers need a quick local audit that explains risky flows without requiring cloud analysis.

## V1 Scope

- TypeScript CLI package.
- `actiontaint scan .github/workflows`
- Parse workflow YAML, jobs, steps, permissions, triggers, and expressions.
- Flag risky untrusted contexts such as `github.event.issue.body`, PR titles, comments, and changed file content flowing into `run`, `prompt`, `with`, environment variables, or token-bearing steps.
- Emit stable Markdown and JSON reports with severity, evidence path, and remediation.
- Include safe, risky, and mixed workflow fixtures.
- No network calls by default.

## Out of Scope

- Full symbolic execution of Actions.
- Running workflows.
- Hosted scanning.

## Verification

Run `npm test`, `npm run check`, `npm run build`, `npm run smoke`, `bash scripts/validate.sh`, and a real CLI smoke against fixture workflows.

