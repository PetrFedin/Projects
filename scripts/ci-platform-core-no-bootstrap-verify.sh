#!/usr/bin/env bash
# CI: migrate-only PG (без seed) + core-10 honesty (banner, empty cabinet, no B2B-DEMO pin).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
LOG="${ROOT}/.planning/ci-core-no-bootstrap-dev.log"
COMPOSE="${FULL}/docker-compose.workshop2.yml"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@localhost:5433/workshop2}"
export SPINE_OPERATIONAL_PG=1
export CORE_VERIFY_NO_BOOTSTRAP=1

mkdir -p "${ROOT}/.planning"

echo "→ wait PG :5433"
for _ in $(seq 1 30); do
  core_lib_pg_ready && break
  sleep 2
done
core_lib_pg_ready || {
  echo "PG на :5433 не отвечает" >&2
  exit 1
}

if [[ -f "${COMPOSE}" ]] && docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^synth-workshop2-postgres$'; then
  echo "→ локальный docker PG — recycle migrate-only"
  core_lib_pg_recycle "${COMPOSE}"
  for _ in $(seq 1 30); do
    core_lib_pg_ready && break
    sleep 1
  done
fi

echo "→ db:apply:workshop2-migrations (без seed)"
cd "${FULL}"
URL="$(node scripts/resolve-workshop2-database-url.mjs)"
export WORKSHOP2_DATABASE_URL="${URL}"
npm run db:apply:workshop2-migrations

bash "${ROOT}/scripts/stop-stale-next-dev.sh" >/dev/null 2>&1 || true
if core_lib_port_listening 3001; then
  echo "Порт :3001 всё ещё занят" >&2
  exit 1
fi

echo "→ dev:core migrate-only (лог: .planning/ci-core-no-bootstrap-dev.log)"
nohup env SPINE_OPERATIONAL_PG=1 bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
DEV_PID=$!
cleanup() {
  kill "${DEV_PID}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in $(seq 1 90); do
  core_lib_core_dev_ready && break
  sleep 2
done

core_lib_core_dev_ready || {
  echo "dev:core не поднялся за 180s. tail -40 ${LOG}" >&2
  tail -40 "${LOG}" >&2 || true
  exit 1
}

HEALTH="$(curl -fsS --max-time 10 http://127.0.0.1:3001/api/workshop2/platform-core/health || true)"
echo "health: ${HEALTH}"
echo "${HEALTH}" | grep -q '"demoSeeded":false' || {
  echo "FAIL: ожидали demoSeeded=false на migrate-only PG" >&2
  exit 1
}

echo "→ e2e core-10 (CORE_VERIFY_NO_BOOTSTRAP=1)"
cd "${FULL}"
PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test \
  --config=playwright.core.config.ts \
  e2e/core-10-no-bootstrap-honesty.spec.ts \
  --retries=0

echo "PASS core:ci:no-bootstrap"
