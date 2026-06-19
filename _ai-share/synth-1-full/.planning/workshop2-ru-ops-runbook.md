# Workshop2 RU — ops runbook (one-pager)

Краткий чеклист для staging, investor demo и human UAT signoff.

## 1. Поднять staging

```bash
cp .env.staging.live.ru.example .env.local
# Заполните URL + токены из кабинетов Контур / ЦРПТ (см. комментарии в example)
node scripts/workshop2-pg-staging-up.mjs
npm run dev:e2e
```

## 2. Live harness + verify

```bash
npm run workshop2:staging-live-verify
# → .planning/workshop2-staging-live-verify.json
# configured:true при заданном URL; HTTP 401/403 без ключа = OK (fail-closed)
curl -s http://localhost:3000/api/workshop2/staging/live-harness | jq '.items[:3]'
```

## 3. Integration probes

```bash
curl -s http://localhost:3000/api/workshop2/integration-probes | jq '{
  wave37StagingMobile,
  wave36ReleaseReady,
  wave35bProdReadiness
}'
```

## 4. PG gate (strict на main)

```bash
WORKSHOP2_PG_GATE_REQUIRED=true bash scripts/ci-workshop2-pg-only-gate.sh
```

## 5. Staging signoff + investor demo

```bash
npm run workshop2:staging-signoff
# → .planning/workshop2-staging-signoff.json
./scripts/workshop2-investor-demo.sh
```

## 6. Human UAT signoff (SS27)

```bash
curl -s http://localhost:3000/api/workshop2/uat/ss27-checklist | jq '{readyForHumanSignoff, autoProgressPct}'
curl -s -X POST http://localhost:3000/api/workshop2/uat/ss27/signoff \
  -H 'Content-Type: application/json' \
  -d '{"role":"staging","signedBy":"ops-lead","notes":"Wave37 staging verified"}' | jq
```

Шаги для человека: [.planning/workshop2-uat-ss27-human-steps.md](workshop2-uat-ss27-human-steps.md)

## 7. ЭДО / ЧЗ staging curl (fail-closed)

```bash
# ЭДО send — journal + HTTP (без fake sign)
curl -s -X POST http://localhost:3000/api/workshop2/edo/send \
  -H 'Content-Type: application/json' \
  -d '{"collectionId":"SS27","articleId":"demo-ss27-01"}' | jq '{ok,configured,journalId,httpStatus,messageRu}'

# ЧЗ register-order (article path)
curl -s -X POST http://localhost:3000/api/workshop2/articles/SS27/demo-ss27-01/marking/register-order \
  -H 'Content-Type: application/json' \
  -d '{"markingRequired":true,"gtin":"04601234567890"}' | jq '{ok,configured,journalId,httpStatus}'
```

## 8. B2B mobile smoke (rep + buyer)

- Rep: `/shop/b2b/sales-rep-portal` — bottom nav, quick actions, cart badge
- Buyer: `/shop/b2b/showroom?collection=SS27&article=demo-ss27-01` — sticky cart, swipe grid

## 9. Unit suite (обязательно перед handoff)

```bash
npm run test:workshop2:unit
npx jest src/lib/production/__tests__/workshop2-wave37-staging-mobile.test.ts
npx jest src/lib/production/__tests__/workshop2-wave45-pg-ack-signoff.test.ts
```

## 10. PG ACK queries (Wave 45)

После `edo/send` или `marking/register-order` ACK переживает рестарт (PG или `data/workshop2-*-ack-journal.json`):

```bash
curl -s "http://localhost:3000/api/workshop2/edo/ack-status?collectionId=SS27&articleId=demo-ss27-01" | jq '{latest, history: .history|length}'
curl -s http://localhost:3000/api/workshop2/articles/SS27/demo-ss27-01/marking/ack-status | jq '.latest'
```

PG-only SQL:

```sql
SELECT status, http_status, external_ref, updated_at FROM workshop2_edo_ack ORDER BY updated_at DESC LIMIT 5;
SELECT status, http_status, external_ref, updated_at FROM workshop2_marking_ack ORDER BY updated_at DESC LIMIT 5;
```

Investor demo: `demoMode` только без live credentials при `WORKSHOP2_INVESTOR_DEMO_MODE=true` — без fake gov ACK.

## 11. Human signoff gate (Wave 45)

`investorDemoReady` = `false` пока ops **и** staging не подписали (unless `WORKSHOP2_INVESTOR_DEMO_MODE=true`):

```bash
curl -s -X POST http://localhost:3000/api/workshop2/uat/ss27/signoff \
  -H 'Content-Type: application/json' -d '{"role":"ops","signedBy":"ops-lead"}' | jq '.humanSignoffComplete'
curl -s -X POST http://localhost:3000/api/workshop2/uat/ss27/signoff \
  -H 'Content-Type: application/json' -d '{"role":"staging","signedBy":"qa-lead"}' | jq '.humanSignoffComplete'
npm run workshop2:staging-signoff
```

**Коммиты:** вручную по [.planning/COMMIT-GROUPS-WAVES-9-27.md](COMMIT-GROUPS-WAVES-9-27.md) — агент не коммитит автоматически.

## 12. E2E lifecycle + smoke (Wave 47)

