#!/usr/bin/env bash
# Pre-PR gate для dev-perf: статика обязательна, e2e — флаг --e2e.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RUN_E2E=false
for arg in "$@"; do
  case "$arg" in
    --e2e) RUN_E2E=true ;;
    -h|--help)
      echo "Usage: bash scripts/pre-pr-dev-perf.sh [--e2e]"
      echo "  default: verify:dev-perf only (~5s)"
      echo "  --e2e:   + test:e2e:light (~7–15 min, port :3123)"
      exit 0
      ;;
  esac
done

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

echo "=== Branch ==="
git branch --show-current
git status -sb _ai-share/synth-1-full 2>/dev/null | head -5 || true
echo ""

echo "=== Static (CI parity) ==="
npm run verify:dev-perf

if [[ "$RUN_E2E" == true ]]; then
  echo ""
  echo "=== E2E light (CI merge gate) ==="
  npm run stop:stale-dev
  npm run test:e2e:light
fi

echo ""
echo "=== PR ==="
echo "  bash scripts/create-dev-perf-pr.sh"
echo "  Compare: https://github.com/PetrFedin/Projects/compare/main...feat/dev-perf-optimization?expand=1"
