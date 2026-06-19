# SECTION-DETAIL — brand-dev-w2-hub (Цех разработки · коллекция)

> **Роль:** бренд · столп 1 · order 1  
> **Оценка:** 7.4 (live)  
> **URL:** `/brand/production/workshop2?w2col=SS27`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Hub артикулов коллекции | Shop matrix write |
| Create SKU + PG hydrate | MES execution |
| Cross-links столпа 1→2 | Supplier procurement UI |

## 2. Cross-role

```
brand-dev-w2-hub → mfr-dev-dossier (factory dossier)
                 → mfr-dev-sample-queue
                 → brand-sc-linesheets/showroom (downstream)
```

## 3. Волна 92

- `brand-dev-w2-hub-panel` + context strip
- Peer links: showroom, factory dossier, sample queue
- `brand-dev-pg-sync-hint` канон
- liveScore 7.2 → 7.4

## 4. P1

- Bulk-import SKU CSV
- UAT W2 → handoff → factory queue
