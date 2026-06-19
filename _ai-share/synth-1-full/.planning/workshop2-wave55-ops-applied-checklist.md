# Wave 55 — Ops applied checklist (PagerDuty + Sentry)

Отметьте вручную после применения в org (не автоматизируется — только stub/scripts в repo).

## PagerDuty

- [ ] Создан service «Workshop2 Prod» в PagerDuty
- [ ] `WORKSHOP2_PAGERDUTY_WEBHOOK_URL` добавлен в production vault
- [ ] `node scripts/workshop2-probe-escalation.mjs` → journal `.planning/workshop2-probe-escalation-journal.json` с `pagerdutySent: true`
- [ ] Sentry integration → PagerDuty routing rule активна
- [ ] Runbook §16 PagerDuty в `.planning/workshop2-ru-ops-runbook.md` прочитан ops

## Sentry

- [ ] `SENTRY_DSN` задан в staging + production
- [ ] Alert rules из `.planning/workshop2-sentry-alert-rules.md` созданы в Sentry UI
- [ ] Rule: Workshop2 API 5xx rate > threshold
- [ ] Rule: probe-alert failure (external cron / GitHub workflow)
- [ ] `POST /api/workshop2/observability/sentry-test` с `WORKSHOP2_ALLOW_SENTRY_TEST=1` — issue виден в Sentry
- [ ] PagerDuty escalation из Sentry проверена test incident

## ACK compliance (Wave 54–55)

- [ ] `node scripts/workshop2-ack-s3-lifecycle-apply.mjs` — dry-run reviewed, apply on prod bucket
- [ ] `node scripts/workshop2-ack-restore-drill-quarterly.mjs` — completed
- [ ] `.planning/workshop2-ack-restore-drill-last.json` содержит свежий `completedAt`

## Investor freeze signoff

- [ ] ops role signed (`POST .../signoff` role=ops)
- [ ] product role signed (`POST .../signoff` role=product)
- [ ] `GET /api/workshop2/cutover-dashboard` → `wave55FreezeReady: true`
- [ ] `wave55InvestorFreezeReady` probe ≥10

## Tag (optional)

- [ ] `bash scripts/workshop2-investor-freeze-tag.sh` — команды проверены
- [ ] `WORKSHOP2_RUN_GIT_TAG=1 bash scripts/workshop2-investor-freeze-tag.sh` — tag `investor-freeze-wave55` локально
- [ ] `git push origin investor-freeze-wave55` — после review
