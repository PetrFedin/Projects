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
PR_TITLE="perf(dev): route-gated providers, dev:fast, bench tooling"
PR_BODY_FILE=".planning/phases/dev-perf/PR_BODY.md"
PR_WEB_URL="https://github.com/PetrFedin/Projects/compare/main...${BRANCH}?expand=1"

if command -v gh >/dev/null 2>&1; then
  gh pr create --title "$PR_TITLE" --body-file "$PR_BODY_FILE" \
    || echo "PR may already exist — gh pr view"
else
  echo "gh CLI не найден. Создайте PR вручную:"
  echo "  $PR_WEB_URL"
  echo "  Title: $PR_TITLE"
  echo "  Body:  $PR_BODY_FILE"
fi

echo "Done. CI: check:contracts:ci (incl. test:layout:gates)"
