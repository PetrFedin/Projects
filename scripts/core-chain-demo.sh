#!/usr/bin/env bash
# Platform Core — пошаговая демо-цепочка (инвестор).
set -euo pipefail
BASE="${CORE_DEMO_BASE_URL:-http://localhost:3001}"
ORDER="${CORE_DEMO_ORDER_ID:-B2B-DEMO-SHOP1-SS27}"

cat <<EOF
Platform Core — сквозная цепочка (${BASE})

0 · Личные кабинеты (столпы по роли)
   ${BASE}/brand/core
   ${BASE}/shop/core
   ${BASE}/factory/production/core
   ${BASE}/factory/supplier/core

1 · Бренд собирает коллекцию (столп «Образец → коллекция»)
   ${BASE}/brand/linesheets
   ${BASE}/brand/showroom
   ${BASE}/shop/b2b/showroom?collection=SS27

2 · Магазин формирует заказ (столп «Коллекция → заказ»)
   ${BASE}/shop/b2b/matrix?collection=SS27
   ${BASE}/shop/b2b/orders/${ORDER}

3 · Бренд принимает заказ (столп «Коллекция → заказ»)
   ${BASE}/brand/b2b-orders/${ORDER}

4 · Заказ → производство (столп handoff + PO + ТЗ)
   ${BASE}/brand/b2b-orders/${ORDER}
   (кнопка «Подтвердить → производство» или уже после seed)

5 · Производство по досье артикула
   ${BASE}/factory/production
   ${BASE}/factory/production/dossier/demo-ss27-01

6 · Поставщик: сырьё под PO
   ${BASE}/factory/supplier/core
   ${BASE}/brand/materials/reservation

7 · Связь (все роли)
   Чат: ${BASE}/brand/messages?contextType=b2b_order&contextId=${ORDER}
   Календарь: ${BASE}/brand/calendar?layers=tasks,orders,production

Статус цепочки (API):
   ${BASE}/api/workshop2/b2b/orders/${ORDER}/chain-status

Интерактив (без auto-handoff в seed):
   npm run core:chain:interactive
   npm run db:core:bootstrap:interactive

FW27 (вторая цепочка):
   ${BASE}/platform?collection=FW27
   ${BASE}/shop/b2b/matrix?collection=FW27
   ${BASE}/shop/b2b/orders/B2B-DEMO-SHOP1-FW27
   ${BASE}/factory/production/dossier/demo-fw27-01

Проверка:
   npm run core:demo:check
   npm run core:verify
EOF
