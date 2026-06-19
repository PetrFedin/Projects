#!/usr/bin/env bash
# Platform Core dev server :3001 (идемпотентно).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

if core_lib_core_dev_ready; then
  echo "dev:core уже запущен → http://localhost:3001/platform"
  exit 0
fi

if core_lib_port_listening 3001; then
  echo "Порт :3001 занят, но это не Platform Core." >&2
  echo "Освободите: npm run stop:stale-dev" >&2
  exit 1
fi

cd "${FULL}"

export SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1
# Platform Core dev must not share Playwright's `.next-e2e` dist (see .env.local NEXT_DIST_DIR).
unset NEXT_DIST_DIR
export NEXT_DIST_DIR=.next
export NEXT_PUBLIC_DISABLE_FONTS=1
export NEXT_PUBLIC_PLATFORM_CORE_MODE=1
export NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE=1
export NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE=1
export NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE=1
export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-$(node "${FULL}/scripts/resolve-workshop2-database-url.mjs")}"
export WORKSHOP2_DEV_BYPASS_AUTH="${WORKSHOP2_DEV_BYPASS_AUTH:-true}"
export WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER="${WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER:-true}"
# Optional: REDIS_URL для multi-instance chain-status SSE (poll+bump+redis).
export REDIS_URL="${REDIS_URL:-}"

node scripts/ensure-supported-node.mjs
# Turbopack по умолчанию; webpack: CORE_DEV_WEBPACK=1.
if [[ "${CORE_DEV_WEBPACK:-}" == "1" ]]; then
  exec npx next dev --hostname 0.0.0.0 --port 3001
fi
exec npx next dev --turbopack --hostname 0.0.0.0 --port 3001
