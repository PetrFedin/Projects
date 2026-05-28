# Domain events health — CI и переменные

Скрипт **`npm run check:domain-events-health-contract`** (входит в **`npm run check:contracts`** и в **`npm run check:contracts:ci`**) может дергать живой **`GET`** по URL и сверять JSON/заголовки с контрактом.

В монорепо **`ci-heavy`** (полный Playwright verification + API) дополнительно запускается на **`push` в ветку `main`** (если сработал path-filter workflow), на **`schedule`**, по **`workflow_dispatch`** и по лейблу **`ci-heavy`** на PR — см. **`.github/workflows/synth-1-full-ci.yml`**.

## Поведение по умолчанию (push/PR)

- **`DOMAIN_EVENTS_HEALTH_URL` не задан** → live-probe **не выполняется**, в логе событие **`check_skipped`**, **exit 0**. Остальные guard-ы из **`check:contracts`** выполняются как обычно.
- Явный пропуск: **`SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK=1`**.

## Строгий режим (только когда URL реально доступен из раннера)

- **`DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1`** и **нет** URL → **`config_error`**, **exit 1** (для gated job / прод-подобного CI).
- В **`.github/workflows/synth-1-full-ci.yml`** (монорепо) и **`_ai-share/synth-1-full/.github/workflows/ci.yml`** (standalone) шаг *Live domain-events health contract* выполняется **только если** в настройках репозитория задана **Actions variable** **`DOMAIN_EVENTS_HEALTH_URL`** (непустая строка). В этом шаге всегда выставляется **`DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1`**.

## Секреты и переменные (GitHub)

| Имя | Тип | Назначение |
| --- | --- | --- |
| **`DOMAIN_EVENTS_HEALTH_URL`** | Repository **variable** | Полный URL, например `https://…/api/ops/domain-events/health`. Пусто → шаг не запускается. |
| **`DOMAIN_EVENTS_HEALTH_SECRET`** | Repository **secret** (опционально) | Bearer для защищённого endpoint; если эндпоинт без auth — можно не задавать. |

Паритет с «что валидирует CI» и кодом приложения: метаданные контракта и коды ошибок — **`SOURCE_OF_TRUTH.md`** и **`src/lib/server/domain-events-health.ts`**.

## Локальная диагностика

- Формат вывода: **`DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT=pretty`** или **`json`**.
- Typed-прогон: **`npm run check:domain-events-health-contract:typed`** (нужен **`tsx`**).
