# Source of truth (synth-1-full)

Краткий указатель канона для **`_ai-share/synth-1-full`**: куда смотреть агенту и человеку, чтобы не расходиться с репо. Практический контур разработки (окружение, перенос с доноров, связи, CI): **`docs/FULL_APP_DEVELOPMENT.md`**.

## Типы и каталоги (`lib/` vs `src/lib`)

| Слой                                    | Путь                        | Назначение                                                                                                                                                                                  |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Канон типов и доменного кода приложения | **`src/lib/**`\*\*          | Алиас **`@/lib/*`** в `tsconfig` указывает сюда. Импорты вида `@/lib/types`, `@/lib/products` — **всегда из `src/lib`**.                                                                    |
| Устаревший демо-каталог у корня репо    | **`lib/`** (рядом с `src/`) | Небольшой набор файлов (`types.ts`, `products.ts`, …) для совместимости; **не дублировать** новые типы здесь — расширять **`src/lib/types.ts`** и соседние модули. См. **`lib/README.md`**. |

Контракты публичных ответов B2B-интеграций (status + catalog-summary + dashboard): Zod в **`src/lib/b2b/integrations/b2b-integration-public-response.zod`**, Jest в **`src/lib/b2b/integrations/__tests__/`** и **`src/lib/use-cases/b2b/__tests__/`**. Серверные модули **`b2b-integration-service`**, **`integration-export-persistence`** помечены **`server-only`** (не тянуть в client bundle); клиентский barrel **`src/lib/b2b/integrations/index.ts`** — только **`joor-delivery-mocks`**.

Сборка «интеграции + каталог» для UI/SSR без двойных вызовов из страницы: **`src/lib/use-cases/b2b/load-integrations-dashboard.ts`**, HTTP **`GET /api/b2b/integrations/dashboard`**, e2e **`e2e/b2b-integrations-dashboard-api.spec.ts`**.

Персистентность экспорта на platform (идемпотентность): по умолчанию файл **`data/integration-export-jobs.json`** или **`INTEGRATION_EXPORT_JOBS_FILE`**; опционально **`INTEGRATION_EXPORT_DATABASE_URL`** (Postgres) или **`UPSTASH_REDIS_REST_URL`** + **`UPSTASH_REDIS_REST_TOKEN`** (Upstash REST). Проба SLO бэкенда: **`SYNTHA_API_SLO_URL`** или **`SYNTHA_API_SLO_PATH`** относительно origin **`NEXT_PUBLIC_API_URL`** (см. **`src/lib/b2b/integrations/integration-health-probe.ts`**).

HTTP: **`POST /api/b2b/export-order`** (заголовок **`Idempotency-Key`**, тело `provider: platform`, `payload.orderId`), **`POST /api/b2b/export-order/retry`** (`exportJobId`). Повтор с тем же idempotency возвращает тот же **`orderId`**, что при первом запросе. UI: **`/shop/b2b/create-order`** (карточка экспорта на platform, `data-testid` с префиксом **`shop-b2b-platform-export-*`**), **`/brand/integrations`** и **`/admin/integrations`** — сводка **`GET /api/b2b/integrations/dashboard`**. E2E: **`e2e/b2b-export-order-api.spec.ts`**, UI — **`e2e/b2b-create-order-platform-export-ui.spec.ts`**.

AI boundary (client-safe): клиентские компоненты не вызывают Genkit flow напрямую в browser bundle; используются HTTP-обёртки (server route → flow): **`POST /api/ai/chat-response`**, **`POST /api/ai/outfit-preview`**, **`POST /api/ai/body-scanner`**, **`POST /api/ai/optimize-blog-text`**, **`POST /api/ai/campaign-creative`**, **`POST /api/ai/social-video`**, **`POST /api/ai/collaborative-lookbook`**, **`POST /api/ai/design-variants`**, **`POST /api/ai/sku-simulation`**, **`POST /api/ai/suggest-price`**, **`GET /api/ai/reviews`**. Это удерживает full-контур в рамках server/client границы при сборке и e2e. Server-only инстанс стилиста — **`src/lib/repo/ai-stylist-repo-instance.ts`**; в клиенте использовать только HTTP (`/api/ai/stylist`), а не `repo.aiStylist`.

