# MVP Contract — Synth-1

Источник правды: что **обязано** работать в демо и пилоте. Остальное — Phase 2 (код может быть, контракт — нет).

## Core API (бэкенд)

| Endpoint | Назначение |
|----------|------------|
| `GET /health`, `GET /api/v1/health` | Готовность |
| `POST /api/v1/auth/login/access-token` | Вход |
| `GET /api/v1/dashboard/` | KPI |
| `GET /api/v1/search?q=` | Поиск |
| `GET /api/v1/brand/profile/{id}` | Профиль бренда |
| `GET /api/v1/brand/dashboard/{id}` | KPI бренда |
| `GET /api/v1/brand/integrations/status/{id}` | Статус интеграций |

Логистика — опционально для демо, если показываете сценарий доставки.

## Режимы

- **Без внешних ключей:** stub/demo ответы, UI не падает.
- **С ключами:** реальные вызовы там, где подключено.

## Изменение контракта

Любой новый core-endpoint: строка здесь + тест + fallback в demo-режиме.

## Быстрая проверка (pytest)

```bash
./scripts/run-core-smoke.sh
# или: poetry run pytest tests/ -m smoke_core
```
