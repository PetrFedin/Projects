#!/usr/bin/env bash
# Полный pre-merge чеклист dev-perf (статика + подсказки для e2e/bench).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== Phase 1: static (CI parity) ==="
bash scripts/dev-verify-perf.sh

echo ""
echo "=== Phase 2: optional local (needs free ports + RAM) ==="
cat <<'EOF'
  # Остановить :3000 / :3123, очистить .next после e2e:
  npm run stop:stale-dev && npm run dev:fast:clean

  # E2E (отдельный webpack dev на :3123, ~7–15 min):
  npm run test:e2e:light
  npm run test:e2e:verification

  # Bench (только после clean, один прогон за раз):
  npm run dev:bench:ci
  npm run dev:bench:routes

  # Cabinet hubs — тяжёлый (~2h локально); CI — источник правды:
  npm run test:e2e:cabinet-hubs
EOF

echo ""
echo "=== Phase 3: PR ==="
echo "  bash scripts/create-dev-perf-pr.sh"
echo "  # или compare: https://github.com/PetrFedin/Projects/compare/main...feat/dev-perf-optimization?expand=1"
