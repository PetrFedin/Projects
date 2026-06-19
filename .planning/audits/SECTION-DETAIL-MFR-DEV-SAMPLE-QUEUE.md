# SECTION-DETAIL — mfr-dev-sample-queue (Очередь образцов)

> **Роль:** manufacturer · столп 1 · order 2  
> **Оценка:** static 7.2 · live 7.4  
> **URL:** `/factory/production#sample-queue`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.manufacturer.development[1]`

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| Sample queue card + priority sort | Edit brand ТЗ |
| Ack / статус образца в PG | Shop checkout |
| Hash-scroll `#sample-queue` | Supplier procurement PATCH |

**Summary:** Sample queue PG — один canonical entry в context strip (волна 21).

## 2. Cross-role

```
mfr-dev-sample-queue ← brand-dev-w2-hub (handoff образца)
                     ← brand-dev-pg-sync (queue position)
                     → mfr-dev-dossier (article context)
                     → sup-dev-bom (materials после образца)
```

## 3. Good (из SECTION_AUDIT)

- Sample queue card
- SAMPLE-DEMO в e2e
- Priority sort overdue→due
- #sample-queue hash-scroll (волна 94)
- pillarId development на карточке очереди
- Один CTA образцы/ack в mfr-dev-cabinet strip

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Factory dossier duplicate queue slot | Collapse dossier sample slot P2 |

## 5. P1 / UAT

- [ ] UAT: ack образца обновляет brand `development-sample-queue-position`
- [ ] E2E: core-01 factory hub sample queue panel
- [ ] Hash-scroll из mfr-dev-cabinet → `#sample-queue`
