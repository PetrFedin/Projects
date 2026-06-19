#!/usr/bin/env bash
# Platform Core — подготовка к демо (PG + seeds + проверка маршрутов).
#   npm run core:prep
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
LOG="${ROOT}/.planning/core-dev.log"
PID_FILE="${ROOT}/.planning/core-dev.pid"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

mkdir -p "${ROOT}/.planning"

echo "Platform Core prep"
echo "------------------"

if ! core_lib_pg_ready; then
  echo "→ bootstrap (PG + seeds)"
  bash "${ROOT}/scripts/core-platform-bootstrap.sh"
else
  echo "→ PG :5433 OK"
  if ! core_lib_core_dev_ready; then
    echo "→ seeds (идемпотентно)"
    npm run db:core:bootstrap --prefix "${FULL}"
  fi
fi

if ! core_lib_core_dev_ready; then
  if core_lib_port_listening 3001; then
    echo "Порт :3001 занят не-core процессом → npm run stop:stale-dev" >&2
    exit 1
  fi
  echo "→ dev:core в фоне (лог: .planning/core-dev.log)"
  nohup bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
  echo $! >"${PID_FILE}"
  for _ in $(seq 1 90); do
    core_lib_core_dev_ready && break
    sleep 2
  done
fi

core_lib_core_dev_ready || {
  echo "dev:core не поднялся за 180s. tail -30 ${LOG}" >&2
  exit 1
}

echo ""
cd "${ROOT}"
npm run core:demo:check
echo ""
npm run core:demo
