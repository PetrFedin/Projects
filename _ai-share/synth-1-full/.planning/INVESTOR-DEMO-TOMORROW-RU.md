# Investor demo — пошагово на завтра (ops)

**Дата подготовки:** 2026-05-29 · **Проект:** Synth-1 / Workshop2 + B2B

---

## Быстрый старт (demo day — только сервер, без investor-show)

**Рекомендуется за 5–10 мин до встречи**, если полный prep уже проходили ранее:

```bash
cd /Users/petr/Projects/_ai-share/synth-1-full
npm run workshop2:investor-serve
```

Скрипт: merge `.env.e2e.investor.example` → `.env.local`, stop `:3123`, `dev:e2e:investor` **в фоне**, wait env-check **180s**, SS27 seed, проверка dossier HTTP.  
**Сервер остаётся после exit скрипта** — терминал можно закрыть, но **ноутбук должен оставаться включённым**.

PID и лог:

- `.planning/dev-e2e-investor.pid`
- `.planning/dev-e2e-investor.log`

Остановить сервер: `npm run dev:e2e:stop`

---

## Полный prep (за 30–40 мин до встречи)

```bash
npm run workshop2:investor-prep
```

Скрипт делает: merge env, stop `:3123`, dev в фоне, wait env-check, SS27 seed, signoff curls, `investor-show`, проверка **last-run failCount=0**.  
**Prep НЕ убивает сервер в конце** — после exit проверяется env-check ещё раз.

Быстрый prep без investor-show (сервер + seed только):

```bash
WORKSHOP2_INVESTOR_PREP_SKIP_SHOW=1 npm run workshop2:investor-prep
```

---

## Держать терминал открытым — когда нужно

| Режим | Команда | Терминал после exit |
|-------|---------|---------------------|
| **Фон (рекомендуется)** | `npm run workshop2:investor-serve` | Можно закрыть — Next.js detached |
| **Foreground** | `npm run dev:e2e:investor` | **Нельзя закрывать** — процесс умрёт |
| **Полный prep** | `npm run workshop2:investor-prep` | Можно закрыть — сервер в фоне |

Если запускали `dev:e2e:investor` в foreground и закрыли терминал → **ERR_CONNECTION_REFUSED** на `:3123`.  
Исправление: `npm run workshop2:investor-serve` или `npm run dev:e2e:investor:restart`.

---

## ERR_CONNECTION_REFUSED — troubleshooting

**Симптом:** браузер / curl не открывает `http://127.0.0.1:3123/...`

1. **Сервер не запущен** — самая частая причина после закрытия foreground-терминала.
   ```bash
   npm run workshop2:investor-serve
   ```
2. **Порт занят мёртвым процессом** — перезапуск:
   ```bash
   npm run dev:e2e:investor:restart
   ```
3. **Next ещё компилирует** — подождите 1–3 мин, смотрите лог:
   ```bash
   tail -f .planning/dev-e2e-investor.log
   ```
4. **demoMode=false** — env читается только при старте Next:
   ```bash
   curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/env-check | jq .
   # demoModeComputed должен быть true → иначе restart:
   npm run dev:e2e:investor:restart
   ```
5. **Проверка что процесс жив:**
   ```bash
   cat .planning/dev-e2e-investor.pid
   lsof -i :3123
   curl -sfS http://127.0.0.1:3123/api/workshop2/investor-demo/env-check
   ```

---

## Шаг 0 — Проверка после prep/serve (2 мин)

```bash
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/env-check | jq .
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '{demoMode,investorDemoReady,probes,qaDocPath,presentationTipsRu:(.presentationTipsRu|length)}'
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/status | jq '{investorDemoReady,blockingGatesRu,warningsRu}'
```

**Ожидание env-check:**

```json
{
  "WORKSHOP2_INVESTOR_DEMO_MODE": "true",
  "demoModeComputed": true
}
```

**Ожидание brief:**

```json
{
  "demoMode": true,
  "investorDemoReady": true,
  "qaDocPath": ".planning/INVESTOR-QA-RU.md",
  "presentationTipsRu": 18
}
```

