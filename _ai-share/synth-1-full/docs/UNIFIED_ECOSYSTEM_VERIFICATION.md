# Unified Ecosystem Verification (demo)

Человекочитаемая матрица приёмки для **`_ai-share/synth-1-full`**: demo-контур без prod-бэкенда. Технический SoT по связям и чеклисту — **`INTEGRATION_MAP.md` §6** (при расхождении правьте сначала §6, затем этот файл и смок).

## Сопровождение матрицы

- Имеет смысл **версионировать** этот файл в git (корень монорепо `Projects`), чтобы матрица не расходилась с §6 из‑за потери локальной копии.
- После нового маршрута / `data-testid` / смока: **`INTEGRATION_MAP.md` §6** → строка здесь → заголовок `test('…')` в **`unified-ecosystem-smoke.spec.ts`**. Для **shop inventory** сверяйте порядок **`Shop inventory contour (serial)`** и отдельный тест **`Brand logistics hub shell (/brand/logistics)`**.
- Таймауты Playwright: дефолт теста **210s** — **`playwright.config.ts`**; детали **`gotoResilient` / serial describe** — **`e2e/README.md`** (пункт про **`unified-ecosystem-smoke`**).
- **Связанные модули на `/brand/integrations`:** список строится как **`finalizeRelatedModuleLinks(getIntegrationsLinks())`**; легаси-хаб **`/shop/b2b-orders`** и канон **`/shop/b2b/orders`** не дают двух строк «B2B Заказы» (**`dedupeEntityLinksByHref`**, **`filterB2B`**) — **`src/lib/data/entity-links.ts`**, регресс — **`src/lib/data/__tests__/entity-links-related-modules.test.ts`**, канон UX — **`SOURCE_OF_TRUTH.md`**.
- **UI-экспорт B2B (`/shop/b2b/create-order`):** e2e **`b2b-create-order-platform-export-ui`** должен ждать не только `data-testid`, но и сам `POST /api/b2b/export-order` (через `waitForResponse`) перед проверкой блока результата; это снижает флейк на cold dev/compile.

## Автотесты (обязательный минимум перед релизом)

| Команда | Назначение |
|--------|------------|
| `npm run test:e2e:verification` | UI-матрица: `e2e/unified-ecosystem-smoke.spec.ts` (`--workers=1`) — **5** тестов (имена `test('…')` = источник правды): см. блок ниже |
| `npm run test:e2e:api` | Контракты API + hot UI: **точный** порядок файлов — в **`package.json`** → **`test:e2e:api`**: **`b2b-operational-orders-api`** → **`b2b-integrations-dashboard-api`** → **`b2b-export-order-api`** → **`b2b-create-order-platform-export-ui`** → **`b2b-catalog`** (один `goto`) → **`production`**. Перед Playwright — **`scripts/kill-e2e-port.cjs`**. **`npm run dev:e2e`** чистит **`.next/cache`**. В CI обычно **ci-heavy**, не на каждый PR |
| `npm run typecheck` | Полный `tsc` — в **`synth-1-full-ci.yml`** (job **ci-fast**) с **`continue-on-error: true`** — политика merge (не блокирует при регрессиях вне hot paths). Локально дерево часто проходит «чисто»; снятие **`continue-on-error`** — отдельное решение (**`SOURCE_OF_TRUTH.md`**) |

> **Совет:** Перед релизом или при существенных изменениях в логике Phase 2 прогоните `npm run test:e2e:verification` локально или с лейблом **`ci-heavy`** в PR. Это проверяет связность модулей (shop inventory, logistics, B2B hot paths).

> Если Playwright падает с **`net::ERR_CONNECTION_REFUSED`** или **`net::ERR_EMPTY_RESPONSE`** на `goto` — процесс **`next dev`** (E2E на **:3123**) мог упасть по памяти или отдать пустой ответ под компиляцией; **`npm run dev:e2e`** задаёт увеличенный heap; **`e2e/unified-ecosystem-smoke.spec.ts`** делает **`gotoResilient`** (несколько попыток с паузой). Повторите прогон или закройте лишние dev-серверы на том же порту.
>
> Если **`EADDRINUSE: 127.0.0.1:3123`** — занят порт; перед Playwright вызывается **`scripts/kill-e2e-port.cjs`** в **`test:e2e`**, **`test:e2e:light`**, **`test:e2e:verification`**, **`test:e2e:api`** (по умолчанию **:3123**; отключить: **`PLAYWRIGHT_SKIP_KILL_E2E_PORT=1`**). Или **`PLAYWRIGHT_SKIP_WEBSERVER=1`**, если сами держите **`npm run dev:e2e`**.

**Шесть тестов в `unified-ecosystem-smoke.spec.ts` (порядок файла):**

