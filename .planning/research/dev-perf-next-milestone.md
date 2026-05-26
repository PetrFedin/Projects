# Dev-perf next milestone (4a)

## ClientLayout import graph

| Import | Тип | Кабинет | Действие |
|--------|-----|---------|----------|
| `NuqsProvider` | sync `nuqs/adapters` | был везде | **NuqsProviderGate** — skip cabinets/embed |
| `RunwayAnalyticsProvider` | dynamic | public only | **RunwayAnalyticsGate** — idle + dynamic |
| `RolePanelGate` | idle + dynamic | all | done |
| `RouteGuard` | sync | all | blocks AuthProvider lazy |
| `ThemeProvider`, `TooltipProvider` | sync | all | low cost, keep |
| Header/Footer/Sheets | dynamic | public | done in ClientLayoutLazyParts |

## RootClientProviders (heavy, always mount)

| Provider | Gate | Notes |
|----------|------|-------|
| `AuthProvider` | none | **RouteGuard** uses `useAuth` globally |
| `QueryProviderGate` | `/brand/*` | done |
| `B2BStateProviderGate` | public, brand, hub `/shop`, `/shop/b2b/*` | done |
| `UIStateProviderGate` | brand, b2b shop, settings, client me/wishlist | done |
| `NotificationsProviderGate` | same as B2B | done |
| `DevOnlyChromeGate` | dev idle | done |

## Nuqs removed (7th commit)

- Package `nuqs` imported only `NuqsAdapter`; app uses `@/hooks/useQueryState` (Next router + queryCodec).
- Removed `NuqsProviderGate`, `nuqs-provider.tsx`, `nuqs` from `package.json` / `optimizePackageImports`.
- `isPublicShellPathname` in `public-shell-route.ts` — shared gate for RunwayAnalytics idle mount.

## 4c Server CMS prefetch

- **`GET /api/home/cms`** — server baseline (`DEFAULT_HOME_CMS`), cache 60s.
- Client: `loadHomeCmsConfig` → localStorage override, иначе fetch API.
- Next: RSC `initialCms` на `/` для zero-fetch first paint.

## 4d investor-spine / unified-ecosystem CI

- Local: `npm run test:e2e:verification` (unified-ecosystem-smoke.spec.ts, serial 210s).
- CI: path filter in `.github/workflows/ci.yml` — not default PR job.
- Stabilization: cold `/shop` compile after brand navigation — already 60s timeout in spec.

## Recommended PR order

1. Merge dev-perf (gates + bench + home) — this series.
2. NuqsProviderGate + RunwayAnalyticsGate — can ship with (1) or tiny follow-up.
3. Server CMS API — separate ADR + phase.
4. CI: add `test:e2e:verification` to nightly or manual workflow_dispatch.
