#!/usr/bin/env bash
# Создаёт SYNTHA.app на рабочем столе (или в Applications).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/scripts/desktop/lib.sh"

TARGET="${1:-${HOME}/Desktop/SYNTHA.app}"
CFG_DIR="$(fashion_os_config_dir)"
ICON_SRC="${ROOT}/scripts/desktop/assets/syntha.icns"
APP_NAME="SYNTHA"
MACOS_DIR="${TARGET}/Contents/MacOS"
RES_DIR="${TARGET}/Contents/Resources"

mkdir -p "${CFG_DIR}"
printf '%s\n' "${ROOT}" >"${CFG_DIR}/repo.path"
# legacy path for older installs
mkdir -p "${HOME}/.config/fashion-os"
printf '%s\n' "${ROOT}" >"${HOME}/.config/fashion-os/repo.path"

rm -rf "${TARGET}" "${HOME}/Desktop/Fashion OS.app" 2>/dev/null || true

mkdir -p "${MACOS_DIR}" "${RES_DIR}"

if [[ ! -f "${ICON_SRC}" ]]; then
  echo "Не найден ${ICON_SRC} — запустите npm run desktop:icon" >&2
  exit 1
fi
cp "${ICON_SRC}" "${RES_DIR}/syntha.icns"

cat >"${TARGET}/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>ru</string>
  <key>CFBundleExecutable</key>
  <string>syntha</string>
  <key>CFBundleIconFile</key>
  <string>syntha</string>
  <key>CFBundleIdentifier</key>
  <string>com.syntha.desktop</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>SYNTHA</string>
  <key>CFBundleDisplayName</key>
  <string>SYNTHA</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
PLIST

cat >"${MACOS_DIR}/syntha" <<'LAUNCHER'
#!/usr/bin/env bash
set -euo pipefail
for cfg in "${HOME}/.config/syntha/repo.path" "${HOME}/.config/fashion-os/repo.path"; do
  if [[ -f "${cfg}" ]]; then
    ROOT="$(tr -d '[:space:]' <"${cfg}")"
    break
  fi
done
if [[ -z "${ROOT:-}" || ! -f "${ROOT}/scripts/desktop/fashion-os-menu.sh" ]]; then
  osascript -e 'display alert "SYNTHA" message "Не найден репозиторий Projects. Запустите: npm run desktop:install" as critical'
  exit 1
fi
exec bash "${ROOT}/scripts/desktop/fashion-os-menu.sh"
LAUNCHER

chmod +x "${MACOS_DIR}/syntha"
chmod +x "${ROOT}/scripts/desktop/"*.sh

# Refresh Finder icon cache for Desktop
touch "${TARGET}"

echo "✓ ${APP_NAME}.app → ${TARGET}"
echo "  repo: ${ROOT}"
echo ""
echo "Двойной клик → устройство + Core + вкладка План + Cursor"
echo "Меню: npm run desktop:menu  ·  Статус: npm run desktop:status"
