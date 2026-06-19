#!/usr/bin/env bash
# Workshop2 HTTP smoke — health, critical API routes, hub page (investor demo).
#
# Usage:
#   npm run smoke:workshop2
#   WORKSHOP2_SMOKE_BASE=http://127.0.0.1:3000 bash scripts/workshop2-smoke-test.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="${WORKSHOP2_SMOKE_BASE:-http://127.0.0.1:3000}"
API="${BASE}/api/workshop2"
COL="${WORKSHOP2_SMOKE_COLLECTION:-SS27}"
ART="${WORKSHOP2_SMOKE_ARTICLE:-demo-ss27-01}"
SMOKE_FAIL=0

curl_step() {
  local label="$1"
  local url="$2"
  local method="${3:-GET}"
  local data="${4:-}"
  local code

  if [[ "$method" == "POST" ]]; then
    if [[ -n "$data" ]]; then
      code="$(curl -sS -o /dev/null -w '%{http_code}' -X POST \
        -H 'Content-Type: application/json' \
        -d "$data" \
        "$url" 2>/dev/null || echo "000")"
    else
      code="$(curl -sS -o /dev/null -w '%{http_code}' -X POST \
        -H 'Content-Type: application/json' \
        -d '{}' \
        "$url" 2>/dev/null || echo "000")"
    fi
  else
    code="$(curl -sS -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo "000")"
  fi

  if [[ "$code" =~ ^2[0-9][0-9]$ ]]; then
    echo "[OK] $label ($code)"
  else
    echo "[FAIL] $label → HTTP $code ($url)"
    SMOKE_FAIL=$((SMOKE_FAIL + 1))
  fi
}

echo "== Workshop2 smoke =="
echo "  BASE=$BASE"
echo "  article=$COL/$ART"
echo

curl_step "GET health" "${API}/health"
curl_step "GET references/status" "${API}/references/status"
curl_step "GET hub page" "${BASE}/brand/production/workshop2"
curl_step "GET dossier" "${API}/articles/${COL}/${ART}/dossier"
curl_step "GET events" "${API}/articles/${COL}/${ART}/events"
curl_step "GET handoff-readiness" "${API}/articles/${COL}/${ART}/handoff-readiness"
curl_step "GET sample-order" "${API}/articles/${COL}/${ART}/sample-order"
curl_step "POST wms/reserve-sample" \
  "${API}/articles/${COL}/${ART}/wms/reserve-sample" \
  POST \
  '{"size":"M","quantity":1}'

echo
if [[ "$SMOKE_FAIL" -gt 0 ]]; then
  echo "✗ smoke failed: $SMOKE_FAIL check(s)"
  exit 1
fi
echo "✓ smoke passed ($COL/$ART)"
