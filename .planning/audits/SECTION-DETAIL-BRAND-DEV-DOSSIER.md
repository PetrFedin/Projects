# SECTION-DETAIL — brand-dev-dossier (Досье артикула · ТЗ)

> **Роль:** бренд · столп 1 · order 2  
> **Оценка:** 7.7 (live)  
> **URL:** `/brand/production/workshop2/.../c/SS27/a/demo-ss27-01`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Edit dossier sections + persist | Factory MES write |
| Gates, TZ export, chat attach | Shop orders |
| Cross: sample handoff, supplier BOM | Production PO ack |

## 2. Cross-role

```
brand-dev-dossier → mfr-dev-dossier (peer read)
                  → sup-dev-bom (materials)
                  → brand-dev-range / sample_collection downstream
```

## 3. Волна 93

- `brand-dev-dossier-panel` + context/cross strips
- Canonical hrefs (`factoryProductionDossierHref`)
- liveScore 7.6 → 7.7

## 4. P1

- E2E PDF export composition
- Investor-summary read-only view
