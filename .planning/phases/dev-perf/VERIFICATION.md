# Dev-perf verification (2026-05-26)

## Latest static verify

| Команда | Результат | Примечание |
|---------|-----------|------------|
| `npm run verify:dev-perf` | **PASS** | layout gates **49** + `typecheck:dev-perf` + contracts + layout-gates-package guard |

## Фаза 1 — regression (historical)

| Команда | Результат | Примечание |
|---------|-----------|------------|
| `npm run verify:dev-perf` | **PASS** | layout gates **27** + contracts (post RootClientProviders wiring) |
| `npm run test:e2e:cabinet-hubs` | partial local | 7 hubs; readiness `/` fix; полный прогон — CI |
| `npm run test:e2e:verification` | **5/5**, exit 0 | локально; в CI: **unified ecosystem e2e (dispatch)** или `ci-heavy` |
| `npm run dev:bench:ci` | **9/9**, exit 0 | после JSON_OUT fix; strict ≤3000ms |
| `npm run dev:bench:routes` | **38/38**, exit 0 | один `dev:fast:clean`, не подряд с ci bench |
| `npm run smoke` | **PASS** | |

### Ops-правила (подтверждены)

1. Не параллелить `dev:fast` (:3000) и `test:e2e:*` (:3123).
2. Не держать `dev:workshop2` на :3000 при bench/e2e.
3. После e2e → `dev:fast:clean` перед bench.
4. Между `dev:bench:ci` и `dev:bench:routes` без clean — каскад 500 (turbopack).
5. Preflight `check-shared-next-conflict.cjs`: исправлен `lsof` на `-sTCP:LISTEN` (ложные блокировки).

## Фаза 0 — git / ship

- **Git:** обход без `sudo xcodebuild -license` — `PATH=/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH`.
- **7 коммитов** на `feat/dev-perf-optimization` — см. `SHIP_CHECKLIST.md`.
- **PR:** вручную — https://github.com/PetrFedin/Projects/pull/new/feat/dev-perf-optimization (`PR_BODY.md`).

## Фаза 3 — CI bench

- **Вариант B:** `verify:dev-perf` / `check:contracts:ci` — уже в CI.
- **Вариант C:** manual `dev:bench:ci` — см. `docs/CURSOR_AGENT_TOOLKIT.md` §6.
- **Вариант A (nightly):** отложен до стабилизации turbopack.

## Фаза 4 — complete (2026-05-29)

| ID | Статус |
|----|--------|
| 4a explore ClientLayout imports | **done** — `RouteGuardGate` skips sync guard on public shell (#12) ✅ |
| 4b NuqsProviderGate + RunwayAnalyticsGate | **done** — nuqs removed; RunwayAnalyticsGate idle on public shell |
| 4b RolePanelGate idle | **done** — `RolePanelGate` wired in ClientLayout (#13) ✅ |
| 4c server CMS prefetch | **done** — `GET /api/home/cms` + RSC `initialCms` + client seed zero-fetch (#10) ✅ |
| 4d investor-spine e2e в CI | **done** — `investor-spine-e2e` после ci-fast (#9); unified verification — **`ci-heavy`** / dispatch |
| AuthProvider lazy | **done** — `AuthProviderGate` + interactive stub; RouteGuard uses shared public paths |
| Backend CI smoke | **done** — MVP `smoke_core` pytest + scoped ruff in monorepo CI (#14) ✅ |

## Фаза 5 — home zero-fetch + bundle baseline (2026-05-29)

| ID | Статус |
|----|--------|
| RSC `initialCms` + `initialProducts` на `/` | **done** — Phase 4/5 (#10, PLAN-05) ✅ |
| `GET /api/home/cms` + client seed | **done** ✅ |
| `dev:bench:routes` `/` warm | **done** — 55ms (2026-05-26) |
| `build:isolated` + First Load JS baseline | **done** — см. `PLAN-05-home-rsc-zero-fetch.md` |
| Layout gates **45** incl. `route-guard-route` | **done** — guard в `layout-gates-package-guard.mjs` |
| `analyze:bundle` HTML client report | **deferred** — локально OOM; top routes зафиксированы в PLAN-05 |

**Next (Phase 6 candidates):** nightly turbopack bench; bundle HTML в CI с большим heap; расширение `typecheck:dev-perf` (Gate `.tsx` — отдельно).

## Фаза 6 — typecheck:dev-perf subset (2026-05-29)

| ID | Статус |
|----|--------|
| `tsconfig.dev-perf.json` — route helpers без `routes.ts` | **done** — `cabinet-route-match` literals + parity test |
| `typecheck:dev-perf` в `check:contracts:ci` | **done** — ~5s, guard `dev-perf-typecheck-guard.mjs` |
| `cabinet-route-match.test.ts` в layout gates | **done** — 49 Jest tests (+ parity с ROUTES) |
| AGENTS.md / toolkit — 45→46 gates, ci-heavy | **done** — этот PR |
