# Workshop2 — SLO цели (RU defaults)

Wave 53 ops SLA dashboard читает этот файл; при отсутствии — defaults ниже.

## Цели

| Метрика | Порог |
| --- | --- |
| ACK p99 (ЭДО + ЧЗ) | **5000 ms** |
| B2B 3D error rate | **5%** |

## Источники данных

- `.planning/workshop2-integration-ack-journal.json` — latencyMs по kind `edo` / `marking`
- `.planning/workshop2-b2b-3d-session-journal.json` — sessions с `error: true`
- `WORKSHOP2_PROBE_LAST_OK_AT` — последний успешный probe-alert cron

## Fail-closed

Без journal entries метрики **не** подставляются fake values — p99 = null, error rate = 0% при 0 сессий.
