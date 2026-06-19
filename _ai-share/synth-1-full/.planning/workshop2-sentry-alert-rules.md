# Workshop2 — Sentry alert rules (RU)

## 5xx integration routes

1. Sentry → Alerts → Create Alert → Issues
2. Filter: `transaction` contains `/api/workshop2/edo/` OR `/api/workshop2/articles/` (marking)
3. Threshold: > 5 events / 15 min → Slack/email ops

## Probe-alert cron

1. GitHub Actions / cron: `node scripts/workshop2-probe-alert.mjs`
2. Exit code 1 → эскалация (см. § Escalation Wave 53)
3. Threshold: `wave52ProdLiveReady >= 12`

## Test fire

1. POST `/api/workshop2/observability/sentry-test` только с `WORKSHOP2_ALLOW_SENTRY_TEST=1` на prod
2. Verify Issues → resolve test event

## § Escalation (Wave 53)

При падении probe-alert:

1. `node scripts/workshop2-probe-escalation.mjs [BASE_URL]`
2. Journal: `.planning/workshop2-probe-escalation-journal.json`
3. **Sentry**: только если `SENTRY_DSN` задан (fail-closed без DSN)
4. **PagerDuty**: только если `WORKSHOP2_PAGERDUTY_WEBHOOK_URL` задан (fail-closed без webhook)
5. Ops runbook: `.planning/workshop2-ru-ops-runbook.md` § probe escalation

## § PagerDuty (Wave 54)

1. Задайте `WORKSHOP2_PAGERDUTY_WEBHOOK_URL` в prod vault (Events API v2 integration URL).
2. При падении probe: `node scripts/workshop2-probe-escalation.mjs [BASE_URL]`
3. Escalation делает `fetch(POST)` только когда webhook задан — иначе fail-closed + journal.
4. Ops runbook: `.planning/workshop2-ru-ops-runbook.md` § PagerDuty RU

## Fail-closed

Без DSN/webhook эскалация **не** симулирует успешный alert — только journal + stderr.
