# SECTION-DETAIL — sup-dev-bom (BOM · спецификация)

> **Роль:** supplier · столп 1 · order 1  
> **Оценка:** static 7.2 · live 7.3  
> **URL:** `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.supplier.development[0]`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| SupplierBomPreview из dossier PG | RFQ legacy hub |
| UoM + drawer expand | Brand W2 edit |
| Development view (не procurement) | Handoff POST |

**Summary:** Материалы из dossier PG — основа RFQ-free core.

## 2. Cross-role

```
sup-dev-bom ← brand-dev-dossier (source BOM)
            ← mfr-dev-dossier (read-only peer)
            → sup-dev-materials (workspace)
            → brand-dev-cross (brand peer link)
```

## 3. Good (из SECTION_AUDIT)

- SupplierBomPreview
- UoM в preview
- Drawer expand

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Legacy suppliers hub вне core | Core redirect suppliers |
| Нет каталога в nav | Material catalog nav |

## 5. P1 / UAT

- [ ] UAT: BOM preview совпадает с dossier PG lines
- [ ] UAT: cross-role из brand ведёт на `view=development`
- [ ] E2E: supplier core BOM в столпе development (core-01)
