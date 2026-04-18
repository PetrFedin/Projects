# План отказа от `/shop/b2b/catalog`

## Цель

Перенести все необходимые B2B-возможности из `/shop/b2b/catalog` в ролевые кабинеты (`shop`, `brand`, `factory`, `supplier`, `distributor`, `admin`), связать их единым процессом и затем деактивировать `/shop/b2b/catalog`.

## Принцип

- `/shop/b2b/catalog` временно используется как агрегатор/entry.
- Каноническая модель: **capability-layer по ролям**, а не отдельный “хаб-остров”.
- Отказ от маршрута возможен только после прохождения gate-критериев ниже.

## Канонические роли и ownership

- `shop` — buyer flow: discover -> selection -> order submit.
- `brand` — seller flow: offer -> approve -> fulfill orchestration.
- `factory` — production execution + status back-propagation.
- `supplier` — materials readiness + compliance signals.
- `distributor` — multi-brand channel coordination.
- `admin` — e2e observability, audit, overrides, disputes/SLA.

## Фаза 0 — Инвентаризация и freeze

1. Зафиксировать полный список фич из `/shop/b2b/catalog` (источник: `getShopB2BHubLinks` + page-level actions).
2. Проставить каждой фиче:
   - owner role,
   - target cabinet route,
   - взаимодействующие роли,
   - текущий статус: `ready | partial | missing | duplicate`.
3. Ввести правило: новые B2B-фичи добавляются сразу в ролевой кабинет, не в агрегатор.

Выходной артефакт:

- `B2B_CAPABILITY_GAP_MAP_RU.md` (матрица 1:1 фича -> роль -> маршрут -> gap).

## Фаза 1 — Role parity (минимально необходимый набор)

### Shop (обязательно)

- Discover/catalog
- Selection builder / assortment planning
- Create/quick/grid/working order
- Order drafts/templates
- Documents/payment/finance tracking

### Brand (обязательно)

- Offer publish (showroom/linesheets)
- Commercial terms / price lists / customer groups
- Inbound order processing / approval / amendments
- Shipment + PO visibility

### Factory (обязательно)

- Производственные задачи от подтвержденных B2B заказов
- Статусы исполнения по заказу/позиции
- Инвентарь/документы в связке с Brand

### Supplier (обязательно, текущий gap)

- Материальная готовность под B2B заказ
- SLA/availability signals
- Compliance/traceability signals

### Distributor (обязательно)

- Multi-brand ordering + matrix/contracts
- Координация retailer/territory сценариев

### Admin (обязательно)

- E2E lifecycle timeline
- Аудит переходов и действий
- Исключения: disputes/SLA/integrations
- Контролируемые override

Критерий выхода Фазы 1:

- Для каждой обязательной capability есть рабочий route в ролевом кабинете.

## Фаза 2 — Межролевые связки (workflow integration)

1. Единые идентификаторы сущностей (order/item/sku/partner) во всех кабинетах.
2. Кросс-ролевые переходы из карточек:
   - Shop order -> Brand order detail
   - Brand fulfillment -> Factory execution
   - Factory delay -> Admin monitor/dispute
   - Supplier readiness -> Brand/Factory views
3. Единые статусные контракты и event transitions.

Критерий выхода Фазы 2:

- Сквозной сценарий “от селекции до закрытия заказа” проходится без `/shop/b2b/catalog`.

## Фаза 3 — UI/Navigation cleanup

1. Убрать дубли B2B entry points в глобальной навигации.
2. Оставить только role-cabinet entry с контекстными переходами.
3. В `/shop/b2b/catalog` включить soft-banner “маршрут устаревает” + редиректы на канонические экраны.

Критерий выхода Фазы 3:

- Пользователь не зависит от агрегатора для ежедневных операций.

## Фаза 4 — Деактивация `/shop/b2b/catalog`

1. Включить режим `read-only` (короткий переходный период).
2. Включить 301/302 редиректы на канонические role routes.
3. Удалить страницу после подтвержденной стабилизации.

Критерий полного отказа:

- 0 критичных пользовательских сценариев используют `/shop/b2b/catalog`.

## Gate-критерии перед выключением

- [ ] Нет runtime ошибок навигации (`href`, key warnings, broken links).
- [ ] Role parity закрыта по must-have capability.
- [ ] Кросс-ролевые переходы покрыты smoke/e2e.
- [ ] Admin видит полный lifecycle + аудит.
- [ ] Product/design sign-off по UX роли.

## Риски и защита

- Риск: supplier/factory parity недозакрыта -> нельзя выключать агрегатор.
- Риск: дублирующие маршруты в top nav -> потеря понятности.
- Риск: разная семантика статусов между ролями -> несогласованность.

Митигация:

- единый статусный словарь,
- централизованный capability map,
- staged rollout по ролям с метриками.

## Что делаем сразу (оперативный next step)

1. Составляем `B2B_CAPABILITY_GAP_MAP_RU.md` (подробная карта gap).
2. Выделяем Top-10 gap для `supplier/factory/distributor`.
3. Вносим задачи в спринт с owner per role.
