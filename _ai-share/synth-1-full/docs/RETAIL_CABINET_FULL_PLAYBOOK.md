# Ритейл-кабинет `/shop` — playbook полного контура

Единая точка для **розницы + закупки у брендов (B2B)** в одном UI: навигация, срезы аналитики, учёт (ERP), перекрёстные ссылки и автотесты.

## Архитектура

| Слой | Файлы / маршруты |
|------|------------------|
| Маршруты | Только **`ROUTES.shop.*`** в **`src/lib/routes.ts`** (в т.ч. `analyticsFootfall`, `b2bMarginAnalysis`, `b2bLandedCost`, `b2bFinance`). |
| Сайдбар и табы | **`src/lib/data/shop-navigation-normalized.ts`** (`shopNavGroups`, подразделы в блоке **Аналитика**). |
| Срез «Розница / Опт / Маржа» + ERP | **`ShopAnalyticsSegmentErpStrip`** → **`ShopAnalyticsSegmentNav`** + **`ErpAccountingSyncBanner`**. |
| Статус учёта (API) | **`GET /api/shop/erp-sync-status`** — используется полосой и e2e. |
| RBAC | **`profile-page-features.ts`**, **`rbac.ts`** — при новых страницах проверить доступ. |

## Поведение сегмент-навигации

- **Розница**: пути `/shop/analytics` (включая `/shop/analytics/footfall`).
- **Опт**: аналитика закупок (`/shop/b2b/analytics`, `order-analytics`, `reports`) и **финансы партнёра** `/shop/b2b/finance*`.
- **Маржа**: `/shop/b2b/margin/*` и **landed cost** `/shop/b2b/landed-cost`.

Логика активной вкладки: **`src/components/shop/ShopAnalyticsSegmentNav.tsx`**.

## Перекрёстные ссылки («См. также»)

На экранах аналитики и маржи — единый паттерн:

- ссылка на **`ROUTES.shop.analytics`**, **`ROUTES.shop.analyticsFootfall`**, хаб маржи через **`B2bMarginAnalysisHubButton`** (`data-testid="b2b-margin-analysis-hub-link"`);
- на **`/shop/analytics/footfall`**: блок «См. также» — **`shop-footfall-retail-analytics-link`**, **`shop-footfall-b2b-link`**;
- на хабе **`/shop/b2b/margin-analysis`**: **`margin-hub-retail-analytics-link`**, **`margin-hub-b2b-analytics-link`** (карточки на калькулятор, отчёт, landed cost).

Имена `data-testid` для новых страниц: префикс **`shop-b2b-<страница>-retail-link`** / **`-footfall-link`** (см. **`e2e/shop-erp-analytics-strip.spec.ts`**).

## Чеклист новой фичи в `/shop`

1. Добавить маршрут в **`routes.ts`** (`shop`).
2. Ввести страницу в **`shop-navigation-normalized.ts`** (нужная группа + при необходимости подразделы).
3. На страницах с аналитикой/финансами: **`ShopAnalyticsSegmentErpStrip`**; при необходимости скрыть ERP-баннер (`showErpBanner={false}` — как на **`/shop`**).
4. Блок **«См. также»** + стабильные **`data-testid`** для e2e.
5. Прогон: **`npm run test:e2e:shop-retail`**; матрица демо: **`npm run test:e2e:verification`** (блок retail + margin hub в **`unified-ecosystem-smoke.spec.ts`**).

## Команды

| Команда | Назначение |
|---------|------------|
| `npm run test:e2e:shop-retail` | **`e2e/shop-erp-analytics-strip.spec.ts`** — API ERP + сегменты + перекрёстные ссылки. |
| `npm run test:e2e:verification` | Полный смок матрицы, включая retail hub и margin shell. |

## Продукт и дорожная карта

- **`docs/shop-retailer-cabinet-roadmap.md`** (если есть в репозитории) — приоритеты фич.
- Согласование с **`INTEGRATION_MAP.md`** и **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`** при изменении маршрутов smoke/API.

## Переменные окружения

- **`NEXT_PUBLIC_SHOP_NAV_MVP=1`** — скрыть пункты с `navTier: 'phase2'` (**`getShopNavDisplayMode`**).

## Доступ CFO / финансов

- Роль **`finance_manager`** включена в **`canAccessHub(..., \"shop\")`** — перекрёстные ссылки на ритейл-кабинет из других хабов.
- Маршруты **`/shop/b2b/finance`**, **`/shop/b2b/payment`** перечислены в **`RESOURCE_TO_ROUTES.finance`**; контур аналитики/маржи — в **`RESOURCE_TO_ROUTES.analytics`**.

## Дашборд `/shop`

- Быстрые секции B2B: **`src/lib/data/retailer-b2b-dashboard.ts`** (блок **«Аналитика и маржа»**: розница, footfall, опт, order-analytics, reports, хаб маржи, landed cost).
- Блок «Связь с брендом…»: **`getShopB2bDashboardCrossRoleLinks()`** в **`entity-links.ts`** — те же маршруты, что в сегмент-навигации, плюс финансы партнёра и кросс-хабы.

## CI (standalone `synth-1-full`)

В **`.github/workflows/ci.yml`**: job **`changes`** (`dorny/paths-filter`) и шаг **`npm run test:e2e:shop-retail`** только если менялись пути ритейл-кабинета (`src/app/shop/**`, `src/components/shop/**`, навигация/дашборд/связи, соответствующие e2e).

## CI (монорепо `Projects`)

Файл **`.github/workflows/synth-1-full-ci.yml`**: job **`changes`** с префиксом путей **`_ai-share/synth-1-full/`** и условный шаг **`npm run test:e2e:shop-retail`** в **`ci-fast`** (как в standalone).

## API ритейла и наблюдаемость

- **`GET /api/shop/erp-sync-status`** обёрнут в **`observeApiRoute`** — строки **`api.http`** при включённой наблюдаемости (см. **`AGENTS.md`**).
- Изменения в **`src/app/api/shop/**`** и обёртке **`observe-api-route.ts`** попадают в **`paths-filter`** → **`test:e2e:shop-retail`** в CI.
