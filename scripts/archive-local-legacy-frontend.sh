#!/usr/bin/env bash
# Архивирует локальные legacy-деревья фронта (не трогает канон _ai-share/synth-1-full).
# Перед запуском: убедиться, что нужное уже в full (см. docs/ARCHIVE_AND_LEGACY_RU.md).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${ARCHIVE_DEST:-$HOME/Archive/Projects-legacy}"
mkdir -p "$DEST"
STAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE="$DEST/monorepo-legacy-frontend-${STAMP}.tar.gz"

paths=()
if [[ -n "${ARCHIVE_PATHS:-}" ]]; then
  # Пример: ARCHIVE_PATHS="synth-1" или ARCHIVE_PATHS="synth-1 src"
  read -r -a paths <<<"${ARCHIVE_PATHS}"
else
  if [[ -d "$ROOT/synth-1" ]]; then
    paths+=("synth-1")
  fi
  # Корневой legacy src/ (TS без Next в корне) — только по явному согласию: перенос в full см. docs.
  if [[ "${ARCHIVE_INCLUDE_LEGACY_SRC:-0}" == "1" ]] && [[ -d "$ROOT/src" ]]; then
    if [[ -f "$ROOT/src/lib/cn.ts" || -f "$ROOT/src/design/tokens.json" ]]; then
      paths+=("src")
    fi
  fi
fi

if [[ "${#paths[@]}" -eq 0 ]]; then
  echo "Нечего архивировать: нет каталога synth-1/ (или задайте ARCHIVE_PATHS / ARCHIVE_INCLUDE_LEGACY_SRC=1 для корневого src)."
  echo "Примеры:"
  echo "  ARCHIVE_PATHS=\"synth-1\" bash $0"
  echo "  ARCHIVE_INCLUDE_LEGACY_SRC=1 bash $0   # добавит src/ при совпадении эвристики"
  exit 0
fi

echo "В архив (относительно $ROOT): ${paths[*]}"
echo "Файл: $ARCHIVE"
tar -C "$ROOT" -czf "$ARCHIVE" "${paths[@]}"
echo "Готово: $ARCHIVE"
echo "Проверка содержимого: tar -tzf \"$ARCHIVE\" | head"
