# SECTION-DETAIL — shop-sc-matrix-entry (Переход · матрица)

> **Роль:** магазин · столп 2 → 3 · order 3  
> **Оценка:** 7.3 (live) · витрина → матрица  
> **URL:** `/shop/b2b/matrix?collection=SS27&article=demo-ss27-01`

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| Deep-link с витрины (`?article=`) | Brand handoff |
| Один context strip (entry) | Дубль `shop-co-matrix-context-strip` при `?article=` |
| Scroll к строке артикула | Multi-collection season matrix |

## 2. Cross-role

```
brand publish → shop showroom → matrix entry → checkout → brand registry
```

## 3. Волна 112

- Единый `shop-sc-matrix-entry-strip` с registry/checkout (без второго strip)
- Канон testids: `shop-co-matrix-registry-link` в entry strip

## 4. UAT

- [ ] Showroom quick-add → matrix scroll к артикулу
- [ ] Entry strip → checkout → PG order
