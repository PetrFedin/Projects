# Synth-1 — runbook

## Два корня

| Часть | Путь |
|--------|------|
| API | Репозиторий корень (`app/`, Poetry) |
| Web | `_ai-share/synth-1-full/` (отдельный `package.json`) |

## CI

Файл **`.github/workflows/ci.yml`**: на push/PR в `main` параллельно backend (`poetry install --without ml`, `pytest tests/smoke tests/unit`) и frontend в `_ai-share/synth-1-full/`: `npm ci`, **`npm run lint`** (`eslint.config.cjs`, области `src/lib` + корневой `lib/`), **`npm run typecheck:ci`** (`tsconfig.ci.json`, подмножество до полного `npm run typecheck`):

| Область | Путь в репозитории |
|---------|---------------------|
| Корневые типы/утилиты фронта | `_ai-share/synth-1-full/lib/**/*.ts` |
| Маршруты и каталог | `src/lib/routes.ts`, `src/lib/products.ts` |
| Репозитории и поиск | `src/lib/repositories/**`, `src/lib/repo/searchRepo.ts`, `src/lib/repo/aiStylistRepo.ts` |
| Сокеты и серверные архивы | `src/lib/websocket-service.ts`, `src/lib/server/workshop2-dossier-metrics-archive.ts` |
| Fashion domain | `src/lib/fashion/**/*.ts` |
| Production / Цех | `src/lib/production/**/*.ts` |
| Чистая логика (utils) | `src/lib/logic/**/*.ts` |
| Доменные TS-типы | `src/lib/types/**/*.ts` |
| B2B feature flags / типы | `src/lib/b2b-features/**/*.ts` |

Полный проект: `npm run typecheck` (без `-p`) — пока не обязателен в CI.

**`npm run build`**.

Локально backend-тесты: `poetry run pytest tests/smoke tests/unit` из корня (импорт `app` задаётся через `pythonpath` в `pyproject.toml`).

## Окружения (кратко)

- **UI без API:** не задавать `NEXT_PUBLIC_USE_FASTAPI` или `false`. См. `_ai-share/synth-1-full/src/lib/syntha-api-mode.ts`.
- **UI + FastAPI:** `NEXT_PUBLIC_USE_FASTAPI=true`, `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1`; в корне `.env` с `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS`.

## Demo / mock (не путать с prod)

- **Backend:** `POST /api/v1/auth/login/access-token` не проверяет пароль; `get_current_user` строит пользователя из JWT (`app/api/v1/endpoints/auth.py`, `app/api/deps.py`).
- **Frontend:** при `USE_FASTAPI === false` часть API — локальные ответы (`collections-api.ts`, `demo-data.ts`).