Блок **`Shop inventory contour (serial)`**: Playwright **`mode: 'serial'`**, **`timeout: 210_000`** на describe — shell + upload + cold **`next dev`** иначе упираются в лимит. После клика из **`/brand/*`** на **`/shop/inventory`** смок даёт до **60s** на **`shop-inventory-page`**; тест **`Shop inventory shell`** делает **`goto`** с **`domcontentloaded`**, **`expect(page).toHaveURL(/shop/inventory)`** (нет редиректа на **`/`**), до **90s** на **`shop-inventory-page`** (Suspense **`shop/loading`** без отдельного **`data-testid`**).

1. `Brand ↔ Shop inventory cross-links (stock contour)` — внутри serial
2. `Brand logistics hub → Shop stock upload link` — внутри serial
3. `Shop inventory shell` — внутри serial (диалог, **`GET`/`POST`** **`/api/shop/inventory/stock-upload`**, **`shop-stock-sync-last-accepted`** после POST)
4. `Shop retail hub + analytics segment + margin hub shell` — **вне** serial: **`GET /api/shop/erp-sync-status`** (JSON `lastSuccessAt`), затем **`/shop`** (`page-shop-retail-dashboard`, `shop-analytics-segment-nav`), затем **`/shop/analytics/footfall`** (`shop-footfall-retail-analytics-link`, `shop-footfall-b2b-link`), затем **`/shop/b2b/margin-analysis`** (`page-shop-b2b-margin-analysis`, `margin-hub-retail-analytics-link`, `margin-hub-b2b-analytics-link`)
5. `Brand logistics hub shell (/brand/logistics)` — **вне** serial (соседний `test`, не внутри describe serial)
6. `Brand integrations hub shell (/brand/integrations)` — **вне** serial (карточка реестра: **`data-testid`** **`brand-integrations-b2b-registry-card`**, **`href`** **`/brand/b2b-orders`**)

## Системный старт (Node)

- **`src/instrumentation.ts`** (`register`, при `NEXT_RUNTIME === 'nodejs'`): после **`logEnvSafetyWarningsOnce()`** вызывается **`bootstrapEnterpriseEcosystem()`** (`src/lib/core/bootstrap.ts`) → **`CognitiveNervousSystem.initialize()`** (подписки на **`eventBus`**, в т.ч. демо **`inventory.shop_stock_file_ingested`** → запись в **`ImmutableAuditTrail`**) и **`GlobalAnomalyEngine.initialize()`** (глобальный перехватчик). Шина: **`eventBus`** — **`src/lib/order/domain-events.ts`** (`publish`, `publishUrgent`, DLQ, circuit breaker). Подробнее — **`SOURCE_OF_TRUTH.md`**.

## Shop inventory + logistics (demo) — ручной чеклист

Синхронизируйте с describe **`Shop inventory contour (serial)`** и отдельным тестом оболочки логистики в **`e2e/unified-ecosystem-smoke.spec.ts`**.

1. **API:** `GET` / `POST` **`/api/shop/inventory/stock-upload`** — после POST виден audit (`GET`); ключ audit — **`x-forwarded-for`** (первый hop) или **`demo-anon`**; в шину уходит **`inventory.shop_stock_file_ingested`** (`publishInventoryShopStockFileIngested`, демо-канал **`b2c_shop_stock_upload_demo`**). Prod tenant/user — **`TASK_QUEUE`** / §6 **`INTEGRATION_MAP`** (не смешивать с demo-ключом).
2. **UI shop:** префикс **`shop-stock-sync`** — диалог, загрузка файла; **`shop-stock-sync-last-accepted`** всегда в DOM (до загрузки «—»), после успешного POST — имя файла (стабильный якорь для смока).
3. **Кросс-кабинет:** **`tid.brand-inventory-shop-stock-upload-link`**, **`tid.shop-inventory-brand-matrix-link`**.
4. **Логистика → ритейл:** **`tid.brand-logistics-shop-stock-upload-link`** на **`/brand/logistics`** → **`/shop/inventory`**.
5. **Порядок (serial):** сначала cross-links brand↔shop, затем logistics → shop, затем shop shell — иначе ломается demo-auth (`shop@` в storage до **`/brand`**).
   - Имена тестов: **`Brand ↔ Shop inventory cross-links (stock contour)`** → **`Brand logistics hub → Shop stock upload link`** → **`Shop inventory shell`**; отдельно **`Shop retail hub + analytics segment + margin hub shell`**, **`Brand logistics hub shell (/brand/logistics)`** и **`Brand integrations hub shell (/brand/integrations)`** вне serial.

**Инфра:** **`RouteGuard`** + **`shop-inventory-cross-cabinet.ts`**, **`shop/layout.tsx`** (`allowCrossCabinetShopInventory`), **`demo-hub-email.ts`** (`adjustDemoHubEmailForShopInventoryBootstrap`).

