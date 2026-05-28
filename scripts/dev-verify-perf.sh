#!/usr/bin/env bash
# Статическая верификация dev-perf (в CI = check:contracts:ci / npm run smoke).
# Полный цикл с dev-сервером: test:e2e:light → dev:fast:clean → dev:bench:routes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

if git -C "$ROOT/_ai-share/synth-1-full" diff --quiet HEAD -- 2>/dev/null; then
  :
else
  echo "⚠ dirty tree in synth-1-full — verify может падать (workshop2 WIP, ai-client-boundary)."
  echo "  Для PR: git stash или отдельная ветка. См. .planning/phases/dev-perf/PR_READY.md"
  echo ""
fi

cd "$ROOT"
echo "=== npm run smoke (check:contracts:ci + layout gates) ==="
npm run smoke

echo ""
echo "=== OK (static). Next with dev:fast:clean on :3000 ==="
echo "  npm run dev:bench:hubs"
echo "  npm run dev:bench:routes"
echo "  npm run test:e2e:light  # ~7 min, separate"
