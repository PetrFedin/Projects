# Workshop2 — merge assist checklist (RU)

Wave 52 → main без auto-commit.

## Перед PR

1. `npm run test:workshop2:unit` — 0 failed
2. `node scripts/workshop2-probe-alert.mjs http://127.0.0.1:3123` — wave52 ≥ 12
3. `npm run workshop2:production-keys-checklist` — review `.planning/workshop2-production-keys-status.json`
4. Human UAT: ops + staging signoff → `.planning/workshop2-ss27-uat-signoff.json`
5. `WORKSHOP2_STAGING_PUBLIC_URL` — checklistLinks HTTP 200

## Merge assist

```bash
bash scripts/workshop2-merge-assist.sh
```

- **NO** `git commit` внутри скрипта
- `gh pr create --body-file .planning/workshop2-pr-body.md`

## После merge в main

- `workshop2-probe-prod.yml` workflow_dispatch с `WORKSHOP2_PRODUCTION_PUBLIC_URL`
- Daily ACK archive cron (wave 50)
