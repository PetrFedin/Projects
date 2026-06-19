# SECTION-DETAIL — brand-sc-cross-matrix (Cross-role · матрица магазина)

> **Роль:** бренд · столп 2 · order 4  
> **Оценка:** 7.5 (live)  
> **URL:** `/brand/core?pillar=sample_collection` · peer `/shop/b2b/matrix`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Peer-read: матрица/checkout/showroom магазина | Shop cart write |
| Qty badge в linesheets | Amend |
| Инвест-перспектива пути байера | MES |

## 2. Cross-role

```
brand-sc-cabinet cross-strip → shop-sc-matrix / shop-co-checkout / shop-sc-showroom
brand-sc-linesheets matrix qty ← demo order lines
```

## 3. Волна 91

- `brand-sc-cross-matrix-context-strip` в кабинете
- Checkout через `shopB2bCheckoutCollectionHref`
- API `shopMatrixHref` / `shopShowroomHref` из sample-collection-status
- liveScore 7.2 → 7.5

## 4. P1

- Read-only matrix peek modal
- UAT brand peer → shop checkout click-through
