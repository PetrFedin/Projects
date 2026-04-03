#!/usr/bin/env bash
# Останавливает «забытые» Next dev на дополнительных портах.
# Порт 3000 (основной synth-1) не трогает.
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

echo "Готово. Основной dev: cd synth-1 && npm run dev (порт 3000)."
