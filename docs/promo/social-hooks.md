# Social Hooks

## Short posts

1. `actiontaint` is being shaped around a sharp local question: where does untrusted GitHub Actions event text flow into agent prompts, shell commands, or write-permission automation?

2. New fixture tour for `actiontaint`: compare metadata-only issue comment handling with a risky `pull_request_target` agent prompt built from PR title and body.

3. Agentic workflow injection risk is easiest to review with concrete sources and sinks. `actiontaint` now has starter fixtures for that scanner contract.

## Demo CTA

```sh
bash demo/workflow-risk-tour.sh
```

## Grounding facts

- The risky fixture uses `github.event.pull_request.title` and `github.event.pull_request.body`.
- The risky fixture also uses `pull_request_target` with write permissions.
- The current demo is a fixture tour, not a completed scan command.
