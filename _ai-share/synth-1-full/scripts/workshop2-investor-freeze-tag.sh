#!/usr/bin/env bash
# Wave 55: print git tag commands for investor-freeze-wave55 (NO tag unless WORKSHOP2_RUN_GIT_TAG=1).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAG="investor-freeze-wave55"
MSG="Investor freeze Wave 55 — Workshop2 RU prod hardening baseline"

echo "== Workshop2 investor freeze tag (Wave 55) =="
echo ""
echo "# Проверки перед тегом:"
echo "node scripts/wave55-restore-disk.mjs"
echo "npm run test:workshop2:unit"
echo "node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123"
echo ""
echo "# Команды git (не выполняются автоматически):"
echo "git tag -a ${TAG} -m \"${MSG}\""
echo "git push origin ${TAG}"
echo ""
echo "Snapshot: .planning/INVESTOR-FREEZE-WAVE55.md"
echo "Changelog: .planning/RELEASE-NOTES-WAVES-9-55-RU.md"

if [[ "${WORKSHOP2_RUN_GIT_TAG:-0}" == "1" ]]; then
  echo ""
  echo "WORKSHOP2_RUN_GIT_TAG=1 — создаём локальный annotated tag ${TAG}"
  cd "$ROOT"
  git tag -a "${TAG}" -m "${MSG}"
  echo "ok: tag ${TAG} created locally (push вручную: git push origin ${TAG})"
else
  echo ""
  echo "Тег НЕ создан. Для выполнения: WORKSHOP2_RUN_GIT_TAG=1 bash scripts/workshop2-investor-freeze-tag.sh"
fi
