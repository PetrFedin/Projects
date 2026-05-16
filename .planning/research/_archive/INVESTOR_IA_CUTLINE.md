# Инвесторский срез: информационная архитектура и навигация

> **Копирование в канон:** при необходимости скопируйте файл вручную в  
> `**_ai-share/synth-1-full/docs/INVESTOR_IA_CUTLINE.md`**  
> (запись агентом в `docs/` может быть ограничена `.cursorignore` / политикой воркспейса).

**Дата:** 2026-05-11  
**Корень монорепо:** `/Users/petr/Projects`  
**Канон фронта:** `_ai-share/synth-1-full`  
**Связанный анализ:** `.planning/research/PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`

Этот документ описывает **как есть** поверхность продукта (URL + визуальные кабинеты), **как сузить** демо для инвестора и **на что опереться по факту кода/тестов**, а не по общим рекомендациям.

---

## Текущая карта продукта (визуально + по URL)

### Публичная витрина и общие маршруты


| Маршрут / зона                                                                                                                           | Роль                                           | Примечание                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| `/`                                                                                                                                      | Публичная главная                              | `src/app/page.tsx` → `HomePageDynamic`, `data-testid` `public-home`         |
| `/login`                                                                                                                                 | Вход                                           | Отдельный маршрут приложения                                                |
| `/catalog`, `/marketroom`                                                                                                                | Публичные витрины                              | Задекларированы в `ROUTES` (`src/lib/routes.ts`)                            |
| `/b/[brandId]/*`                                                                                                                         | Публичный профиль бренда                       | Табы, медиа, отдельное дерево от кабинета `/brand`                          |
| `/academy/*`                                                                                                                             | Клиентская академия (курсы, пути)              | Параллельно внутреннему `/brand/academy`                                    |
| `/checkout`, `/shipping`, `/orders/*`                                                                                                    | B2C-контур заказов                             | Общие layout-и возможны (`orders/layout.tsx`)                               |
| `/press`, `/live`, `/community`, `/kickstarter/*`, `/dpp/*`, `/u/*`, `/project-info/*`, `/wallet`, `/supplier/*`, `/store-locator` и др. | Маркетинг, демо-лендинги, вспомогательные зоны | Не входят в «операционный spine» инвесторского демо без отдельного сценария |


### Кабинеты (основные «оболочки» с сайдбаром)

Каждый кабинет задаёт **хром** (хаб + сайдбар) через свой `layout.tsx` и **нормализованную навигацию** в `src/lib/data/*-navigation*.ts`.


| Кабинет           | Базовый URL                                                              | Layout                                      | Источник пунктов меню                                             |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------- | ----------------------------------------------------------------- |
| Бренд             | `/brand/*` → фактический вход `**/brand/profile`** (редирект с `/brand`) | `src/app/brand/layout.tsx`                  | `brand-navigation.ts`, кластеры `syntha-nav-clusters.ts`          |
| Ритейл / shop     | `/shop/*`                                                                | `src/app/shop/layout.tsx`                   | `shop-navigation-normalized.ts` (`/shop/b2b` редирект на `/shop`) |
| Клиент            | `/client/*`, `/client/me/*`                                              | `client/layout.tsx`, `client/me/layout.tsx` | Клиентские группы (см. e2e `client hub sidebar`)                  |
| Фабрика           | `/factory/*` (в т.ч. `/factory/supplier`)                                | `factory/layout.tsx`, вложенные             | `factory-navigation.ts`                                           |
| Дистрибьютор      | `/distributor/*`                                                         | `distributor/layout.tsx`                    | `distributor-navigation.ts`                                       |
| Админ платформы   | `/admin/*`                                                               | `src/app/admin/layout.tsx`                  | `admin-navigation-normalized.ts`                                  |
| Академия в бренде | `/brand/academy/*`                                                       | `brand/academy/layout.tsx`                  | Вложенная зона внутри бренда                                      |


**Важно для «главной бренда»:** `src/app/brand/page.tsx` делает **постоянный редирект** на `/brand/profile` (с сохранением query). Каноничный «дом» бренда в коде — `**ROUTES.brand.home` = `/brand/profile`** (`routes.ts`).

---

## Кабинеты и разделы (таблица: раздел → маршруты → статус)

Статусы: **готово** — есть смок/API/e2e в матрице CI или плотные unit-тесты на BFF; **частично** — UI и маршруты есть, данные часто seed/demo или сценарий узкий; **заглушка/витрина** — страница в дереве без выделенного контрактного теста на сценарий.

