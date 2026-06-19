#!/usr/bin/env bash
# CI: PG-primary cutover (SPINE_OPERATIONAL_PG_PRIMARY=1) + health + core-15/17.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="${ROOT}/_ai-share/synth-1-full"
LOG="${ROOT}/.planning/ci-core-pg-primary-dev.log"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@localhost:5433/workshop2}"
export SPINE_OPERATIONAL_PG=1
export SPINE_OPERATIONAL_PG_PRIMARY=1
export CORE_VERIFY_PG_PRIMARY=1

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

echo "→ db:core:bootstrap"
npm run db:core:bootstrap --prefix "${FULL}"

if core_lib_core_dev_ready; then
  echo "→ перезапуск dev:core (нужен SPINE_OPERATIONAL_PG_PRIMARY в env)"
  bash "${ROOT}/scripts/stop-stale-next-dev.sh" >/dev/null 2>&1 || true
fi

if core_lib_port_listening 3001; then
  echo "Порт :3001 всё ещё занят" >&2
  exit 1
fi

echo "→ dev:core PG-primary (лог: .planning/ci-core-pg-primary-dev.log)"
nohup env SPINE_OPERATIONAL_PG=1 SPINE_OPERATIONAL_PG_PRIMARY=1 bash "${ROOT}/scripts/core-dev.sh" >>"${LOG}" 2>&1 &
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
  echo "dev:core PG-primary не поднялся за 180s. tail -40 ${LOG}" >&2
  tail -40 "${LOG}" >&2 || true
  exit 1
}

echo "→ core:verify:pg-primary"
npm run core:verify:pg-primary

echo "→ e2e core-08 + core-15…core-36 (clean PG gate)"
cd "${FULL}"
npx playwright test e2e/core-08-section-audit-smoke.spec.ts \
  e2e/core-15-clean-pg-registry.spec.ts e2e/core-17-pg-primary-mode.spec.ts \
  e2e/core-18-clean-pg-spine-golden-path.spec.ts   e2e/core-20-clean-pg-comms-spine.spec.ts e2e/core-22-empty-checkout-mfr-po-inbox.spec.ts \
  e2e/core-24-clean-pg-14-cell-matrix.spec.ts e2e/core-25-comms-notifications-supplier-quote.spec.ts \
  e2e/core-26-brand-export-fw27-audit-path.spec.ts \
  e2e/core-30-bulk-section-export.spec.ts \
  e2e/core-31-supplier-comms-peer-insight.spec.ts \
  e2e/core-32-joor-import-registry-export.spec.ts \
  e2e/core-33-operational-list-pg-primary.spec.ts \
  e2e/core-34-clean-pg-erp-retry.spec.ts \
  e2e/core-35-comms-sse-unread-bump.spec.ts \
  e2e/core-36-supplier-delivery-confirm.spec.ts \
  e2e/core-37-brand-create-article-wizard.spec.ts \
  e2e/core-38-shop-showroom-empty-onboarding.spec.ts \
  e2e/core-39-clean-pg-section-deep.spec.ts \
  e2e/core-40-clean-pg-comms-four-roles.spec.ts \
  e2e/core-41-batch-publish-audit-roundtrip.spec.ts \
  e2e/core-42-clean-pg-mfr-handoff-shop-floor.spec.ts \
  e2e/core-43-clean-pg-po-calendar-export-wms.spec.ts \
  e2e/core-44-brand-dev-disclosure-mfr-calendar.spec.ts \
  e2e/core-45-brand-showroom-unified-clean-pg-tracking.spec.ts \
  e2e/core-46-linesheet-audit-order-comms-thread.spec.ts \
  e2e/core-47-pg-collections-retailers-tier.spec.ts \
  e2e/core-48-mfr-sup-interaction-comms-thread.spec.ts \
  e2e/core-49-brand-op-minimums-clean-pg.spec.ts \
  --config=playwright.core.config.ts

echo "PASS core:ci:pg-primary"
