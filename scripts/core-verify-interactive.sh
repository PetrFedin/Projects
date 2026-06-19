#!/usr/bin/env bash
# Platform Core: интерактивный handoff (без auto-handoff в seed) + e2e core-03/07/12.
# Требует: docker db :5433, dev:core на :3001.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"
cd "${ROOT}"

if ! core_lib_pg_ready; then
  echo "FAIL: PostgreSQL :5433 недоступен → npm run db:core:up" >&2
  exit 1
fi

if ! core_lib_core_dev_ready; then
  echo "FAIL: dev:core не отвечает на :3001 → npm run dev:core" >&2
  exit 1
fi

echo "→ bootstrap interactive (CORE_BOOTSTRAP_SKIP_HANDOFF=1)"
npm run db:core:bootstrap:interactive

echo "→ e2e interactive: core-03 (handoff + registry bulk) · core-07 · core-12"
(
  cd _ai-share/synth-1-full
  PLAYWRIGHT_SKIP_WEBSERVER=1 npx playwright test \
    --config=playwright.core.config.ts \
    e2e/core-03-interactive-handoff.spec.ts \
    e2e/core-07-pg-interactive-bootstrap.spec.ts \
    e2e/core-12-bulk-accept-registry.spec.ts \
    --retries=0
)

echo "OK: interactive PG e2e passed (handoff UI → registry bulk accept → toolbar hidden)"
