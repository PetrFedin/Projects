#!/usr/bin/env bash
# SYNTHA — поднять PG + dev:core, открыть Platform Core и/или Cursor.
# Usage: fashion-os-launch.sh [both|core|cursor|prep|status|stop]
set -euo pipefail

MODE="${1:-both}"
DEVICE="${2:-${SYNTHA_DEVICE:-macbook}}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/scripts/desktop/lib.sh"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

fashion_os_setup_env
fashion_os_ensure_logs
ROOT="$(fashion_os_repo_root)"
LOG="$(fashion_os_log_dir)/dev-core.log"
PLATFORM_URL="$(fashion_os_platform_url)"
PID_FILE="$(fashion_os_config_dir)/dev-core.pid"

fashion_os_open_platform() {
  local device="${1:-macbook}"
  [[ "${device}" == "macbook-full" ]] && device="macbook"
  local target="${2:-${PLATFORM_URL}}"
  local preview_url
  preview_url="$(fashion_os_device_preview_url "${device}" "${target}")"

  if [[ -d "/Applications/Google Chrome.app" ]]; then
    case "${device}" in
      iphone) open -na "Google Chrome" --args --app="${preview_url}" --window-size=520,980 ;;
      ipad) open -na "Google Chrome" --args --app="${preview_url}" --window-size=980,1380 ;;
      macbook) open -na "Google Chrome" --args --app="${preview_url}" --window-size=1440,920 ;;
      *) open -na "Google Chrome" --args --app="${preview_url}" --window-size=1440,920 ;;
    esac
  elif [[ -d "/Applications/Arc.app" ]]; then
    open -na "Arc" --args --new-window "${preview_url}"
  else
    open "${preview_url}"
  fi
}

fashion_os_open_cursor() {
  if [[ -d "/Applications/Cursor.app" ]]; then
    open -a "Cursor" "${ROOT}"
  else
    fashion_os_notify "SYNTHA" "Cursor.app не найден — установите Cursor или откройте ${ROOT} вручную"
    open "${ROOT}"
  fi
}

fashion_os_require_pg() {
  if core_lib_core_dev_ready; then
    if ! core_lib_pg_ready; then
      fashion_os_notify "SYNTHA" "Core уже на :3001 — пробую поднять PG…"
      fashion_os_try_start_pg "${ROOT}" "${LOG}" || {
        fashion_os_notify "SYNTHA" "PG offline — preview откроется, нужен OrbStack для данных"
      }
    fi
    return 0
  fi
  fashion_os_try_start_pg "${ROOT}" "${LOG}" || {
    local msg
    msg="$(fashion_os_pg_failure_message "${LOG}")"
    fashion_os_alert "${msg}"
    fashion_os_terminal_msg "SYNTHA: ${msg}"
    exit 1
  }
}

fashion_os_start_dev_core() {
  cd "${ROOT}"
  if core_lib_core_dev_ready; then
    return 0
  fi
  if core_lib_port_listening 3001; then
    local i
    for i in $(seq 1 45); do
      if core_lib_core_dev_ready; then
        return 0
      fi
      sleep 2
    done
    fashion_os_notify "SYNTHA" "Перезапуск :3001 (зависший процесс)…"
    bash "${ROOT}/scripts/core-restart.sh" >>"${LOG}" 2>&1 &
    echo $! >"${PID_FILE}"
    return 0
  fi
  fashion_os_notify "SYNTHA" "Запускаю Platform Core (:3001)…"
  mkdir -p "$(fashion_os_config_dir)"
  nohup bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
  echo $! >"${PID_FILE}"
}

fashion_os_wait_core() {
  local i hint
  for i in $(seq 1 120); do
    if core_lib_core_dev_ready; then
      return 0
    fi
    sleep 2
  done
  hint="$(fashion_os_log_tail "${LOG}" 8)"
  fashion_os_notify "SYNTHA" "Таймаут :3001 — см. ${LOG}"
  fashion_os_alert "Platform Core не ответил на :3001 за ~4 мин. Лог: ${LOG}${hint:+ · ${hint}}"
  return 1
}

case "${MODE}" in
  prep)
    bash "${ROOT}/scripts/desktop/syntha-prep.sh" >>"${LOG}" 2>&1 || true
    fashion_os_notify "SYNTHA" "Bootstrap завершён (см. .planning/syntha-prep.log при ошибках)"
    ;;
  status)
    bash "${ROOT}/scripts/desktop/syntha-status.sh"
    ;;
  restart)
    fashion_os_acquire_launch_lock
    fashion_os_terminal_msg "SYNTHA: перезапуск Platform Core (:3001)…"
    fashion_os_notify "SYNTHA" "Перезапуск Platform Core…"
    bash "${ROOT}/scripts/core-restart.sh" >>"${LOG}" 2>&1 || true
    fashion_os_wait_core || exit 1
    fashion_os_notify_launch_health "${ROOT}"
    fashion_os_open_platform "${DEVICE}" "$(fashion_os_platform_url planner)"
    fashion_os_terminal_msg "SYNTHA: Core перезапущен → http://127.0.0.1:3001/platform?view=planner"
    fashion_os_notify "SYNTHA" "Core перезапущен · вкладка План"
    ;;
  plan)
    fashion_os_clear_stale_launch_lock
    if core_lib_core_dev_ready; then
      fashion_os_open_platform "${DEVICE}" "$(fashion_os_platform_url planner)"
      fashion_os_terminal_msg "SYNTHA: открыт План (preview ${DEVICE})"
    else
      fashion_os_alert "Platform Core не запущен. Двойной клик по SYNTHA или npm run dev:core"
      fashion_os_terminal_msg "SYNTHA: Core offline — сначала npm run dev:core или desktop:launch"
      exit 1
    fi
    ;;
  stop)
    if core_lib_port_listening 3001; then
      pids="$(lsof -nP -iTCP:3001 -sTCP:LISTEN -t 2>/dev/null || true)"
      for pid in ${pids}; do kill "${pid}" 2>/dev/null || true; done
      sleep 1
      fashion_os_notify "SYNTHA" "dev:core на :3001 остановлен (PG остаётся)"
    else
      fashion_os_notify "SYNTHA" "dev:core уже выключен"
    fi
    rm -f "${PID_FILE}" 2>/dev/null || true
    ;;
  cursor)
    fashion_os_open_cursor
    ;;
  core)
    fashion_os_acquire_launch_lock
    fashion_os_require_pg
    fashion_os_start_dev_core
    fashion_os_wait_core || exit 1
    fashion_os_notify_launch_health "${ROOT}"
    fashion_os_open_platform "${DEVICE}" "$(fashion_os_platform_url planner)"
    ;;
  both)
    fashion_os_acquire_launch_lock
    fashion_os_require_pg
    fashion_os_start_dev_core
    fashion_os_wait_core || exit 1
    fashion_os_notify_launch_health "${ROOT}"
    fashion_os_open_platform "${DEVICE}" "$(fashion_os_platform_url planner)"
    fashion_os_open_cursor
    fashion_os_notify "SYNTHA" "Platform Core (${DEVICE}) · План + Cursor"
    ;;
  *)
    echo "Usage: $0 [both|core|cursor|prep|status|stop|restart|plan] [iphone|ipad|macbook]" >&2
    exit 1
    ;;
esac
