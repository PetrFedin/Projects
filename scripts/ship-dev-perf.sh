#!/usr/bin/env bash
# После sudo xcodebuild -license: коммиты + push + PR dev-perf.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Git недоступен. Сначала: sudo xcodebuild -license"
  exit 1
fi

BRANCH="${1:-feat/dev-perf-optimization}"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
else
  git checkout -b "$BRANCH"
fi

bash scripts/commit-home-dev-optimization.sh

echo "=== Push ==="
git push -u origin HEAD

echo "=== PR ==="
gh pr create \
  --title "perf(dev): route-gated providers, dev:fast, bench tooling" \
  --body-file .planning/phases/dev-perf/PR_BODY.md \
  || echo "PR may already exist — gh pr view"

echo "Done. CI: check:contracts:ci (incl. test:layout:gates)"
