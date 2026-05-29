# Инвесторский сценарий — RU Fashion OS (Workshop2 + B2B)

**Wave 58 · 25 мин · SS27 + JOOR/NuOrder native**  
**Роли:** ведущий (product/founder) — narrative; ops — терминал, API, честные disclaimer.  
**Base URL:** `http://127.0.0.1:3123` (или `WORKSHOP2_STAGING_PUBLIC_URL`)

---

## Подготовка (ops, до входа инвесторов)

**Обязательно:** Next.js подхватывает env **только при старте процесса**. Export в shell без перезапуска `dev:e2e` даёт `demoMode: false` на brief.

**Primary path (рекомендуется — one-command):**

```bash
npm run workshop2:investor-prep
```

Скрипт: merge `.env.e2e.investor.example` → `.env.local`, stop порта 3123, `dev:e2e:investor` в фоне, wait `env-check`, signoff, `investor-show`.

**Проверка после prep:**

```bash
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/env-check | jq .
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '.demoMode'
# ожидание: demoModeComputed: true, demoMode: true
```

**Вариант B — ручной dev (если prep уже создал .env.local):**

```bash
node scripts/wave58-restore-disk.mjs
npm run test:workshop2:unit   # обновляет data/workshop2-wave35a-unit-metrics.json
npm run dev:e2e:investor      # порт 3123, investor env встроен
# перезапуск с очисткой кэша:
npm run dev:e2e:investor:restart
# остановка:
npm run dev:e2e:stop
```

**Вариант C — только `.env.local` без prep:**

```bash
cp .env.e2e.investor.example .env.local
npm run dev:e2e:investor:restart
```

**Integration ceilings в dev:** при `WORKSHOP2_INVESTOR_DEMO_MODE=true` `readyForInvestorDemo` не блокирует localhost; альтернатива — wave58 probe ≥12 на диске. SS27 seed: `npm run db:seed:workshop2-ss27-dossiers` при необходимости fill %.

```bash
# human signoff (опционально в demo — не blocking):
bash scripts/workshop2-human-uat-signoff.sh http://127.0.0.1:3123
```

Проверка one-screen:

```bash
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq .
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/status | jq '{investorDemoReady,investorDemoMode,demoModeRelaxesHumanSignoff,blockingGatesRu,warningsRu}'
```

**Ожидание brief при готовности:** `investorDemoReady: true`, `humanSignoff.demoMode: true`, `unitTests.passing: true`, `blockingGatesRu: []`, `warningsRu` может содержать «keys=0» и relaxed signoff.

**Fallback если сервер не поднят:** показать `.planning/investor-demo-last-run.json`, `INVESTOR-DEMO-VS-LIVE-RU.md`, parity matrix; честно сказать «live UI недоступен — демо по артефактам и записи».

---

## Тайминг (25 мин)

| Мин | Блок | Шаги |
|-----|------|------|
| 0–3 | Brief + честность | 1–2 |
| 3–10 | Workshop2 SS27 | 3–8 |
| 10–18 | B2B native | 9–14 |
| 18–22 | Rep offline + 3D | 15–16 |
| 22–25 | Gates + Q&A | 17–18 |

---

## Шаг 1 — Investor brief (1 мин)

- **URL:** `/brand/production/workshop2/investor-brief`
- **Действие:** открыть read-only dashboard.
- **API:** `GET /api/workshop2/investor-demo/brief`
- **Ожидание:** JSON с `parityNativePct`, `probes.wave54`…`wave58`, `keysConfiguredCount`, `investorDemoReady`.
- **Сказать:** «Это не marketing slide — это live gates с диска и probes. Красный gate = не скрываем.»

---

## Шаг 2 — Demo vs live таблица (1 мин)

- **Документ:** `.planning/INVESTOR-DEMO-VS-LIVE-RU.md`
- **Действие:** ops показывает 3 строки: ЭДО, 3D, signoff.
- **Сказать:** «В demo режиме journal-only ACK — это не fake success в UI, это подписанный demoMode.»

---

## Шаг 3 — Hub SS27 + investor banner (2 мин)

- **URL:** `/brand/production/workshop2?w2col=SS27`
- **UI:** баннер «Режим демо инвестора», UAT checklist panel, cutover/SLA chips.
- **API:** `GET /api/workshop2/uat/ss27-checklist` → `autoProgressPct`
- **Сказать:** «Коллекция SS27 — investor flow: demo-ss27-01…04. UAT % — авто, human signoff отдельно.»

---

## Шаг 4 — Карточка demo-ss27-01 (2 мин)

- **URL:** `/brand/production/workshop2/c/SS27/a/demo-ss27-01`
- **UI:** dossier phase1, TZ fill %, этапы pipeline.
- **Сказать:** «Два SKU на брифе, один на материалах — видим вертикаль product data, не статичный mockup.»

---

## Шаг 5 — demo-ss27-02 и demo-ss27-03 (1 мин)

- **URL:** переключение артикулов в hub / breadcrumb.
- **Сказать:** «Линейка SS27 — 4 артикула для investor path; fill % различается честно.»

---

## Шаг 6 — Publish gate → showroom (2 мин)

- **API:** `POST /api/workshop2/collections/SS27/publish-showroom-readiness` body `articleIds: ["demo-ss27-01"]`
- **Ожидание:** `{ ready, messageRu }` — если gate блокирует, озвучить причину.
- **Сказать:** «Публикация в B2B showroom не обходится — gate как в JOOR linesheet publish.»

---

## Шаг 7 — ЭДО journal (demoMode) (2 мин)

