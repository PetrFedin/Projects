#!/usr/bin/env bash
# Wave AE — PG-only Playwright sign-off (requires WORKSHOP2_DATABASE_URL + bootstrap).
#
# Usage:
#   export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
#   export NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1
#   npm run signoff:workshop2:pg
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${WORKSHOP2_DATABASE_URL:-}" ]]; then
  echo "✗ WORKSHOP2_DATABASE_URL is required for PG Playwright sign-off."
  echo ""
  echo "  bash scripts/workshop2-pg-preflight.sh"
  echo "  bash scripts/workshop2-pg-bootstrap.sh --smoke"
  echo "  export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2"
  echo "  export NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1"
  exit 1
fi

echo "== Workshop2 PG sign-off (Wave AE) =="
echo "  WORKSHOP2_DATABASE_URL=set"
echo "  NEXT_PUBLIC_WORKSHOP2_PG_ONLY=${NEXT_PUBLIC_WORKSHOP2_PG_ONLY:-unset}"
echo ""

echo "== 1/2 PG preflight =="
if ! bash scripts/workshop2-pg-preflight.sh; then
  echo "✗ PG preflight failed — bootstrap first:"
  echo "  bash scripts/workshop2-pg-bootstrap.sh --smoke"
  exit 1
fi

echo ""
echo "== 2/2 Playwright PG live describe =="
export NEXT_PUBLIC_WORKSHOP2_PG_ONLY="${NEXT_PUBLIC_WORKSHOP2_PG_ONLY:-1}"
SMOKE_BASE="${WORKSHOP2_SMOKE_BASE_URL:-http://127.0.0.1:3000}"
export PLAYWRIGHT_BASE_URL="${PLAYWRIGHT_BASE_URL:-$SMOKE_BASE}"
export PLAYWRIGHT_SKIP_WEBSERVER="${PLAYWRIGHT_SKIP_WEBSERVER:-1}"
export PLAYWRIGHT_E2E_READY_URL="${PLAYWRIGHT_E2E_READY_URL:-${PLAYWRIGHT_BASE_URL%/}/api/workshop2/health}"

# Не трогаем .next при reuse dev:workshop2 на :3000 (E2E_CLEAR_CACHE ломает hot server).
if ! PLAYWRIGHT_WORKERS=1 npx playwright test e2e/workshop2-ss27.spec.ts --grep "PG live"; then
  echo "✗ Playwright PG live failed"
  exit 1
fi

echo ""
echo "ok: signoff:workshop2:pg finished"
