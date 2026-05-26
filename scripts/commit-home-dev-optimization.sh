#!/usr/bin/env bash
# Коммиты серии home dev optimization (запускать после: sudo xcodebuild -license)
#   bash scripts/commit-home-dev-optimization.sh
#   bash scripts/commit-home-dev-optimization.sh --list-files
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="$ROOT/_ai-share/synth-1-full"

# /usr/bin/git блокируется без Xcode license; Developer git — если Xcode установлен.
if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

if [[ "${1:-}" == "--list-files" ]]; then
  echo "# Файлы серии dev-perf — для ручного git add после xcodebuild -license"
  grep -E '^  (_ai-share|\.vscode|scripts/|AGENTS\.md|docs/|\.cursor/|package\.json)' "$0" \
    | sed -E 's/^  //; s/ \\$//; s/ 2>.*//; s/ \\$//' \
    | sort -u
  exit 0
fi

if ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  echo "Git недоступен. Сначала: sudo xcodebuild -license"
  echo "Список файлов: bash scripts/commit-home-dev-optimization.sh --list-files"
  exit 1
fi

cd "$ROOT"

echo "=== Commit 1: dev infra ==="
(git add \
  _ai-share/synth-1-full/package.json \
  _ai-share/synth-1-full/next.config.ts \
  _ai-share/synth-1-full/src/lib/runtime/dev-bootstrap-flags.ts \
  _ai-share/synth-1-full/src/lib/runtime/__tests__/dev-bootstrap-flags.test.ts \
  _ai-share/synth-1-full/src/instrumentation-node.ts \
  package.json \
  .vscode/tasks.json \
  .vscode/settings.json \
  AGENTS.md \
  docs/CURSOR_AGENT_TOOLKIT.md \
  .cursor/rules/synth-dev-isolation.mdc \
  _ai-share/synth-1-full/AGENTS.md \
  scripts/dev-verify-perf.sh \
  scripts/stop-stale-next-dev.sh \
  scripts/ship-dev-perf.sh \
  scripts/commit-home-dev-optimization.sh) || true
git commit -m "$(cat <<'EOF'
feat(dev): dev:fast + skip enterprise bootstrap + turbopack fonts alias

Ускоряет локальный Next dev без влияния на production: Turbopack,
SYNTH_SKIP_ENTERPRISE_BOOTSTRAP, NEXT_PUBLIC_DISABLE_FONTS и dev:fast:clean.
EOF
)" || echo "(commit 1: nothing to commit or already committed)"

echo "=== Commit 2: home split ==="
(git add _ai-share/synth-1-full/src/app/page.tsx \
  _ai-share/synth-1-full/src/components/home/ \
  _ai-share/synth-1-full/src/components/home/lib/ \
  _ai-share/synth-1-full/src/components/home/hooks/ \
  _ai-share/synth-1-full/src/components/home/context/ \
  _ai-share/synth-1-full/src/lib/home/ \
  _ai-share/synth-1-full/src/app/api/home/) || true
git commit -m "$(cat <<'EOF'
perf(home): lazy gates, CMS/products split, prefetch catalog

Разрез главной на shell + lazy boundaries, singleton CMS/products cache,
useHomeShellPrefetch из shell, split CMS contexts для below-fold.
EOF
)" || echo "(commit 2: nothing to commit)"

echo "=== Commit 3: lint + smoke + workshop types ==="
(git add \
  _ai-share/synth-1-full/src/app/factory/FactoryLayoutLazyChrome.tsx \
  _ai-share/synth-1-full/src/app/factory/FactoryProductionSidebarChrome.tsx \
  _ai-share/synth-1-full/src/app/factory/FactoryProductionMobileSidebarSheet.tsx \
  _ai-share/synth-1-full/src/components/brand/production/workshop2-*.tsx \
  _ai-share/synth-1-full/src/components/product/scroll-switcher/RunwayCompleteLook.tsx \
  _ai-share/synth-1-full/src/lib/production/workshop2-*-types.ts \
  _ai-share/synth-1-full/src/lib/production/workshop2-matchmaker-persist.ts \
  _ai-share/synth-1-full/src/components/hub/HubSidebar.tsx \
  _ai-share/synth-1-full/e2e/smoke.spec.ts \
  _ai-share/synth-1-full/scripts/dev-route-benchmark.mjs \
  _ai-share/synth-1-full/scripts/check-shared-next-conflict.cjs \
  _ai-share/synth-1-full/scripts/prepare-e2e-webpack-dev.sh \
  _ai-share/synth-1-full/scripts/ci/list-tracked-ts-files.mjs \
  _ai-share/synth-1-full/scripts/ci/*-boundary-guard.mjs \
  _ai-share/synth-1-full/src/**/__tests__/runway-analytics-provider.test.tsx \
  _ai-share/synth-1-full/scripts/prepare-e2e-webpack-dev.sh) || true
