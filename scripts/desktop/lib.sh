#!/usr/bin/env bash
# Shared helpers for SYNTHA desktop launcher (source, do not exec).
set -euo pipefail

fashion_os_config_dir() {
  echo "${HOME}/.config/syntha"
}

fashion_os_log_dir() {
  echo "${HOME}/Library/Logs/syntha"
}

fashion_os_repo_root() {
  local cfg p here
  for cfg in "${HOME}/.config/syntha/repo.path" "${HOME}/.config/fashion-os/repo.path"; do
    if [[ -f "${cfg}" ]]; then
      p="$(tr -d '[:space:]' <"${cfg}")"
      if [[ -d "${p}/scripts/core-dev.sh" ]]; then
        echo "${p}"
        return 0
      fi
    fi
  done
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  echo "${here}"
}

fashion_os_setup_env() {
  export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH}"
  if [[ -d "${HOME}/.orbstack/bin" ]]; then
    export PATH="${HOME}/.orbstack/bin:${PATH}"
  fi
  if [[ -x "/Applications/Docker.app/Contents/Resources/bin/docker" ]]; then
    export PATH="/Applications/Docker.app/Contents/Resources/bin:${PATH}"
  fi
  if [[ -x "/Applications/OrbStack.app/Contents/MacOS/bin/docker" ]]; then
    export PATH="/Applications/OrbStack.app/Contents/MacOS/bin:${PATH}"
  fi
  if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
    export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:${PATH}"
  fi
  export NVM_DIR="${NVM_DIR:-${HOME}/.nvm}"
  if [[ -s "${NVM_DIR}/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "${NVM_DIR}/nvm.sh"
  fi
  local root full
  root="$(fashion_os_repo_root)"
  full="${root}/_ai-share/synth-1-full"
  if [[ -f "${full}/.nvmrc" ]] && command -v nvm >/dev/null 2>&1; then
    (cd "${full}" && nvm use --silent >/dev/null 2>&1) || true
  fi
  export DOCKER_HOST="${DOCKER_HOST:-unix://${HOME}/.orbstack/run/docker.sock}"
}

fashion_os_ensure_logs() {
  mkdir -p "$(fashion_os_log_dir)"
}

fashion_os_notify() {
  local title="$1"
  local message="$2"
  osascript -e "display notification \"${message}\" with title \"${title}\"" >/dev/null 2>&1 || true
}

fashion_os_alert() {
  local message="$1"
  osascript -e "display alert \"SYNTHA\" message \"${message}\" as critical" >/dev/null 2>&1 || true
}

fashion_os_terminal_msg() {
  [[ -t 1 ]] || return 0
  printf '%s\n' "$*"
}

# iphone | ipad | macbook
fashion_os_pick_device() {
  local choice cfg_dir last_file device
  cfg_dir="$(fashion_os_config_dir)"
  last_file="${cfg_dir}/last-device"
  mkdir -p "${cfg_dir}"

  choice="$(osascript <<'APPLESCRIPT'
set deviceChoices to {"iPhone + Cursor", "iPad + Cursor", "MacBook + Cursor"}
set picked to choose from list deviceChoices with title "SYNTHA" with prompt "Формат экрана — как будет выглядеть интерфейс:" default items {"MacBook + Cursor"}
if picked is false then
  return "cancel"
end if
return item 1 of picked
APPLESCRIPT
)" || choice=""

  if [[ "${choice}" == "cancel" || -z "${choice}" ]]; then
    if [[ -f "${last_file}" ]]; then
      device="$(tr -d '[:space:]' <"${last_file}")"
      [[ "${device}" == "macbook-full" ]] && device="macbook"
      fashion_os_notify "SYNTHA" "Запуск с последним форматом: ${device}"
      echo "${device}"
      return 0
    fi
    return 1
  fi

  case "${choice}" in
    "iPhone + Cursor") device="iphone" ;;
    "iPad + Cursor") device="ipad" ;;
    "MacBook + Cursor") device="macbook" ;;
    *)
      fashion_os_alert "Ошибка выбора устройства. Используем MacBook."
      device="macbook"
      ;;
  esac
  printf '%s\n' "${device}" >"${last_file}"
  echo "${device}"
}

