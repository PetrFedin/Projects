#!/usr/bin/env bash
# Sample-shop E2E CI — PG migrations, dev:e2e в фоне, Playwright без webServer (OOM-safe).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

E2E_PORT="${PLAYWRIGHT_E2E_PORT:-3123}"
BASE="${PLAYWRIGHT_BASE_URL:-http://127.0.0.1:${E2E_PORT}}"
WAIT_SEC="${PLAYWRIGHT_E2E_WAIT_SEC:-420}"
export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2}"
export WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER="${WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER:-true}"
export WORKSHOP2_MARKET="${WORKSHOP2_MARKET:-ru}"
export PLAYWRIGHT_E2E_PORT="${E2E_PORT}"

cleanup() {
  node scripts/kill-e2e-port.cjs || true
}
trap cleanup EXIT INT TERM

echo "==> Workshop2 PG migrations"
npm run db:apply:workshop2-migrations

echo "==> Starting dev:e2e (background, external webServer)"
export E2E_CLEAR_CACHE="${E2E_CLEAR_CACHE:-1}"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=12288}"
node scripts/kill-e2e-port.cjs --spawn-dev

echo "==> Waiting for runway health at ${BASE}/api/runway/health (up to ${WAIT_SEC}s)"
export PLAYWRIGHT_E2E_WAIT_MS="$((WAIT_SEC * 1000))"
node scripts/kill-e2e-port.cjs --wait-health

echo "==> Sample-shop Playwright (PLAYWRIGHT_SKIP_WEBSERVER=1)"
npm run test:e2e:sample-shop:external

echo "==> Sample-shop E2E CI passed"
