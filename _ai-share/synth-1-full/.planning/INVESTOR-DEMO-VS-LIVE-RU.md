# Demo vs Live — честная таблица (Wave 58)

**Обновлено:** 2026-05-29  
**Принцип:** UI никогда не показывает fake success. Если контур journal-only / demo — сказать вслух и показать badge.

| Функция | Demo сейчас (без prod keys) | Live с ключами | Честное сообщение UI |
|---------|----------------------------|----------------|----------------------|
| Workshop2 unit gate | `npm run test:workshop2:unit` ≥1445 PASS | CI + nightly | Hub chip: unit PASS/FAIL из brief API |
| SS27 dossier / TZ fill | PG или local seed, UAT % | PG prod + signoff ops+staging | UAT panel: «авто %» ≠ human signoff |
| Publish showroom gate | API `publish-showroom-readiness` | То же + live assortment | Rep portal chip: готов / gate блокирует |
| ЭДО (Контур) | `demoMode` + `journalId` без HTTP 2xx ACK | `WORKSHOP2_KONTUR_DIADOC_TOKEN` | «Демо-журнал ЭДО — не юридически значимый документ» |
| Честный ЗНАК | CSV / journal-only | `WORKSHOP2_MARKING_API_TOKEN` | «Регистрация в demo — journal, не ЦРПТ live» |
| B2B matrix → cart | Native API + local cart | PG + ERP export | Matrix: qty сохраняется; ошибка 409 multi-brand озвучить |
| B2B checkout wholesale | PO, paymentTermsRu, delivery date | Live credit hold + ERP | Checkout banner B2bWorkshopChrome demo mode |
| B2B order chat event | Domain event → chat stub | Webhook + Slack/email connectors | «Событие в журнале — не гарантия доставки в мессенджер» |
| 3D showroom | `WORKSHOP2_B2B_3D_DEMO_PREVIEW_URL` iframe | Matterport SDK + stream URL | Badge: **Демо-превью 3D** vs **Live SDK** |
| Rep offline queue | IndexedDB `b2b-offline-db` replay | То же + prod cart persistence | Banner: «N действий в очереди офлайн» |
| JOOR/NuOrder parity | 31/31 native scaffold | OAuth prod + inbound webhook | Parity matrix markdown — не fake «connected» |
| ACK archive S3 | Drill journal / stub path | `WORKSHOP2_ACK_ARCHIVE_S3_BUCKET` | Ops runbook: drill ≠ prod compliance до apply |
| PagerDuty / Sentry | Env или ops-applied JSON | Org applied checklist | Cutover dashboard: opsAppliedChecklist |
| Human SS27 signoff | `WORKSHOP2_INVESTOR_DEMO_MODE=true` bypass | ops + staging + product roles | status API: `humanSignoffComplete` |
| investorDemoReady | autoGates ∧ (signoff ∨ demo mode) | Все gates + real signoff | `GET /api/workshop2/investor-demo/status` |
| Investor brief dashboard | `GET .../investor-demo/brief` | То же на staging URL | Read-only page `/brand/production/workshop2/investor-brief` |

## Быстрая проверка перед залом

```bash
node scripts/wave58-restore-disk.mjs
npm run test:workshop2:unit
npm run workshop2:investor-show
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '{investorDemoReady,parityNativePct,probes}'
```

См. также: [INVESTOR-DEMO-SCRIPT-RU.md](./INVESTOR-DEMO-SCRIPT-RU.md), [INVESTOR-FREEZE-WAVE55.md](./INVESTOR-FREEZE-WAVE55.md).
