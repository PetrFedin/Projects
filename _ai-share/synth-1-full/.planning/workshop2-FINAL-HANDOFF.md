# FINAL HANDOFF — Workshop2 close commands

1. `npm run test:workshop2:unit` — **859 passed / 79 suites**
2. `npm run signoff:workshop2`
3. `npm run signoff:workshop2:pg`
4. `bash scripts/workshop2-pg-bootstrap.sh`
5. `npm run check:workshop2`

## verified 2026-05 (investor demo deep pass)

| Gate | Result |
|------|--------|
| `curl:workshop2-panes` | **12/12 panes HTTP 200** (`overview`…`nesting`); file-store skip в PG-only |
| `signoff:workshop2:pg` | **2/2 Playwright** (API + QC deep link); QC cold-compile может потребовать retry без `test.setTimeout(360_000)`) |
| `test:workshop2:unit` | **1088 passed / 14 failed** (138 suites; регрессии wave-v/no-demo-deadends/B2B — см. блокеры) |
| `verify:workshop2:catalog-wire` | **OK 0 gaps** (в составе check) |
| PG health | `postgres: ok`, `internalWms: enabled`, `devAuthBypass: true` |

Критические фиксы сессии: удалён дубликат route `workshop2/c/.../page`, восстановлен `middleware.ts` (legacy redirect + dev bypass), восстановлен `workshop2-pg-bootstrap.sh` (290 строк), Playwright QC — pane-aware `waitForDossierLoaded` + `#w2article-section-qc`.
