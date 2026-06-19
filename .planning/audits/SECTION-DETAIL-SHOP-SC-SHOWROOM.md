# SECTION-DETAIL — shop-sc-showroom (Витрина коллекции)

> **Роль:** магазин · столп 2 · order 1  
> **Оценка:** 7.6 (live)  
> **URL:** `/shop/b2b/showroom?collection=SS27`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Каталог опубликованных артикулов бренда | Brand publish controls |
| Hero preview, MOQ, cart qty | Factory dossier edit |
| CTA: матрица, quick-add, checkout path | Production handoff |
| Чат по артикулу | Supplier procurement |

## 2. Cross-role

```
shop-sc-partners → shop-sc-showroom → shop-sc-matrix → shop-co-checkout → shop-co-registry
       ↑ peer read
brand-sc-showroom / brand-sc-publish
```

## 3. Что работает

- `shop-sc-showroom-panel` + context strip (matrix, checkout, registry, partners)
- Per-article: MOQ, cart qty, matrix link, quick-add, orders→registry, article chat
- Footer: matrix + checkout
- core-06 hero e2e

## 4. Слабые стороны / P1

- Cover hero vs partner PG badge — визуальная неоднозначность
- Нет e2e partner row badge на mini/hub
- UAT showroom→checkout golden path

## 5. Волна 88

- Канон testids `shop-sc-showroom-*` + `data-audit-legacy`
- Orders CTA: `shopB2bOrdersCollectionRegistryHref()` вместо bare `/shop/b2b/orders`
- liveScore 7.4 → 7.6
