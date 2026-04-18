# Ops: `/api/ops/domain-events/health`

Эндпоинт отдаёт **HTTP 200** с телом, в котором отражено состояние шины событий и outbox. Для мониторинга недостаточно проверять только статус-код: смотрите **`severity`**, **`summaryCode`** и при необходимости **`alerts` / `degradedReasons`**.

## Поля верхнего уровня (кратко)

| Поле | Смысл |
| --- | --- |
| **`ok`** | Упрощённый флаг «нет деградации» (согласован с **`healthy`** в доменной модели). |
| **`status`** | **`ok`** \| **`warning`** \| **`critical`** — итоговая важность для алертов. |
| **`summaryCode`** | Канонический код состояния (см. ниже). |
| **`summary`** | Человекочитаемая строка для дашборда/лога. |

## `summaryCode` и что делать

Канонические подсказки для runbook/webhook совпадают с константой **`DOMAIN_EVENTS_SUMMARY_CODE_ACTION`** в коде:

| `summaryCode` | Типичная причина | Действие (кратко) |
| --- | --- | --- |
| **`OK`** | Все пороги в норме | Не пейджить. |
| **`CRIT_CIRCUIT_OPEN`** | Circuit breaker шины открыт | Сброс/разбор падающих handler’ов, логи. |
| **`CRIT_DLQ_HIGH`** | DLQ шины выше критического порога | Стабилизировать обработчики, затем контролируемый replay DLQ. |
| **`CRIT_FAILED_HIGH`** | Много failed в outbox | Drain cron, смотреть **`lastError`**, доступность downstream. |
| **`CRIT_PENDING_HIGH`** | Большой backlog pending в outbox | Рост очереди, безопасный drain, причина роста. |
| **`WARN_BACKLOG`** | Pending выше warn-порога | Мониторить тренд, проактивный drain. |
| **`WARN_DEGRADED`** | Есть сигналы деградации без критического кода выше | Разбор **`degradedReasons`**, превентивно. |

## Алертинг

- **Warning**: **`status === 'warning'`** или **`summaryCode`** из группы **`WARN_*`** — уведомление/тикет, не обязательно немедленный пейджер.
- **Critical**: **`status === 'critical'`** или **`summaryCode`** из группы **`CRIT_*`** — немедленная реакция on-call.

Пороги частично настраиваются env (см. **`evaluateDomainEventsHealth`** в **`src/lib/server/domain-events-health.ts`**: `EVENTS_HEALTH_*`).

## Контракт ответа (CI / интеграции)

Версия контракта, обязательные ключи JSON и заголовков — **`DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA`** в **`src/lib/server/domain-events-health.ts`**. Проверка из CI: **`docs/ci/DOMAIN_EVENTS_HEALTH_CI.md`**.

## Паритет «раннер ↔ прод»

Live-проверка в CI использует тот же скрипт **`scripts/ci/check-domain-events-health-contract.mjs`**, что и локально: те же ожидания по ключам/заголовкам, что и **`validateDomainEventsHealthFetchResponse`** в **`src/lib/server/domain-events-health.ts`**. Менять семантику контракта — в одном месте (типы/константы в **`domain-events-health.ts`**) и синхронно обновлять скрипт/тесты при изменении полей.