git commit -m "$(cat <<'EOF'
fix(lint): workshop hooks, factory sidebar paths, AI flow types

Исправляет conditional hooks ESLint, no-sync-scripts в тесте runway analytics,
пути dynamic import FactoryProduction/Supplier sidebar panels (500 в e2e),
вынос типов match-contractors/analyze-dfm для ai-client-boundary guard.
Fallback list-tracked-ts-files когда git ls-files недоступен; test:e2e:home.
EOF
)" || echo "(commit 3: nothing to commit)"

echo "=== Commit 4: provider gates + bench + cabinet chrome ==="
(git add \
  _ai-share/synth-1-full/src/components/layout/B2BStateProviderGate.tsx \
  _ai-share/synth-1-full/src/components/layout/B2BStateProviderSync.tsx \
  _ai-share/synth-1-full/src/components/layout/UIStateProviderGate.tsx \
  _ai-share/synth-1-full/src/components/layout/UIStateProviderSync.tsx \
  _ai-share/synth-1-full/src/components/layout/NotificationsProviderGate.tsx \
  _ai-share/synth-1-full/src/components/layout/NotificationsProviderSync.tsx \
  _ai-share/synth-1-full/src/lib/layout/ \
  _ai-share/synth-1-full/src/components/layout/QueryProviderGate.tsx \
  _ai-share/synth-1-full/src/components/layout/NuqsProviderGate.tsx \
  _ai-share/synth-1-full/src/components/layout/RunwayAnalyticsGate.tsx \
  _ai-share/synth-1-full/src/components/layout/RolePanelGate.tsx \
  _ai-share/synth-1-full/src/components/layout/client-layout.tsx \
  _ai-share/synth-1-full/src/components/layout/ClientLayoutLazyParts.tsx \
  _ai-share/synth-1-full/src/components/layout/DevOnlyChromeGate.tsx \
  _ai-share/synth-1-full/src/components/layout/dev-only-chrome.tsx \
  _ai-share/synth-1-full/src/components/layout/RootClientProviders.tsx \
  _ai-share/synth-1-full/scripts/dev-route-benchmark.mjs \
  _ai-share/synth-1-full/scripts/check-shared-next-conflict.cjs \
  _ai-share/synth-1-full/scripts/prepare-e2e-webpack-dev.sh \
  _ai-share/synth-1-full/src/app/brand/BrandLayoutLazyChrome.tsx \
  _ai-share/synth-1-full/src/components/shop/ShopSidebar.tsx \
  _ai-share/synth-1-full/src/app/admin/AdminLayoutLazyChrome.tsx \
  _ai-share/synth-1-full/src/app/distributor/DistributorLayoutLazyChrome.tsx \
  _ai-share/synth-1-full/src/components/layout/ClientCabinetSidebarPanel.tsx \
  _ai-share/synth-1-full/e2e/smoke.spec.ts \
  _ai-share/synth-1-full/package.json \
  _ai-share/synth-1-full/AGENTS.md \
  package.json \
  scripts/commit-home-dev-optimization.sh \
  scripts/ship-dev-perf.sh \
  docs/CURSOR_AGENT_TOOLKIT.md \
  .planning/phases/dev-perf/PR_BODY.md \
  .planning/phases/dev-perf/VERIFICATION.md \
  .planning/phases/dev-perf/SHIP_CHECKLIST.md \
  .planning/research/dev-perf-next-milestone.md) || true
git commit -m "$(cat <<'EOF'
perf(layout): route-gated B2B/UI providers + dev route benchmark

Не монтирует тяжёлые B2B/UI state на retail shop subroutes; hub /shop
и shop/b2b сохраняют B2BStateProvider. dev:bench с pause/retry; smoke shell
wait; nav cluster exports для compile-fix кабинетов.
EOF
)" || echo "(commit 4: nothing to commit)"

git status --short
echo "Done. Run: npm run smoke && npm run dev:bench:hubs"
