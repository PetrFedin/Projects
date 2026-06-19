#!/usr/bin/env bash
# CI: PG + seeds + dev:core + smoke + e2e Platform Core (:3001).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
LOG="${ROOT}/.planning/ci-core-dev.log"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@localhost:5433/workshop2}"

mkdir -p "${ROOT}/.planning"

echo "→ wait PG :5433"
for _ in $(seq 1 30); do
  core_lib_pg_ready && break
  sleep 2
done
core_lib_pg_ready || {
  echo "PG на :5433 не отвечает" >&2
  exit 1
}

echo "→ db:core:bootstrap"
npm run db:core:bootstrap --prefix "${FULL}"

if core_lib_core_dev_ready; then
  echo "→ dev:core уже слушает :3001"
else
  if core_lib_port_listening 3001; then
    echo "Порт :3001 занят не-core процессом" >&2
    exit 1
  fi
  echo "→ dev:core в фоне (лог: .planning/ci-core-dev.log)"
  nohup bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
  DEV_PID=$!
  cleanup() {
    kill "${DEV_PID}" 2>/dev/null || true
  }
  trap cleanup EXIT
  for _ in $(seq 1 90); do
    core_lib_core_dev_ready && break
    sleep 2
  done
fi

core_lib_core_dev_ready || {
  echo "dev:core не поднялся за 180s. tail -40 ${LOG}" >&2
  tail -40 "${LOG}" >&2 || true
  exit 1
}

echo "→ core:verify (smoke + e2e)"
cd "${ROOT}"
npm run core:verify
