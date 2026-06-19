# SECTION-DETAIL — mfr-dev-dossier (Досье · read-only)

> **Роль:** manufacturer · столп 1 · order 1  
> **Оценка:** 7.7 (live)  
> **URL:** `/factory/production/dossier/demo-ss27-01?collection=SS27`

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| Read-only ТЗ + BOM из PG | Edit brand dossier |
| Export SKU strip | Shop checkout |
| Article chat | Brand publish |

## 2. Cross-role

```
mfr-dev-dossier ← brand-dev-dossier (source of truth)
                → mfr-dev-sample-queue
                → sup-dev-materials (BOM procurement view)
```

## 3. Волна 93

- `mfr-dev-dossier-panel` + context strip
- Peer: brand W2, sample queue, materials, cabinet
- Chat link канон `mfr-dev-dossier-article-chat-link`
- liveScore 7.5 → 7.7

## 4. P1

- E2E export TZ meta
- Comment-only annotations on read-only dossier
