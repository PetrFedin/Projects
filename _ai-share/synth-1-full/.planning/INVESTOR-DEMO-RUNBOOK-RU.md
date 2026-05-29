# Investor demo — runbook (ops + агенты)

**Канон сценария:** [INVESTOR-DEMO-SCRIPT-RU.md](./INVESTOR-DEMO-SCRIPT-RU.md)  
**Артефакт прогона:** `.planning/investor-demo-last-run.json` (или `workshop2-investor-demo-last-run.json` — см. runner)

## Быстрый старт (перед встречей)

```bash
cd _ai-share/synth-1-full
npm run workshop2:investor-prep
```

Prep: merge env → stop :3123 → `dev:e2e:investor` → wait `env-check` → signoff → `investor-show` (без полного unit в CI).

Проверка demo mode (обязательно после старта Next):

```bash
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/env-check | jq '.demoModeComputed'
curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq '.demoMode'
# ожидание: true / true
```

Полный прогон gates (локально, ~5–15 мин с поднятым dev):

```bash
WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT=1 npm run workshop2:investor-demo:full
```

## Env-check

| Симптом | Причина | Действие |
|--------|---------|----------|
| `demoModeComputed: false` | Next стартовал без investor env | `npm run dev:e2e:investor:restart` или `workshop2:investor-prep` |
| `brief.demoMode: false` | то же + нет `WORKSHOP2_UNIT_TESTS_PASSING` | проверить `.env.local` из `.env.e2e.investor.example` |
| порт занят | старый e2e dev | `npm run dev:e2e:stop` или `npm run stop:stale-dev` из корня монорепо |

Merge env вручную:

```bash
node scripts/merge-investor-env-local.mjs
npm run dev:e2e:investor:restart
```

## Troubleshooting runner / last-run.json

| Поле / шаг | Не блокирует demo? | Комментарий |
|------------|-------------------|-------------|
| `probes.investorDemoReady: false` | часто да | wave46–50 — prod cutover; для встречи смотреть `investor-demo/status` API |
| `integration-probes` wave50 `ack_cron` | да | cron route для prod merge, не для localhost demo |
| `wave47` `e2e_smoke` | да | shell smoke отдельно от investor full |
| `screenshotChecklist[].captured: false` | да | опционально: `WORKSHOP2_INVESTOR_DEMO_VISUAL_QA=1` + Playwright visual |
| unit step SKIP | да | при `WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT=1` |

Если HTTP шаги FAIL при живом dev — лог `.planning/dev-e2e-investor.log`, повтор:

```bash
npm run dev:e2e:wait-ready
npm run workshop2:investor-show
```

## CI / smoke

- **`npm run smoke:fast`** (монорепо `npm run smoke`) включает **`check:investor-demo-contract`** — файлы, npm scripts, import merge в `dev-e2e-investor.mjs`.
- **`workshop2:investor-demo:full` в CI не запускается** — требует Next на :3123 и не укладывается в ci-fast; перед релизом демо — локально prep + full или human signoff.

## Связанные команды

| Команда | Назначение |
|---------|------------|
| `npm run dev:e2e:investor` | Next :3123 с investor + E2E env |
| `npm run workshop2:investor-prep` | one-command prep + show |
| `npm run workshop2:investor-demo:full` | полный runner (alias show + env flags) |
| `node scripts/wave58-restore-disk.mjs` | restore диск + цепочка wave57 |

*Обновляйте этот runbook при смене портов, API paths или флагов в `workshop2-investor-demo-full.mjs`.*
