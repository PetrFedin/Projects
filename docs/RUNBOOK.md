# Synth-1 — runbook: репозиторий, CI, окружения

Единая точка правды: **где лежат приложения**, как их запускать, и **когда вы в demo/mock**, а не в «боевом» контуре.

## Два корня в одном репозитории

| Часть | Путь от корня репозитория | Технологии | Типичный запуск |
|--------|---------------------------|------------|------------------|
| **API (backend)** | `/` (`app/`, `pyproject.toml` / Poetry) | FastAPI | `uvicorn app.main:app --reload` (порт по умолчанию 8000) |
| **Web (frontend)** | `_ai-share/synth-1-full/` | Next.js | `npm install` и `npm run dev` из этой папки (порт 3000) |

Онбординг и любые скрипты CI должны явно указывать **оба** рабочих каталога: зависимости и команды **не** общие на корень и подпапку.

## CI и проверки

- **Backend:** из корня репозитория — установка Poetry, `pytest`, линтеры Python, если они настроены в вашем pipeline.
- **Frontend:** из `_ai-share/synth-1-full/` — `npm ci` / `npm install`, затем `npm run lint`, `npm run typecheck`, при необходимости `npm run test` и `npm run test:e2e`.

Сборка Docker или монорепо-оркестратор (если появится) должна копировать или монтировать оба дерева согласно этой таблице.

## Матрица окружений (env)

Ниже — **целевые профили**, а не полный список всех переменных. Детали фронта: `_ai-share/synth-1-full/src/lib/syntha-api-mode.ts`, `_ai-share/synth-1-full/src/lib/collections-api.ts`, `_ai-share/synth-1-full/src/lib/demo-data.ts`.

### A. Локальный UI без вызовов FastAPI (демо по умолчанию на фронте)

| Переменная | Рекомендуемое значение |
|------------|-------------------------|
| `NEXT_PUBLIC_USE_FASTAPI` | не задано или `false` |
| `NEXT_PUBLIC_API_URL` | можно не задавать; часть кода не ходит в сеть |

**Поведение:** UI и сценарии с локальными/зашитыми данными; многие модули не делают исходящие запросы к `localhost:8000`. Это **не** production-контур.

### B. Локальный «стек»: Next + FastAPI

| Где | Переменные |
|-----|------------|
| Frontend (`_ai-share/synth-1-full/.env.local`) | `NEXT_PUBLIC_USE_FASTAPI=true`, `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1` (или ваш URL с суффиксом `/api/v1`) |
| Backend (корень, `.env`) | `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS` с origin вашего Next (например `http://localhost:3000`) |

**Поведение:** фронт ходит в API там, где включена интеграция по флагу. Учтите: на стороне API **логин и часть доменов могут оставаться демо-заглушками** — см. раздел ниже.

### C. Продакшен (ориентир)

| Компонент | Минимум |
|-----------|---------|
| API | `ENVIRONMENT=production` (или `prod`), **не** дефолтный `SECRET_KEY`; реальная БД; CORS только доверенные origin. |
| Frontend | Публичный base URL API в `NEXT_PUBLIC_API_URL`; секреты платформы **только** server-side env, не префикс `NEXT_PUBLIC_`. |

## Где явно demo / mock (не путать с prod)

### Backend (FastAPI)

- **`POST /api/v1/auth/login/access-token`:** выдача JWT **без проверки пароля**; роль и организация выводятся из эвристик по строке username. См. `app/api/v1/endpoints/auth.py`.
- **`get_current_user`:** пользователь собирается из claims JWT, **без** обязательной проверки записи в БД. См. `app/api/deps.py`.
- Регистрация и часть сценариев могут быть помечены в коде как mock.

Пока это не заменено реальной аутентификацией и проверкой пользователя в БД, **любой стек с этим API — демо-контур с точки зрения безопасности**, даже если фронт в режиме `NEXT_PUBLIC_USE_FASTAPI=true`.

### Frontend (Next.js)

- **`NEXT_PUBLIC_USE_FASTAPI`:** при значении не `true` многие клиенты API возвращают локальные ответы (пример: `_ai-share/synth-1-full/src/lib/collections-api.ts`).
- **Демо-данные:** `_ai-share/synth-1-full/src/lib/demo-data.ts`, файлы с суффиксом `*-demo*`, `partner-demo-data`, сиды для презентаций.
- **`_ai-share/synth-1-full/src/lib/syntha-api-mode.ts`:** центральное описание режимов `USE_FASTAPI`, `USE_PRODUCTION_DATA_HTTP`, `ENABLE_BACKEND_HTTP`.

Итог: **prod-контур** — это не только «фронт звонит в API», но и **реальные** проверки учётных данных и данных на сервере. Матрица выше помогает не смешивать профили A и C.

## Связанные документы

- Корень репозитория: `README.md` (backend + ссылка сюда).
- Next-приложение: `_ai-share/synth-1-full/README.md`, `AGENTS.md` (UI и агенты Cursor).
