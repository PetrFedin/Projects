# Runway CI / E2E

## Рекомендуемые команды

| Сценарий | Команда |
|----------|---------|
| **Локально, мало RAM (рекомендуется)** | `npm run test:e2e:runway:stable` |
| Prod build через Playwright webServer | `npm run test:e2e:runway:prod` |
| Dev server (отладка, нужен ~8 GB heap) | `npm run test:e2e:runway` |
| CI (GitHub Actions) | `npm run test:e2e:runway:ci` |
| Unit + content + doctor | `npm run deploy:runway-check` |
| Pre-deploy локально | `npm run pre-deploy:runway:local` |

## Почему prod build для E2E

`dev:e2e` компилирует маршруты on-demand — на машинах с ≤16 GB RAM возможны **SIGKILL/OOM** и таймауты `data-runway-ready`.

`test:e2e:runway:prod` / `:stable` поднимают **`next start`** из `.next-e2e` (копия `.next-isolated`), без runtime compile.

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `RUNWAY_E2E_SKIP_BROWSER_WARM=1` | Пропуск browser warm в setup (экономия RAM; включено в prod/stable скриптах) |
| `PLAYWRIGHT_RUNWAY_USE_BUILD=0` | Принудительно dev:e2e (только `test:e2e:runway`) |
| `RUNWAY_E2E_CLEAN=1` | Перед stable — `npm run clean:runway-caches` |
| `PLAYWRIGHT_E2E_PORT` | Порт webServer (default `3123`) |
| `PLAYWRIGHT_SKIP_WEBSERVER=1` | Внешний сервер уже запущен |

## Low-RAM workflow

```bash
# Первый раз или после больших изменений
npm run build:isolated

# Стабильный прогон (0 failed — цель)
npm run test:e2e:runway:stable

# При странных 500 / stale cache
RUNWAY_E2E_CLEAN=1 npm run test:e2e:runway:stable
```

Ожидаемое время: ~5–15 мин (зависит от наличия `.next-isolated`).

## Структура Playwright

- `playwright.runway.config.ts` — projects: `runway-setup` → `runway-chromium` → `runway-a11y`
- `e2e/runway.setup.ts` — HTTP warm + optional browser warm
- `e2e/runway.spec.ts` — функциональные сценарии (3 hero SKU, embed, playlist, cart)
- `e2e/runway-a11y.spec.ts` — axe (зависит от chromium suite)

Setup устойчив к transient 500/compile через `isNextCompileResponse` retry.

## Демо-ассеты (Wikimedia CC)

```bash
npm run download:runway-assets
```

- Скрипт `scripts/download-runway-demo-assets.mjs` резолвит URL через Commons API и скачивает JPEG/WebM.
- Для MP4-комpanion нужен **ffmpeg** (локально `brew install ffmpeg` или devDependency `ffmpeg-static`, подтягивается при `npm install`).
- Без ffmpeg остаются WebM-файлы; `validate-runway-content` пройдёт, если `.mp4` уже на диске.