fashion_os_device_preview_url() {
  local device="${1:-macbook}"
  local target="${2:-http://127.0.0.1:3001/platform}"
  local path="${target#http://127.0.0.1:3001}"
  path="${path#http://localhost:3001}"
  [[ -z "${path}" ]] && path="/platform"
  if [[ "${device}" == "macbook" || "${device}" == "macbook-full" ]]; then
    fashion_os_platform_app_url "http://127.0.0.1:3001${path}"
    return 0
  fi
  local base="http://127.0.0.1:3001/syntha-device-preview.html"
  printf '%s?device=%s&url=%s' "${base}" "${device}" "$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "${path}")"
}

# MacBook — сразу приложение, без device-preview.
fashion_os_platform_app_url() {
  local target="${1:-http://127.0.0.1:3001/platform}"
  if [[ "${target}" == *"synthaEmbed="* ]]; then
    printf '%s' "${target}"
    return 0
  fi
  if [[ "${target}" == *"?"* ]]; then
    printf '%s&synthaEmbed=1' "${target}"
  else
    printf '%s?synthaEmbed=1' "${target}"
  fi
}

fashion_os_launch_lock_dir() {
  echo "$(fashion_os_config_dir)/launch.lock"
}

fashion_os_clear_stale_launch_lock() {
  local lock age now mtime
  lock="$(fashion_os_launch_lock_dir)"
  [[ -d "${lock}" ]] || return 0
  now="$(date +%s)"
  mtime="$(stat -f %m "${lock}" 2>/dev/null || echo "${now}")"
  age=$((now - mtime))
  if (( age > 120 )); then
    rmdir "${lock}" 2>/dev/null || rm -rf "${lock}" 2>/dev/null || true
  fi
}

fashion_os_acquire_launch_lock() {
  local lock root
  lock="$(fashion_os_launch_lock_dir)"
  root="$(fashion_os_repo_root)"
  fashion_os_clear_stale_launch_lock
  # shellcheck source=core-lib.sh
  source "${root}/scripts/core-lib.sh" 2>/dev/null || true

  if ! mkdir "${lock}" 2>/dev/null; then
    if core_lib_core_dev_ready 2>/dev/null; then
      rmdir "${lock}" 2>/dev/null || rm -rf "${lock}" 2>/dev/null || true
      mkdir "${lock}" 2>/dev/null || {
        fashion_os_notify "SYNTHA" "Platform Core уже работает — открываю preview"
        return 0
      }
    else
      fashion_os_notify "SYNTHA" "Уже запускается — подождите 1–2 мин…"
      fashion_os_terminal_msg "SYNTHA: lock ${lock} — подождите или удалите: rm -rf \"${lock}\""
      exit 0
    fi
  fi
  trap 'rmdir "'"${lock}"'" 2>/dev/null || true' EXIT
}

fashion_os_log_tail() {
  local log="$1" n="${2:-12}"
  [[ -f "${log}" ]] || return 0
  tail -n "${n}" "${log}" 2>/dev/null | tr '\n' ' · ' | head -c 400
}

fashion_os_syntha_status() {
  local root="$1"
  bash "${root}/scripts/desktop/syntha-status.sh" 2>/dev/null || true
}

fashion_os_syntha_status_compact() {
  local root="$1"
  bash "${root}/scripts/desktop/syntha-status.sh" --compact 2>/dev/null || echo "PG:0 Core:0 Seed:0"
}

fashion_os_show_status_dialog() {
  local root="$1"
  local out safe choice
  out="$(fashion_os_syntha_status "${root}")"
  safe="$(printf '%s' "${out}" | tr '\n' ' · ' | sed 's/"/\\"/g' | head -c 900)"
  choice="$(osascript <<APPLESCRIPT
set statusText to "${safe}"
set picked to button returned of (display dialog statusText buttons {"OK", "Открыть План", "Перезапуск Core", "Bootstrap"} default button "OK" with title "SYNTHA — состояние" with icon note)
return picked
APPLESCRIPT
)" || choice="OK"
  echo "${choice}"
}

