#!/usr/bin/env bash
# Platform Core — демо-URL после bootstrap (инвестор / ручная проверка).
set -euo pipefail
BASE="${CORE_DEMO_BASE_URL:-http://localhost:3001}"

cat <<EOF
Platform Core — демо-маршруты (${BASE})

Investor walkthrough (чеклист на hub)
  ${BASE}/platform?collection=SS27
  ${BASE}/platform?collection=EMPTY27   # контраст без seed

Личные кабинеты (5 столпов × 4 роли)
  ${BASE}/brand/core
  ${BASE}/shop/core
  ${BASE}/factory/production/core
  ${BASE}/factory/supplier/core

Столп 1 · ТЗ → образец
  ${BASE}/platform
  ${BASE}/brand/production/workshop2?w2col=SS27
  ${BASE}/brand/range-planner
  ${BASE}/brand/factories/f1

Столп 2 · Образец → коллекция
  ${BASE}/brand/linesheets
  ${BASE}/brand/showroom
  ${BASE}/shop/b2b/showroom?collection=SS27

Столп 3 · Коллекция → заказ
  ${BASE}/shop/b2b/matrix?collection=SS27
  ${BASE}/shop/b2b/orders
  ${BASE}/shop/b2b/orders/B2B-DEMO-SHOP1-SS27
  ${BASE}/brand/b2b-orders
  ${BASE}/brand/b2b-orders/B2B-DEMO-SHOP1-SS27
  ${BASE}/brand/retailers

Столп 4 · Заказ → производство
  ${BASE}/factory/production
  ${BASE}/factory/supplier
  ${BASE}/factory/production/dossier/demo-ss27-01

Столп 5 · Связь
  ${BASE}/brand/messages?contextType=b2b_order&contextId=B2B-DEMO-SHOP1-SS27
  ${BASE}/brand/calendar

FW27 (вторая demo-коллекция, /platform?collection=FW27)
  ${BASE}/platform?collection=FW27
  ${BASE}/brand/production/workshop2?w2col=FW27
  ${BASE}/shop/b2b/showroom?collection=FW27
  ${BASE}/shop/b2b/matrix?collection=FW27
  ${BASE}/shop/b2b/orders/B2B-DEMO-SHOP1-FW27
  ${BASE}/brand/core?collection=FW27&pillar=collection_order
  ${BASE}/factory/production/dossier/demo-fw27-01

Проверка:
  npm run core:demo:check
  npm run core:status
  npm run core:verify
  npm run core:verify:interactive   # после bootstrap:interactive — handoff pending

Сквозная цепочка (shop → brand → production):
  npm run core:chain

Подготовка к демо (PG + walkthrough):
  npm run core:prep

Интерактивное демо (без auto-handoff в seed):
  npm run db:core:bootstrap:interactive
  npm run core:chain:interactive
EOF