## Доменные события (трассировка / идемпотентность)

Базовый тип **`DomainEvent`** в **`src/lib/production/execution-linkage.ts`** допускает необязательные **`correlationId`** и **`dedupeKey`**. Фабрики в **`src/lib/order/domain-event-factories.ts`** (`buildEvent`, `publishTyped`, **`publishOrderB2bPlatformExportResult`**) могут их пробрасывать; подписчики при необходимости дедуплицируют побочные эффекты по **`dedupeKey`**. Экспорт B2B на platform публикует **`order.b2b_platform_export_result`** (повтор по тому же **Idempotency-Key** не шлёт второе событие). Jest: **`src/lib/b2b/integrations/__tests__/b2b-export-domain-event.test.ts`**.

### Ops health (`/api/ops/domain-events/health`)

- Канон вычисления: **`src/lib/server/domain-events-health.ts`** (`evaluateDomainEventsHealth`).
- Машинный код состояния: `summaryCode` (фиксированный enum):
  - `OK`
  - `CRIT_CIRCUIT_OPEN`
  - `CRIT_DLQ_HIGH`
  - `CRIT_FAILED_HIGH`
  - `CRIT_PENDING_HIGH`
  - `WARN_BACKLOG`
  - `WARN_DEGRADED`
- Канон «код -> действие»: **`DOMAIN_EVENTS_SUMMARY_CODE_ACTION`** в том же файле.
- Версия контракта ответа: `contractVersion = "v1"` (см. **`DomainEventsHealthResponsePayload`**).
- Тот же маркер версии дублируется в header: `x-domain-events-health-contract-version`.
- Канон заголовков ответа: **`buildDomainEventsHealthResponseHeaders(requestId)`** в **`src/lib/server/domain-events-health.ts`**.
- Единый экспорт метаданных контракта: **`DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA`** (`version`, `requiredResponseKeys`, `requiredHeaderKeys`).
- Единый runtime-валидатор контракта для интеграторов/тестов: **`validateDomainEventsHealthContract({ payload, headers })`**.
- Удобная обёртка для Fetch API: **`validateDomainEventsHealthFetchResponse({ payload, headers })`** (принимает объект с `.get(name)` как у `Response.headers`).
- Асинхронный helper для `Response`: **`parseAndValidateDomainEventsHealthResponse(response)`** (читает `json()`, проверяет shape + headers/payload контракт).
- Bus snapshot включает `recentFailureCount` и `lastFailureAt`. `recentFailureCount` — счётчик последовательных ошибок handler’ов (растёт по неудачным попыткам; **сбрасывается в `0` только после полностью успешного `publish`** всех handler’ов для события — не сбрасывается «успехом» раннего handler’а, если позже в цепочке есть падение). `lastFailureAt` — ISO момент **последнего срабатывания circuit breaker** (до первого trip — `null`); после **стабильного** успешного `publish` при закрытом breaker сбрасывается обратно в `null`. При `recentFailureCount >= thresholds.recentFailureWarn` (env **`EVENTS_HEALTH_RECENT_FAILURES_WARN`**, по умолчанию `1`) health помечается `event_bus_recent_failures` (warning-контур).
- Фиксированные коды ошибок валидатора: **`DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR`** (`payload_keys_mismatch`, `payload_shape_mismatch`, `payload_contract_version_mismatch`, `header_missing:*`, `header_contract_version_mismatch`).
- Проверка headers в валидаторе case-insensitive (HTTP-совместимо), значения заголовков нормализуются через `trim()`.
- Consumer quickstart (пример подключения): **`lib/README.md`** → `Domain events health contract (consumer quickstart)`.
- CI-check контракта: **`npm run check:domain-events-health-contract`** (`scripts/ci/check-domain-events-health-contract.mjs`, dependency-light runner, default). Typed/canonical variant: **`npm run check:domain-events-health-contract:typed`** (`scripts/ci/check-domain-events-health-contract.ts`, требует `tsx`). Env: optional `DOMAIN_EVENTS_HEALTH_URL` (если не задан — **skip** с событием **`check_skipped`**, exit `0`, чтобы `npm run check:contracts` работал без поднятого сервера); для CI, где URL обязателен, задайте **`DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1`** → отсутствие URL даёт **`config_error`** и exit `1`. Optional `DOMAIN_EVENTS_HEALTH_SECRET`, optional **`DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT`**: только **`json`** | **`pretty`** (по умолчанию `json`); иное значение → fallback на `json` + warn-событие **`output_format_invalid`**.
- Parity-check раннеров: **`npm run check:domain-events-health-runner-parity`** (`scripts/ci/check-domain-events-health-runner-parity.mjs`) — следит, что event `code` в typed/fallback вариантах совпадают.
- Локальный агрегатор контрактных guard-ов: **`npm run check:contracts`** (`legacy-archive-api` + `integrations-boundary` + `ai-client-boundary` + `domain-events-health-runner-parity` + **`check:domain-events-health-contract`**; при отсутствии `DOMAIN_EVENTS_HEALTH_URL` live-probe **пропускается**, см. выше).
- Практика перед PR/push (контрактные правки): **`npm run check:contracts:ci`** (как в **`ci-fast`**); полный **`npm run check:contracts`** — когда сознательно трогаете client/AI-границу. Переменные GitHub Actions и optional live-step: **`docs/ci/DOMAIN_EVENTS_HEALTH_CI.md`**; алертинг по **`summaryCode`**: **`docs/ops/domain-events-health.md`**.
- Логи CI-check парсируемые (JSON): **`formatDomainEventsHealthCheckEventForConsole(event, format)`** в **`src/lib/server/domain-events-health-check-output.ts`**; поля: `scope`, `level`, `code`, `message`, `details`.
- Обязательные ключи JSON: `contractVersion`, `ok`, `status`, `summaryCode`, `summary`, `alerts`, `degradedReasons`, `recommendations`, `thresholds`, `bus`, `outbox`, `requestId`.
- Пороговые env:
  - `EVENTS_HEALTH_PENDING_WARN` / `EVENTS_HEALTH_PENDING_CRIT`
  - `EVENTS_HEALTH_DLQ_WARN` / `EVENTS_HEALTH_DLQ_CRIT`
  - `EVENTS_HEALTH_FAILED_WARN` / `EVENTS_HEALTH_FAILED_CRIT`
  - `EVENTS_HEALTH_RECENT_FAILURES_WARN` (порог для `event_bus_recent_failures`, по умолчанию `1`)
  - Live health probe (см. выше): `DOMAIN_EVENTS_HEALTH_URL`, optional `DOMAIN_EVENTS_HEALTH_SECRET`, optional `DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT`

