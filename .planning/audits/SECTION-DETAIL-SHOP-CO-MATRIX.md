# SECTION-DETAIL — shop-co-matrix (Матрица оптового заказа)

> **Роль:** магазин · столп 3 · order 1  
> **Оценка:** 7.9 (live) · golden path entry  
> **URL:** `/shop/b2b/matrix?collection=SS27`

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| PG rows + qty grid | Brand handoff |
| Cart → checkout | Production tracking |
| MOQ + buyer context | Multi-collection season view |

## 2. Cross-role

```
showroom → matrix → checkout → brand-co-registry
```

## 3. Волна 85

- `shop-co-matrix-panel` + context strip (витрина/реестр/демо/checkout)
- Канон `shop-co-matrix-*` + `data-audit-legacy`

## 4. P1+

- E2E без seed · сводная матрица сезона
