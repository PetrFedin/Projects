#!/usr/bin/env bash
# Playwright webServer: свежий dev:core с рабочим WORKSHOP2_DATABASE_URL (bridge IP).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MONO="$(cd "${ROOT}/../.." && pwd)"
cd "${ROOT}"

export WORKSHOP2_DATABASE_URL="$(node scripts/resolve-workshop2-database-url.mjs)"
export SYNTH_SKIP_ENTERPRISE_BOOTSTRAP=1
export NEXT_PUBLIC_DISABLE_FONTS=1
export NEXT_PUBLIC_PLATFORM_CORE_MODE=1
export NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE=1
export NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE=1
export NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE=1
export WORKSHOP2_DEV_BYPASS_AUTH=true
export WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER=true

core_e2e_health_ok() {
  local body
  body="$(curl -fsS --max-time 4 http://127.0.0.1:3001/api/workshop2/platform-core/health 2>/dev/null || true)"
  [[ -n "${body}" ]] || return 1
  grep -q '"coreMode":true' <<<"${body}" || return 1
  grep -q '"pgReachable":true' <<<"${body}" || return 1
}

if lsof -nP -iTCP:3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  if core_e2e_health_ok; then
    echo "dev:core e2e — reuse healthy :3001 (PG ok)"
    exit 0
  fi
  echo "→ stale/hung dev:core on :3001 — stopping"
  bash "${MONO}/scripts/stop-stale-next-dev.sh" >/dev/null 2>&1 || true
fi

node scripts/ensure-supported-node.mjs
echo "→ starting dev:core e2e on :3001 · ${WORKSHOP2_DATABASE_URL}"
if [[ "${CORE_DEV_WEBPACK:-}" == "1" ]]; then
  exec npx next dev --hostname 0.0.0.0 --port 3001
fi
exec npx next dev --turbopack --hostname 0.0.0.0 --port 3001