Детали и перечень хабов — таблица и блок **«Минимальный чеклист для блока Shop inventory (demo)»** в **`INTEGRATION_MAP.md` §6** (не привязывать к номерам строк — они плывут).

## Control Center и предиктивные риски (demo)

- Агрегация контроля: **`src/lib/control/control-aggregator.ts`** (`aggregateInventoryControl`, **`analyzePredictiveRisks`**).
- Виджет на **`/brand/control-center`**: **`PredictiveRiskWidget`**; снимок для UI — **`getControlCenterPredictiveRisks()`** (тот же контур **`analyzePredictiveRisks`**, демо-гранулы **`CONTROL_CENTER_DEMO_SKU`).

## Перекрёстные ссылки (UX)

- Смок **`Brand integrations hub shell (/brand/integrations)`**: **`brand-integrations-page`**, **`related-modules-block`**, карточка **«Реестр B2B-заказов»** во встроенных B2B-фичах.
- **`getIntegrationsLinks()`** / **`getIntegrationLinks()`** (webhooks, SSO): без отдельной строки на реестр в «Связанных разделах» (**`filterB2B`** + **`finalizeRelatedModuleLinks`**: **`dedupeEntityLinksByHref`** сливает легаси **`ROUTES.shop.b2bOrdersLegacy`** с **`ROUTES.shop.b2bOrders`** и не даёт двух строк с **`SHOP_B2B_ORDERS_HUB_LABEL`**); единый очевидный CTA на реестр — карточка **«Реестр B2B-заказов»** на **`/brand/integrations`**; подпись реестра — **`B2B_ORDERS_REGISTRY_LABEL`**. Пункт с ярлыком **«B2B Заказы»** в связанных разделах интеграций не дублируется отдельно от карточек (хаб ритейла — shop/distributor).
- На **`/brand/integrations`** блок «Связанные разделы» встроен в страницу (тот же контракт **`related-modules-block`**), чтобы SSR/смок стабильно видели якорь.
- **`RelatedModulesBlock`**: корневой якорь **`data-testid="related-modules-block"`**; списки проходят **`finalizeRelatedModuleLinks`** (канонический **`href`** + не более одного **`SHOP_B2B_ORDERS_HUB_LABEL`**).
- **Shop B2B orders (demo):** **`/shop/b2b/orders`** и легаси **`/shop/b2b-orders`** — **`useShopB2BOperationalOrdersList`** (тот же контур, что **`GET /api/b2b/v1/operational-orders`** с **`x-syntha-api-actor-role: shop`**); карточка заказа — **`ROUTES.shop.b2bOrder(id)`** → **`/shop/b2b/orders/[orderId]`**.
- **`getShopB2BHubLinks()`** (RelatedModules на B2B-страницах shop): после **`filterB2B`** — **`finalizeRelatedModuleLinks`** (тот же контракт, что у интеграций); хаб списка заказов — ярлык **`SHOP_B2B_ORDERS_HUB_LABEL`** (согласовано с **`shop-navigation-normalized`**).
- **`getShopB2BOrderLinks()`** на **`/shop/b2b/orders/[orderId]`**: только маршруты **`ROUTES.shop.*`** (каталог, трекинг, stock-upload, RMA и т.д.) + возврат к списку **`SHOP_B2B_ORDERS_HUB_LABEL`**; не путать с **`getB2BLinks()`** (кабинет бренда). Список завершается **`finalizeRelatedModuleLinks`** (канонические пути, без дубля ярлыка хаба).
- Хабы **`/shop/b2b`**, **`/distributor`**, **`/shop`**: в **`HubTodayPanel`** — канонический ярлык заказов (**`SHOP_B2B_ORDERS_HUB_LABEL`** или явная фраза вроде «Открыть B2B заказы» на **`/shop`**); в сетке «Все разделы» для того же **`ROUTES.shop.b2bOrders`** — **«Список заказов»**, чтобы не повторять «B2B Заказы» в одном скролле.

## Продуктовая логика (Phase 2+)

Полный перечень задач и границ агрегатов — **`TASK_QUEUE.md`**, канон доменов — **`docs/domain-model/*`** и **`*-boundaries-checklist.md`**. Юнит-/логика-смоки: **`e2e/*-logic.spec.ts`**.

## Прочие оболочки из смока

Полный перечень заголовков `test('…')` — **`e2e/unified-ecosystem-smoke.spec.ts`**. Рабочий цикл нового маршрута: **`routes.ts`** → навигация / **`entity-links`** → **`data-testid`** → тест в смоке → строка в этом файле (см. **`INTEGRATION_MAP.md` §6**).

## Вне scope этого документа

- **Prod:** owner/tenant brand vs shop inventory — **`TASK_QUEUE.md`** (секция prod-слоя после demo).
- **Монорепо:** legacy **`synth-1/`**, **`Projects/src/`** — **`docs/MONOREPO_INTEGRATION.md`** (фазы D/E).
