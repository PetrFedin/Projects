# Investor Freeze — Wave 55 Snapshot

**Дата:** 2026-05-29  
**Tag (manual):** `investor-freeze-wave55`  
**Baseline unit:** 1445 passed / 0 failed (Wave 54) + Wave 55 (+12)

## Test count

| Metric | Value |
|--------|-------|
| Unit baseline (Wave 54) | 1445 / 0 |
| Wave 55 new tests | +12 (`workshop2-wave55-investor-freeze.test.ts`) |
| Target after Wave 55 | 1457 / 0 |

```bash
npm run test:workshop2:unit
node scripts/wave55-restore-disk.mjs
```

## Probes (integration-probes)

| Probe | Threshold | Purpose |
|-------|-----------|---------|
| `wave54ProdHardeningReady` | ≥12 | Prod hardening baseline |
| `wave55InvestorFreezeReady` | ≥10 | Investor freeze gate |

```bash
curl -s http://127.0.0.1:3123/api/workshop2/integration-probes | jq '{w54:.wave54ProdHardeningReady,w55:.wave55InvestorFreezeReady}'
node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123
```

## Human signoff (Wave 55)

Роли **ops + product** (отдельно от cutover ops+staging):

```bash
curl -X POST http://127.0.0.1:3123/api/workshop2/uat/ss27/signoff \
  -H 'Content-Type: application/json' \
  -d '{"role":"ops","signedBy":"ops-lead@brand.ru"}'
curl -X POST http://127.0.0.1:3123/api/workshop2/uat/ss27/signoff \
  -H 'Content-Type: application/json' \
  -d '{"role":"product","signedBy":"product-lead@brand.ru"}'
curl -s http://127.0.0.1:3123/api/workshop2/cutover-dashboard | jq '{wave55FreezeReady}'
```

## Wave 58 — Investor Show (скрипт показа)

Пошаговый сценарий 25 мин и честная таблица demo/live:

- [.planning/INVESTOR-DEMO-SCRIPT-RU.md](./INVESTOR-DEMO-SCRIPT-RU.md) — шаги 1–18, URL, iPad 1024×768, fallback без сервера
- [.planning/INVESTOR-DEMO-VS-LIVE-RU.md](./INVESTOR-DEMO-VS-LIVE-RU.md) — demo vs live
- `GET /api/workshop2/investor-demo/brief` — one-screen JSON
- `/brand/production/workshop2/investor-brief` — read-only RU dashboard

```bash
node scripts/wave58-restore-disk.mjs
npm run workshop2:investor-show
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '{investorDemoReady,probes}'
```

## Demo commands

```bash
npm run workshop2:investor-demo:full
npm run workshop2:investor-show
WORKSHOP2_INVESTOR_DEMO_WAVE55_FREEZE=1 npm run workshop2:investor-demo:full
bash scripts/workshop2-investor-demo.sh
curl -s "http://127.0.0.1:3123/api/shop/b2b/orders/B2B-001/invoice-stub" | head
curl -s "http://127.0.0.1:3123/api/shop/b2b/orders/export?tenantId=tenant-demo" -H 'Accept: text/csv'
bash scripts/workshop2-investor-freeze-tag.sh
```

## Env checklist (production RU)

См. `.env.production.ru.example`:

- `WORKSHOP2_PRODUCTION_PUBLIC_URL`
- `DATABASE_URL`
- `WORKSHOP2_KONTUR_DIADOC_TOKEN` / `WORKSHOP2_MARKING_API_TOKEN`
- `WORKSHOP2_PAGERDUTY_WEBHOOK_URL`
- `SENTRY_DSN`
- `WORKSHOP2_ACK_ARCHIVE_S3_BUCKET`

```bash
npm run workshop2:production-keys-checklist
```

## B2B parity

- **31 ✓ native**, **0 partial** — `.planning/workshop2-b2b-joor-parity-matrix.md`
- Parity coverage: **100%** scaffold (live keys = prod ops)

## Artifacts on disk

- `.planning/RELEASE-NOTES-WAVES-9-55-RU.md`
- `.planning/workshop2-wave55-ops-applied-checklist.md`
- `.planning/workshop2-ack-restore-drill-last.json` (after drill)
- `scripts/wave55-restore-disk.mjs`
