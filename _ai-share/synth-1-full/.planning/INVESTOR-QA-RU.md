# Investor Q&A — честные ответы (Wave 58/59)

**Контекст:** RU Fashion OS (Workshop2 + B2B wholesale). Demo на `http://127.0.0.1:3123` с `WORKSHOP2_INVESTOR_DEMO_MODE=true`.  
**Связанные документы:** [INVESTOR-DEMO-SCRIPT-RU.md](./INVESTOR-DEMO-SCRIPT-RU.md) · [INVESTOR-DEMO-VS-LIVE-RU.md](./INVESTOR-DEMO-VS-LIVE-RU.md)

---

## 1. Это уже production или только demo?

**Честно:** Сейчас investor show — **demo mode** на localhost/staging без live production keys. Auto-gates, UI, B2B flow и probes — реальный код; ЭДО, 3D stream и часть ACK — **journal-only / stub** без токенов. Live prod — Wave 59+ с keys и staging signoff.

## 2. Чем вы отличаетесь от JOOR / NuOrder?

**Честно:** Мы не iframe JOOR — **native B2B matrix + checkout + rep portal** в одном стеке с Workshop2 (PLM-lite → publish gate → showroom). Parity matrix ~31 native capability vs JOOR linesheet/order path; gaps (live OAuth prod, PDF billing cron) в roadmap Wave 59.

## 3. Почему `investorDemoReady=true`, а production keys = 0?

**Честно:** В demo mode keys **не blocking** — они в `warningsRu`, не в `blockingGatesRu`. Это осознанное решение: показать UX и gates без fake «всё подключено». Для live investor due diligence нужен отдельный staging run с keys checklist.

## 4. ЭДО реально работает с Контуром?

**Честно:** В demo — **POST → journalId**, без HTTP в Diadoc без `WORKSHOP2_KONTUR_DIADOC_TOKEN`. UI показывает `demoMode: true`. С токеном — fail-closed client есть, staging ACK — отдельный ops checklist.

## 5. 3D showroom — live Matterport?

**Честно:** Badge **«Демо-превью 3D»** при `WORKSHOP2_B2B_3D_DEMO_PREVIEW_URL`; **«Live SDK»** только с Matterport keys. Мы не рендерим fake live stream без ключей.

## 6. Offline rep sync — production-ready?

**Честно:** Phase 1 готов: IndexedDB `b2b-offline-db v1`, banner, sync toast, replay на cart API. **Conflict resolution (server wins)** — Wave 59 plan item #1. Для pilot field rep — demo 30с offline достаточен; для scale — нужен Wave 59.

## 7. Как вы доказываете качество кода?

**Честно:** `npm run test:workshop2:unit` — **1539+ passed / 0 failed** (wave35a metrics). Wave probes на диске (wave54–58), `investor-demo-last-run.json` после `npm run workshop2:investor-prep`. Не «100% coverage», но regression gates реальные.

## 8. Что если demo упадёт на встрече?

**Честно:** Fallback: `.planning/investor-demo-last-run.json`, brief API screenshot, `INVESTOR-DEMO-VS-LIVE-RU.md`, parity matrix. Ops заранее гоняет `npm run workshop2:investor-prep` — one-command, 0 FAIL marker.

## 9. Рынок РФ — зачем вам ЭДО и marking?

**Честно:** RU fashion wholesale требует **ЭДО + Честный ЗНАК** на handoff. Мы mirror в dossier + journal path; live CRPT/Kontur — staging keys, не блокирует demo narrative.

## 10. Multi-brand checkout — работает?

**Честно:** UI banner split по tenant/brand есть; полный prod multi-brand OAuth vault — Wave 59. Demo показывает single-tenant SS27 path честно.

## 11. Конкуренты уже в РФ — ваш moat?

**Честно:** Vertical **W2→B2B** (dossier fill % → publish gate → matrix order → rep offline) в одном product data graph. JOOR/NuOrder сильны в linesheet; мы — **RU compliance hooks + native hub**, не замена ERP.

## 12. Unit economics / pricing?

**Честно:** Не part of this demo. Product — B2B SaaS + ops services; pricing deck отдельно. Tech demo доказывает **ship readiness gates**, не финмодель.

## 13. Security / tenant isolation?

**Честно:** Brand tenant registry scaffold, B2B OAuth callback route, fail-closed API errors RU. Full prod pen-test и vault rotation — ops runbook Wave 57; demo не притворяется SOC2 certified.

## 14. Roadmap 6–12 месяцев?

**Честно:** Wave 59 — JOOR OAuth prod, rep conflict resolution, Playwright invoice PDF, ACK S3 lifecycle. Wave 60+ — multi-brand live, extended iPad E2E. См. `.planning/ROADMAP-V2-POST-FREEZE-RU.md`.

## 15. Что нужно от инвестора для следующего шага?

**Честно:** Staging keys budget (Kontur, marking, Matterport optional), 1–2 pilot brands для UAT signoff, ops slot для `workshop2-human-uat-signoff.sh` на staging URL. Demo mode — для **first meeting truth**, не для due diligence closure.

---

*Обновлено Wave 59 investor completion · API: `GET /api/workshop2/investor-demo/brief` → `qaDocPath`, `presentationTipsRu[]`*