- **API:** `POST /api/workshop2/edo/send` (из dossier CTA или curl)
- **Ожидание:** `{ ok, demoMode: true, journalId }` без live token — **сказать вслух:** «Сейчас demoMode — запись в журнал, не отправка в Контур.»
- **Live:** при `WORKSHOP2_KONTUR_DIADOC_TOKEN` — `configured: true`, реальный HTTP attempt.

---

## Шаг 8 — Hub integration probes (1 мин)

- **API:** `GET /api/workshop2/integration-probes` → `wave57PostFreezeLive`, `wave58InvestorShowReady`, `readyForInvestorDemo`
- **Сказать:** «Каждая волна — restore-disk + probe score, не ручной чеклист в Notion.»

---

## Шаг 9 — B2B Showroom SS27 (2 мин)

- **URL:** `/shop/b2b/showroom?collection=SS27&article=demo-ss27-01`
- **UI:** `B2bWorkshopChrome`, matrix panel, linesheet card.
- **iPad 1024×768:** тот же URL в landscape — sticky cart / matrix visible.
- **Сказать:** «NuOrder-плотность matrix order — native API, не iframe JOOR.»

---

## Шаг 10 — Matrix qty → cart (2 мин)

- **UI:** изменить qty в `b2b-matrix-order-grid`, дождаться batch save indicator.
- **API:** `POST /api/shop/b2b/cart/matrix`
- **Ожидание:** 200 + обновлённая корзина; MOQ подсказки RU при нарушении.

---

## Шаг 11 — Showroom → checkout (1 мин)

- **URL:** `/shop/b2b/checkout`
- **UI:** `B2bWholesaleCheckoutForm`, payment terms, delivery date, multi-brand split banner если несколько брендов.
- **Сказать:** «Checkout не disabled stub — wholesale PO path.»

---

## Шаг 12 — Submit order + chat event (2 мин)

- **API:** submit order → domain event `b2b_order` → contextual chat
- **Ожидание:** order id, `messageRu`; chat role labels RU.
- **Сказать:** «Горизонталь W2↔B2B: заказ виден в chip «B2B заказы» на артикуле.»

---

## Шаг 13 — Invoice stub / export (1 мин)

- **API:** `GET /api/shop/b2b/orders/B2B-001/invoice-stub`  
  `GET /api/shop/b2b/orders/export?tenantId=tenant-demo` (CSV)
- **Сказать:** «PDF pipeline ops — Playwright; сейчас HTML stub с честной подписью печати.»

---

## Шаг 14 — Sales rep portal (2 мин)

- **URL:** `/shop/b2b/sales-rep-portal`
- **UI:** matrix panel, commission preview, share link, offline banner.
- **API:** `GET /api/shop/b2b/rep/offline-pack?repId=rep-anna`
- **Сказать:** «Rep portal — JOOR attribution + SS27 campaign SS27::demo-ss27-01.»

---

## Шаг 15 — Offline → online sync (2 мин) **demo 30с**

1. DevTools → Network offline.
2. Rep portal: добавить qty / queue offline draft.
3. Banner: «N действий в IndexedDB (b2b-offline-db v1)».
4. Online → toast «Синхронизировано N действий…».
- **Сказать:** «Field rep story — очередь на устройстве, replay на cart API.»

---

## Шаг 16 — 3D panel (1 мин)

- **URL:** showroom с `B2b3dStreamPanel`
- **Env:** `WORKSHOP2_B2B_3D_DEMO_PREVIEW_URL` → badge **Демо-превью 3D**
- **Live:** Matterport keys → badge **Live SDK**
- **Сказать:** «3D не притворяемся live без ключей — badge различает.»

---

## Шаг 17 — Auto-gates status (2 мин)

- **API:** `GET /api/workshop2/investor-demo/status`
- **Поля:** `investorDemoReady`, `autoGatesPass`, `failingAutoGates`, `deadEndsRemaining`, `parityCoveragePct`
- **Сказать:** «investorDemoReady = auto gates И (human signoff ИЛИ WORKSHOP2_INVESTOR_DEMO_MODE).»

---

## Шаг 18 — One-command runner + Q&A (3 мин)

```bash
npm run workshop2:investor-show
# → .planning/investor-demo-last-run.json + screenshotChecklist placeholders
```

- **Сказать:** «После встречи ops присылает last-run JSON и 6 скринов из visual checklist.»
- **Q&A anchors:** parity 31 native, unit 1539+, wave58 probe ≥12, roadmap Wave 59 multi-brand live.

---

## iPad 1024×768 — экраны

| Экран | URL |
|-------|-----|
| Hub SS27 | `/brand/production/workshop2?w2col=SS27` |
| Dossier | `.../c/SS27/a/demo-ss27-01` |
| Showroom | `/shop/b2b/showroom?collection=SS27&article=demo-ss27-01` |
| Checkout | `/shop/b2b/checkout` |
| Rep | `/shop/b2b/sales-rep-portal` |
| Brief | `/brand/production/workshop2/investor-brief` |

---

## Чеклист ops после показа

- [ ] `investor-demo-last-run.json` — все шаги PASS или объяснены FAIL
- [ ] 6 screenshots — `.planning/workshop2-investor-visual-checklist.md`
- [ ] Human signoff journal при необходимости (не подменяет demo mode disclaimer)
- [ ] Запись: какие gates были demo vs live

---

*Связанные документы:* [INVESTOR-DEMO-VS-LIVE-RU.md](./INVESTOR-DEMO-VS-LIVE-RU.md) · [INVESTOR-FREEZE-WAVE55.md](./INVESTOR-FREEZE-WAVE55.md) · [workshop2-b2b-joor-parity-matrix.md](./workshop2-b2b-joor-parity-matrix.md)