### Бренд (`/brand`)


| Раздел (логика IA)                    | Ключевые маршруты                                                        | Статус                           | Комментарий                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Профиль / реестр                      | `/brand/profile`                                                         | частично                         | Registry shell; табы, часть метрик из демо-констант                                                                                                                                                                 |
| Организация / стратегия               | `/brand/organization`, query на profile                                  | частично                         | `organization-demo-data.ts` — явный **демо-источник без API** для ЦУ и алертов                                                                                                                                      |
| Центр управления                      | `/brand/control-center`, `/brand/dashboard`                              | частично                         | Хаб модулей; смешение реальных ссылок и обзорных карточек                                                                                                                                                           |
| B2B операционные заказы               | `/brand/b2b-orders`, `/brand/b2b-orders/[orderId]`                       | **готово** (контур)              | `GET /api/b2b/operational-orders`, v1 read/write в `AGENTS.md`; e2e `b2b-operational-orders-api.spec.ts`, `workshop2-smoke` открывает реестр                                                                        |
| Интеграции                            | `/brand/integrations`                                                    | **готово** (shell + связи)       | `unified-ecosystem-smoke`: `brand-integrations-page`, линк на B2B registry                                                                                                                                          |
| Производство (пол)                    | `/brand/production`                                                      | частично                         | Крупный UI; связка с коллекциями — `production-page-*`, e2e смок W2                                                                                                                                                 |
| Workshop 2 / ТЗ                       | `/brand/production/workshop2`, `/brand/production/workshop2/c/.../a/...` | частично → **готово** по демо-TЗ | `workshop2-smoke.spec.ts`, демо-досье в коде (`buildWorkshop2Ss27MenCoat01FullTzDemoDossier`, `e2e/helpers/w2-demo-routes`); API `api/brand/workshop2/phase1-dossier/*` с колокированными `__tests__/route.test.ts` |
| Tech pack (пилот)                     | BFF: `api/brand/workshop2/tech-pack/*`                                   | частично / env-gated             | `docs/W2_TECHPACK_PILOT.md`, `npm run w2:techpack:preflight`; без S3/DB — риск «не взлетит» на демо                                                                                                                 |
| Логистика / склад бренда              | `/brand/logistics`, `/brand/inventory`, `/brand/warehouse`               | частично                         | Кросс-линки на shop inventory в **verification** смоке                                                                                                                                                              |
| PIM / товары                          | `/brand/products`, матрица, карточки                                     | частично                         | Широкая поверхность; не все экраны в строгом `verify`                                                                                                                                                               |
| B2B «витрина» (лайншиты, шоурум, PO…) | `ROUTES.brand.b2b*` (десятки путей)                                      | витрина / по экрану              | Много страниц под JOOR/NuOrder-нарратив; без отдельного e2e на каждый                                                                                                                                               |
| Аналитика, мерч, маркетинг, ESG, IP…  | `/brand/analytics/*`, `/brand/merch/*`, …                                | витрина / частично               | Пример в общем smoke: `/brand/analytics/phase2`                                                                                                                                                                     |


### Shop (`/shop`)


| Раздел                  | Маршруты                                               | Статус                   | Комментарий                                                                                    |
| ----------------------- | ------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------- |
| Розничный хаб           | `/shop`, `/shop/analytics`, `/shop/analytics/footfall` | **готово** (сегмент)     | `unified-ecosystem-smoke`, `shop-erp-analytics-strip.spec.ts`, `GET /api/shop/erp-sync-status` |
| Склад / stock upload    | `/shop/inventory`                                      | **готово** (демо-контур) | Unified smoke: CSV upload, `GET/POST …/stock-upload`                                           |
| B2B финансы / маржа     | `/shop/b2b/margin-analysis`, калькуляторы, отчёты      | частично                 | В `smoke.spec.ts` и unified smoke как **навигационные** якоря                                  |
| Остальной `/shop/b2b/*` | десятки URL                                            | витрина                  | Риск «ширина без глубины» для питча (см. исследование приоритетов)                             |


### Клиент (`/client`)


| Раздел               | Маршруты                   | Статус   | Комментарий                          |
| -------------------- | -------------------------- | -------- | ------------------------------------ |
| Хаб                  | `/client`                  | частично | В `smoke.spec.ts`                    |
| Профиль              | `/client/me`               | частично |                                      |
| Гардероб и навигация | `/client/wardrobe`         | частично | e2e: именованное клиентское меню     |
| Швейные паттерны     | `/client/sewing-patterns*` | частично | `e2e/client-sewing-patterns.spec.ts` |


