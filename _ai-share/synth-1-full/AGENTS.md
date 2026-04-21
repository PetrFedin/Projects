# Synth-1 — AI Agent Instructions

## Единственный канон приложения (Next.js)

**`_ai-share/synth-1-full`** — единственная активная кодовая база фронтенда Fashion OS в монорепо: фичи, BFF, доменный канон, E2E и CI-релиз.

| Каталог                                 | Роль                        | Конечное состояние                                                 |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------ |
| **`_ai-share/synth-1-full`**            | Канон, prod и demo          | Единственное дерево Next.js в монорепо                             |
| **`Projects/src/`** (если присутствует) | Внешний / legacy-дубликаты  | Не канон; не развивать как источник правды                         |

Политика: **`docs/CANONICAL_FULL.md`**, **`SOURCE_OF_TRUTH.md`**, **`Projects/docs/MIGRATION_FULL_CUTOVER.md`**. Субмодуль **`synth-1/`** из корня монорепо **удалён** — весь продуктовый фронт ведётся здесь.

### Порядок работ

1. **Новые сценарии** — сразу в паттернах full (`routes.ts`, навигация, `entity-links`, RBAC, BFF/API).
2. **Улучшение** — UX, типы, контракты, наблюдаемость в этом дереве.
3. **Связи** — перекрёстные ссылки между кабинетами, `data-testid`, смоки/матрица **`UNIFIED_ECOSYSTEM_VERIFICATION.md`**.

## Commands (/)

Наберите `/` в Cursor чате — доступны команды из `.cursor/commands/`. Проектные: syntha-design-audit, syntha-b2b-feature, syntha-sync-integration. Общие: lint-fix, code-review, refactor-code и др.

## Design System

Before UI/UX changes: read `STYLE_GUIDE.md` and `design-system/synth-1-fashion-os/MASTER.md`. Use Tailwind classes from STYLE_GUIDE. Cursor rule `ui-ux-design-system` applies to tsx/jsx.

**Единый визуальный стандарт кабинетов (эталон Академия — типы страниц, токены, чеклист):** `docs/ACADEMY_CABINET_UI_STANDARD.md`.

**Ядро продукта (B2B-заказы, ТЗ → отшив, чаты/календарь как слой):** сущности, статусы, источники правды, фазы P0–P2 — `docs/B2B_AND_PRODUCTION_CORE_SPEC.md`.

**Основные CTA витрины академии** (`/academy`, `/academy/course/*`, `/academy/path/*`, отзывы на курсе, полоса «Моё обучение», кабинет бренда `/brand/academy/platform/path/*`): не придумывайте новые классы `h-9 rounded-sm bg-[#0b63ce]` и т.п. Используйте **`ACADEMY_CTA_PRIMARY`**, **`ACADEMY_CTA_PRIMARY_FULL_WIDTH`** (на всю ширину блока), **`ACADEMY_CTA_SECONDARY`**, при необходимости **`ACADEMY_CTA_DISABLED`** — всё в `src/lib/ui/academy-cta.ts`, вместе с **`Button size="sm"`**. Эталон — **«Начать путь»** на карточке траектории на `/academy`.

## UI rules (enterprise SaaS layout)

- **Примитивы:** используй `@/components/design-system` — `PageContainer`, `PageHeader`, `SectionContainer`, `DashboardGrid`, `MetricCard`, `AnalyticsCard`, `WidgetContainer`, `ChartCard`, `HistogramCard`, `DataTableContainer`, `FilterToolbar`, `EmptyState`, `LoadingState`, `StatusBadge`. Не плоди одноразовые карточки с новыми тенями/отступами.
- **Токены:** `src/design/tokens.json` + корневой `design-tokens.json`; подробности для агентов: `src/design/UI_RULES.md`.
- **Графики:** только **Recharts** через `ChartCard` / `HistogramCard`; оси и легенда компактные, без декора.
- **Таблицы:** `@tanstack/react-table`, плотные строки, обёртка `DataTableContainer`.
- **Фильтры:** компактный ряд `FilterToolbar` где возможно.
- **Не ломать:** маршруты, навигацию, бизнес-логику; улучшения — инкрементальные обёртками.
- **JOOR + Oracle (fashion B2B enterprise):** полный бриф `src/design/JOOR_ORACLE_ENTERPRISE_UI.md`, правило Cursor `joor-oracle-enterprise-ui`. Плотные дашборды, wholesale/showroom, панели планирования — без «стартап-украшательств».

