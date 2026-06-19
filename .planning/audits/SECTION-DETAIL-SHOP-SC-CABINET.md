# SECTION-DETAIL — shop-sc-cabinet (Кабинет · витрина)

> **Роль:** магазин · столп 2 · order 4  
> **Оценка:** 7.6 (live)  
> **URL:** `/shop/core?pillar=sample_collection&collection=SS27`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Partner badge + published count | Brand publish |
| Hub strip: showroom/matrix/partners/registry/checkout | MES |
| Hero preview из PG | Production |

## 2. Cross-role

```
shop-sc-cabinet → shop-sc-showroom / shop-sc-matrix / shop-sc-partners
       ↑ read
brand-sc-publish (published count)
```

## 3. Волна 91

- `shop-sc-cabinet-panel` + context strip (5 рабочих href)
- Канон testids partner/hero/empty
- Убраны дубли bottom-links
- liveScore 7.4 → 7.6

## 4. P1

- Синхрон counts mini vs showroom page
- UAT EMPTY27 empty + SS27 partner row
