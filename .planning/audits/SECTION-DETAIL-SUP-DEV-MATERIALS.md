# SECTION-DETAIL — sup-dev-materials (Материалы · разработка)

> **Роль:** supplier · столп 1 · order 2  
> **Оценка:** static 7.1 · live 7.2  
> **URL:** `/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development`  
> **SoT:** `platform-core-readiness-sections.ts` → `SECTION_AUDIT.supplier.development[1]`

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| materials-core development workspace | Procurement PATCH (столп 4) |
| List chrome + price journal | Shop checkout |
| substitutes / alt materials | Brand linesheets publish |

**Summary:** view=development — workspace столпа.

## 2. Cross-role

```
sup-dev-materials ← sup-dev-bom (preview entry)
                  → mfr-dev-dossier (article context)
                  → sup-dev-comms-peer (price quote chat)
                  → sup-op-procurement (downstream столп 4)
```

## 3. Good (из SECTION_AUDIT)

- materials-core development
- List chrome
- materials-price-journal из dossier_events
- materials-price-history fallback из unitCostNet

## 4. Bad / Fix

| Bad | Fix |
|-----|-----|
| Журнал пуст без событий с ценами в PG | Compare suppliers P2 |
| — | Price delta alert |

## 5. P1 / UAT

- [ ] UAT: вкладки materials не дублируют workspace заголовок (PATH-AUDIT P1)
- [ ] UAT: primary CTA «BOM · материалы» на development href
- [ ] Peer: brand/supplier cross-link с тем же article
