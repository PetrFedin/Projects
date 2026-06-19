#!/usr/bin/env bash
# Останавливает «забытые» Next dev на дополнительных портах.
# По умолчанию: e2e :3123 и legacy :3010. Порт 3000 — только с SYNTHA_STOP_MAIN_DEV=1.
#   bash scripts/stop-stale-next-dev.sh
#   SYNTHA_STOP_MAIN_DEV=1 bash scripts/stop-stale-next-dev.sh
set -euo pipefail

kill_listen_port() {
  local port="$1"
  local pids
  pids="$(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)"
  if [[ -z "${pids}" ]]; then
    echo "Порт $port: слушателей нет."
    return 0
  fi
  for pid in $pids; do
    local cmd
    cmd="$(ps -p "$pid" -o args= 2>/dev/null | head -c 120 || true)"
    echo "Останавливаю PID $pid на :$port — $cmd"
    kill "$pid" 2>/dev/null || true
  done
}

# Ранее использовавшийся второй dev-сервер (см. историю сессий)
kill_listen_port 3010
# Playwright e2e webServer — делит .next с dev:fast на :3000
kill_listen_port "${PLAYWRIGHT_E2E_PORT:-3123}"
# Platform Core dev (NEXT_PUBLIC_PLATFORM_CORE_MODE=1)
kill_listen_port 3001

if [[ "${SYNTHA_STOP_MAIN_DEV:-}" == "1" ]]; then
  kill_listen_port 3000
fi

echo "Готово. dev:fast → :3000 · dev:core → npm run dev:core (:3001)."
