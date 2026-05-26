# Dev-perf PR scope (2026-05-26)

## Размер ветки

`feat/dev-perf-optimization` ≈ **201 commits** ahead of `main`.

Ветка включает **Workshop 2 / Phase 11–13** (matchmaker, DFM, B2B) **и** серию dev-perf (~22 коммита сверху). Это **не** чистый perf-only diff.

## Dev-perf серия (review focus)

От `976bc78b` до `HEAD` — ключевые темы:

| Область | Файлы / символы |
|---------|-----------------|
| Root wiring | `app/layout.tsx`, `RootClientProviders.tsx` |
| Provider gates | `*ProviderGate.tsx`, `src/lib/layout/*-route.ts` |
| Auth perf | `AuthProviderGate`, `auth-provider-stub`, `auth-bootstrap-route` |
| Home | `page.tsx`, `get-home-*-server`, `home-products-catalog` |
| Dev tooling | `dev:fast`, `dev:bench:*`, `scripts/dev-route-benchmark.mjs` |
| CI | `test:layout:gates`, `layout-gates-package-guard`, playwright `/` readiness |

## Если нужен узкий PR

1. **Merge as-is** — если Workshop 2 уже готов к main вместе с perf.
2. **Split later** — `gsd-pr-branch` / cherry-pick dev-perf на свежий `main` (конфликты возможны: nav, workshop panels).

## Pre-merge локально

```bash
npm run pre-pr:dev-perf          # static, ~5s
npm run pre-pr:dev-perf:e2e      # + e2e (локально может OOM — CI источник правды)
bash scripts/create-dev-perf-pr.sh
```

## Post-merge

- `npm run dev:fast:clean`
- `npm run analyze:bundle` (фаза 5, optional dep)
- Manual bench: `dev:bench:ci`