### Фабрика / дистрибьютор / админ


| Кабинет     | Маршруты                                   | Статус   | Комментарий                                  |
| ----------- | ------------------------------------------ | -------- | -------------------------------------------- |
| Factory     | `/factory/production`, `/factory/supplier` | частично | В `smoke.spec.ts`; `factory-navigation.ts`   |
| Distributor | `/distributor/*`                           | частично | `ROUTES.distributor`                         |
| Admin       | `/admin`, activity, audit, dossier metrics | частично | `admin-navigation-normalized.ts`; W2 метрики |


---

## Связанность и типичные пользовательские цепочки

1. **Бренд: операционный заказ** — `/brand/b2b-orders` → карточка `ROUTES.brand.b2bOrder(id)`; данные через BFF operational (demo read-model в `b2b-orders-list-read-model.ts`, см. `AGENTS.md`). Параллель в shop: `shopB2bOrderHref` → `/shop/b2b/orders/[orderId]`.
2. **Бренд ↔ Shop: инвентарь и загрузка стока** — `/brand/inventory` или `/brand/logistics` → ссылка на `/shop/inventory` → upload CSV → обратная ссылка на матрицу бренда. Зафиксировано в `**e2e/unified-ecosystem-smoke.spec.ts`** (приёмка `INTEGRATION_MAP` / `UNIFIED_ECOSYSTEM_VERIFICATION.md`).
3. **Бренд: интеграции → B2B реестр** — unified smoke проверяет карточку реестра с `href` на `/brand/b2b-orders`.
4. **Shop: розница ↔ опт ↔ маржа** — единая полоса сегментов аналитики; цепочка `/shop` → footfall → margin hub в unified smoke; методология в `docs/RETAIL_CABINET_FULL_PLAYBOOK.md` (цитата в `AGENTS.md`).
5. **Производство: коллекция → артикул → досье ТЗ (W2)** — `/brand/production` и вложенные `workshop2/...`; демо в `workshop2-smoke.spec.ts`.
6. **Публичный бренд** — `/b/[brandId]` отдельно от `/brand/profile`; для инвестора это другая история (витрина доверия vs операции).

---

## Предлагаемая структура для инвесторского демо (до / после)

### До (как сейчас воспринимается пользователь)

- Вход в бренд фактически `**/brand/profile`** с **большим сайдбаром** (`brandNavGroups`: команда, организация, PIM, B2B, производство, логистика, аналитика, … + архивные кластеры `SYNTHA_SIDEBAR_CLUSTERS`).
- Shop: `**/shop`** как розничный хаб + **очень широкий** `/shop/b2b/*`.
- Сотни страниц в `src/app/`; часть — **исследовательский UI** без e2e на сценарий.

### После (целевая IA для 3–7 экранов)

Согласовано с `PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`:

1. **Один demo-tenant** и граница маршрутов = union `**test:e2e:light`** (`e2e/smoke.spec.ts`) + `**test:e2e:verification`** (`unified-ecosystem-smoke`) + `**workshop2-smoke**` + при необходимости `**test:e2e:api**` (перечень файлов в `package.json`).
2. **Сайдбар:** свернуть до 4–5 бизнес-тезисов; остальное в «Архив» / скрыть флагом (аналог `**NEXT_PUBLIC_SHOP_NAV_MVP`** для shop уже в `shop-navigation-normalized.ts`).
3. **Подписи:** Demo data / Pilot (S3) / API v1 — по источнику данных.

---

## Что убрать / спрятать / не трогать до v2 (с обоснованием)


| Действие                           | Объект                                   | Почему                                                |
| ---------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| **Спрятать из инвесторского меню** | Длинный хвост `/shop/b2b/`* вне сценария | Меньше шума; не каждый экран в CI                     |
| **Спрятать в «Архив»**             | `brand/integrations/archive/`*           | Явно архивные маршруты в `ROUTES.brand.integrations*` |
| **Не позиционировать как shipped** | Отдельный Python FastAPI                 | Вне Next BFF без явной демо-связки                    |
| **Не удалять маршруты в v1**       | Редкие страницы                          | Риск сломать smoke, entity-links, закладки            |
| **Убрать из live-демо**            | Случайные deep-link без данных           | Слабая история без подготовленного tenant             |


---

## Список функций — обязательный акцент (P0) и второй эшелон (P1)

