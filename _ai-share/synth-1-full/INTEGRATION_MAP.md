# Syntha — Карта интеграций и связей

> Вертикальные (data → UI) и горизонтальные (модуль ↔ модуль) связи для максимальной продуктивности.

---

## 1. Источники правды

| Сущность           | Файл                      | Описание                                                      |
| ------------------ | ------------------------- | ------------------------------------------------------------- |
| **Routes**         | `src/lib/routes.ts`       | Все href — использовать ROUTES.\*, не строки                  |
| **Types**          | `src/lib/types.ts`        | Brand, Order, Product, B2BOrder, TeamMember                   |
| **B2B Features**   | `src/lib/b2b-features/`   | ShipWindow, PriceList, RFQ, Credit, ExclusionZone             |
| **Design Tokens**  | `src/design/tokens.json`  | Цвета, шрифты, отступы                                        |
| **Style Guide**    | `STYLE_GUIDE.md`          | Tailwind-классы, компоненты                                   |
| **Profile Schema** | `BRAND_PROFILE_SCHEMA.md` | Структура профиля бренда                                      |
| **Brand Profile**  | `src/app/brand/page.tsx`  | Профиль: brand, contacts, brandInfo, legalData, brandContacts |

---

## 2. Вертикальные связи (Data → UI)

```
tokens.json ─────┬──► tailwind.config.ts ──► className в компонентах
                 └──► globals.css (--color-*)

types.ts ────────┬──► Компоненты (props)
                 └──► b2b-features/types.ts (расширение B2B)

routes.ts ───────┬──► Link href={ROUTES.brand.xyz}
                 ├──► entity-links.ts
                 └──► brand-navigation.ts

b2b-features/ ───┬──► B2BOrder.orderMode, priceTier
                 ├──► Price lists UI, RFQ UI
                 └──► Ship window selectors

BRAND_PROFILE_SCHEMA ─► brand/page.tsx (структура, порядок, источники данных)
```

---

## 3. Горизонтальные связи (модуль ↔ модуль)

| Откуда                          | Куда                      | Связь                               |
| ------------------------------- | ------------------------- | ----------------------------------- |
| `entity-links.ts`               | `routes.ts`               | href из ROUTES                      |
| `brand-navigation.ts`           | `routes.ts`               | href из ROUTES                      |
| `brand-navigation.ts`           | `entity-links.ts`         | Переиспользование EntityLink[]      |
| `shop-navigation-normalized.ts` | `routes.ts`               | ROUTES.shop.\*                      |
| `b2b-features`                  | `types.ts`                | B2BOrder.orderMode → ShipWindowType |
| `b2b-features`                  | `brand/page.tsx`          | Контакты, showroom                  |
| `design-system`                 | `AGENTS.md`, Cursor rules | STYLE_GUIDE, MASTER                 |

---

## 4. B2B Feature → Routes

