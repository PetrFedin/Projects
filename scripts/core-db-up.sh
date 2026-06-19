#!/usr/bin/env bash
# Platform Core PG — docker compose up (идемпотентно).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE="${ROOT}/_ai-share/synth-1-full/docker-compose.workshop2.yml"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

if core_lib_pg_ready; then
  echo "PG уже доступен на :5433 — docker compose up не нужен"
  exit 0
fi

echo "→ пересоздание workshop2 PG (orphan/conflict cleanup)"
core_lib_pg_recycle "${COMPOSE}" || {
  echo "" >&2
  echo "OrbStack/Docker не запущен. Откройте OrbStack → Running → npm run db:core:up" >&2
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
echo "PG готов на :5433"
