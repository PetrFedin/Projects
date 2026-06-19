#!/usr/bin/env bash
# Platform Core: PG docker + db:core:bootstrap из корня монорепо.
#   bash scripts/core-platform-bootstrap.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
COMPOSE="${FULL}/docker-compose.workshop2.yml"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

if [[ ! -f "${COMPOSE}" ]]; then
  echo "Не найден ${COMPOSE}" >&2
  exit 1
fi

if core_lib_pg_ready; then
  echo "→ PG уже доступен на :5433 — пропускаю docker compose up"
else
  echo "→ docker compose up (workshop2 PG :5433)"
  core_lib_pg_recycle "${COMPOSE}" || {
    echo "" >&2
    echo "OrbStack/Docker не запущен." >&2
    echo "  1. Откройте приложение OrbStack (или Docker Desktop)" >&2
    echo "  2. Дождитесь Running, затем: npm run db:core:up" >&2
    echo "  3. npm run core:bootstrap  или  npm run core:prep" >&2
    exit 1
  }
  for _ in $(seq 1 30); do
    core_lib_pg_ready && break
    sleep 1
  done
  core_lib_pg_ready || {
    echo "PG на :5433 не отвечает после docker up" >&2
    exit 1
  }
fi

echo "→ db:core:bootstrap (миграции + demo seeds)"
npm run db:core:bootstrap --prefix "${FULL}"

echo ""
echo "Готово."
if core_lib_core_dev_ready; then
  echo "  dev:core уже запущен → http://localhost:3001"
else
  echo "  npm run dev:core"
fi
echo "  npm run core:verify"
echo "  npm run core:demo"