| Фича                          | Route                     | Файл                               |
| ----------------------------- | ------------------------- | ---------------------------------- |
| PIM / ассортимент             | products                  | brand/products                     |
| Ship windows                  | preOrders, b2bOrders      | brand/pre-orders, brand/b2b-orders |
| Price lists                   | priceLists                | brand/b2b/price-lists              |
| RFQ                           | suppliersRfq, b2bRfq      | brand/suppliers/rfq, shop/b2b/rfq  |
| Виртуальный шоурум (buy-side) | b2bShowroom               | shop/b2b/showroom                  |
| Тендеры (buy-side)            | b2bTenders                | shop/b2b/tenders                   |
| Credit / Net terms            | financeRf                 | brand/finance/rf-terms             |
| Linesheets                    | b2bLinesheets             | brand/b2b/linesheets               |
| Showroom                      | showroom                  | brand/showroom                     |
| Trade shows                   | tradeShows                | brand/b2b/trade-shows              |
| Мои выставки (buy-side)       | b2bTradeShows             | shop/b2b/trade-shows               |
| Запись на встречи (buy-side)  | b2bTradeShowAppointments  | shop/b2b/trade-shows/appointments  |
| Финансы партнёра (buy-side)   | b2bFinance                | shop/b2b/finance                   |
| JOOR Pay / оплата             | b2bPayment                | shop/b2b/payment                   |
| Документы B2B                 | b2bDocuments              | shop/b2b/documents                 |
| Контракты B2B                 | b2bContracts              | shop/b2b/contracts                 |
| Аналитика закупок             | b2bAnalytics              | shop/b2b/analytics                 |
| Аналитика по заказам          | b2bOrderAnalytics         | shop/b2b/order-analytics           |
| Fulfillment (ZEOS)            | b2bFulfillmentDashboard   | shop/b2b/fulfillment-dashboard     |
| Replenishment                 | b2bReplenishment          | shop/b2b/replenishment             |
| Трекинг заказов               | b2bTracking               | shop/b2b/tracking                  |
| Календарь поставок            | b2bDeliveryCalendar       | shop/b2b/delivery-calendar         |
| Рекламации (RMA)              | b2bClaims                 | shop/b2b/claims                    |
| Отчёты партнёра               | b2bReports                | shop/b2b/reports                   |
| Landed Cost                   | b2bLandedCost             | shop/b2b/landed-cost               |
| Карта стока                   | b2bStockMap               | shop/b2b/stock-map                 |
| Доска ассортимента            | b2bWhiteboard             | shop/b2b/whiteboard                |
| Академия B2B                  | b2bAcademy                | shop/b2b/academy                   |
| Календарь закупок             | b2bPurchaseCalendar       | shop/b2b/calendar                  |
| Условия коллекций             | b2bCollectionTerms        | shop/b2b/collection-terms          |
| Заказ по коллекции            | b2bOrderByCollection      | shop/b2b/order-by-collection       |
| Шаблоны заказов               | b2bOrderTemplates         | shop/b2b/order-templates           |
| Черновики заказов             | b2bOrderDrafts            | shop/b2b/order-drafts              |
| Быстрый заказ                 | b2bQuickOrder             | shop/b2b/quick-order               |
| Reorder                       | b2bReorder                | shop/b2b/reorder                   |
| Pre-order                     | b2bPreOrder               | shop/b2b/pre-order                 |
| Маржа по брендам              | b2bMarginReport           | shop/b2b/margin-report             |
| Хаб маржи (срез)              | b2bMarginAnalysis         | shop/b2b/margin-analysis           |
| Режим заказа                  | b2bOrderMode              | shop/b2b/order-mode                |
| Working Order                 | b2bWorkingOrder           | shop/b2b/working-order             |
| Лукбуки                       | b2bLookbooks              | shop/b2b/lookbooks                 |
| Кабинет агента                | b2bAgentCabinet           | shop/b2b/agent                     |
| Сводный заказ агента          | b2bAgentConsolidatedOrder | shop/b2b/agent/consolidated-order  |
| Grid Ordering                 | b2bGridOrdering           | shop/b2b/grid-ordering             |
| Quote-to-Order                | b2bQuoteToOrder           | shop/b2b/quote-to-order            |
| Shopify sync                  | b2bShopifySync            | shop/b2b/shopify-sync              |
| Режимы заказа (список)        | b2bOrderModes             | shop/b2b/order-modes               |
| EZ Order                      | b2bEzOrder                | shop/b2b/ez-order                  |
| AI Smart Order                | b2bAiSmartOrder           | shop/b2b/ai-smart-order            |
| Sales Rep Portal              | b2bSalesRepPortal         | shop/b2b/sales-rep-portal          |
| Онбординг партнёра            | b2bPartnerOnboarding      | shop/b2b/partner-onboarding        |
| Мультивалютность              | b2bMultiCurrency          | shop/b2b/multi-currency            |
| Маппинг размеров              | b2bSizeMapping            | shop/b2b/size-mapping              |
| Custom assortments            | b2bCustomAssortments      | shop/b2b/custom-assortments        |
| Подбор размера                | b2bSizeFinder             | shop/b2b/size-finder               |
| Рейтинг брендов               | b2bRating                 | shop/b2b/rating                    |
| Челленджи / бейджи            | b2bGamification           | shop/b2b/gamification              |
| Лента брендов                 | b2bSocialFeed             | shop/b2b/social-feed               |
| Видео-консультация            | b2bVideoConsultation      | shop/b2b/video-consultation        |
| VIP шоурум                    | b2bVipRoomBooking         | shop/b2b/vip-room-booking          |
| Шаринг лукбука                | b2bLookbookShare          | shop/b2b/lookbook-share            |
| Планирование ассортимента     | b2bAssortmentPlanning     | shop/b2b/assortment-planning       |
| Настройки B2B                 | b2bSettings               | shop/b2b/settings                  |
| Деталь контракта              | —                         | shop/b2b/contracts/[contractId]    |
| Checkout B2B                  | b2bCheckout               | shop/b2b/checkout                  |
| Passport выставки (buy-side)  | b2bPassport               | shop/b2b/passport                  |
| Партнёры (buy-side)           | b2bPartners               | shop/b2b/partners                  |
| Discover брендов              | b2bDiscover               | shop/b2b/discover                  |
| AI Discovery Radar            | b2bPartnersDiscover       | shop/b2b/partners/discover         |
| Заявка байера                 | b2bApply                  | shop/b2b/apply                     |
| Поиск поставщиков             | b2bSupplierDiscovery      | shop/b2b/supplier-discovery        |
| Collaborative order           | b2bCollaborativeOrder     | shop/b2b/collaborative-order       |
| Margin calculator             | b2bMarginCalculator       | shop/b2b/margin-calculator         |
| AI-поиск B2B                  | b2bAiSearch               | shop/b2b/ai-search                 |
| Формирование селекции         | b2bSelectionBuilder       | shop/b2b/selection-builder         |
| Sales App / сканер            | b2bScanner                | shop/b2b/scanner                   |
| Кабинет дилера                | b2bDealerCabinet          | shop/b2b/dealer-cabinet            |

