# Video Brief: Spot Agentic Workflow Injection Risk

## Viewer

Maintainers experimenting with AI-assisted GitHub Actions and agents that read pull request, issue, or comment text.

## Demo arc

1. Open with the risk: untrusted GitHub event text can become an agent prompt or shell input.
2. Show the safe fixture using comment metadata only.
3. Show the risky fixture using PR title and body in `REVIEW_PROMPT`.
4. Run `bash demo/workflow-risk-tour.sh`.
5. Explain the planned scanner output: source field, sink, permission posture, and remediation.

## On-screen commands

```sh
bash demo/workflow-risk-tour.sh
bash scripts/validate.sh
```

## Honest limitations

- This repository is still scaffold-stage; the current demo is a fixture tour, not a scanner result.
- The V1 goal is deterministic local scanning, not hosted analysis or workflow execution.
- The fixture names are examples for contributor discussion and tests.
