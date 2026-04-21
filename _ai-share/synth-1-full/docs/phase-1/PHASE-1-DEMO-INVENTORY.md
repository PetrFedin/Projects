# Инвентаризация демо-данных (этап 1, DEMO1)

**Статус:** черновик репозитория · **Дата:** 2026-04-19  
**Назначение:** список экранов под `src/app`, тянущих **`placeholder-data`**, для политики бейджей «Демо» и последующей замены на API.

## Импорт `@/lib/placeholder-data` в `src/app`

| # | Путь | Назначение (кратко) |
|---|------|---------------------|
| 1 | `app/brand/analytics/page.tsx` | Аналитика бренда |
| 2 | `app/brand/brands/page.tsx` | Список брендов |
| 3 | `app/brand/collaborations/page.tsx` | Коллаборации |
| 4 | `app/brand/kickstarter/[campaignId]/page.tsx` | Кампания kickstarter |
| 5 | `app/brand/profile/page.tsx` | Профиль бренда |
| 6 | `app/b/[brandId]/hooks/use-brand-data.ts` | Хук данных бренда |
| 7 | `app/b/[brandId]/hooks/useBrandProfile.ts` | Профиль витрины |
| 8 | `app/brands/page.tsx` | Каталог брендов |
| 9 | `app/admin/brands/page.tsx` | Админ брендов |
| 10 | `app/admin/quality/page.tsx` | Качество |
| 11 | `app/client/catalog/page.tsx` | Каталог клиента |
| 12 | `app/kickstarter/[campaignId]/page.tsx` | Kickstarter публичный |
| 13 | `app/project-info/product-display/page.tsx` | Project info |
| 14 | `app/shop/b2b/partners/[brandId]/page.tsx` | Партнёр + мок заказов |
| 15 | `app/shop/b2b/rating/page.tsx` | Рейтинг B2B |

*Снимок: автоматический поиск по репозиторию; дополнять при новых импортах.*

## Связанный контур: `mockB2BOrders` (`@/lib/order-data`)

Для P0-ENTITY см. [`PHASE-1-NEXT-ACTIONS.md`](./PHASE-1-NEXT-ACTIONS.md) §шаг 3 — отдельная очередь на read-model, не дублируется здесь полностью.

## Следующий шаг (DEMO2)

Выбрать **2** экрана из таблицы с наибольшим риском «выдать за прод» (рекомендация: **`brand/analytics`**, **`shop/b2b/partners/[brandId]`**) и добавить дисклеймер + `data-testid` по образцу circular-hub (`CORE_OPERATING_CHAIN` §5).
