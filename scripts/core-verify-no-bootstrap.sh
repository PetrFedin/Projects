#!/usr/bin/env bash
# Platform Core: честный прогон prod без seed — свежий PG, только миграции, core-10.
# ВНИМАНИЕ: пересоздаёт контейнер workshop2 PG (данные seed сбрасываются).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
COMPOSE="${FULL}/docker-compose.workshop2.yml"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

echo "→ пересоздание PG (migrate-only, без seed)"
core_lib_pg_recycle "${COMPOSE}"

for _ in $(seq 1 30); do
  core_lib_pg_ready && break
  sleep 1
done
core_lib_pg_ready || {
  echo "PG на :5433 не отвечает после recycle" >&2
  exit 1
}

echo "→ db:apply:workshop2-migrations (без seed)"
cd "${FULL}"
URL="$(node scripts/resolve-workshop2-database-url.mjs)"
export WORKSHOP2_DATABASE_URL="${URL}"
npm run db:apply:workshop2-migrations

if ! core_lib_core_dev_ready; then
  echo "→ dev:core не слушает :3001 — запуск"
  nohup bash "${ROOT}/scripts/core-dev.sh" >>"${ROOT}/.planning/ci-core-dev.log" 2>&1 &
  for _ in $(seq 1 60); do
    core_lib_core_dev_ready && break
    sleep 2
  done
fi

core_lib_core_dev_ready || {
  echo "dev:core не поднялся — npm run dev:core" >&2
  exit 1
}

echo "→ e2e core-10 (CORE_VERIFY_NO_BOOTSTRAP=1)"
export CORE_VERIFY_NO_BOOTSTRAP=1
(
  cd "${FULL}"
  PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test \
    --config=playwright.core.config.ts \
    e2e/core-10-no-bootstrap-honesty.spec.ts \
    --retries=0
)

echo "OK: migrate-only honesty passed (banner no-seed, demoSeeded=false)"
echo "→ восстановите demo: npm run db:core:bootstrap"
