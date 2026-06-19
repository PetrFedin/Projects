# SECTION-DETAIL — brand-co-retailers (Сеть ритейлеров)

> **Роль:** бренд · столп 3 · order 3  
> **Оценка:** 7.5 (live)  
> **URL:** `/brand/retailers` · `/brand/retailers/shop1`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Список B2B партнёров + stats | Shop amend write |
| Фильтр заказов по partner | MES |
| Peer: витрина магазина (read) | CRM invite depth |

## 2. Cross-role

```
brand retailers list → partner orders filter → shop showroom (peer)
       ↓
brand-co-detail / handoff
```

## 3. Волна 87

- `brand-co-retailers-panel` + context strip
- `brandB2bOrdersRegistryHref({ partner })` на все CTA заказов
- Detail: `brand-co-retailer-detail-panel` + strip (чат/витрина/заказы)
- SS27 → `PLATFORM_CORE_DEMO.collectionId`

## 4. P1+

- Tier/names из PG для multi-partner