fashion_os_notify_launch_health() {
  local root="$1"
  local compact pg core seed
  compact="$(fashion_os_syntha_status_compact "${root}")"
  pg="$(echo "${compact}" | sed -n 's/.*PG:\([0-9]\).*/\1/p')"
  core="$(echo "${compact}" | sed -n 's/.*Core:\([0-9]\).*/\1/p')"
  seed="$(echo "${compact}" | sed -n 's/.*Seed:\([0-9]\).*/\1/p')"
  if [[ "${pg}" == "1" && "${core}" == "1" && "${seed}" == "1" ]]; then
    fashion_os_notify "SYNTHA" "PG ✓ · Core ✓ · Seed ✓ — Platform Core готов"
    return 0
  fi
  local issues=""
  [[ "${pg}" != "1" ]] && issues="${issues} PG✗"
  [[ "${core}" != "1" ]] && issues="${issues} Core✗"
  [[ "${seed}" != "1" ]] && issues="${issues} Seed✗"
  fashion_os_notify "SYNTHA" "Проверьте стек:${issues} — меню: npm run desktop:menu → Состояние"
  if [[ "${core}" != "1" ]]; then
    fashion_os_alert "Platform Core не полностью готов.${issues} Откройте «Состояние SYNTHA» в меню (npm run desktop:menu)."
  fi
}

fashion_os_platform_url() {
  local view="${1:-}"
  local base="http://127.0.0.1:3001/platform"
  if [[ "${view}" == "planner" || "${SYNTHA_OPEN_PLAN:-1}" == "1" ]]; then
    printf '%s?view=planner' "${base}"
  else
    printf '%s' "${base}"
  fi
}

fashion_os_docker_ready() {
  command -v docker >/dev/null 2>&1 || return 1
  docker info >/dev/null 2>&1
}

fashion_os_start_orbstack() {
  if fashion_os_docker_ready; then
    return 0
  fi
  fashion_os_notify "SYNTHA" "Запускаю OrbStack (Docker)…"
  if command -v orbctl >/dev/null 2>&1; then
    orbctl start >/dev/null 2>&1 || true
  fi
  if [[ -d "/Applications/OrbStack.app" ]]; then
    open -a OrbStack >/dev/null 2>&1 || true
  elif [[ -d "/Applications/Docker.app" ]]; then
    open -a Docker >/dev/null 2>&1 || true
  else
    return 1
  fi
  local i
  for i in $(seq 1 60); do
    sleep 2
    fashion_os_docker_ready && return 0
  done
  return 1
}

fashion_os_try_start_pg() {
  local root="$1"
  local log="${2:-$(fashion_os_log_dir)/dev-core.log}"
  # shellcheck source=core-lib.sh
  source "${root}/scripts/core-lib.sh"

  if core_lib_pg_ready; then
    return 0
  fi

  if ! fashion_os_docker_ready; then
    fashion_os_start_orbstack || return 1
  fi

  fashion_os_notify "SYNTHA" "Поднимаю PostgreSQL (:5433)…"
  if ! npm run db:core:up >>"${log}" 2>&1; then
    return 1
  fi

  local i
  for i in $(seq 1 30); do
    core_lib_pg_ready && return 0
    sleep 1
  done
  return 1
}

fashion_os_pg_failure_message() {
  local log="$1"
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker CLI не найден. Установите OrbStack и повторите."
    return
  fi
  if ! fashion_os_docker_ready; then
    echo "OrbStack/Docker не запущен. Откройте OrbStack (иконка в меню → Running), подождите 30 сек и нажмите SYNTHA снова."
    return
  fi
  echo "PostgreSQL на :5433 не ответил. См. лог: ${log} · npm run db:core:up"
}