## Key Refs

- **Развитие приложения в full (перенос, настройки, связи, фичи):** `docs/FULL_APP_DEVELOPMENT.md`
- **Единый стиль кабинетов (shell, `cabinetSurface`, шапки реестра):** `.cursor/rules/cabinet-ui-consistency.mdc`, `src/lib/ui/cabinet-surface.ts`
- **Адаптив (breakpoints, touch):** `.cursor/rules/responsive-design.mdc` (в корне монорепо — globs на **`_ai-share/synth-1-full/**`**; при открытом только full — **`src/**`** в **`.cursor/rules/responsive-design.mdc`** внутри этого пакета)
- **Домен / API / PR:** `.cursor/rules/domain-canon-pr.mdc` — обновление `docs/domain-model/*`, `TASK_QUEUE.md`, контракты v1
- Profile schema: `BRAND_PROFILE_SCHEMA.md`
- Tokens: `src/design/tokens.json`, `design-tokens.json`, `src/design/UI_RULES.md`, `src/design/JOOR_ORACLE_ENTERPRISE_UI.md`, `.ai_context/ui_rules.md`, `.ai_context/joor_oracle_ui_rules.md`
- Operational UI contract (B2B orders / control-center эталон): `src/design/OPERATIONAL_SCREEN_SPEC.md`, классы `src/lib/ui/operational-layout-contract.ts`, оболочка `OperationalPageChrome` / `OperationalPageHeader` в `design-system`
- Layout & widgets: `src/components/design-system/`
- Components: `src/components/ui/` (SectionHeader, StatCard, WidgetCard, etc.)
- Routes: `src/lib/routes.ts` — всегда ROUTES.\*, не строки
- B2B types: `src/lib/b2b-features/` — ShipWindow, PriceList, RFQ, Credit
- Ритейл-кабинет `/shop` (навигация, RBAC, аналитика, ERP, маржа): **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`** — чеклист фич, связь с roadmap. E2E: **`npm run test:e2e:shop-retail`**; в CI (standalone **`_ai-share/synth-1-full/.github/workflows/ci.yml`**, монорепо **`.github/workflows/synth-1-full-ci.yml`**) шаг выполняется при изменении путей контура shop (см. job **`changes`** / **`paths-filter`**). В корневом **`Projects/.github/workflows/ci.yml`** — job **`frontend-schemas`** (каталоги/схемы в full). Матрица demo: **`npm run test:e2e:verification`**
- Integration map: `INTEGRATION_MAP.md` — связи data↔UI, модуль↔модуль; **§6** — приёмка экосистемы (маршрут → tid → смок ↔ `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`), чеклист ручной матрицы, ворота **MONOREPO** D/E, CI verification vs subset, разделение demo vs prod tenant inventory; кросс-кабинет **`/brand/inventory` ↔ `/shop/inventory*`** — `RouteGuard` + **`src/lib/auth/shop-inventory-cross-cabinet.ts`**, **`src/app/shop/layout.tsx`** (`allowCrossCabinetShopInventory` при пустом сайдбаре), демо-bootstrap **`src/lib/auth/demo-hub-email.ts`**, **`SectionInfoCard`** / **`badges`**, **`brand-navigation`** (quickActions PIM + логистика/склад → **`ROUTES.shop.inventory`**), **`/brand/warehouse`** (кнопки матрица + ритейл), **`getProductLinks`** / **`getLogisticsLinks`** + **`getB2BLinks`** / **`getIntegrationsLinks`** / **`getEndlessAisleLinks`**, **`factory-navigation`** (логистика → shop inventory), **`getSupplierLinks`** (поставщики → матрица + ритейл), **`getProductionLinks`**, **`getFinanceLinks`**, **`getComplianceLinks`** (→ матрица + ритейл где уместно), **`MODULE_HUBS`** (плитка **Инвентарь и сток** на `/brand/control-center`), **`tid.brandLogisticsShopStockUploadLink`** на `/brand/logistics`
- Приёмка экосистемы: `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md` (версионируйте в git корня `Projects`, порядок правок — раздел **«Сопровождение матрицы»** в файле) · автосмок матрицы (demo): **`npm run test:e2e:verification`** → **`e2e/unified-ecosystem-smoke.spec.ts`** (UI-матрица приёмки). Детальный перечень маршрутов и якорей см. в `e2e/README.md` и коде смока.
- Дорожная карта Q1 / strict CI / монорепо: `docs/roadmap/ENTERPRISE-Q1.md`, `docs/roadmap/STRICT_CI.md`, `docs/MONOREPO_INTEGRATION.md` — жёсткий контур: **`npm run typecheck:order-subset`** / **`lint:order-subset`** (`tsconfig.strict-order.json` + `package.json`; сейчас B2B operational/v1, shop cart/orders/session, **`b2c-shop-request`** / **`shop-inventory-stock-upload-client`**, inventory **`GET|POST …/stock-upload`** (+ audit types/client), processes, realtime poll, auth guard, **`env-safety-warnings`**). **Прод = только это дерево**; корневой **`Projects/src/`** (если есть) не считать каноном. См. **`Projects/docs/MIGRATION_FULL_CUTOVER.md`**, **`MONOREPO_INTEGRATION.md`**, **`docs/CANONICAL_FULL.md`**.
- API envelopes vs legacy: `docs/api-response-contracts.md`; Zod-контракт operational orders: `src/lib/order/b2b-operational-orders-response.schema.ts`
- B2B v1 **RBAC на API** (опционально `B2B_V1_API_ENFORCE_ROLES=1`, заголовок `x-syntha-api-actor-role`): `src/lib/auth/b2b-v1-api-guard.ts` + матрица `src/lib/rbac.ts`; клиент — **`withB2BV1ApiActorRoleHeaders`** (`src/lib/auth/b2b-v1-api-client-headers.ts`): порядок токена **`NEXT_PUBLIC_B2B_V1_API_ACTOR_ROLE`** → **`normalizeAuthRoles(profile, user)`** (хуки + `OperationalOrderNoteV1Panel`) → pathname (`/brand` → brand, `/shop` → sales_rep)
- B2B **v1**: Article read `GET /api/b2b/v1/articles`, `GET /api/b2b/v1/articles/[articleId]` — `src/lib/article/v1/*`; Order **read** list/detail DTO: `GET /api/b2b/v1/operational-orders`, `GET /api/b2b/v1/operational-orders/[orderId]` — `src/lib/order/operational-order-dto.ts` (`wholesaleOrderId`); hooks сначала бьют в v1, fallback на legacy `/api/b2b/operational-orders*`. Order write: `PATCH …/operational-note` — `src/lib/order/v1/*`; UI: `useArticlesV1List`, `OperationalOrderNoteV1Panel`. **SoT vs projection:** Order (payment/shipment, read-model) — `docs/domain-model/order.md` §4.1; Article read v1 (seed, `_projection`, `dossierKind`) — `docs/domain-model/article.md` §4.1
- Legacy archive API: **`docs/ci/LEGACY_API_POLICY.md`**
- API versioning: **`docs/api-versioning.md`** · аудит operational-note v1: **`GET /api/b2b/v1/audit/operational-order-notes`** (см. `docs/api-response-contracts.md`)
- B2B **catalog summary** (demo): `GET /api/b2b/integrations/catalog-summary` — поле `catalogSource` = константа **`CATALOG_SUMMARY_SOURCE`** (`src/lib/b2b/integrations/catalog-summary-source.ts`); smoke: **`e2e/b2b-catalog-summary-api.spec.ts`**
- Список B2B-заказов (demo read-model): `src/lib/order/b2b-orders-list-read-model.ts` — brand и shop; не дублировать `mockB2BOrders` в UI; HTTP read: **`GET /api/b2b/operational-orders`**, карточка **`GET /api/b2b/operational-orders/[orderId]`** (`jsonOk` / `NOT_FOUND`); списки: **`useB2BOperationalOrdersList`**; строка для карточки: **`useB2BOperationalOrderRow`**; legacy **`/shop/b2b-orders`** → **`next.config.ts`** `redirects`

## Unified frontend (repo layout)

- **Компоненты только в `src/components/`** — алиас `@/components/*` → `./src/components/*`. Корневой каталог `components/` удалён как дубликат; не создавайте параллельное дерево.
- **Tailwind:** единственный активный конфиг — корневой `tailwind.config.ts` (токены из `src/design/tokens.json`). Других `tailwind.config` в репозитории нет.
- **Стили:** Tailwind + `design-system` / `ui` + Radix. **MUI / Emotion в UI не используются** и не должны появляться в новом коде; токены — `src/design/tokens.json` / `design-tokens.json`.

## Conventions

Icons: Lucide only. No emojis. Use `cn()` for class merging. Responsive: 375/768/1024. Drawers: vaul. Container queries: @container.

**HTTP:** исходящие `fetch` — через `fetchWithHttpDeadline` из `@/lib/http/http-fetch-deadline` (слияние с `init.signal`). Для лимита ≠ 20s передайте третий аргумент `deadlineMs` (например FastAPI-клиент 25s, архив W2 PUT 120s). Service Worker: `public/sw.js`.

**Наблюдаемость API (hot routes):** оборачивайте handler в **`observeApiRoute`** (`src/lib/server/observe-api-route.ts`) — пишет **`logObservability('api.http', { route, method, status, latencyMs, requestId })`** при включённых флагах (см. `logObservability` / RUNBOOK). Уже подключено к B2B operational/v1, **`/api/shop/cart`**, **`/api/shop/session`**, **`GET /api/shop/erp-sync-status`**, **`/api/processes`**, **`/api/processes/[processId]/events`**, **`/api/shop/orders`**, **`/api/realtime/poll`**.

**In-memory state в API (Next dev / Turbopack):** один и тот же модуль могут подхватить разные чанки → несколько экземпляров `Map` в одном процессе. Общие корзины, rate limit и т.п. держите на `globalThis` + уникальный `Symbol.for('…')`; для нового кода предпочтительно **`getOrCreateGlobalRuntime`** из `src/lib/server/global-runtime-singleton.ts` (см. также `b2c-shop-server-state`, `showroom-sample-memory-store`, `b2b-finance-post-rate-limit`, `realtime/server-broker` — в Jest сброс: `resetRealtimeServerBrokerForTests`, W2 post guard / loose stamp). В блочных комментариях `/* … */` не вставляйте подстроку `**/` — парсер закроет комментарий слишком рано.

## PR и доменный канон

- **Шаблон PR (монорепо):** **`/.github/pull_request_template.md`** — чеклист канона и метки **`ci-heavy`** / **`ci-visual`**.
- **Правило merge:** изменение доменной логики (Order, Article, Inventory, Availability, контракты API, SoT) **без** обновления канона (`docs/domain-model/*`, `TASK_QUEUE.md`, соответствующий \*-boundaries-checklist.md`) — не мержим. Исключения только с явным ADR.
- **E2E:** затронутый HTTP-маршрут или критичный UI-поток — добавить/обновить Playwright (см. `e2e/README.md`).
- **Новый legacy-эндпоинт** — только с ADR или ссылкой на задачу на вывод из legacy; предпочтительно **v1** за одной BFF-точкой.
