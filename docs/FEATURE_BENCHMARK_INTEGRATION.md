# Бенчмарк фич и рекомендации по интеграции

Сравнение с JOOR, NuOrder, Faire, RepSpark, Fashion Cloud, Uphance, Brandboom, SparkLayer, Le New Black и др.

---

## Приоритет 1: Быстрые победы (низкий объём работ)

| Фича | Источник | Описание | Статус в Synth-1 | Действие |
|------|----------|----------|------------------|----------|
| **Quoting System** | SparkLayer, RepSpark | Котировки с expiry, переговоры buyer↔brand | Нет | Добавить `Quote` модель, `POST /quota/quotes`, workflow Draft→Sent→Accepted/Expired |
| **Event Microsites** | RepSpark | Мини-сайты под выставки/сезон (отдельный URL, ограниченный каталог) | Нет | Расширить Showroom: `showroom_type=event`, `event_dates`, `invite_only` |
| **Retailer Discovery** | JOOR Discover, Brandboom Marketplace | AI-подбор байеров под продукт/регион | Нет | Использовать embeddings + DemandForecast для `GET /ai/buyer-recommendations` |
| **Order Minimums by Country** | Faire | MOQ разный по стране | MOQ есть, по стране — нет | Расширить `MOQSetting`: `country_code`, `min_units` |

---

## Приоритет 2: Средний объём (1–2 спринта)

| Фича | Источник | Описание | Статус в Synth-1 | Действие |
|------|----------|----------|------------------|----------|
| **Net 60 / Payment Terms** | Faire, Brandboom flowPAY | Отсрочка платежа для байеров, гарантия выплат бренду | CreditLimit есть | Добавить `PaymentTerm` (Net 30/60/90), интеграция с факторингом (FactoringRequest) |
| **Smart Replenishment** | Fashion Cloud | Автозаказы по продажам и остаткам | VMI/Replenishment есть | Добавить AI-рекомендации: `GET /ai/replenishment-suggestions` на основе sell-through |
| **AI Order Insights** | RepSpark | Аномалии в заказах, алерты | Нет | Расширить агентов: `OrderAnomalyAgent` — большие отклонения от истории, дубликаты |
| **Always-On Cart** | RepSpark Flow | Черновик заказа сохраняется между сессиями | Draft Order есть | Персистентный cart в frontend + `PUT /orders/draft/{id}` для синка |
| **Content Expiry Reminders** | Fashion Cloud | Напоминания об истечении контента (lookbook, сертификаты) | Нет | Добавить `ContentExpiryAlert` в AlertService, триггер по `valid_until` |
| **Assortments (10+ stores)** | NuOrder | Кураторские ассортименты для сетей | Collection/Drop есть | Добавить `Assortment` — связка коллекция + список ритейлеров + рекомендации по размерной сетке |

---

## Приоритет 3: Крупные инициативы

| Фича | Источник | Описание | Статус в Synth-1 | Действие |
|------|----------|----------|------------------|----------|
| **Data Hub / PIM for Retailers** | Fashion Cloud | Распространение product data в ERP ритейлеров (EDI, 40+ интеграций) | Нет | Отдельный модуль `RetailerDataHub`: экспорт в форматах ERP, webhook при обновлении |
| **Sales Rep iPad App (offline)** | Le New Black | Оффлайн-заказы, сканер штрихкодов | Нет | PWA + Service Worker, локальный кэш, sync при reconnect |
| **Blended B2C+B2B Store** | SparkLayer | Один магазин: B2C цены и B2B цены/каталог | Нет | Feature flag: один storefront, разный pricing по роли |
| **AI Trend Reports (Shoppable)** | JOOR | Визуальный поиск по трендам, привязка к продуктам | Trend Radars есть | Расширить: shoppable trend report = тренд + список подходящих SKU |

---

## РФ/СНГ специфика

| Фича | Источник | Описание | Рекомендация |
|------|----------|----------|--------------|
| **Маркетплейсы (WB, Ozon)** | InSales | Синк остатков, цен, заказов | Использовать существующие интеграции (Ozon в MASTER_PLAN) |
| **ABC/XYZ анализ** | InSales | Анализ товаров по оборачиваемости | Добавить в `app/analytics/`: ABC/XYZ отчёт |
| **Тендеры / Закупки** | B2B-Center | Модель закупок (B2G, корпоративные) | Другой домен; при необходимости — отдельный модуль RFQ/Tender |

---

## Уже есть в Synth-1 (не дублировать)

- Tech Pack, BOM, Grading, Sampling, Fit Comments
- Range Planning, Drops, Merchandise Grid
- DAM, Linesheet, Showroom 360
- MOQ, Credit Limits, Order Rules
- Influencer CRM, Academy, Compliance
- AI Studio (контент), Demand Forecast, Trend Radar

---

## Рекомендуемый порядок внедрения

1. **Quoting System** — закрывает частый запрос B2B
2. **Order Minimums by Country** — мало кода, высокая польза
3. **Event Microsites** — расширение Showroom
4. **Retailer Discovery (AI)** — использование имеющихся embeddings
5. **Net 60 / Payment Terms** — доработка CreditLimit
6. **Smart Replenishment (AI)** — использование DemandForecast + VMI
7. **AI Order Insights** — новый агент

---

*Создано 2026-03. Обновлять по мере внедрения.*
