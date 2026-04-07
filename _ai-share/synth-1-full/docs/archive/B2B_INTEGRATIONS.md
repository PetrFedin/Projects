# B2B-интеграции: JOOR, NuOrder, Fashion Cloud, SparkLayer, Colect, Zedonk

Связь с платформой: дистрибуторы, производство, поставщики, бренды, магазины.

## GitHub и источники

| Платформа      | GitHub / доки | Что встроено в проект |
|----------------|----------------|------------------------|
| **JOOR**       | [batpig61/JoorAPI_Examples](https://github.com/batpig61/JoorAPI_Examples), [api-docs.jooraccess.com](https://api-docs.jooraccess.com/docs) | `joor-api.ts`, `joor-inventory.ts` (v2), `joor-prices.ts` (v4), `joor-orders.ts`, `joor-styles-customers.ts`. Остатки, цены, импорт заказов, синхрон стилей и клиентов. UI: `/brand/integrations/joor`. |
| **NuOrder**    | [jacobsvante/nuorder](https://github.com/jacobsvante/nuorder) (Python, OAuth 1.0), [nuorderapi1.docs.apiary.io](https://nuorderapi1.docs.apiary.io/) | `nuorder-client.ts` + `nuorder-server.ts`: company codes, order/new, **inventory** (pre-book, ATS), **shipments**, **order edits** (amendments), **replenishment**. API: export-order, company-codes, nuorder/inventory, nuorder/shipment, nuorder/order-edit, nuorder/replenishment. UI: `/brand/integrations/nuorder`. |
| **Fashion Cloud** | [onetoweb/fashion-cloud](https://github.com/onetoweb/fashion-cloud) (PHP), [api.showroom.fashion.cloud](https://api.showroom.fashion.cloud/) | `fashion-cloud-client.ts`: products, stock, **orders/draft_orders**, **stock bulk upsert**, каталог с **options + media** (фото, видео, 3D). API: catalog-summary, fashion-cloud/orders, draft-orders, stock-bulk, catalog-sync, webhook. UI: `/brand/integrations/fashion-cloud`. |
| **SparkLayer** | [docs.sparklayer.io](https://docs.sparklayer.io/tech-docs/pricing-api), [SparkLayer API](https://docs.sparklayer.io/sparklayer-api), [JavaScript SDK](https://docs.sparklayer.io/tech-docs/javascript-sdk) | `sparklayer-pricing.ts` (Pricing API) + `sparklayer-core.ts`: **Core API** (products, customers, orders), **Quoting** (КП, workflow), **customer rules** и **discounts**. API: price-lists, sparklayer/products, customers, orders, quotes, customer-rules, discounts. UI: `/brand/integrations/sparklayer`. Фронт: JS SDK по необходимости. |
| **Colect**     | [docs.colect.io](https://docs.colect.io) (user) | `colect-client.ts`: структура лукбука (главы, Key Looks), контент (фото, видео, 3D), режимы показа, добавление в заказ — при появлении API. Env: COLECT_API_URL, COLECT_ACCESS_TOKEN. UI: `/brand/integrations/colect`. |
| **Zedonk**     | [api-docs.jooraccess.com](https://api-docs.jooraccess.com) (Zedonk ERP) | `zedonk-client.ts`: приём заказов из Zedonk (JOOR/NuOrder через него), multi-brand/agent (бренды, сводные заказы) — при появлении API. Env: ZEDONK_API_BASE, ZEDONK_ACCESS_TOKEN. UI: `/brand/integrations/zedonk`. |

## Переменные окружения

- **JOOR**: `JOOR_API_BASE` или `NEXT_PUBLIC_JOOR_API_BASE`, `JOOR_ACCESS_TOKEN`.
- **NuOrder**: `NUORDER_HOSTNAME`, `NUORDER_CONSUMER_KEY`, `NUORDER_CONSUMER_SECRET`, `NUORDER_OAUTH_TOKEN`, `NUORDER_OAUTH_TOKEN_SECRET`.
- **Fashion Cloud**: `FASHION_CLOUD_TOKEN` или `NEXT_PUBLIC_FASHION_CLOUD_TOKEN`.
- **SparkLayer**: `SPARKLAYER_API_URL`, `SPARKLAYER_ACCESS_TOKEN`.
- **Colect**: `COLECT_API_URL`, `COLECT_ACCESS_TOKEN` (при появлении API).
- **Zedonk**: `ZEDONK_API_BASE` или `NEXT_PUBLIC_ZEDONK_API_BASE`, `ZEDONK_ACCESS_TOKEN`.

## API платформы

- `GET /api/b2b/integrations/status` — статус интеграций.
- `POST /api/b2b/export-order` — экспорт заказа (`provider`: nuorder | joor).
- `GET /api/b2b/nuorder/company-codes` — коды компаний NuOrder.
- `POST /api/b2b/nuorder/inventory` — синхрон остатков (pre-book, ATS): body `{ inventory, overwrite? }`.
- `POST /api/b2b/nuorder/shipment` — отправка статуса отгрузки: body `{ order_id, tracking_number?, carrier?, status?, lines? }`.
- `PUT /api/b2b/nuorder/order-edit` — amendments: body `{ order_id, lines?, note? }`.
- `POST /api/b2b/nuorder/replenishment` — replenishment feed: body `{ items }`.
- `GET /api/b2b/integrations/catalog-summary` — сводка каталога (Fashion Cloud).
- `GET /api/b2b/fashion-cloud/orders` — импорт заказов (query: brandId, status, since, limit).
- `GET /api/b2b/fashion-cloud/draft-orders` — импорт черновиков (query: brandId).
- `POST /api/b2b/fashion-cloud/stock-bulk` — массовая выгрузка остатков (body: `{ stock }`).
- `POST /api/b2b/fashion-cloud/catalog-sync` — синхрон каталога с options и media (body: `{ products }`).
- `POST /api/b2b/fashion-cloud/webhook` — приём вебхуков от Fashion Cloud.
- `GET /api/b2b/integrations/price-lists` — прайс-листы (SparkLayer).
- `GET /api/b2b/sparklayer/products` — продукты (Core API). Query: limit, offset.
- `GET /api/b2b/sparklayer/customers` — клиенты. Query: limit, offset.
- `GET /api/b2b/sparklayer/orders` — заказы. Query: customerId, status, limit. `POST` — создание заказа.
- `GET /api/b2b/sparklayer/quotes` — КП (Quoting). Query: customerId, status, limit. `POST` — создание КП.
- `PATCH /api/b2b/sparklayer/quotes/:quoteId` — обновление статуса КП (workflow). Body: `{ status }`.
- `GET /api/b2b/sparklayer/customer-rules` — правила по клиентам. Query: customerId.
- `GET /api/b2b/sparklayer/discounts` — скидки. Query: customerId, valid.
- `GET /api/b2b/colect/lookbook/[lookbookId]/structure` — структура лукбука (главы, Key Looks).
- `GET /api/b2b/colect/lookbook/[lookbookId]/content` — контент (фото, видео, 3D). Query: chapterId, type.
- `POST /api/b2b/colect/add-to-order` — добавление Key Look в заказ. Body: lookbookId, keyLookId, skus.
- `GET /api/b2b/zedonk/orders` — приём заказов из Zedonk. Query: since, until, status, limit.
- `GET /api/b2b/zedonk/brands` — список брендов (multi-brand).
- `GET /api/b2b/zedonk/consolidated-orders` — сводные заказы агента. Query: since, limit.

### JOOR

- `POST /api/b2b/joor/inventory` — выгрузка остатков (v2): body `{ items, overwrite?, decPending? }`.
- `GET /api/b2b/joor/price-types` — типы цен (v4).
- `POST /api/b2b/joor/prices` — массовое обновление цен: body `{ prices: JoorPriceItem[] }`.
- `GET /api/b2b/joor/orders` — импорт заказов: query `since`, `until`, `status`, `limit`.
- `POST /api/b2b/joor/sync-styles` — синхрон стилей: body `{ styles, drop_style_ids? }`.
- `POST /api/b2b/joor/sync-customers` — синхрон клиентов: body `{ customers }`.
