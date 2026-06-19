# Wave 59 — Plan (RU)

**Статус:** plan / starter stub  
**Не блокирует:** investor demo Wave 58 (localhost demo mode)  
**Цель:** rep offline phase 2 + prod integrations после investor freeze

---

## Контекст

Wave 58 закрыл investor show path: prep, brief, Q&A, SS27 seed, IndexedDB v1 queue, demo mode gates.  
Wave 59 — **production hardening** и field-rep scale без изменения demo narrative.

---

## P0 — Rep offline IndexedDB conflict resolution

### Проблема

`B2bRepOfflineSyncClient` (Wave 57/58) пишет очередь в `b2b-offline-db v1` и replay при `online`.  
При расхождении local vs server qty **нет merge policy** — item либо остаётся в queue, либо silently fail POST.

### Решение (server-wins)

| Шаг | Действие |
|-----|----------|
| 1 | При replay POST получить server cart snapshot (`GET /api/shop/b2b/cart`) |
| 2 | Сравнить `payload` queue item с server line по `skuId` + `size` |
| 3 | **Conflict** если server qty ≠ local и server `updatedAt` > local `createdAt` |
| 4 | Policy **server-wins**: drop local item, emit toast RU «Конфликт: применена серверная qty» |
| 5 | Journal event `b2b_offline_conflict_resolved` для audit |

### Файлы (target)

- `src/lib/production/workshop2-rep-offline-conflict.ts` — pure merge (stub Wave 59 starter)
- `src/components/shop/b2b/B2bRepOfflineSyncClient.tsx` — wire replay через conflict resolver
- `src/lib/production/__tests__/workshop2-rep-offline-conflict.test.ts`

### Acceptance

- Unit: server-wins когда server newer
- Unit: local wins replay когда server older / missing line
- E2E (Wave 59b): offline edit → server edit → online → toast + correct cart

---

## P0 — JOOR OAuth prod checklist

| # | Item | Env / artifact | Verify |
|---|------|----------------|--------|
| 1 | OAuth client prod | `WORKSHOP2_B2B_OAUTH_JOOR_CLIENT_ID`, `WORKSHOP2_B2B_OAUTH_JOOR_CLIENT_SECRET` | staging signoff |
| 2 | Token URL live | `WORKSHOP2_B2B_OAUTH_TOKEN_URL` | curl token exchange |
| 3 | Redirect URI prod | `https://{tenant}/api/shop/b2b/inbound/oauth/callback` | JOOR app config |
| 4 | Inbound webhook prod | `WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET` + HTTPS URL | POST test event |
| 5 | Parity matrix update | `.planning/workshop2-b2b-joor-parity-matrix.md` | 31 ✓ → live OAuth line |
| 6 | Investor Q&A refresh | `.planning/INVESTOR-QA-RU.md` §2, §6 | honest live vs demo |

**Не делать в demo mode:** fake «connected» badge без token.

---

## P1 — Playwright invoice PDF cron

- Ops cron: `scripts/workshop2-b2b-invoice-pdf-cron.mjs` (plan)
- Playwright: generate PDF from checkout confirmation
- S3 upload + ACK journal (Wave 54 pattern)

---

## P1 — ACK S3 lifecycle on prod

- Apply lifecycle rule 7y on prod bucket (Wave 54 scaffold)
- Audit log: `ack_archive_lifecycle_applied`

---

## P1 — 3D SDK full + iPad E2E

- Live stream provider credentials (не iframe stub)
- Extended Playwright: rep portal + matrix on iPad viewport

---

## P2 — Wave 59 probe + restore-disk

| Artifact | Purpose |
|----------|---------|
| `scripts/wave59-restore-disk.mjs` | Chain wave58 artifacts + conflict module |
| Probe field `wave59RepSyncReady` | ≥8 checks (conflict, JOOR env, PDF cron file) |
| `workshop2-wave59-rep-sync.test.ts` | Unit gate ≥10 tests |

Target probe in `GET /api/workshop2/integration-probes` → `wave59RepSyncReady`.

---

## Порядок execution (рекомендуемый)

1. **Conflict resolver** (pure TS + unit) — vertical slice, no prod keys
2. Wire into `B2bRepOfflineSyncClient` replay loop
3. JOOR prod keys staging signoff (human gate)
4. PDF cron + ACK lifecycle (ops)
5. Probe + restore-disk

---

## Связи horizontal / vertical

```
Workshop2 dossier → publish gate → B2B showroom
                                      ↓
                              Rep portal offline queue (IDB)
                                      ↓
                              Wave 59 conflict merge → cart API
                                      ↓
                              JOOR OAuth export (prod keys)
```

---

## Оценка готовности (plan quality)

| Item | /10 |
|------|-----|
| Conflict resolution spec | 9.2 |
| JOOR prod checklist | 9.0 |
| Probe/restore pattern | 9.1 |
| Investor demo non-regression | 9.5 (Wave 59 после demo) |

---

*Wave 59 starter stub: `workshop2-rep-offline-conflict.ts` + unit test — server-wins merge.*
