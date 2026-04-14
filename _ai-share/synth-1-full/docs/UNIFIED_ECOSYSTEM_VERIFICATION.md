# Unified Ecosystem Verification (demo)

Человекочитаемая матрица приёмки для **`_ai-share/synth-1-full`**: demo-контур без prod-бэкенда. Технический SoT по связям и чеклисту — **`INTEGRATION_MAP.md` §6** (при расхождении правьте сначала §6, затем этот файл и смок).

## Сопровождение матрицы

- Имеет смысл **версионировать** этот файл в git (корень монорепо `Projects`), чтобы матрица не расходилась с §6 из‑за потери локальной копии.
- После нового маршрута / `data-testid` / смока: **`INTEGRATION_MAP.md` §6** → строка здесь → заголовок `test('…')` в **`unified-ecosystem-smoke.spec.ts`**. Для **shop inventory** сверяйте порядок **`Shop inventory contour (serial)`** и отдельный тест **`Brand logistics hub shell (/brand/logistics)`**.

## Автотесты (обязательный минимум перед релизом)

| Команда | Назначение |
|--------|------------|
| `npm run test:e2e:verification` | UI-матрица: `e2e/unified-ecosystem-smoke.spec.ts` (`--workers=1`) |
| `npm run test:e2e:api` | Контракты API (shop, B2B v1, processes, …) — в CI обычно **ci-heavy**, не на каждый PR |
| `npm run typecheck` | Полный `tsc` — в **`synth-1-full-ci.yml`** блокирует билд; см. **`SOURCE_OF_TRUTH.md`** (job **`synth-1-legacy`** в корневом **`ci.yml`** — **`continue-on-error: true`**, не про full) |

> **Совет:** Перед релизом или при существенных изменениях в логике Phase 2 прогоните `npm run test:e2e:verification` локально или с лейблом **`ci-heavy`** в PR. Это проверяет связность модулей (shop inventory, logistics, B2B hot paths).

## Системный старт (Node)

- **`src/instrumentation.ts`** (`register`, при `NEXT_RUNTIME === 'nodejs'`): после **`logEnvSafetyWarningsOnce()`** вызывается **`bootstrapEnterpriseEcosystem()`** (`src/lib/core/bootstrap.ts`) → **`CognitiveNervousSystem.initialize()`** (подписки на **`eventBus`**) и **`GlobalAnomalyEngine.initialize()`** (глобальный перехватчик). Шина: **`eventBus`** — **`src/lib/order/domain-events.ts`** (`publish`, `publishUrgent`, DLQ, circuit breaker). Подробнее — **`SOURCE_OF_TRUTH.md`**.

## Shop inventory + logistics (demo) — ручной чеклист

Синхронизируйте с describe **`Shop inventory contour (serial)`** и отдельным тестом оболочки логистики в **`e2e/unified-ecosystem-smoke.spec.ts`**.

1. **API:** `GET` / `POST` **`/api/shop/inventory/stock-upload`** — после POST виден audit (`GET`); идентификация **`getB2CShopUserIdOrDemoAnon`** (см. §6 **`INTEGRATION_MAP.md`**).
2. **UI shop:** префикс **`shop-stock-sync`** — диалог, загрузка файла, **`shop-stock-sync-last-accepted`**.
3. **Кросс-кабинет:** **`tid.brand-inventory-shop-stock-upload-link`**, **`tid.shop-inventory-brand-matrix-link`**.
4. **Логистика → ритейл:** **`tid.brand-logistics-shop-stock-upload-link`** на **`/brand/logistics`** → **`/shop/inventory`**.
5. **Порядок (serial):** сначала cross-links brand↔shop, затем logistics → shop, затем shop shell — иначе ломается demo-auth (`shop@` в storage до **`/brand`**).
   - Имена тестов: **`Brand ↔ Shop inventory cross-links (stock contour)`** → **`Brand logistics hub → Shop stock upload link`** → **`Shop inventory shell`**; отдельно **`Brand logistics hub shell (/brand/logistics)`** вне serial.

**Инфра:** **`RouteGuard`** + **`shop-inventory-cross-cabinet.ts`**, **`shop/layout.tsx`** (`allowCrossCabinetShopInventory`), **`demo-hub-email.ts`** (`adjustDemoHubEmailForShopInventoryBootstrap`).

Детали и перечень хабов — строки **169–175** в **`INTEGRATION_MAP.md` §6**.

## Control Center и предиктивные риски (demo)

- Агрегация контроля: **`src/lib/control/control-aggregator.ts`** (`aggregateInventoryControl`, **`analyzePredictiveRisks`**).
- Виджет на **`/brand/control-center`**: **`PredictiveRiskWidget`**; снимок для UI — **`getControlCenterPredictiveRisks()`** (тот же контур **`analyzePredictiveRisks`**, демо-гранулы **`CONTROL_CENTER_DEMO_SKU`).

## Перекрёстные ссылки (UX)

- Смок **`Brand integrations hub shell (/brand/integrations)`**: **`brand-integrations-page`**, **`related-modules-block`**, карточка **«Реестр B2B-заказов»** во встроенных B2B-фичах.
- **`getIntegrationsLinks()`** не дублирует отдельным пунктом «B2B Заказы»; реестр — в блоке карточек на странице интеграций.
- **`RelatedModulesBlock`**: корневой якорь **`data-testid="related-modules-block"`**; **один пункт на `href`** при склейке списков (первая метка сохраняется).

## Продуктовая логика (Phase 2+)

Полный перечень задач и границ агрегатов — **`TASK_QUEUE.md`**, канон доменов — **`docs/domain-model/*`** и **`*-boundaries-checklist.md`**. Юнит-/логика-смоки: **`e2e/*-logic.spec.ts`**.

## Прочие оболочки из смока

Полный перечень заголовков `test('…')` — **`e2e/unified-ecosystem-smoke.spec.ts`**. Рабочий цикл нового маршрута: **`routes.ts`** → навигация / **`entity-links`** → **`data-testid`** → тест в смоке → строка в этом файле (см. **`INTEGRATION_MAP.md` §6**).

## Вне scope этого документа

- **Prod:** owner/tenant brand vs shop inventory — **`TASK_QUEUE.md`** (секция prod-слоя после demo).
- **Монорепо:** legacy **`synth-1/`**, **`Projects/src/`** — **`docs/MONOREPO_INTEGRATION.md`** (фазы D/E).