**Ожидание status:** `investorDemoReady: true`, `blockingGatesRu: []`, `warningsRu` может содержать «Production keys: 0».

---

## Шаг 1 — SS27 seed (если prep уже был, опционально)

```bash
curl -s -X POST http://127.0.0.1:3123/api/workshop2/demo/apply-ss27-uat-seed | jq .
```

**Ожидание:**

```json
{
  "ok": true,
  "seededArticleIds": ["demo-ss27-01", "demo-ss27-02", "demo-ss27-03", "demo-ss27-04"],
  "messageRu": "SS27 UAT seed применён..."
}
```

---

## Шаг 2 — Publish gate

```bash
curl -s -X POST http://127.0.0.1:3123/api/workshop2/collections/SS27/publish-showroom-readiness \
  -H 'Content-Type: application/json' \
  -d '{"articleIds":["demo-ss27-01"]}' | jq .
```

**Ожидание:** `"ready": true`, `"ok": true`.

---

## Шаг 3 — Hub UAT

```bash
curl -s http://127.0.0.1:3123/api/workshop2/uat/ss27-checklist | jq '{autoProgressPct,checklistLinks:(.checklistLinks|length)}'
```

**Ожидание:** `autoProgressPct` — number (обычно ≥70 после seed).

---

## Шаг 4 — B2B pages HTTP

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3123/shop/b2b/checkout
curl -s -o /dev/null -w '%{http_code}\n' 'http://127.0.0.1:3123/shop/b2b/showroom?collection=SS27&article=demo-ss27-01'
```

**Ожидание:** `200` или `307` (redirect OK).

---

## Шаг 5 — Dossier smoke (ReferenceError guard)

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3123/brand/production/workshop2/c/SS27/a/demo-ss27-01
```

**Ожидание:** HTTP `200`. В браузере DevTools Console — **без** `ReferenceError` (ранее: `testId is not defined` в SmartRoutingPanel — исправлено Wave 59 pass).

Открыть в браузере и проверить Console:

http://127.0.0.1:3123/brand/production/workshop2/c/SS27/a/demo-ss27-01

---

## Шаг 6 — Full runner (если не через prep)

```bash
WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT=1 WORKSHOP2_INVESTOR_DEMO_SKIP_STAGING=1 npm run workshop2:investor-show
cat .planning/investor-demo-last-run.json | jq '{ok,failCount,passCount,summaryRu}'
```

**Ожидание:** `"ok": true`, `"failCount": 0`.

---

## Шаг 7 — UI URLs для ведущего (25 мин сценарий)

| # | URL |
|---|-----|
| Brief | http://127.0.0.1:3123/brand/production/workshop2/investor-brief |
| Hub SS27 | http://127.0.0.1:3123/brand/production/workshop2?w2col=SS27 |
| Dossier 01 | http://127.0.0.1:3123/brand/production/workshop2/c/SS27/a/demo-ss27-01 |
| Showroom | http://127.0.0.1:3123/shop/b2b/showroom?collection=SS27&article=demo-ss27-01 |
| Checkout | http://127.0.0.1:3123/shop/b2b/checkout |
| Rep portal | http://127.0.0.1:3123/shop/b2b/sales-rep-portal |

**Сценарий речи:** `.planning/INVESTOR-DEMO-SCRIPT-RU.md` (поля **Что говорить**).  
**Q&A:** `.planning/INVESTOR-QA-RU.md`.

---

## Если что-то FAIL

1. Лог dev: `.planning/dev-e2e-investor.log`
2. Перезапуск: `npm run workshop2:investor-serve` или `npm run dev:e2e:investor:restart`
3. `demoMode: false` → **обязательно** перезапуск dev (Next.js env only at boot)
4. Fallback без UI: показать `investor-demo-last-run.json` + Q&A doc

---

## Wave 59 (после встречи — не блокирует demo)

См. `.planning/WAVE-59-PLAN-RU.md`

**Commits:** по запросу product — этот sprint **без commit** (investor completion pass).
