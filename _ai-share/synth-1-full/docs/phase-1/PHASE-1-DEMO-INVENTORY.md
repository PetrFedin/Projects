# Инвентаризация демо-данных (этап 1, DEMO1)

**Статус:** актуализировано по репозиторию · **Дата:** 2026-05-07  
**Назначение:** импорты **`@/lib/placeholder-data`** для политики бейджей «Демо» и последующей замены на API.

## Импорт `@/lib/placeholder-data` в `src` (снимок `rg`)

| # | Путь | Назначение (кратко) |
|---|------|---------------------|
| 1 | `app/admin/brands/page.tsx` | Админ — каталог брендов |
| 2 | `app/admin/quality/page.tsx` | Админ — качество |
| 3 | `app/b/[brandId]/hooks/use-brand-data.ts` | Хук данных витрины бренда |
| 4 | `app/b/[brandId]/hooks/useBrandProfile.ts` | Профиль витрины |
| 5 | `app/brand/analytics/page.tsx` | Аналитика бренда |
| 6 | `app/brand/brands/page.tsx` | Список брендов (кабинет) |
| 7 | `app/brand/collaborations/page.tsx` | Коллаборации |
| 8 | `app/brand/kickstarter/[campaignId]/page.tsx` | Kickstarter (кабинет бренда) |
| 9 | `app/brand/profile/page.tsx` | Профиль бренда |
| 10 | `app/client/catalog/page.tsx` | Каталог клиента |
| 11 | `app/kickstarter/[campaignId]/page.tsx` | Kickstarter публичный |
| 12 | `app/shop/b2b/partners/[brandId]/page.tsx` | Карточка партнёра (ритейл B2B) |
| 13 | `app/shop/b2b/rating/page.tsx` | Рейтинг B2B |
| 14 | `components/home/HomePageClient.tsx` | Домашняя страница |
| 15 | `lib/production/workshop2-sewing-plan-reference-data.ts` | Референсные данные плана пошива |

*`app/brands/page.tsx`, `app/project-info/*` в текущем снимке **не** импортируют `placeholder-data`.*

## DEMO2 / дисклеймеры (явный «Демо» + `data-testid`)

| Экран | `data-testid` |
|-------|----------------|
| `/factory/supplier/circular-hub` | `supplier-circular-demo-disclaimer` |
| `/brand/analytics` | `brand-analytics-demo-disclaimer` |
| `/shop/b2b/tracking` | `shop-b2b-tracking-demo-disclaimer` |
| `/shop/b2b/partners/[brandId]` | `shop-b2b-partner-detail-demo-disclaimer` |

## Связанный контур: `mockB2BOrders` (`@/lib/order-data`)

Для P0-ENTITY см. [`PHASE-1-NEXT-ACTIONS.md`](./PHASE-1-NEXT-ACTIONS.md) §3 — очередь read-model отделена от списка placeholder выше.

**`/shop/b2b-orders`:** данные через **`useShopB2BOperationalOrdersList`** (operational read-model), не прямой `mockB2BOrders`.
