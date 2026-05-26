# Dev-perf Phase 5 — Home zero-fetch + bundle audit

**Depends on:** merge `feat/dev-perf-optimization` (gates, dev:fast, auth lazy, CMS API).

**Goal:** Убрать client-side waterfall на `/` и зафиксировать measurable baseline для следующих срезов.

## Requirements

1. **RSC baseline на `/`** — `initialCms` + `initialProducts` (или catalog slice) без client fetch на first paint.
2. **API contract** — `GET /api/home/cms` уже есть; products — переиспользовать server loader / cache (`home-products-catalog`).
3. **Bundle audit** — один прогон `@next/bundle-analyzer` на production build, записать top-5 chunks в этот файл.
4. **Gates** — любой новый public route → `public-shell-route` / `route-guard-public-path` tests.

## Verification

```bash
npm run verify:dev-perf          # 32 layout gates
npm run dev:fast:clean           # :3000
npm run dev:bench:routes         # / TTFB vs baseline в VERIFICATION.md
npm run test:e2e:home            # если есть home-specific e2e
```

## Out of scope

- Nightly CI bench (turbopack flaky)
- AuthProvider further split (defer + lazy уже в Phase 4)
- Workshop2 feature work

## Success criteria

- [x] `/` — RSC `initialProducts` + client seed (без fetch `/data/products.json` до idle, если seed есть)
- [x] `/` — RSC `initialCms` (Phase 4)
- [x] `dev:bench:routes` для `/` — **55ms** warm (2026-05-26), hubs **9/9** 200
- [x] `build:isolated` — PASS (2026-05-27); `@next/bundle-analyzer` добавлен
- [ ] `analyze:bundle` HTML client report — локально OOM; top routes по First Load JS ниже

## Bundle baseline (build:isolated, 2026-05-27)

Shared First Load JS: **107 kB** (chunks `31684` 46 kB, `4bd1b696` 53.2 kB)

Top routes by First Load JS:

| Route | First Load |
|-------|------------|
| `/u` | 891 kB |
| `/client/me` | 889 kB |
| `/brand/media` | 805 kB |
| `/client/me/wardrobe` | 771 kB |
| `/search` | 619 kB |

Dev bench hubs (dev:fast): `/` 55–174ms, cabinets 43–106ms — см. VERIFICATION.md.
