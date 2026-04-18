# Synth-1 Full (Fashion OS)

Next.js 15 приложение: операционные экраны бренда/магазина, API routes, Genkit-потоки, e2e (Playwright) и пилотные скрипты. Репозиторий вырос из шаблона Firebase Studio; актуальная сборка и качество — ниже.

Точки входа для разработки: `npm run dev`, карта маршрутов и соглашения — `AGENTS.md`, **`SOURCE_OF_TRUTH.md`**, `INTEGRATION_MAP.md`, `TASK_QUEUE.md`.

### Быстрый старт (локально)

В монорепо `Projects` каталог приложения — **`_ai-share/synth-1-full`**. Рекомендуемая версия Node задаётся **`.nvmrc`** (сейчас **22**); **`package.json` → `engines`** и **`.npmrc` → `engine-strict=true`** не дадут поставить зависимости на неподдерживаемом Node (в т.ч. **24+**). Скрипты **`npm run dev`**, **`test`**, **`lint`**, **`typecheck`**, **`check:contracts`\*** и др. сначала гоняют **`scripts/ensure-supported-node.mjs`**, чтобы на «чужой» версии Node ошибка была сразу понятной, а не внутри Next/Jest.

**Кратко:** `cd _ai-share/synth-1-full` → `nvm use` → `npm ci` → дальше п. 1–3 ниже.

```bash
cd _ai-share/synth-1-full
nvm use   # или: nvm install && nvm use
npm ci
```

Дальше минимальный «дым» (как в разнесённом CI: контракты → unit → один узкий e2e):

1. **Контракты (в т.ч. health-контракт без обязательного live URL — как в `ci-fast`):** **`npm run smoke:fast`** (= **`check:contracts:ci`**; то же по смыслу «**`check:contracts` без строгого probe**», плюс без **`check:ai-client-boundary`** из‑за текущего техдолга). Полный набор guard-ов: **`npm run check:contracts`**.
2. **Unit (как в `ci-fast`):** **`npm test`**.
3. **Один узкий e2e (health API):** после **`npx playwright install chromium`** —  
   `DOMAIN_EVENT_HEALTH_SECRET=e2e-domain-health-secret npx playwright test e2e/domain-events-health-api.spec.ts --workers=1`  
   Шире без отдельного лейбла: **`npm run test:e2e:light`**.

