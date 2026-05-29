#!/usr/bin/env bash
# Wave 58: one-shot human UAT signoff for investor demo prep (ops + staging + product).
# Usage: bash scripts/workshop2-human-uat-signoff.sh [BASE_URL]
# Default BASE: http://127.0.0.1:3123 (PLAYWRIGHT_E2E_PORT / WORKSHOP2_STAGING_PUBLIC_URL)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PLAYWRIGHT_E2E_PORT:-3123}"
BASE="${1:-${WORKSHOP2_STAGING_PUBLIC_URL:-http://127.0.0.1:${PORT}}}"
BASE="${BASE%/}"

sign() {
  local role="$1"
  local who="$2"
  echo "[workshop2-human-uat-signoff] POST ${role} (${who}) → ${BASE}"
  curl -sf -X POST "${BASE}/api/workshop2/uat/ss27/signoff" \
    -H 'Content-Type: application/json' \
    -d "{\"role\":\"${role}\",\"signedBy\":\"${who}\",\"notes\":\"investor-demo-prep wave58\"}" \
    | jq -c '{ok, role, humanSignoffComplete, wave55FreezeReady, messageRu}'
}

sign ops "ops-lead-demo"
sign staging "qa-lead-demo"
sign product "product-lead-demo"

echo "[workshop2-human-uat-signoff] journal: .planning/workshop2-ss27-uat-signoff.json"
if command -v jq >/dev/null 2>&1 && [[ -f .planning/workshop2-ss27-uat-signoff.json ]]; then
  jq '{entries: [.entries[] | {role, signedBy, signedAt}], updatedAt}' .planning/workshop2-ss27-uat-signoff.json
fi

echo "[workshop2-human-uat-signoff] brief gate:"
curl -sf "${BASE}/api/workshop2/investor-demo/brief" \
  | jq -c '{investorDemoReady, demoMode: .humanSignoff.demoMode, humanComplete: .humanSignoff.complete, blockingGatesRu, warningsRu}'
