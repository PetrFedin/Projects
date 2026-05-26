## Summary

- **dev:fast / dev:fast:clean** — Turbopack, skip enterprise bootstrap, fonts off in dev.
- **Route-gated providers** — B2B, UI state, notifications, React Query (brand only); hub `/shop` keeps B2B for `useUserContext`.
- **Home** — lazy sections, CMS/products cache, **`GET /api/home/cms`**, RSC `initialCms` на `/`.
- **Bench tooling** — `dev:bench:ci` (9 hubs strict), `dev:bench:routes` (38 smoke URLs), shared `.next` conflict guards.
- **E2E** — smoke retries on 500, hydration shell wait.
- **Follow-up in branch:** `NuqsProviderGate`, `RunwayAnalyticsGate` wired in `client-layout.tsx`, preflight `lsof` LISTEN fix, **`GET /api/home/cms`**, `test:layout:gates` в `check:contracts:ci`.

## Test plan

- [x] `npm run verify:dev-perf` — layout gates **22/22**
- [x] `npm run test:e2e:light` — 36/36
- [x] `npm run dev:bench:ci` — 9/9, exit 0 (strict)
- [x] `npm run dev:bench:routes` — 38/38 после **одного** `dev:fast:clean` (не подряд с ci bench)
- [x] `npm run test:e2e:verification` — 5/5 (unified ecosystem, 1 flaky)
- [x] `npm run smoke`

## Breaking / ops rules

**Не параллелить** на одном `.next`:

- `dev:fast` (:3000) ↔ `test:e2e:*` (:3123)
- `dev:workshop2` (:3000) ↔ bench / e2e

После e2e: `npm run stop:stale-dev && npm run dev:fast:clean` → bench.

При ENOENT / turbopack runtime: clean restart, не патчить код вслепую.

Manual bench (release checklist): `npm run dev:bench:ci` — см. AGENTS.md.

## Review focus

- Provider gates + tests (`src/lib/layout/*-route.ts`)
- `/shop` hub B2B mount (retail subroutes skip)
- `syntha-nav-clusters` exports, shop navigation data
- `check-shared-next-conflict.cjs` LISTEN-only preflight

## Not in scope

- AuthProvider lazy (RouteGuard)
- Nightly CI bench (turbopack flaky)
