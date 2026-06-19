#!/usr/bin/env bash
# SYNTHA — выбор устройства при запуске; меню: FASHION_OS_MENU=1 или npm run desktop:menu.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LAUNCH="${ROOT}/scripts/desktop/fashion-os-launch.sh"
# shellcheck source=lib.sh
source "${ROOT}/scripts/desktop/lib.sh"

fashion_os_alert() {
  local msg="$1"
  osascript -e "display alert \"SYNTHA\" message \"${msg}\" as critical" 2>/dev/null || true
}

fashion_os_menu_pick_device_and_launch() {
  local mode="${1:-both}"
  local device
  device="$(fashion_os_pick_device)" || exit 0
  exec bash "${LAUNCH}" "${mode}" "${device}"
}

if [[ "${FASHION_OS_MENU:-}" == "1" ]]; then
  choice="$(osascript <<'APPLESCRIPT'
set menuChoices to {"Запуск (Core + Cursor + План)", "Только Core + План", "Состояние SYNTHA", "Перезапуск Core", "Открыть План", "Остановить dev", "Bootstrap PG"}
set picked to choose from list menuChoices with title "SYNTHA" with prompt "Сервисное меню:" default items {"Запуск (Core + Cursor + План)"}
if picked is false then
  return "cancel"
end if
return item 1 of picked
APPLESCRIPT
)" || choice=""

  [[ "${choice}" == "cancel" || -z "${choice}" ]] && exit 0

  case "${choice}" in
    "Запуск (Core + Cursor + План)")
      fashion_os_menu_pick_device_and_launch both
      ;;
    "Только Core + План")
      fashion_os_menu_pick_device_and_launch core
      ;;
    "Состояние SYNTHA")
      action="$(fashion_os_show_status_dialog "${ROOT}")"
      case "${action}" in
        "Перезапуск Core")
          fashion_os_menu_pick_device_and_launch restart
          ;;
        "Bootstrap")
          exec bash "${LAUNCH}" prep
          ;;
        "Открыть План")
          device="$(fashion_os_pick_device)" || exit 0
          exec bash "${LAUNCH}" plan "${device}"
          ;;
        *) exit 0 ;;
      esac
      ;;
    "Перезапуск Core")
      fashion_os_menu_pick_device_and_launch restart
      ;;
    "Открыть План")
      device="$(fashion_os_pick_device)" || exit 0
      exec bash "${LAUNCH}" plan "${device}"
      ;;
    "Остановить dev") exec bash "${LAUNCH}" stop ;;
    "Bootstrap PG") exec bash "${LAUNCH}" prep ;;
    *) exit 0 ;;
  esac
fi

device="$(fashion_os_pick_device)" || {
  fashion_os_alert "Запуск отменён. Повторите двойной клик или: npm run desktop:launch"
  exit 0
}
exec bash "${LAUNCH}" both "${device}"
