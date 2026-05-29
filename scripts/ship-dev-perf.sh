#!/usr/bin/env bash
# После sudo xcodebuild -license: push + PR dev-perf (коммиты уже в ветке).
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
git checkout "$BRANCH"
git pull origin "$BRANCH" 2>/dev/null || true

echo "=== Pre-PR static ==="
npm run pre-pr:dev-perf

echo "=== Push ==="
git push -u origin HEAD

echo "=== PR ==="
bash scripts/create-dev-perf-pr.sh "$BRANCH" main

echo "Done. CI: check:contracts:ci (45 layout-gate tests). Scope: .planning/phases/dev-perf/PR_SCOPE.md"
