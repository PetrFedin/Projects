#!/usr/bin/env bash
# Platform Core — перезапуск dev:core на :3001.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

if core_lib_port_listening 3001; then
  pids="$(lsof -nP -iTCP:3001 -sTCP:LISTEN -t 2>/dev/null || true)"
  for pid in ${pids}; do
    echo "Останавливаю PID ${pid} на :3001"
    kill "${pid}" 2>/dev/null || true
  done
  sleep 1
  if core_lib_port_listening 3001; then
    pids="$(lsof -nP -iTCP:3001 -sTCP:LISTEN -t 2>/dev/null || true)"
    for pid in ${pids}; do
      echo "SIGKILL PID ${pid} на :3001"
      kill -9 "${pid}" 2>/dev/null || true
    done
    sleep 1
  fi
  sleep 2
fi

FULL="${ROOT}/_ai-share/synth-1-full"
if [[ -d "${FULL}/.next" ]]; then
  echo "→ очистка .next после остановки dev:core (избегаем битых manifest)"
  # Не прерывать restart: гонка с завершающимся next иногда даёт «Directory not empty».
  (cd "${FULL}" && npm run clean --silent 2>/dev/null) || rm -rf "${FULL}/.next" 2>/dev/null || true
fi

exec bash "${ROOT}/scripts/core-dev.sh"
