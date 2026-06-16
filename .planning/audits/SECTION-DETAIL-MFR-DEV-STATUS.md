# SECTION-DETAIL — mfr-dev-status (Статус коллекции · PG)

> **Роль:** manufacturer · столп 1 · order 3  
> **Оценка:** static 7.0 · live 7.1  
> **URL:** `/factory/production/dossier/demo-ss27-01?collection=SS27`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.manufacturer.development[2]`

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| development-status read-only | Brand-only publish steps |
| Связь с бренд W2 PG | Shop matrix |
| Factory-scoped article filter | Edit dossier fields |

**Summary:** development-status read — связь с бренд W2.

## 2. Cross-role

```
mfr-dev-status ← brand-dev-pg-sync (upstream PG status)
               → mfr-dev-dossier (article detail)
               → mfr-dev-sample-queue (operational queue)
```

## 3. Good (из SECTION_AUDIT)

- Read-only steps
- Empty panels manufacturer sample_collection

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Brand development на карточке шумит | Только factory articles |
| Нет factory-scoped filter | Скрыть brand-only steps |

## 5. P1 / UAT

- [ ] UAT: статус на dossier не дублирует brand W2 hub noise
- [ ] UAT: только артикулы factory scope в development card
- [ ] Peer: brand W2 → тот же `demo-ss27-01` article id
