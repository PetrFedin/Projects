#!/usr/bin/env bash
# Append SPINE_OPERATIONAL_PG* to synth-1-full/.env.local if missing (idempotent).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/_ai-share/synth-1-full/.env.local"

touch "${ENV_FILE}"

append_if_missing() {
  local key="$1"
  local val="$2"
  if grep -qE "^${key}=" "${ENV_FILE}" 2>/dev/null; then
    echo "skip ${key} (already in .env.local)"
  else
    printf '\n# ADR-002 PG-primary cutover\n%s=%s\n' "${key}" "${val}" >>"${ENV_FILE}"
    echo "added ${key}=${val}"
  fi
}

append_if_missing SPINE_OPERATIONAL_PG 1
append_if_missing SPINE_OPERATIONAL_PG_PRIMARY 1

echo ""
echo "→ перезапустите dev:core: npm run core:restart"
echo "→ проверка: npm run core:verify:pg-primary"
