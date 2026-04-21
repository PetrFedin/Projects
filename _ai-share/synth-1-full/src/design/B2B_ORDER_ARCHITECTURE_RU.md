# B2B wholesale: вертикаль, горизонталь, расширения (synth-1-full)

Канон дополняет `SOURCE_OF_TRUTH.md` (раздел B2B). Ориентация: **РФ**, опт, маркетплейсы и учётные системы.

## Вертикаль слоёв

1. **UI** (`/shop/b2b/*`, `/brand/b2b/*`) → по возможности `fetch` к API, fallback read-model.
2. **HTTP** — `GET /api/b2b/v1/operational-orders`, legacy envelope, `export-order`.
3. **Домен** — `listB2BOrdersForOperationalUiServer`, `applyOrderPaymentsOverlay`, далее `order-state-machine`, `domain-events`.
4. **Персистентность** — `data/b2b-orders.snapshot.json` (v1), позже Postgres/OMS. Env: `B2B_ORDERS_SNAPSHOT_FILE`.

## Горизонталь доменов

- **Ядро:** заказ, черновик, кредит/оплаты.
- **РФ:** экспорт на platform → маркетплейсы / 1С / ЭДО (не смешивать с `integrations/archive` в прод-навигации).

## Точки расширения в коде

| Механизм | Файл |
|----------|------|
| Оверлей оплат на любой базе | `applyOrderPaymentsOverlay` в `partner-finance-rollup.ts` |
| Фильтр brand/retailer | `filterB2BOrdersByOperationalActor` в `b2b-orders-read-model-shared.ts` |
| Снимок списка заказов | `b2b-order-persistence.file.ts`, тип `B2BOrderSnapshotFileV1` |
| Детализация строк без БД (план) | `lineItemsByOrderId` в снимке v1 |
| Порт чтения (план) | `B2BOrderReadPort` в `b2b-order-persistence.types.ts` |

## Следующие шаги

- Деталь заказа из `lineItemsByOrderId` в `toV1DetailDto`.
- Замена фильтра `Демо-магазин` на `organizationId` при появлении в типах.
- Клиентская страница списка заказов — только через хук с API (синхронизация с серверным снимком).
