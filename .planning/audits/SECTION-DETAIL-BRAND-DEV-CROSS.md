# SECTION-DETAIL — brand-dev-cross (Связь · цех и поставщик)

> **Роль:** бренд · столп 1 · order 6  
> **Оценка:** static 7.0 · live 7.1  
> **URL:** `/factory/production/dossier/demo-ss27-01?collection=SS27`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.brand.development[5]`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Peer → factory dossier (read-only ТЗ) | Редактирование BOM поставщика |
| Sample handoff CTA | Shop matrix write |
| BOM + sample queue badges | Дубль полного W2 в cross-role |

**Summary:** Горизонталь к manufacturer dossier и supplier BOM + EMPTY27 plan CTA.

## 2. Cross-role

```
brand-dev-cross → mfr-dev-dossier (factory read-only)
                → mfr-dev-sample-queue (#sample-queue)
                → sup-dev-bom (materials development view)
                → brand-dev-w2-hub (upstream)
```

## 3. Good (из SECTION_AUDIT)

- brand-dev-cross-context-strip в кабинете
- W2 hub → factory dossier + sample queue
- Factory dossier + supplier BOM links с testids
- Sample handoff CTA
- BOM + sample queue badges
- EMPTY27 onboarding в cabinet (core-44)

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Нет push при смене статуса образца | SSE sample queue для бренда |

## 5. P1 / UAT

- [ ] UAT: cross-role compact → dossier с `collection=SS27`
- [ ] UAT: BOM link ведёт на `view=development`, не procurement
- [ ] E2E: `brand-w2-sample-handoff-link` кликабелен
