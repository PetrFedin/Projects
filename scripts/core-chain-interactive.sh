#!/usr/bin/env bash
# Platform Core — интерактивная цепочка: handoff не в seed, подтверждение на UI.
set -euo pipefail
BASE="${CORE_DEMO_BASE_URL:-http://localhost:3001}"
ORDER="${CORE_DEMO_ORDER_ID:-B2B-DEMO-SHOP1-SS27}"

cat <<EOF
Platform Core — интерактивная цепочка (${BASE})

Подготовка (заказ submitted, без auto-handoff):
  npm run db:core:bootstrap:interactive
  npm run dev:core

0 · Кабинеты и обзор
   ${BASE}/platform
   ${BASE}/brand/core

1 · ТЗ → образец
   ${BASE}/brand/production/workshop2?w2col=SS27
   ${BASE}/brand/factories/f1

2 · Образец → коллекция (+ PDF linesheet)
   ${BASE}/brand/linesheets
   ${BASE}/api/shop/b2b/campaigns/SS27%3A%3Ademo-ss27-01/linesheet.pdf

3 · Коллекция → заказ (list chrome + деталка)
   ${BASE}/shop/b2b/orders
   ${BASE}/brand/b2b-orders
   ${BASE}/shop/b2b/matrix?collection=SS27
   ${BASE}/shop/b2b/orders/${ORDER}
   ${BASE}/brand/b2b-orders/${ORDER}

4 · Подтвердить → производство (живой шаг)
   UI: ${BASE}/brand/b2b-orders/${ORDER} → «Подтвердить → производство»
   API: curl -X POST ${BASE}/api/brand/b2b/orders/${ORDER}/confirm-production-handoff -H 'Content-Type: application/json' -d '{}'

5 · Производство + досье
   ${BASE}/factory/production
   ${BASE}/factory/production/orders   ← bulk accept в реестре (после handoff)
   ${BASE}/factory/production/dossier/demo-ss27-01

6 · Поставщик
   ${BASE}/factory/supplier

7 · Связь (столп 5)
   ${BASE}/brand/messages?contextType=b2b_order&contextId=${ORDER}
   ${BASE}/brand/calendar
   ${BASE}/shop/b2b/calendar

Проверка после handoff:
   ${BASE}/api/workshop2/b2b/orders/${ORDER}/chain-status
   npm run core:verify

Проверка pending handoff (после bootstrap:interactive, до кнопки):
   npm run core:verify:interactive
EOF