#### Health contract changelog (compact)

- `v1` (current):
  - required keys: `contractVersion`, `ok`, `status`, `summaryCode`, `summary`, `alerts`, `degradedReasons`, `recommendations`, `thresholds`, `bus`, `outbox`, `requestId`
  - notes: `summaryCode` is fixed enum; threshold values are echoed in `thresholds` (в т.ч. `recentFailureWarn` для `event_bus_recent_failures`).

#### Integration snapshot (v1)

```json
{
  "contractVersion": "v1",
  "ok": true,
  "status": "ok",
  "summaryCode": "OK",
  "summary": "OK: domain events pipeline healthy.",
  "alerts": [],
  "degradedReasons": [],
  "recommendations": [],
  "thresholds": {
    "pendingWarn": 100,
    "pendingCritical": 500,
    "dlqWarn": 1,
    "dlqCritical": 10,
    "failedWarn": 1,
    "failedCritical": 10,
    "recentFailureWarn": 1
  },
  "bus": {
    "dlqSize": 0,
    "eventStoreSize": 25,
    "circuitOpen": false,
    "dedupeCacheSize": 3,
    "subscriberEventTypeCount": 9,
    "recentFailureCount": 0,
    "lastFailureAt": null
  },
  "outbox": {
    "total": 12,
    "pending": 2,
    "sent": 10,
    "failed": 0
  },
  "requestId": "rid-1"
}
```

## Приёмка «полного контура» (demo)

