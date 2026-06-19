# Platform Core — responsive cabinet & workspace

Контракт слоёв для `:3001` (core mode). Breakpoints: **< md** iPhone · **md–lg** iPad · **lg+** MacBook.

## Источники правды

| Слой | Токены / компоненты |
|------|---------------------|
| Кабинет роли | `hubCabinet` — `src/lib/platform-core-cabinet-chrome.ts` |
| Insight-карточки | `pillarInsight`, `PillarInsightPrimitives` |
| Hub quick entry | `PlatformCoreHubQuickEntry`, `platformCoreHeaderHubTabClass` |
| Workspace chrome | `PlatformCoreListChrome`, `PlatformCoreRolePillarStrip` |
| Dedup | `platform-core-ui-dedup` — один context-bar, без дубля H1/cross-role |

## Кабинет `*/core`

| Viewport | Навигация столпов | Insight | CTA |
|----------|-------------------|---------|-----|
| < 768 | `role-core-pillar-nav-horizontal` — swipe pills, `min-h-11` | stack, step chips | `panelHeader`, full-width < sm |
| md–lg | `role-core-pillar-nav` aside `w-52` | `insightGrid` 2 col | в шапке панели |
| lg+ | aside + panel side-by-side | компактно + cross-role | `primaryCta` inline |

**Above the fold (393×812):** context-bar → pills → заголовок столпа → «Открыть рабочий экран».

## Workspace (list chrome)

| Viewport | Pillar strip | Sidebar |
|----------|--------------|---------|
| < lg | `platform-core-role-pillar-strip` под context-bar | бургер |
| lg+ | strip скрыт (`lg:hidden`) | столпы в сайдбаре роли |

Strip: hub-pills, wrap на md; back — `platform-core-workspace-back`.

## E2E

- `e2e/core-92-cabinet-layout-viewports.spec.ts` — brand + shop 393 / 834 / 1280
- `e2e/core-94-cabinet-all-roles-viewports.spec.ts` — manufacturer + supplier cabinets 393 / 834 / 1280
- `e2e/core-91-hub-layout-viewports.spec.ts` — hub
- `e2e/core-93-shop-matrix-smoke.spec.ts` — matrix 393 + iPad sticky col
- Helpers: `expectCabinetPillarNav`, `expectCabinetAboveFold`, `expectWorkspacePillarStrip`

## Preview

`syntha-device-preview.html?url=/brand/core` — iframe + `fitDeviceScale()` на iPad.

## Проверка после правок

```bash
npm run audit:platform-core-ui
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 PLAYWRIGHT_SKIP_WEBSERVER=1 \
  npx playwright test e2e/core-92-cabinet-layout-viewports.spec.ts e2e/core-94-cabinet-all-roles-viewports.spec.ts
```

## Context bar (workspace)

Core mode: одна строка `← Кабинет · роль · столп · entity` (`showWorkspaceBack`).

`data-testid="platform-core-workspace-back"` на ссылке «Кабинет» в context-bar (без дубля в ListChrome).

## Таблицы

`hubCabinet.workspaceTableScroll` + `workspaceStickyHead` / `workspaceStickyCol` — orders registry, matrix size grid.

## Order detail

`hubCabinet.orderDetailLayout` — `lg:grid-cols-[1fr_20rem]`; cross-role в `orderDetailRail` (lg+) и `platform-core-order-detail-cross-role-mobile` (< lg).

## Реестры заказов (brand/shop)

`< md` и `lg+` — таблица + sticky col; **md–lg** — `workspaceCardGrid` (`brand-co-registry-card-grid`, `shop-co-registry-card-grid`).

## Кабинет — mobile panel grid

`pillarPanelGrid` (core mode): строка 1 — название столпа (sticky top); строка 2 — insight; строка 3 — CTA «Открыть…» (`role-pillar-primary-cta`, sticky bottom + `pb-safe`). На `md+` — CTA в шапке панели (grid col 2), insight ниже в 2 колонки.

## Тема

`PlatformCoreThemeBridge` — `data-platform-core`, `.dark` по `prefers-color-scheme`.

## E2E helpers (`e2e/helpers/core-chain-overview.ts`)

| Helper | Назначение |
|--------|------------|
| `expectCabinetPillarNav` | horizontal `< md`, aside `≥ md` |
| `expectCabinetAboveFold` | context + pills + CTA + insight в 393×812 |
| `expectCabinetAsidePanelLayout` | aside + panel в одной строке `md+` |
| `expectWorkspacePillarStrip` | strip `< lg`, hidden `lg+` |
| `cabinetPillarNavLocator` / `clickCabinetPillar` | клик по столпу без strict-mode дубля testid |
| `clickCabinetPrimaryCta` | CTA кабинета: навигация по `href` (live `demoOrderId`) |
| `gotoRoleCoreCabinet` | `/core` + optional chain-overview wait |

## Hub `/platform`

| Зона | < md | md–lg | lg+ | E2E |
|------|------|-------|-----|-----|
| Quick entry + матрица | stack / h-scroll | 2×2 роли, таблица | 2-col grid + audit | `core-91` |
| Audit-only роли | 2×2 (`PLATFORM_CORE_HUB_CARD_ROW_ROLES`) | 2×2 | 2×2 в левой колонке | `core-91` audit 834 |
| Планировщик | full width, toolbar scroll, `min-h-11` CTA | same | chat split `lg:grid` | `core-104` |

Токены: `platformCoreHubLayout` (`platform-core-hub-layout.ts`), planner actions — `hubCabinet.workspaceStickyActions` / `workspacePrimaryBtn`.

### E2E hub (дополнительно)

- `e2e/core-104-hub-planner-viewports.spec.ts` — planner 393 / 834
- `e2e/core-101-comms-mobile-viewports.spec.ts` — messages split `< md`
- `e2e/core-102-calendar-viewports.spec.ts` — calendar compact 393 / 834
- `e2e/core-103-op-viewports.spec.ts` — handoff, mfr cards, sup procurement
