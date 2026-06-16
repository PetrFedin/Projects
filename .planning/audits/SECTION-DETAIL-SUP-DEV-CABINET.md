# SECTION-DETAIL — sup-dev-cabinet (Кабинет · BOM образца)

> **Роль:** supplier · столп 1 · order 4  
> **Оценка:** static 7.1 · live 7.2  
> **URL:** `/factory/supplier/core?pillar=development&collection=SS27`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.supplier.development[3]`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| SupplierBomPreview compact в кабинете | Пустой RFQ hub |
| Primary → materials development | sample_collection UI |
| BOM fill-rate + alt materials | Brand W2 hub |

**Summary:** SupplierBomPreview compact в кабинете.

## 2. Cross-role

```
sup-dev-cabinet → sup-dev-bom / sup-dev-materials
                → sup-dev-comms-peer (price chat)
                ← brand-dev-cross (brand peer)
```

## 3. Good (из SECTION_AUDIT)

- Только BOM без пустого RFQ
- Primary → materials
- materials-bom-fill-rate
- materials-alt-materials из substitutes

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Fill-rate без весов по критичности строк | Weighted BOM completeness |
| — | Alt materials approval flow |

## 5. P1 / UAT

- [ ] UAT: один primary CTA, compact cross-role внизу
- [ ] UAT: fill-rate badge отражает substitutes
- [ ] E2E: supplier core BOM pillar (core-01)