<<<<<<< HEAD
| Что                                                  | Где                                                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Человеческая матрица + команды                       | **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`**                                                                               |
| Технические связи маршрут ↔ tid ↔ API                | **`INTEGRATION_MAP.md`**, раздел **§6**                                                                                    |
| UI-смок (5 тестов, serial shop inventory + оболочки) | **`e2e/unified-ecosystem-smoke.spec.ts`**, **`npm run test:e2e:verification`**                                             |
| Контракты API (подмножество Playwright)              | **`npm run test:e2e:api`**: **порядок** spec-файлов — **`package.json`** (источник истины), описание — **`e2e/README.md`** |
=======
| Что                                                                               | Где                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Человеческая матрица + команды                                                    | **`docs/UNIFIED_ECOSYSTEM_VERIFICATION.md`**                                                                                                                                                                               |
| Технические связи маршрут ↔ tid ↔ API                                             | **`INTEGRATION_MAP.md`**, раздел **§6**                                                                                                                                                                                    |
| Ритейл-кабинет `/shop`: навигация, RBAC, ERP, аналитика, e2e                      | **`docs/RETAIL_CABINET_FULL_PLAYBOOK.md`** (продукт: **`docs/shop-retailer-cabinet-roadmap.md`**)                                                                                                                          |
| Ритейл E2E узкий контур (ERP `GET /api/shop/erp-sync-status` + сегменты + ссылки) | **`npm run test:e2e:shop-retail`** (`e2e/shop-erp-analytics-strip.spec.ts`); в CI — условно по **`paths-filter`** (см. **`_ai-share/synth-1-full/.github/workflows/ci.yml`**, **`.github/workflows/synth-1-full-ci.yml`**) |
| UI-смок (6 тестов: serial shop inventory + ритейл-хаб/маржа + оболочки)           | **`e2e/unified-ecosystem-smoke.spec.ts`**, **`npm run test:e2e:verification`**                                                                                                                                             |
| Контракты API (подмножество Playwright)                                           | **`npm run test:e2e:api`**: **порядок** spec-файлов — **`package.json`** (источник истины), описание — **`e2e/README.md`**                                                                                                 |
>>>>>>> recover/cabinet-wip-from-stash

Порядок правок при расхождении: **§6** → матрица в **`UNIFIED_…`** → заголовки **`test('…')`** в смоке.

В **`.cursorignore`** не игнорировать весь **`docs/`** — иначе агенты не видят матрицу; достаточно **`docs/archive/`** и **`docs/prompts/`**.

## CI (монорепо `Projects`)

<<<<<<< HEAD
| Слой              | Где                                                           | Содержание                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Основной workflow | **`.github/workflows/synth-1-full-ci.yml`** (корень монорепо) | **`ci-fast`**: format, lint, legacy-archive guard (PR), jest, **`npm run typecheck`** (**`continue-on-error: true`** — техдолг полного дерева), **`npm run build:isolated`**, **`test:e2e:light`**. **`ci-heavy`** после успешного ci-fast: лейбл **`ci-heavy`** на PR (в т.ч. при **позднем** навешивании — в workflow включены события **`labeled`/`unlabeled`**), **`schedule`** (пн 05:00 UTC), **`workflow_dispatch`** → **`test:e2e:verification`** + **`test:e2e:api`**. |
| Пакет в изоляции  | **`_ai-share/synth-1-full/.github/workflows/ci.yml`**         | Без heavy; локально **`npm run test:e2e:heavy`** или PR в монорепо с лейблом.                                                                                                                                                                                                                                                                                                                                                                                                   |
=======
| Слой              | Где                                                           | Содержание                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Основной workflow | **`.github/workflows/synth-1-full-ci.yml`** (корень монорепо) | **`changes`** (`paths-filter`) + **`ci-fast`**: format, lint, legacy-archive guard (PR), jest, **`npm run typecheck`** (**`continue-on-error: true`** — техдолг полного дерева), **`npm run build:isolated`**, **`test:e2e:light`**, **`test:e2e:cabinet-hubs`**, условно **`test:e2e:shop-retail`**. **`ci-heavy`** после успешного ci-fast: лейбл **`ci-heavy`** на PR (в т.ч. при **позднем** навешивании — в workflow включены события **`labeled`/`unlabeled`**), **`schedule`** (пн 05:00 UTC), **`workflow_dispatch`** → **`test:e2e:verification`** + **`test:e2e:api`**. |
| Пакет в изоляции  | **`_ai-share/synth-1-full/.github/workflows/ci.yml`**         | То же условие для **`shop-retail`**; без heavy; локально **`npm run test:e2e:heavy`** или PR в монорепо с лейблом.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
>>>>>>> recover/cabinet-wip-from-stash

Полный **`tsc`** в CI настроен с **`continue-on-error: true`** — merge не зависит от «зелёности» всего дерева (политика монорепо). Локально **`npm run typecheck`** нередко уже проходит без ошибок; цель «строгость всего приложения» — снимать флаг и чинить регрессии пакетами, не ломая demo-контур **stock-upload + B2B hot paths** (поднабор — **`npm run typecheck:order-subset`**).

Для проверки Next app-router page-контрактов используем отдельный шаг: **`npm run typecheck:next-pages`** (строит `.next-isolated` и валидирует `.next-isolated/types/**/*.ts`).

Known warnings сборки:

- `@sentry/*` / OpenTelemetry (`require-in-the-middle`, `Critical dependency`) — ожидаемые warnings инструментирования серверного рантайма.
- Tailwind ambiguous `duration-[...]` — не блокер; чистится отдельно.

## Продукт / prod (вне demo-матрицы)

- **Brand vs shop inventory (tenant / owner)** и границы агрегата **Order** — **`TASK_QUEUE.md`**, **`docs/domain-model/*`**; не сводится к копированию UI.
- **Монорепо — конечное состояние:** **канон один — `synth-1-full`**. Каталоги **`synth-1/`** и **`Projects/src/`** — временные доноры. **Правило порядка:** сначала **перенести** нужное в full с **улучшениями** и **настроенными связями** (маршруты, навигация, entity-links, RBAC, API, E2E), затем **заморозить** и **отключить** доноры; не отключать донор, пока перенос по плану не закрыт. После фаз **D/E** (**`docs/MONOREPO_INTEGRATION.md`**) и приёмки — удалить деревья доноров. Политика: **`docs/CANONICAL_FULL.md`**, **`AGENTS.md`**.

## Кросс-кабинет shop inventory (demo)

Канон в коде: **`src/lib/auth/shop-inventory-cross-cabinet.ts`**, **`RouteGuard`**, **`src/app/shop/layout.tsx`** (`allowCrossCabinetShopInventory`), **`src/lib/auth/demo-hub-email.ts`**. Донор **`synth-1/`** этот модуль не дублирует — разработка канона в **full**.

## Интеграции и подписи «B2B» (UX)

- **`getIntegrationsLinks()`** и **`getIntegrationLinks()`** (webhooks, SSO): отдельной строки на реестр оптовых заказов в «связанных модулях» нет — **`filterB2B`** + **`finalizeRelatedModuleLinks`** (внутри: **`dedupeEntityLinksByHref`** сливает **`ROUTES.shop.b2bOrdersLegacy`** с **`ROUTES.shop.b2bOrders`**, один ярлык **`SHOP_B2B_ORDERS_HUB_LABEL`**) в **`src/lib/data/entity-links.ts`**. Очевидный CTA на реестр: карточка **«Реестр B2B-заказов»** на **`/brand/integrations`**; единая подпись реестра — **`B2B_ORDERS_REGISTRY_LABEL`** в **`src/lib/ui/b2b-registry-label.ts`** (импорт в бейджах **`SectionBadgeCta`**, кнопках brand-страниц); в сайдбаре — кластер **«Оптовые продажи (B2B)»** (**`src/lib/data/brand-navigation.ts`**); плитка Control Center — **«Реестр B2B-заказов»** (**`MODULE_HUBS`** в **`entity-links.ts`**). **`getShopB2BHubLinks()`** / **`getShopB2BOrderLinks()`** завершаются тем же **`finalizeRelatedModuleLinks`**.
