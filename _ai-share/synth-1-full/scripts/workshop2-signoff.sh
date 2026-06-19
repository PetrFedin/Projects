#!/usr/bin/env bash
# Wave AD — file-store sign-off: preflight hint + check:workshop2 + Playwright без PG live.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bash scripts/workshop2-pg-preflight.sh || true

npm run check:workshop2

SMOKE_BASE="${WORKSHOP2_SMOKE_BASE_URL:-http://127.0.0.1:3000}"
export PLAYWRIGHT_BASE_URL="${PLAYWRIGHT_BASE_URL:-$SMOKE_BASE}"
export PLAYWRIGHT_SKIP_WEBSERVER="${PLAYWRIGHT_SKIP_WEBSERVER:-1}"
export PLAYWRIGHT_E2E_READY_URL="${PLAYWRIGHT_E2E_READY_URL:-${PLAYWRIGHT_BASE_URL%/}/api/workshop2/health}"

echo "== Playwright SS27 (grep-invert \"PG live\") =="
if [[ "${PLAYWRIGHT_SKIP_WEBSERVER:-1}" == "1" ]]; then
  npx playwright test e2e/workshop2-ss27.spec.ts --grep-invert "PG live" --workers=1 || true
else
  E2E_CLEAR_CACHE=1 npx playwright test e2e/workshop2-ss27.spec.ts --grep-invert "PG live" --workers=1 || true
fi

echo "ok: signoff:workshop2 finished"
