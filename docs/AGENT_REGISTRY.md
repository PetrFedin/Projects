# Agent Registry — Synth-1

Единая модель для `app/agents/`: каждый агент должен иметь карточку перед расширением логики.

**В коде:** `app/agents/registry.py` — словарь `AGENT_REGISTRY` и статусы `AgentLifecycle`.

## Поля карточки

- `agent_id`, `capability`, `owner`
- `status`: `CORE` | `PHASE_2` | `EXPERIMENTAL` | `DEPRECATED`
- `invoked_by` (сервис/роут), `timeout`, `retry`, `fallback`
- `side_effects`, теги для логов

## Правила

- Вызов только через service/facade, не из HTTP-роутера напрямую.
- Ошибка агента не должна ронять core user journey без fallback.
- Новый агент: consumer в продукте + тест happy path + fallback.

Обновляйте таблицу по мере добавления агентов в `app/agents/`.
