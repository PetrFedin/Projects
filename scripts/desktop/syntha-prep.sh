#!/usr/bin/env bash
# Поднять OrbStack → PG :5433 → demo bootstrap (фон для hub «Подключить PostgreSQL»).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LOG="${ROOT}/.planning/syntha-prep.log"
mkdir -p "$(dirname "${LOG}")"
# shellcheck source=lib.sh
source "${ROOT}/scripts/desktop/lib.sh"

{
  echo "=== syntha-prep $(date -Iseconds) ==="
  if ! fashion_os_try_start_pg "${ROOT}" "${LOG}"; then
    echo "PG failed: $(fashion_os_pg_failure_message "${LOG}")"
    exit 1
  fi
  cd "${ROOT}"
  npm run core:bootstrap
  echo "=== syntha-prep done $(date -Iseconds) ==="
} >>"${LOG}" 2>&1
