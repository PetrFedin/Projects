# Workshop2 — ACK archive S3 lifecycle (RU template)

## Retention

- **7 лет** — compliance ЭДО/ЧЗ ACK export (ФЗ-152 / отраслевые требования бренда).
- Bucket: `WORKSHOP2_ACK_ARCHIVE_S3_BUCKET` (prod only, fail-closed без bucket).

## Lifecycle rule (шаблон AWS)

```json
{
  "Rules": [
    {
      "ID": "workshop2-ack-archive-7y",
      "Status": "Enabled",
      "Filter": { "Prefix": "workshop2/ack/" },
      "Transitions": [],
      "Expiration": { "Days": 2555 }
    }
  ]
}
```

## Ops

1. Weekly/manual: `.github/workflows/workshop2-ack-archive.yml`
2. Local: `npm run workshop2:ack-archive` (если script задан)
3. Без S3 credentials — **journal_only** в `.planning/archives/` (continue-on-error в CI)

## Wave 53

Связано с ops SLA dashboard и probe escalation — без fake upload ACK.
