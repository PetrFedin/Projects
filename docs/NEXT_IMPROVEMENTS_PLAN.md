# План следующих улучшений Synth-1

Приоритизированный список. Выполнять по фазам с проверкой после каждого шага.

---

## Фаза A: Стабилизация (низкий риск)

### A1. Починить падающие тесты ✅
- **test_academy_api** — KeyError 'id' в ответе POST /academy/modules. Нужно выровнять схему ответа.
- **test_production_plm** — помечен skip (PLM schema mismatch). После выравнивания API — снять skip.
- Запустить `pytest tests/ -v` и добиться зелёного статуса критичных тестов.

### A2. Убрать устаревший префикс /ai-intelligence ✅
- Сейчас: два роута — `/ai` и `/ai-intelligence` (deprecated).
- Поискать в synth-1 фронте вызовы `/ai-intelligence/*`.
- Если нет — удалить `include_router(..., prefix="/ai-intelligence")` из routes.py.

### A3. Закрыть TODO/FIXME в app/ (частично)
- auth, rule_engine: уточнены как mock/stub.
- Остальные (~15): placeholders для будущей реализации (embeddings, ATS, Ozon API и т.д.) — оставлены.

---

## Фаза B: Наблюдаемость и качество

### B1. Включить ENABLE_ENDPOINT_STATS ✅
- Добавлено в .env.example: `ENABLE_ENDPOINT_STATS=false` (включить для сбора статистики).
- Собрать 1–2 недели логов, потом принять решение по неиспользуемым эндпоинтам.

### B2. Расширить CI
- `ruff check` и `ruff format` уже в CI.
- Добавить `mypy --no-error-summary` для типов (опционально).
- Убедиться, что `pip audit` уже в пайплайне (есть).

### B3. Обновить ARCHITECTURE.md
- Сейчас упоминает lib/repositories, Firebase — это synth-1 (фронт).
- Добавить секцию Backend: FastAPI, SQLAlchemy async, Repository Pattern, RBAC.

---

## Фаза C: Безопасность и продуктивность ✅

### C1. CORS и rate limiting ✅
- Проверить CORS (allowed_origins) для прода.
- Добавить rate limit на чувствительные эндпоинты (auth, quota, ai/task).

### C2. Синхронизация synth-1
- synth-1 — 4 GB, свой .git. Решить: submodule или отдельный репо.
- Пока: добавить `synth-1/` в .cursorignore вручную (снижение нагрузки на AI).

### C3. Документация API
- Проверить, что OpenAPI-описание (/docs) актуально.
- Добавить примеры для ключевых эндпоинтов (request/response).

---

## Фаза D: Стратегические (позже)

### D1. Аудит 56 эндпоинтов
- После сбора endpoint stats — составить список неиспользуемых.
- Пометить deprecation или вынести в отдельные feature-flags.

### D2. Миграции БД
- Проверить состояние Alembic.
- Добавить миграции для изменений моделей (если есть).

### D3. Performance
- N+1 в repositories.
- Кэширование тяжёлых запросов (Redis, если уже есть REDIS_URL).

---

## Порядок выполнения (рекомендуемый)

1. **A1** — тесты (блокирует уверенные рефакторинги)
2. **A2** — удаление дубликата AI-роута
3. **B1** — endpoint stats
4. **A3** — часть TODO
5. **B2** — CI
6. **B3** — ARCHITECTURE

---

---

## Выполнено (2026-03)

- **EmbeddingsSearch**: Подключен к clip_backend (CLIP+FAISS или keyword fallback).
- **Health check**: Расширен — статус AI (CLIP), DB.
- **ARCHITECTURE.md**: Расширена секция Backend (AI, Feedback Loop, Integrations).
- **MemoryManager**: In-memory fallback для store/get/summarize.
- **AI RAG**: Добавлен endpoint `GET /ai/rag-search` для семантического поиска по документам.
- **TaskRequest**: Добавлен example для OpenAPI.

*Создано 2026-03. Обновлять по мере выполнения.*