Опционально: **`direnv`** — **`cp .envrc.example .envrc`** → **`direnv allow`** (файл **`.envrc`** в репозиторий не коммитим). PR из CLI: **`brew install gh`** → **`gh auth login`** → **`gh pr create`** (см. [документацию GitHub CLI](https://cli.github.com/manual/gh_pr_create)).

CI и переменные для live-probe контракта health: **`docs/ci/DOMAIN_EVENTS_HEALTH_CI.md`**. Смысл **`summaryCode` / severity** для алертов: **`docs/ops/domain-events-health.md`**. Узкие PR и локальный шум в монорепо: **`docs/MONOREPO_PR_HYGIENE.md`**.

Приёмка сценариев (роли, маршруты, demo/prod): **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`** — при обновлении матрицы сверяйте с **`INTEGRATION_MAP.md` §6** (чеклист Shop inventory: serial-блок, tid, API, **ci-heavy**: **`npm run test:e2e:verification`** + **`npm run test:e2e:api`**). Автосмок матрицы (demo): **`npm run test:e2e:verification`** — UI: хабы **`/shop`**, **`/client`**, **`/distributor`**, **`/factory`** (+ **`?role=supplier`**), **`/`** (публичная главная), **`/login`**, **`/terms`**, **`/privacy`**, **`/search`**, **`/press`**, **`/u`**, **`/wallet`**, **`/kickstarter`**, **EZ Order** **`/o/ez/*`**, **VIP** **`/s/prive/*`**, **`/customer-360`**, **`/b/*`** (витраж бренда), **`/brand`** (профиль-хаб), **`/brand/products`** (PIM), brand/shop **B2B** list+detail (`B2B-0013`), **`/brand/production/operations`**, **`/brand/control-center`**, **`/brand/integrations`**, **`/shop/b2b`** (хаб) + **`/shop/b2b/catalog`**, **`/shop/b2b/create-order`**, **`/shop/b2b/matrix`**, **`/shop/b2b/rfq`**, **`/shop/b2b/tenders`**, **`/shop/b2b/showroom`**, **`/shop/b2b/discover`**, **`/shop/b2b/partners/discover`**, **`/shop/b2b/apply`**, **`/shop/b2b/partners`**, **`/shop/b2b/supplier-discovery`**, **`/shop/b2b/collaborative-order`**, **`/shop/b2b/margin-calculator`**, **`/shop/b2b/ai-search`**, **`/shop/b2b/selection-builder`**, **`/shop/b2b/scanner`**, **`/shop/b2b/dealer-cabinet`**, **`/shop/b2b/trade-shows`** (+ **`/shop/b2b/trade-shows/appointments`**), **`/shop/b2b/finance`**, **`/shop/b2b/payment`**, **`/shop/b2b/documents`**, **`/shop/b2b/contracts`** (+ detail **`/shop/b2b/contracts/contr_123`**), **`/shop/b2b/analytics`**, **`/shop/b2b/order-analytics`**, **`/shop/b2b/fulfillment-dashboard`**, **`/shop/b2b/replenishment`**, **`/shop/b2b/tracking`**, **`/shop/b2b/delivery-calendar`**, **`/shop/b2b/claims`**, **`/shop/b2b/reports`**, **`/shop/b2b/landed-cost`**, **`/shop/b2b/stock-map`**, **`/shop/b2b/whiteboard`**, **`/shop/b2b/academy`**, **`/shop/b2b/calendar`**, **`/shop/b2b/collection-terms`**, **`/shop/b2b/order-by-collection`**, **`/shop/b2b/order-templates`**, **`/shop/b2b/order-drafts`**, **`/shop/b2b/quick-order`**, **`/shop/b2b/reorder`**, **`/shop/b2b/pre-order`**, **`/shop/b2b/margin-report`**, **`/shop/b2b/order-mode`**, **`/shop/b2b/working-order`**, **`/shop/b2b/lookbooks`**, **`/shop/b2b/agent`**, **`/shop/b2b/agent/consolidated-order`**, **`/shop/b2b/grid-ordering`**, **`/shop/b2b/quote-to-order`**, **`/shop/b2b/shopify-sync`**, **`/shop/b2b/order-modes`**, **`/shop/b2b/ez-order`**, **`/shop/b2b/ai-smart-order`**, **`/shop/b2b/sales-rep-portal`**, **`/shop/b2b/partner-onboarding`**, **`/shop/b2b/multi-currency`**, **`/shop/b2b/size-mapping`**, **`/shop/b2b/custom-assortments`**, **`/shop/b2b/size-finder`**, **`/shop/b2b/rating`**, **`/shop/b2b/gamification`**, **`/shop/b2b/social-feed`**, **`/shop/b2b/video-consultation`**, **`/shop/b2b/vip-room-booking`**, **`/shop/b2b/lookbook-share`**, **`/shop/b2b/assortment-planning`**, **`/shop/b2b/budget`**, **`/shop/b2b/budget/осень-зима-2024`**, **`/shop/b2b/margin-analysis`**, **`/shop/b2b/lookbooks/lb-fw26-1/shoppable`**, **`/shop/b2b/partners/syntha-lab`**, **`/shop/b2b/academy/knowledge/k1`**, **`/shop/b2b/academy/training/ct1`**, **`/shop/b2b/settings`**, **`/shop/b2b/checkout`**, **`/shop/b2b/passport`**, **`/brand/b2b/linesheets`**, **`/brand/b2b/po`**, **`/brand/b2b/trade-shows`**, **`/brand/suppliers/rfq`**, **`/shop/orders`** (B2C), **`/shop/promotions`**, **`/shop/inventory`** (**`shop-stock-sync`**), **`/brand/inventory`**, **`/brand/logistics`**, **`/shop/calendar`**, **`/brand/finance`**, **`/brand/messages`**, **`/brand/calendar`**, **`/brand/team`**, **`/brand/settings`**, **`/brand/analytics-360`**, **`/shop/career`**, **`/admin`** HQ; **редиректы** `/shop/b2b-orders`; legacy operational + **catalog-summary** + **realtime poll** + **processes** (**GET by id**, **events**, **`/runtime`**) + **notifications** + **facets** + **collection-stage-review** + **showroom-sample** + **B2C shop** (cart, session, wishlist, orders, **payment intent + confirm**) + **B2B v1** (orders, **articles**, **PATCH note** + **400 без Idempotency-Key**, audit). Донор **`synth-1/`**: **`synth-1/AGENTS.md`**. Список e2e: **`e2e/README.md`**. Политика JSON для API: **`docs/api-response-contracts.md`**. Zod-контракт ответов B2B operational (legacy list): **`src/lib/order/b2b-operational-orders-response.schema.ts`**. **List/Detail DTO v1** (`wholesaleOrderId`): **`src/lib/order/operational-order-dto.ts`**, Zod **`operational-order-dto.schema.ts`**, HTTP **`GET /api/b2b/v1/operational-orders`** (+ detail по `orderId`). Быстрый smoke read API: **`npm run test:e2e:api`** (в т.ч. B2B operational orders, B2B catalog summary, notifications feed, realtime poll, live processes, facets, shop API; список — **`e2e/README.md`**). Legacy **`/shop/b2b-orders`** → **`/shop/b2b/orders`** задано в **`next.config.ts`** (`redirects`), чтобы редирект был стабилен и для `fetch`/Playwright.

## Дорожная карта и границы репо

- **Единый контур разработки full** (канон, перенос с доноров, окружение, связи модулей, CI): **`docs/FULL_APP_DEVELOPMENT.md`**
- Ритейл-кабинет `/shop` (полный контур: навигация, RBAC, ERP, аналитика, e2e): **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`** · продукт: **`docs/shop-retailer-cabinet-roadmap.md`**
- Квартальный приоритет доменов и WIP: **`docs/roadmap/ENTERPRISE-Q1.md`**, план strict CI: **`docs/roadmap/STRICT_CI.md`**
- Монорепо `Projects` (Python, корневой `src/`, `scripts/`): **`docs/MONOREPO_INTEGRATION.md`** (прод = только full; **не удалять** legacy-деревья до подтверждённого запуска только на full → фазы D/E) · инвентаризация **`Projects/src/`**: **`docs/PROJECTS_ROOT_SRC_INVENTORY.md`** · корневой **`README.md`**: **full = dev entry**; **`.github/workflows/ci.yml`**: **`synth-1-legacy`** с **`continue-on-error`** · узкие PR и локальный шум: **`docs/MONOREPO_PR_HYGIENE.md`**.
- Версии публичных API: **`docs/api-versioning.md`**
- Владельцы модулей (заполнить): **`docs/OWNERS.md`** · SLO (черновик): **`docs/SLO.md`**
- Инциденты и откат: **`docs/production-readiness/RUNBOOK.md`**
<<<<<<< HEAD
- CI (монорепо `Projects`): корневой **`.github/workflows/synth-1-full-ci.yml`** — **`ci-fast`** по push/PR с paths под **`\_ai-share/synth-1-full/**`:** `format:check`, **`npm run lint`**, **`npm run check:legacy-archive-api`** (только PR), **`npm test`**, полный **`npm run typecheck`** (**`continue-on-error`**, техдолг), **`npm run build`**, **`npm run test:e2e:light`** (при **`NEXT_PUBLIC_USE_B2C_SHOP_API`**). **`ci-heavy`** после успешного ci-fast — при лейбле **`ci-heavy`** на PR (в т.ч. события **`labeled`/`unlabeled`**), **`schedule`** (пн 05:00 UTC) или **`workflow_dispatch`**: **`npm run test:e2e:verification`** + **`npm run test:e2e:api`**. Standalone-клон только full: **`\_ai-share/synth-1-full/.github/workflows/ci.yml`** (без heavy; локально **`npm run test:e2e:heavy`**). Визуальные тесты — отдельный workflow / лейбл **`ci-visual`** (см. корень **`.github/workflows/`**). Шаблон PR: **`.github/pull_request_template.md`\*\*

## Качество кода (локально)

| Команда                        | Назначение                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`            | TypeScript без эмита                                                                                                 |
| `npm run lint`                 | ESLint (Next + TypeScript + Tailwind); часть правил — **warning** для старого кода                                   |
| `npm run format:check`         | Prettier без записи                                                                                                  |
| `npm run format`               | Prettier с записью                                                                                                   |
| `npm run check:contracts`      | Локальный запуск контрактных guard-ов (`legacy-archive-api`, `integrations-boundary`, `ai-client-boundary`, parity). |
| `npm run build`                | Production-сборка Next.js (обычный `.next`)                                                                          |
| `npm run build:isolated`       | Изолированная production-сборка (`.next-isolated`) без конфликта с параллельным `next dev`                           |
| `npm run typecheck:next-pages` | Проверка Next page-контрактов по `.next-isolated/types`                                                              |
=======
- CI (монорепо `Projects`): корневой **`.github/workflows/synth-1-full-ci.yml`** — job **`changes`** (`dorny/paths-filter`) + **`ci-fast`** по push/PR с paths под **`\_ai-share/synth-1-full/**`:** `format:check`, **`npm run lint`**, **`npm run check:legacy-archive-api`** (только PR), **`npm test`**, **`npm run check:contracts:ci`** (live health-probe **пропускается**, если не задан **`DOMAIN_EVENTS_HEALTH_URL`**), отдельный шаг **`check:ai-client-boundary`** с **`continue-on-error`** (сигнал без блокировки merge), полный **`npm run typecheck`** (**`continue-on-error`**, техдолг), **`npm run build:isolated`**, опционально live-probe при **repo variable** **`DOMAIN_EVENTS_HEALTH_URL`** (см. **`docs/ci/DOMAIN_EVENTS_HEALTH_CI.md`**), **`npm run test:e2e:light`**, **`npm run test:e2e:cabinet-hubs`**, **`npm run test:e2e:shop-retail`** (последний — только если менялся контур ритейл-кабинета, см. фильтр в workflow). Node в CI берётся из **`.nvmrc`**. **`ci-heavy`** после успешного **`ci-fast`** — при **`push`в`main`**, лейбле **`ci-heavy`** на PR, **`schedule`** (пн 05:00 UTC) или **`workflow_dispatch`**: **`npm run test:e2e:verification`** + **`npm run test:e2e:api`**. Standalone-клон только full: **`\_ai-share/synth-1-full/.github/workflows/ci.yml`** (то же условие для **`test:e2e:shop-retail`**; без heavy; локально **`npm run test:e2e:heavy`**). Визуальные тесты — отдельный workflow / лейбл **`ci-visual`** (см. корень **`.github/workflows/`**). Шаблон PR: **`.github/pull_request_template.md`\*\*

## Качество кода (локально)

| Команда                         | Назначение                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run typecheck`             | TypeScript без эмита                                                                                                                                                                       |
| `npm run lint`                  | ESLint (Next + TypeScript + Tailwind); часть правил — **warning** для старого кода                                                                                                         |
| `npm run format:check`          | Prettier без записи                                                                                                                                                                        |
| `npm run format`                | Prettier с записью                                                                                                                                                                         |
| `npm run smoke:fast`            | Быстрый smoke: только **`check:contracts:ci`**                                                                                                                                             |
| `npm run check:contracts:ci`    | Guard-ы как в **`ci-fast`** (без **`check:ai-client-boundary`**)                                                                                                                           |
| `npm run check:contracts`       | Все guard-ы, включая **`check:ai-client-boundary`**                                                                                                                                        |
| `npm run build`                 | Production-сборка Next.js (обычный `.next`)                                                                                                                                                |
| `npm run build:isolated`        | Изолированная production-сборка (`.next-isolated`) без конфликта с параллельным `next dev`                                                                                                 |
| `npm run typecheck:next-pages`  | Проверка Next page-контрактов по `.next-isolated/types`                                                                                                                                    |
| `npm run test:e2e:shop-retail`  | Ритейл-кабинет: **`GET /api/shop/erp-sync-status`**, сегменты аналитики и перекрёстные ссылки (**`e2e/shop-erp-analytics-strip.spec.ts`**); см. **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`** |
| `npm run test:e2e:verification` | Матрица demo-хабов, в т.ч. **`/shop`** + хаб маржи (**`unified-ecosystem-smoke.spec.ts`**)                                                                                                 |
>>>>>>> recover/cabinet-wip-from-stash

Рекомендуемый pre-push для изменений в API/контрактах: **`npm run check:contracts:ci`**; если трогаете client/AI-границу — ещё **`npm run check:contracts`** (или смотрите красный informational-шаг в CI). Для изменений в **`/shop`** (навигация, аналитика, ERP): **`npm run test:e2e:shop-retail`** и при необходимости **`npm run test:e2e:verification`**.

### Прогресс strict CI (живой чеклист)

| Контур                                      | Статус                                                         | Как расширять                                                                                                                                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Полный `tsc` / `next lint`                  | смягчённо в CI                                                 | Закрывать техдолг → снять `continue-on-error` у **`npm run typecheck`** в workflow / подтянуть warn → error                                                                                                              |
| Жёсткое подмножество Order/Article/shop API | дорожка (см. **`AGENTS.md`**, **`docs/roadmap/STRICT_CI.md`**) | Уже есть **`tsconfig.strict-order.json`** и **`npm run typecheck:order-subset`**; отдельный **`lint:order-subset`** пока не выделен — общий **`npm run lint`**. Включение subset в **`ci-fast`** — по **`STRICT_CI.md`** |

В корневом workflow **`ci-fast`** сейчас: **`npm test`**, **lint**, **legacy-archive guard (PR)**, **format:check**, полный **typecheck** (`continue-on-error`), **build:isolated**, **`test:e2e:light`**. **`ci-heavy`** / **`ci-visual`** — см. выше.

ESLint: нарушения `react-hooks/rules-of-hooks` остаются ошибками; шумные правила (например `no-explicit-any`, правила React Compiler) ослаблены до `warn` в `eslint.config.mjs` — их можно подтягивать пакетами по модулям.

### Known build warnings

- `require-in-the-middle` / OpenTelemetry / Sentry (`Critical dependency ... cannot be statically extracted`) — известные webpack warnings для серверных инструментаторов, не блокируют текущую сборку.
- Tailwind ambiguous classes (`duration-[1.5s]`, `duration-[2000ms]`, `duration-[30s]`) — косметический warning. При целевой чистке заменить точечно или нормализовать utility-классы.

### Runtime и данные (публичные env)

Логика в `src/lib/runtime-mode.ts`. Режим **`demo` | `prod`** для UI/метаданных: **`prod`**, если включён **`NEXT_PUBLIC_USE_FASTAPI`** или **`NEXT_PUBLIC_PRODUCTION_DATA_HTTP`**; **`NEXT_PUBLIC_FORCE_DEMO_MODE=1`** принудительно держит **`demo`**. Моки при недоступном бэкенде: **`NEXT_PUBLIC_USE_MOCK_FALLBACKS`** (по умолчанию включены). **`src/middleware.ts`** и все **`src/app/api/**/route.ts`** выставляют **`x-request-id`\*\* на ответе; middleware также прокидывает его в входящий request (SSR/RSC), при отсутствии — генерируется id.

Ошибки API: обёртки **`jsonOk` / `jsonError`** (`src/lib/api/response-contract.ts`) используются выборочно, чтобы не менять JSON-контракт у уже подключённых клиентов; единый envelope «везде» — отдельная версия API.

**Process runtime (п.2 плана):** при **`PROCESS_PERSISTENCE=1`** (в dev включено по умолчанию, кроме явного `PROCESS_PERSISTENCE=0`) процессы и runtime пишутся в **`.data/process-persistence.json`**. См. `GET/PUT /api/processes/...`, **`GET/PUT .../runtime`**, **`GET .../events`**. Optimistic lock: заголовок **`If-Match`** или поле **`clientVersion`**; повторы — **`Idempotency-Key`**.

### Как уменьшать warning по шагам

1. Периодически: **`npx eslint . --fix`** — автоисправляет в том числе порядок/сокращения классов Tailwind (после правок прогоните **`npm run format`** при необходимости).
2. Смотреть объём предупреждений: полный **`npm run lint`** (при необходимости **`npx eslint .`** с нужными флагами).
3. Типичные пачки: неиспользуемые импорты/переменные (префикс **`_`**, удаление импорта), **`no-explicit-any`** в одном каталоге, **`react/no-unescaped-entities`** в JSX.
4. Для Zod-схем в **`src/ai/flows/**`** имя **`InputSchema`** намеренно игнорируется правилом unused-vars (используется в **`z.infer<typeof InputSchema>`\*\*).
5. **Планомерно:** по выводу **`npm run lint`** выбрать один каталог с наибольшим числом предупреждений и подтянуть правила/типы за спринт (P2).
