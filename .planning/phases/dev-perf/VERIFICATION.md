# Dev-perf verification (2026-05-26)

## Latest static verify

| Команда | Результат | Примечание |
|---------|-----------|------------|
| `npm run verify:dev-perf` | **PASS** | layout gates **36** + contracts + layout-gates-package guard |

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

## Фаза 4 (этот PR / follow-up)

| ID | Статус |
|----|--------|
| 4a explore ClientLayout imports | `.planning/research/dev-perf-next-milestone.md` |
| 4b NuqsProviderGate + RunwayAnalyticsGate | **в diff** |
| 4b RolePanelGate idle | уже было |
| 4c server CMS prefetch | **`GET /api/home/cms`** + RSC `initialCms` на `/` ✅ |
| 4d investor-spine e2e в CI | `test:e2e:verification` есть локально; CI path-filter only |
| AuthProvider lazy | **done** — `AuthProviderGate` + interactive stub; RouteGuard uses shared public paths |