| Команда | Назначение |
|---------|------------|
| `npm run dev:e2e` | E2E dev на `:3123`, dist `.next-e2e` |
| `E2E_CLEAR_CACHE=1 npm run dev:e2e` | Полная очистка `.next` + `.next-e2e` перед стартом |
| `npm run dev:e2e:stop` | Освободить порт 3123 |
| `npm run dev:e2e:restart` | stop + dev:e2e; с `E2E_RESTART_CLEAN=1` — rm `.next-e2e` |
| `npm run workshop2:e2e-smoke` | curl health + investor-demo/status + probes (exit 0 если сервер up) |

### investorDemoReady (demo mode vs real signoff)

| Режим | Условие | `investorDemoReady` |
|-------|---------|---------------------|
| **Demo** | `WORKSHOP2_INVESTOR_DEMO_MODE=true` | `true` если auto-gates pass (без human signoff) |
| **Real signoff** | demo mode **off** | `true` только после ops **и** staging POST `/uat/ss27/signoff` |
| **Проверка** | — | `GET /api/workshop2/investor-demo/status` → `investorDemoReady`, `humanSignoffComplete`, `failingAutoGates` |

Без live Kontur/ЧЗ credentials допустим demo mode; **fake gov ACK запрещён**.

## 15. Production vault injection (Wave 52)

Инжекция live-ключей в production **без коммита секретов** в git:

| Шаг | Действие |
|-----|----------|
| 1 | Шаблон: `.env.production.ru.example` (Matterport, Kontur, CRPT, MES, ERP, S3 ACK, Sentry, OAuth, multi-brand JSON) |
| 2 | Скопировать ключи в vault / Vercel / K8s secrets — имена 1:1 как в example |
| 3 | `npm run workshop2:production-keys-checklist` → `.planning/workshop2-production-keys-status.json` |
| 4 | Deploy → `node scripts/workshop2-probe-alert.mjs "$WORKSHOP2_STAGING_PUBLIC_URL"` |
| 5 | Human signoff на реальном URL: `bash scripts/workshop2-human-uat-signoff.sh "$WORKSHOP2_STAGING_PUBLIC_URL"` |
| 6 | `GET /api/workshop2/cutover-dashboard` → `cutoverReady: true` (demo mode **off**) |

**Matterport + gov на prod:** `WORKSHOP2_MATTERPORT_*`, `WORKSHOP2_KONTUR_*`, `WORKSHOP2_MARKING_*` — без них 3D/ЭДО/ЧЗ остаются fail-closed 503, не demo journal.

**Merge assist (без auto-push):** `bash scripts/workshop2-merge-assist.sh` — [.planning/workshop2-merge-assist-checklist.md](workshop2-merge-assist-checklist.md)

## 14. Disaster recovery — PG ACK replay drill (Wave 51)

Восстановление compliance-событий после сбоя PG или потери chat thread:

```bash
# 1) Убедитесь, что ACK rows есть (edo/send или marking/register-order ранее)
curl -s "http://localhost:3123/api/workshop2/edo/ack-status?collectionId=SS27&articleId=demo-ss27-01" | jq '.latest'

# 2) Idempotent replay → domain events + chat [compliance]
curl -s -X POST http://localhost:3123/api/workshop2/integrations/ack-replay \
  -H 'Content-Type: application/json' \
  -d '{"kind":"edo","collectionId":"SS27","articleId":"demo-ss27-01"}' | jq '{ok,replayed,idempotentHit}'

# 3) Полный drill (edo + marking + events probe)
npm run workshop2:ack-replay-drill
# → .planning/workshop2-ack-replay-drill.json
```

| Шаг | Критерий green |
|-----|----------------|
| ack-replay POST | `ok:true`, `replayed:true` или `idempotentHit:true` |
| drill script | exit 0, report `ok:true` |
| PG restore | после миграции 021 — `GET .../ack-status` показывает latest row |

**Зачем:** ops может восстановить audit trail ЭДО/ЧЗ без повторного HTTP к Kontur/CRPT.

## 17. Квартальный ACK restore drill — prod (Wave 57)

Ежеквартально на production после change window:

```bash
node scripts/workshop2-ack-restore-drill-quarterly.mjs --prod
# → .planning/workshop2-ack-restore-drill-last.json (prodMode + prodDrill: true, summaryRu)
```

| Шаг | Критерий |
|-----|----------|
| `--prod` | `prodDrill: true` в last JSON + summaryRu на русском |
| replay | exit 0, ack-replay idempotent |
| compliance | сохранить last JSON в org journal / ticket |

**Ops checklist org-applied (Wave 57):**

```bash
curl -s -X POST http://localhost:3123/api/workshop2/ops/mark-applied \
  -H 'Content-Type: application/json' \
  -d '{"appliedBy":"ops-lead","notesRu":"PagerDuty+Sentry wired in org"}' | jq
node scripts/workshop2-wave55-ops-applied-checklist.mjs
```

## 13. Staging live verify — green criteria (Wave 47)

`npm run workshop2:staging-live-verify` → `.planning/workshop2-staging-live-verify.json`

| Критерий | Green |
|----------|-------|
| `report.ok` | `true` |
| Kontur URL | заполнен (не `YOUR-`) |
| ЧЗ URL | заполнен |
| HTTP probe | 401/403/503 = fail-closed OK без token; network error = fail |
| Keys checklist | `npm run workshop2:staging-keys-checklist` exit 0 когда `.env.staging.live.ru` полный |
