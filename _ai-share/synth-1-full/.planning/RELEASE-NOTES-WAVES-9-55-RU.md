# Release Notes — Workshop2 Waves 9–55 (RU)

Консолидированный changelog для investor handoff / due diligence. Детали по волнам — `.planning/PROJECT-STATUS-RU.md`.

## Waves 9–20 — RU maturity

- RU horizontal connectivity, API error coverage, SS27 UAT scaffold
- B2B JOOR/NuOrder parity matrix (31 native ✓)
- Module health, dead-ends audit, investor readiness probes

## Waves 28–34 — Staging live

- Dead-end fixes, PG-only brand messages, domain events sync
- Staging contract mode, integration ceilings honesty
- Live harness: Kontur ЭДО, ЧЗ, MES, ERP stubs fail-closed

## Waves 35–38 — Prod readiness + integrations

- SS27 human UAT signoff API (`ops` + `staging`)
- B2B OAuth inbound (authorize + token exchange)
- MES floor + factory ERP reverse sync + Genkit sketch gate
- MoySklad, factory registry, linkedPaths integration APIs

## Waves 39–44 — Platform + investor demo

- Performance budget, logistics handoff, MoySklad journal
- iPad E2E (1024×768), investor demo mode, labeled ЭДО/ЧЗ demo ACK
- Deep parity (matrix batch, linesheet share, order amendments)
- Live staging harness, 3D embed, one-command `investor-demo-full`

## Waves 45–48 — PG ACK + ship

- PG ACK persistence (edo/marking), ack-status routes
- ACK export/replay, OAuth rotation journal
- Staging keys panel, 3D SDK script handshake, Sentry real hook
- Vault OAuth webhook, 3D SLA, ACK S3 archive, probe-alert

## Waves 49–52 — Prod live cutover

- Production `.env.production.ru.example`, keys checklist
- Brand tenant registry, rep brand switcher, merge-assist (no auto-commit)
- Matterport adapter, Sentry test fire, cutover dashboard
- Human signoff gate (ops+staging), probe-prod cron workflow

## Waves 53–54 — SLA + prod hardening

- Ops SLA dashboard, B2B orders CSV export by tenantId
- Invoice stub journal + PG migration `022_workshop2_b2b_invoice`
- CDN routing doc, probe escalation (PagerDuty + Sentry)
- ACK S3 lifecycle apply (dry-run), quarterly restore drill
- Performance budget pass/fail, probe-prod daily/hourly cron

## Wave 55 — Investor freeze

- **Release notes** (этот файл) + `INVESTOR-FREEZE-WAVE55.md` snapshot
- Git tag scaffold: `scripts/workshop2-investor-freeze-tag.sh` → `investor-freeze-wave55`
- Human signoff gate **ops + product** для `wave55InvestorFreezeReady`
- Cutover dashboard поле `wave55FreezeReady`
- B2B invoice **HTML printable stub RU** (не fake PDF binary)
- ACK restore drill → `.planning/workshop2-ack-restore-drill-last.json`
- Ops checklist PagerDuty+Sentry applied in org (ручные галочки)
- Probe `wave55InvestorFreezeReady` ≥10, `wave55-restore-disk.mjs`

## Demo commands

```bash
node scripts/wave55-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:investor-demo:full
WORKSHOP2_INVESTOR_DEMO_WAVE55_FREEZE=1 npm run workshop2:investor-demo:full
node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123
bash scripts/workshop2-investor-freeze-tag.sh
curl -s http://localhost:3123/api/workshop2/integration-probes | jq '{w54:.wave54ProdHardeningReady,w55:.wave55InvestorFreezeReady}'
```
