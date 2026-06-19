# Roadmap v2 — post-freeze (Wave 56+)

После **investor-freeze-wave55** — продуктовый рост без нарушения ops baseline.

## P0 — Ops continuity

| Эпик | Описание | Критерий готовности |
|------|----------|---------------------|
| Ops applied | PagerDuty + Sentry в org | `opsAppliedChecklist: true` на cutover-dashboard |
| ACK compliance | S3 7y + quarterly drill | `workshop2-ack-restore-drill-last.json` с `--prod` |
| Probes | wave56 ≥10 | `node scripts/workshop2-probe-alert.mjs` PASS |

## P1 — B2B billing

| Эпик | Описание | Критерий |
|------|----------|----------|
| Invoice HTML | PG `invoice_html_url`, печать в PDF | CSV export + stub route |
| Invoice PDF engine | Playwright pipeline (ops) | `WORKSHOP2_INVOICE_PDF_ENGINE=playwright` documented |

## P1 — Rep offline sync (live)

| Эпик | Wave 56 scaffold | v2 live |
|------|------------------|---------|
| Offline pack API | `GET /api/shop/b2b/rep/offline-pack` journal_only | IndexedDB + sync queue |
| Service worker | optional / skip | PWA cache linesheet assets |
| Conflict resolution | journal_only | server wins + rep merge UI |

## P1 — JOOR OAuth prod

- Staging keys → prod OAuth client в vault
- Inbound webhook prod URL + rotation runbook
- Parity matrix: 31 ✓ → live JOOR full

## P2 — 3D SDK full

- Замена iframe/sdk-stub на live stream provider
- SLA dashboard + error budget (Wave 53 baseline)
- iPad E2E rep portal + 3D showroom

## Wave numbering

- **Wave 56** (done): post-freeze maintenance scaffold
- **Wave 57** (partial): mark-applied org journal + rep offline queue phase 1 + probe `wave57PostFreezeLive`
- **Wave 58** (plan): IndexedDB sync phase 2 + JOOR prod + Playwright PDF ops + 3D SDK full
