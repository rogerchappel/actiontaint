#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SAFE="$ROOT_DIR/examples/workflows/safe-comment-triage.yml"
RISKY="$ROOT_DIR/examples/workflows/risky-pr-prompt.yml"

echo "== safe fixture metadata fields =="
grep -n "github.event" "$SAFE"

echo
echo "== risky fixture untrusted prompt fields =="
grep -n "github.event.pull_request" "$RISKY"

echo
echo "== risky fixture token-bearing posture =="
grep -n "pull_request_target\\|contents: write\\|pull-requests: write" "$RISKY"

echo
echo "Expected scanner lesson:"
echo "- metadata-only issue comment fields are lower-risk inputs"
echo "- PR title/body are untrusted user-controlled text"
echo "- pull_request_target plus write permissions raises review priority"