---

## 5. Провайдеры (верхний уровень)

```
layout.tsx
  ├── B2BStateProvider
  ├── BrandCenterProvider
  ├── AuthProvider
  ├── QueryProvider
  ├── UIStateProvider
  └── NotificationsProvider
```

---

## 6. Приёмка экосистемы (demo) и контроль связности

| Что                                          | Где                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Роль                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Матрица сценариев (ручная / release)         | `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Продукт, приёмка stage/prod                                                                                                                                                                                                                                                                                                                                                                                      |
| Автосмок матрицы (demo, UI + hot API)        | `e2e/unified-ecosystem-smoke.spec.ts`, **`npm run test:e2e:verification`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Регресс в **`ci-heavy`** (см. `SOURCE_OF_TRUTH.md`)                                                                                                                                                                                                                                                                                                                                                              |
| Ops health доменных событий (шина + outbox)  | **`GET /api/ops/domain-events/health`** (`src/app/api/ops/domain-events/health/route.ts`), авторизация **`verifyDomainEventOpsHealthRequest`** (`src/lib/server/domain-event-outbox-cron-auth.ts`); вычисление **`evaluateDomainEventsHealth`**, снимок шины **`getDomainEventBusHealthSnapshot`** (`src/lib/order/domain-events.ts`); SoT и JSON-контракт — **`SOURCE_OF_TRUTH.md`** (§Ops health); агрегатор guard-ов — **`npm run check:contracts`**; Jest — **`src/lib/server/__tests__/domain-events-health*.test.ts`**, **`src/lib/order/__tests__/domain-events-health.test.ts`**, **`src/lib/server/__tests__/domain-event-outbox-cron-auth.test.ts`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Мониторинг и алертинг контура событий                                                                                                                                                                                                                                                                                                                                                                            |
| Стабильные якоря UI                          | `src/lib/ui/test-ids.ts` (`tid.page`, хабы `hub-today-panel-*`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Playwright, контракт экранов                                                                                                                                                                                                                                                                                                                                                                                     |
| Жёсткое подмножество Order/Article/shop API  | `tsconfig.strict-order.json`, **`npm run typecheck:order-subset`** (в т.ч. hot **`/api/shop/*`**, **`src/lib/order/domain-event-factories.ts`** для stock-upload); **`lint:order-subset`** пока не вынесен — общий **`npm run lint`**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Качество «горячих» путей без полного strict на всём репо                                                                                                                                                                                                                                                                                                                                                         |
| Синхронизация остатков shop (demo)           | UI `src/components/shop/stock-sync.tsx` (**`/shop/inventory`**, `fetch` на API), \*\*`GET                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | POST /api/shop/inventory/stock-upload`** (`src/app/api/shop/inventory/stock-upload/route.ts`: audit in-memory по ключу **`x-forwarded-for`** или **`demo-anon`**; POST публикует **`inventory.shop_stock_file_ingested`** через **`publishInventoryShopStockFileIngested`**); observability — поле **`integrationHub`** через **`shopStockFileIngestIntegrationPreview`** (`src/lib/logic/stock-integration.ts`) | Якоря: **`shop-stock-sync`**, **`shop-stock-sync-open-excel`**, **`shop-stock-sync-dialog`**, **`shop-stock-sync-upload-input`**; Jest — **`api-b2c-shop-contract.test.ts`**, **`stock-integration.test.ts`**; e2e API — **`shop-api.spec.ts`**; UI-диалог + **`GET …/stock-upload`** + **`setInputFiles`** → строка **`shop-stock-sync-last-accepted`** (полный UI→POST→GET) в матрице — **`unified-ecosystem-smoke`** («Shop inventory shell»); опционально k6 — **`npm run test:k6:shop-inventory`** (`scripts/k6/shop-inventory-stock-upload.js`) |
| Brand ↔ Shop inventory (кросс-кабинет, demo) | **`SectionInfoCard`** рендерит **`badges`** (`src/components/brand/production/ProductionSectionEnhancements.tsx`); **`/brand/inventory`** → **`ROUTES.shop.inventory`** (`tid.brandInventoryShopStockUploadLink`); **`/shop/inventory`** → **`ROUTES.brand.inventory`** (`tid.shopInventoryBrandMatrixLink`); **`RouteGuard`**: только **`/shop/inventory*`** для ролей из **`src/lib/auth/shop-inventory-cross-cabinet.ts`** (остальной **`/shop`** у brand по-прежнему закрыт); **`src/app/shop/layout.tsx`**: при пустом сайдбаре по RBAC не блокировать контент, если **`allowCrossCabinetShopInventory`** (тот же список ролей); демо-bootstrap: **`resolveDemoHubEmail`** + **`adjustDemoHubEmailForShopInventoryBootstrap`** (`src/lib/auth/demo-hub-email.ts`); логистика бренда: **`getLogisticsLinks()`** + карточка в **`LOGISTICS_NAV_CARDS`** (`navTestId` **`tid.brandLogisticsShopStockUploadLink`**, CTA на `/brand/logistics`) → **`ROUTES.shop.inventory`**; перекрёстные хабы — **`getB2BLinks`**, **`getIntegrationsLinks`**, **`getEndlessAisleLinks`**, **`getSupplierLinks`**; **`brand-navigation`** (quickActions → **`ROUTES.shop.inventory`**); страница **`/brand/warehouse`** (кнопки → матрица + ритейл); **`getProductLinks()`**, **`getProductionLinks()`**, **`getFinanceLinks()`**, **`getComplianceLinks()`**; навигация **`factory-navigation`** (логистика → **`ROUTES.shop.inventory`**) | Смок **`unified-ecosystem-smoke`**: блок **`Shop inventory contour (serial)`** — **1)** cross-links brand↔shop, **2)** `/brand/logistics` → shop (`brand-logistics-shop-stock-upload-link`), **3)** shop shell (диалог + `GET …/stock-upload` + `setInputFiles` → `shop-stock-sync-last-accepted`); порядок важен для demo-auth (**не** начинать с `shop@` до **`/brand`**)                                      |
| Навигация **`/shop/b2b/*`**                  | `src/lib/data/shop-navigation.ts`: **`b2bNavLinks`** + **`B2B_HUB_PINNED_TAB_VALUES`** / **`getB2bHubNavSplit()`**; UI — `src/components/shop/b2b/layout.tsx` (лента + **панель «Ещё»** (портал в `document.body`, `fixed`, z-200 — не режется `overflow-y-auto` shop-layout): `tid.shopB2bHubNav`, **`shop-b2b-hub-more`**, **`shop-b2b-hub-more-panel`**, **`shop-b2b-hub-more-search`**); матч пути — **`src/lib/shop/b2b-hub-nav-match.ts`** (`resolveActiveB2BNavLink`, Jest **`b2b-hub-nav-match.test.ts`**)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Все маршруты в «Ещё» + поиск; смок — **`unified-ecosystem-smoke`**; OTB — демо-слаги в **`budget/page.tsx`**                                                                                                                                                                                                                                                                                                     |

Смок **не заменяет** долгосрочную системную модель: границы агрегатов Order / Article / Inventory / Availability / Control — в `docs/domain-model/*` и чеклистах `docs/*-boundaries-checklist.md`, приоритеты — **`TASK_QUEUE.md`**, ворота legacy — **`docs/MONOREPO_INTEGRATION.md`** (фазы D/E). Субмодуль **`synth-1/`** из монорепо **удалён**; корневой **`Projects/src/`** (если присутствует) по-прежнему вне канона до фиксации фаз **D/E**.

**Ручная матрица `docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`:** каталог **`_ai-share/synth-1-full/docs/`** (краткий чеклист + команды; детали — таблица выше и **`e2e/unified-ecosystem-smoke.spec.ts`**). Имеет смысл **версионировать** файл в git монорепо **`Projects`**, чтобы матрица не расходилась со смоками; порядок правок и shop inventory — в разделе **«Сопровождение матрицы»** внутри файла. Минимальный чеклист для блока **Shop inventory (demo)**:

- API: **`GET|POST /api/shop/inventory/stock-upload`**, audit после POST (ключ **`x-forwarded-for`** / **`demo-anon`**), событие шины **`inventory.shop_stock_file_ingested`** на POST.
- UI shop: **`tid.shop-stock-sync*`**, диалог Excel, **`shop-stock-sync-last-accepted`** (всегда в DOM; после загрузки — имя файла).
- Кросс-кабинет: **`tid.brand-inventory-shop-stock-upload-link`**, **`tid.shop-inventory-brand-matrix-link`**, **`tid.brand-logistics-shop-stock-upload-link`**.
- Инфра demo-auth: **`RouteGuard`** + **`shop-inventory-cross-cabinet`**, **`shop/layout`** (`allowCrossCabinetShopInventory`), **`demo-hub-email`** (`adjustDemoHubEmailForShopInventoryBootstrap`).
- **`/brand/integrations` — RelatedModules:** **`finalizeRelatedModuleLinks(getIntegrationsLinks())`**; хаб ритейла «B2B Заказы» без дубля legacy vs канон (**`dedupeEntityLinksByHref`**, **`finalizeRelatedModuleLinks`**) — **`entity-links.ts`**, Jest **`entity-links-related-modules.test.ts`**, **`SOURCE_OF_TRUTH.md`**.
- Хабы навигации: **`getSupplierLinks`**, **`getFinanceLinks`**, **`getComplianceLinks`**, **`getDocumentsLinks`**, **`getCycleCountingLinks`**, **`getShipFromStoreLinks`**, **`getLiaLinks`**, **`getCollectionLinks`**, **`getPartnerLinks`**, **`getDistributorLinks`**, плюс **`getShopB2BHubLinks`** (**`finalizeRelatedModuleLinks`** после **`filterB2B`**, хаб **`/shop/b2b/orders`** — **`SHOP_B2B_ORDERS_HUB_LABEL`**; см. **`UNIFIED_ECOSYSTEM_VERIFICATION.md`**), плюс **`getShopB2BOrderLinks`** на **`/shop/b2b/orders/[orderId]`** (связанные разделы в контуре **shop B2B**, не **`getB2BLinks`** бренда); пункт у «Карта стока»; также **`getArbitrationLinks`**, **`getGrowthPlatformCrossLinks`**, **`getTeamLinks`**, **`getEsgLinks`**, **`getAnalyticsLinks`**, **`getAuctionLinks`**, **`getBopisLinks`**, **`getBuyerOnboardingLinks`**, **`getMarketingLinks`**, **`getMarketroomLinks`**, **`getLinesheetCampaignsLinks`**, **`getDigitalTwinTestingLinks`**, **`getTradeShowLinks`**; плитка **Инвентарь и сток** в **`MODULE_HUBS`** (`/brand/control-center`); **`getIntegrationsLinks`** / **`getIntegrationLinks`** (подстраницы webhooks/SSO, тот же набор), **`getSettingsLinks`**, **`getSubscriptionLinks`**, **`getBnplLinks`**, **`getAcademyLinks`**, **`getEndlessStylistLinks`**, **`getGiftRegistryLinks`**, **`getHRHubLinks`**, **`getTbybB2CLinks`**. Полный перечень — поиск **`ROUTES.shop.inventory`** в **`entity-links.ts`**.
- Автотест: **`e2e/unified-ecosystem-smoke.spec.ts`** — **6** тестов: describe **`Shop inventory contour (serial)`** с **`test.describe.configure({ mode: 'serial', timeout: 210_000 })`** (три **`test('…')`** по порядку), плюс **`Shop retail hub + analytics segment + margin hub shell`** (`GET /api/shop/erp-sync-status`, `/shop`, `/shop/analytics/footfall`, `/shop/b2b/margin-analysis`), плюс оболочка **`Brand logistics hub shell (/brand/logistics)`**, плюс **`Brand integrations hub shell`** (`/brand/integrations`: **`brand-integrations-page`**, **`related-modules-block`**, **`brand-integrations-b2b-registry-card`** → **`/brand/b2b-orders`**); точные имена и serial / не serial — **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`** (блок «Шесть тестов»). Контракт API + hot UI: **`npm run test:e2e:api`** — **полный** порядок spec-файлов только в **`package.json`** (**`domain-events-health-api`** → **`b2b-operational-orders-api`** → **`b2b-integrations-dashboard-api`** → **`b2b-export-order-api`** → **`b2b-create-order-platform-export-ui`** → **`b2b-catalog`** → **`production`**); перед Playwright — **`kill-e2e-port`**. **`npm run dev:e2e`** чистит **`.next/cache`**; в монорепо обычно **ci-heavy**, не на каждый PR.
- Для UI-части экспорта на platform (`e2e/b2b-create-order-platform-export-ui.spec.ts`) каноничный паттерн ожиданий: `submit` enabled → `waitForResponse(POST /api/b2b/export-order)` → `shop-b2b-platform-export-result`; так матрица устойчивее к cold dev/webpack лагам.

**Prod-слой (не demo):** owner/tenant **brand vs shop** inventory — **`TASK_QUEUE.md`** (ledger / inventory boundaries); до закрытия модели расширять только UX-ссылками без подмены SoT нельзя.

**Рабочий цикл нового маршрута в «полном контуре»:** `routes.ts` → навигация / `entity-links` при необходимости → корневой **`data-testid`** → строка в **`unified-ecosystem-smoke`** → строка в матрице `UNIFIED_ECOSYSTEM_VERIFICATION.md`. Для ветки **`/shop`** (ритейл + B2B в одном кабинете) см. также **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`**. Любой перенос из внешнего legacy (**`Projects/src/`** и т.п.) — только **diff и встраивание** (см. `scripts/README-assimilation.md`), не слепой `cp`. Пример связки B2B: **`/shop/b2b/budget`** + сезон из **`seasonPathSegment`**, хаб **`/shop/b2b/margin-analysis`**, демо shoppable **`lb-fw26-1`**, карточка партнёра по **`brands.json` slug**, вложенная академия **`k1` / `ct1`** — всё в **`getShopB2BHubLinks()`** и verification-смоках.

**CI:** полный прогон матрицы — **`npm run test:e2e:verification`**; в монорепо по умолчанию на PR — лёгкий набор, **verification + `test:e2e:api`** — job **`ci-heavy`** в **`.github/workflows/synth-1-full-ci.yml`** (лейбл PR **`ci-heavy`**, расписание **пн 05:00 UTC**, **`workflow_dispatch`**). См. **`SOURCE_OF_TRUTH.md`**. Перед релизом имеет смысл прогнать verification локально или с лейблом.

**Полный `tsc` на всём приложении** в job **ci-fast** идёт с **`continue-on-error: true`** (см. **`.github/workflows/synth-1-full-ci.yml`**) — техдолг; «строгость горячих путей» — **`npm run typecheck:order-subset`** (отдельный **`lint:order-subset`** — по roadmap). Цель «зелёный полный `tsc`» — снять **`continue-on-error`** и чинить ошибки пакетами (**`SOURCE_OF_TRUTH.md`**).

---

## 7. Добавление новой фичи

1. Добавить тип в `b2b-features/types.ts` или `lib/types.ts`
2. Добавить route в `routes.ts`
3. Добавить ссылку в `entity-links.ts` или `brand-navigation.ts`
4. Обновить `docs/archive/FEATURE_BENCHMARK.md` при необходимости
5. Добавить flag в `b2b-features/feature-config.ts` если нужен toggle

**Фича в ритейл-кабинете `/shop`:** пошаговый чеклист (навигация, RBAC, ERP, e2e) — **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md` §2**.