### P0 — обязательный акцент


| #   | Функция                                  | Где                                                                       | Готовность      | Риск / mock                                         |
| --- | ---------------------------------------- | ------------------------------------------------------------------------- | --------------- | --------------------------------------------------- |
| 1   | Реестр B2B operational orders + карточка | `/brand/b2b-orders`*, API `/api/b2b/operational-orders`, v1 в `AGENTS.md` | Высокая         | `meta.mode` demo/prod; `b2b-orders-list-read-model` |
| 2   | B2B v1 DTO и заметки                     | `operational-order-dto.ts`, `OperationalOrderNoteV1Panel`                 | Высокая         | RBAC через env                                      |
| 3   | Интеграции бренда                        | `/brand/integrations`                                                     | Высокая (shell) | Часть контента — сводки                             |
| 4   | Shop retail + ERP strip                  | `/shop`, `erp-sync-status`                                                | Высокая         | Контракт в e2e                                      |
| 5   | Shop inventory + upload                  | `/shop/inventory`, stock-upload API                                       | Высокая         | Демо CSV                                            |
| 6   | Cross-cabinet inventory                  | brand ↔ shop                                                              | Высокая         | Demo-auth в CI                                      |
| 7   | Processes + domain events API            | скрипт `test:e2e:api`                                                     | Высокая         | Менее визуально                                     |
| 8   | Integrations catalog summary             | `/api/b2b/integrations/catalog-summary`                                   | Средне-высокая  | `CATALOG_SUMMARY_SOURCE` — константа                |


### P1 — второй эшелон


| #   | Функция                | Где                                                | Готовность     | Риск / mock                      |
| --- | ---------------------- | -------------------------------------------------- | -------------- | -------------------------------- |
| 1   | W2 досье ТЗ (демо)     | `workshop2-smoke`, demo lib                        | Хорошая для TZ | Полный production pipeline — env |
| 2   | Phase1 dossier API     | `api/brand/workshop2/phase1-dossier/`** + Jest     | Хорошая        | DB                               |
| 3   | Tech pack              | `tech-pack/`*, preflight npm script                | Средняя        | S3/Postgres                      |
| 4   | Production floor UI    | `brand/production/*`                               | Средняя        | Seeds / local state              |
| 5   | Organization hub       | `/brand/organization`, `organization-demo-data.ts` | Средняя        | **Mock** цифр                    |
| 6   | Client sewing patterns | `/client/sewing-patterns`*, e2e spec               | Средняя        | Кросс-роль                       |
| 7   | Admin dossier metrics  | `/admin/production/dossier-metrics`                | Средняя        | Ops, не pitch UI                 |


---

## Чеклист изменений в навигации / меню (конкретные файлы)

1. `src/lib/data/brand-navigation.ts`
2. `src/lib/data/brand-nav-priority.ts`
3. `src/lib/data/shop-navigation-normalized.ts`
4. `src/lib/data/syntha-nav-clusters.ts`
5. `src/app/brand/layout.tsx`
6. `src/app/shop/layout.tsx`
7. `src/lib/data/admin-navigation-normalized.ts` (если админ в туре)
8. `src/lib/data/profile-page-features.ts`, `src/lib/rbac.ts`
9. `src/lib/routes.ts` — только при новых канонических путях
10. `e2e/unified-ecosystem-smoke.spec.ts`, `e2e/smoke.spec.ts`, `e2e/workshop2-smoke.spec.ts` — обновить границу демо

---

## Как менять структуру проекта (практика)

1. Не ломать pathname без обновления смоков и `data-testid` из `UNIFIED_ECOSYSTEM_VERIFICATION.md`.
2. Сначала **навигация + RBAC**, потом контент.
3. Зафиксировать список URL демо (P0 + один P1).
4. Честно маркировать demo vs v1 vs pilot на экране.

---

*Источники: усечённое чтение `routes.ts`, `brand/page.tsx`, `brand/layout.tsx`, `layout.tsx` (root), `brand-navigation.ts`, `shop-navigation-normalized.ts`, `admin-navigation-normalized.ts`, `package.json` (скрипты e2e/verify), `e2e/smoke.spec.ts`, `e2e/unified-ecosystem-smoke.spec.ts`, `e2e/workshop2-smoke.spec.ts`, `e2e/b2b-operational-orders-api.spec.ts`, `organization-demo-data.ts`, `PROJECT_ANALYSIS_INVESTOR_PRIORITIES.md`.*