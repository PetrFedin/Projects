#!/usr/bin/env bash
# CI: PG + seed + dev:core с REDIS_URL + core-09 (poll+bump+redis).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
LOG="${ROOT}/.planning/ci-core-redis-dev.log"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@localhost:5433/workshop2}"
export REDIS_URL="${REDIS_URL:-redis://127.0.0.1:6379}"

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

echo "→ wait Redis ${REDIS_URL}"
redis_ready() {
  if command -v redis-cli >/dev/null 2>&1; then
    redis-cli -u "${REDIS_URL}" ping 2>/dev/null | grep -q PONG
    return
  fi
  (echo PING | nc -w 1 127.0.0.1 6379 2>/dev/null | grep -q PONG) && return 0
  return 1
}
for _ in $(seq 1 30); do
  redis_ready && break
  sleep 1
done
redis_ready || {
  echo "Redis недоступен по ${REDIS_URL}" >&2
  exit 1
}

echo "→ db:core:bootstrap"
npm run db:core:bootstrap --prefix "${FULL}"

if core_lib_port_listening 3001; then
  echo "→ остановка :3001 перед dev:core с REDIS_URL"
  bash "${ROOT}/scripts/stop-stale-next-dev.sh" >/dev/null 2>&1 || true
fi

echo "→ dev:core с REDIS_URL (лог: .planning/ci-core-redis-dev.log)"
export REDIS_URL
nohup bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
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
  echo "dev:core не поднялся за 180s" >&2
  tail -40 "${LOG}" >&2 || true
  exit 1
}

HEALTH="$(curl -fsS --max-time 5 http://127.0.0.1:3001/api/workshop2/platform-core/health)"
echo "→ health: ${HEALTH}"
grep -q '"chainStatusSseMode":"poll+bump+redis"' <<<"${HEALTH}" || {
  echo "FAIL: ожидался chainStatusSseMode=poll+bump+redis" >&2
  exit 1
}

echo "→ e2e core-09"
(
  cd "${FULL}"
  PLAYWRIGHT_SKIP_WEBSERVER=1 REDIS_URL="${REDIS_URL}" npx playwright test \
    --config=playwright.core.config.ts \
    e2e/core-09-chain-status-sse.spec.ts \
    --retries=0
)

echo "OK: Redis SSE honesty passed"
