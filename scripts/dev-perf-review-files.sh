#!/usr/bin/env bash
# Список файлов dev-perf focus для code review (vs main).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

BASE="${1:-main}"
HEAD="${2:-HEAD}"

if ! git rev-parse --verify "$BASE" >/dev/null 2>&1; then
  echo "Base ref not found: $BASE (fetch origin/main?)"
  exit 1
fi

FOCUS=(
  '_ai-share/synth-1-full/src/app/layout.tsx'
  '_ai-share/synth-1-full/src/app/page.tsx'
  '_ai-share/synth-1-full/src/components/layout/'
  '_ai-share/synth-1-full/src/lib/layout/'
  '_ai-share/synth-1-full/src/lib/auth/auth-bootstrap-route.ts'
  '_ai-share/synth-1-full/src/lib/auth/auth-context.ts'
  '_ai-share/synth-1-full/src/lib/auth/route-guard-public-path.ts'
  '_ai-share/synth-1-full/src/lib/home/'
  '_ai-share/synth-1-full/src/providers/auth-provider'
  '_ai-share/synth-1-full/src/providers/auth-provider-stub.tsx'
  '_ai-share/synth-1-full/src/components/home/'
  '_ai-share/synth-1-full/src/components/route-guard.tsx'
  '_ai-share/synth-1-full/scripts/ci/layout-gates-package-guard.mjs'
  '_ai-share/synth-1-full/scripts/dev-route-benchmark.mjs'
  '_ai-share/synth-1-full/playwright.config.ts'
  '_ai-share/synth-1-full/next.config.ts'
  '_ai-share/synth-1-full/package.json'
  'scripts/dev-verify-perf.sh'
  'scripts/pre-pr-dev-perf.sh'
  'scripts/create-dev-perf-pr.sh'
  'scripts/stop-stale-next-dev.sh'
  'package.json'
  '.github/workflows/unified-ecosystem-e2e-dispatch.yml'
)

echo "=== Dev-perf focus files ($BASE...$HEAD) ==="
git diff "$BASE...$HEAD" --name-only -- "${FOCUS[@]}" | sort -u
echo ""
echo "Total commits: $(git rev-list --count "$BASE...$HEAD" 2>/dev/null || echo '?')"
echo "Scope note: .planning/phases/dev-perf/PR_SCOPE.md"
