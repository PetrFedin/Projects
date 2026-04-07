# Библиотека: типы, API-заглушки, данные

Здесь лежат типы, константы эндпоинтов и мок-данные для фич. Реальные HTTP-вызовы при подключении бэкенда подставляются в страницах или в отдельных API-клиентах.

## Маршруты

- **`routes.ts`** — единый источник правды для путей приложения (`ROUTES.client`, `ROUTES.brand`, `ROUTES.shop`). Использовать вместо строковых литералов в навигации и ссылках.

## API-заглушки (константы эндпоинтов)

При подключении API заменить моки на вызовы по указанным путям.

| Модуль | Файл | Константа | Описание |
|--------|------|-----------|----------|
| Analytics Phase 2 | `analytics/phase2.ts` | `ANALYTICS_PHASE2_API` | ETL fact_* / snapshot_*, buying analytics, дашборды план/факт, импорт 1С/Мой Склад |
| BOPIS | `bopis.ts` | (типы + моки в страницах) | Самовывоз, точки выдачи, маркировка (Честный ЗНАК), ЭДО |
| Endless Aisle POS | `shop/endless-aisle-pos.ts` | `ENDLESS_AISLE_POS_API` | Заказ отсутствующего размера со склада из примерочной |
| Ship-from-Store | `shop/ship-from-store.ts` | `SHIP_FROM_STORE_API` | Отправка онлайн-заказа из ближайшей точки |
| Endless Stylist | `shop/endless-stylist.ts` | `ENDLESS_STYLIST_API` | Сборка образа на планшете продавца |
| BNPL Gateway | `shop/bnpl-gateway.ts` | `BNPL_GATEWAY_API` | Рассрочка на кассе (Тинькофф, Сбер и др.) |
| Cycle Counting | `shop/cycle-counting.ts` | `CYCLE_COUNTING_API` | Инвентаризация склада через камеру смартфона |
| Local Inventory Ads | `shop/local-inventory-ads.ts` | `LOCAL_INVENTORY_ADS_API` | Передача наличия в Google / Yandex Maps |
| Style-Me Upsell | `marketing/style-me-upsell.ts` | `STYLE_ME_UPSELL_API` | Персональные подборки в мессенджер после покупки |
| Digital Wardrobe | `client/digital-wardrobe.ts` | `DIGITAL_WARDROBE_API` | Виртуальный шкаф + конструктор луков |
| Try Before You Buy B2C | `client/try-before-you-buy-b2c.ts` | `TRY_BEFORE_YOU_BUY_B2C_API` | Примерка с холдированием средств |
| Production (QC, Milestones, Subcontractor) | `production/*.ts`, `distributor/*.ts` | см. файлы | QC App, Milestones Video, Subcontractor Hub, Territory, Pre-Order Quota, Sub-Agent Commission |
| Supplier RFQ | (в `supplier-rfq` или в brand) | — | Тендеры на ткань/фурнитуру |
| Budget-Actual | `budget-actual.ts` | — | План vs Факт (рубли) |
| Gift Registry | `gift-registry.ts` | — | Списки подарков |

## Данные и навигация

- **`data/entity-links.ts`** — перекрёстные ссылки между модулями (getBopisLinks, getDigitalWardrobeLinks и т.д.). Часть href берётся из `ROUTES`.
- **`data/brand-navigation.ts`** — структура меню бренд-кабинета.
- **`data/shop-navigation-normalized.ts`** — структура меню магазина (ритейлер).

## API-слой (src/lib/api/)

Реализован клиент и модули по контрактам; при отсутствии бэкенда (или при ошибке запроса) возвращаются моки.

- **`api/client.ts`** — `get(path)`, `post(path, body)`. Базовый URL: `NEXT_PUBLIC_API_BASE_URL`.
- **`api/analytics-phase2.ts`** — `getFactTables()`, `getBuyingSummary()` по `ANALYTICS_PHASE2_API`.
- **`api/style-me-upsell.ts`** — `listCampaigns()` по `STYLE_ME_UPSELL_API`.
- **`api/territory-protection.ts`** — `listRules()` по `TERRITORY_PROTECTION_API`.
- **`api/pre-order-quota.ts`** — `listCampaigns()`, `getCampaign(id)` по `PRE_ORDER_QUOTA_API`.
- **`api/sub-agent-commission.ts`** — `listRecords()`, `listAgents()` по `SUB_AGENT_COMMISSION_API`.
- **`api/supplier-rfq.ts`** — `listRfq()`, `getRfq(id)` по `SUPPLIER_RFQ_API`.
- **`api/budget-actual.ts`** — `listSnapshots()` по `BUDGET_ACTUAL_API`.
- **`api/digital-wardrobe.ts`** — `listItems()`, `listLooks()` по `DIGITAL_WARDROBE_API` (B2C).
- **`api/try-before-you-buy-b2c.ts`** — `listOrders()` по `TRY_BEFORE_YOU_BUY_B2C_API` (B2C).
- **`api/bnpl-gateway.ts`** — `listTransactions()` (Shop).
- **`api/ship-from-store.ts`** — `listAssignments()` по `SHIP_FROM_STORE_API`.
- **`api/endless-aisle-pos.ts`** — `listRequests()` по `ENDLESS_AISLE_POS_API`.
- **`api/cycle-counting.ts`** — `listSessions()` (сессии инвентаризации).
- **`api/local-inventory-ads.ts`** — `listFeeds()` по `LOCAL_INVENTORY_ADS_API`.
- **`api/endless-stylist.ts`** — `listLooks()` (образы стилиста).
- **`api/index.ts`** — реэкспорт для использования в страницах.

В страницах использовать вызовы вида `getFactTables()`, `listCampaigns()` и т.п.; при подключении бэкенда достаточно задать `NEXT_PUBLIC_API_BASE_URL`.

## Рекомендации при подключении API

1. Новые фичи добавлять в `src/lib/api/` по образцу существующих модулей (контракт из `src/lib`, fallback на моки).
2. В страницах использовать функции из `@/lib/api` вместо локальных моков.
3. Обработку ошибок и загрузку (loading) вынести в хуки или в общий слой запросов при необходимости.
