# SECTION-DETAIL — shop-co-checkout

> **Роль:** магазин · столп 3 · order 2  
> **Оценка:** 7.9 (live) · golden monetization  
> **URL:** `/shop/b2b/checkout?collection=SS27`

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| Cart sync → POST order | Brand confirm |
| Buyer context | Production handoff |
| Redirect → order detail | Real inventory hold |

## 2. Cross-role

```
matrix cart → checkout → PG order → brand-co-registry bump
```

## 3. Волна 86

- `shop-co-checkout-panel` + context strip
- Buyer label · канон testids

## 4. P1+

- Production JWT on checkout API
