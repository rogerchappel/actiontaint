# Workflow Risk Fixture Tour

`actiontaint` is scoped as a local GitHub Actions workflow scanner for agentic injection risk. The checked-in fixtures give contributors a concrete starting point before the scanner implementation lands.

## Run the fixture tour

```sh
bash demo/workflow-risk-tour.sh
```

The script highlights two workflow shapes:

- `examples/workflows/safe-comment-triage.yml` records comment and issue metadata only.
- `examples/workflows/risky-pr-prompt.yml` feeds pull request title and body text into an agent prompt under `pull_request_target` with write permissions.

## What a scanner should report later

For the risky fixture, a future `actiontaint scan examples/workflows` report should point at:

- the untrusted fields: `github.event.pull_request.title` and `github.event.pull_request.body`
- the sink: `REVIEW_PROMPT` consumed by `./agent-review --prompt`
- the posture: `pull_request_target`, `contents: write`, and `pull-requests: write`
- the remediation: gate untrusted text, reduce permissions, and avoid privileged execution from untrusted PR content

The safe fixture should remain useful as a low-risk contrast case because it uses stable metadata IDs instead of free-form comment text.
