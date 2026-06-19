# Workshop2 Production / Sample Shop — staging deploy checklist

См. также `docs/workshop2-production-module-adr.md`.

## PostgreSQL

```bash
export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@HOST:5433/workshop2
npm run db:apply:workshop2-migrations
```

## Env (staging / production)

- `WORKSHOP2_DATABASE_URL` — обязательно в production
- `NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1` — production
- `WORKSHOP2_PG_REQUIRED=1` — планируется (503 без PG)
- `WORKSHOP2_DEV_BYPASS_AUTH` — только staging/dev

## E2E dev

Локально как CI (unit + external dev:e2e):

```bash
export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
npm run verify:workshop2
```

Только Playwright при уже запущенном `dev:e2e`:

```bash
npm run test:e2e:sample-shop:external
```

```bash
rm -rf .next .next-e2e
E2E_CLEAR_CACHE=1 PLAYWRIGHT_WORKERS=1 npx playwright test e2e/workshop2-sample-shop-flow.spec.ts
```

`dev:e2e` использует `NEXT_DIST_DIR=.next-e2e`, `E2E=true`, пропуск Sentry в `instrumentation.ts`.

## UAT path

fit (`w2pane=fit`) → release order (`w2relsub=order`) → movement / transition UI.

## Rollback

Deploy rollback + PG snapshot restore; миграции не авто-откатываются.

## CI (`.github/workflows/workshop2-ci.yml`)

| Job | Env |
|-----|-----|
| `workshop2-unit` | `WORKSHOP2_DATABASE_URL` + PG service `:5433` |
| `workshop2-sample-shop-e2e` | PG + `WORKSHOP2_DEV_BYPASS_AUTH`, `WORKSHOP2_MARKET=ru`, EDO mock, `NODE_OPTIONS=12288`, external `dev:e2e` |
| `workshop2-pg-gate` | `WORKSHOP2_PG_ONLY`, `NEXT_PUBLIC_WORKSHOP2_PG_ONLY` via gate script |

Production-only (не в CI): `NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1`, `WORKSHOP2_PG_REQUIRED=1`.

## Локальная проверка без git/Xcode

См. [workshop2-local-verify-without-git.md](./workshop2-local-verify-without-git.md) — Docker PG, migrations, `workshop2-unit-green.mjs`, `ci-workshop2-sample-shop-e2e.sh`.
