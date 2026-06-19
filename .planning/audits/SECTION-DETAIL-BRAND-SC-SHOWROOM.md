# SECTION-DETAIL — brand-sc-showroom (Витрина бренда)

> **Роль:** бренд · столп 2 · order 2  
> **Оценка:** 7.5 (live)  
> **URL:** `/brand/showroom?collection=SS27`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Список опубликованных артикулов коллекции | Shop cart / MOQ |
| Превью hero из досье | MES / production handoff |
| Peer-ссылки: матрица/checkout магазина | Amend write от имени магазина |
| Чат по артикулу (контекст W2) | Дублирующий PDF export |

## 2. Cross-role

```
brand publish/linesheets → brand-sc-showroom (read published)
       ↓ peer links
shop-sc-showroom / shop-sc-matrix / shop-co-checkout
       ↓
shop-co-registry (заказ после checkout)
```

## 3. Что работает

- `PlatformCorePublishedShowroom` variant=brand
- `brand-sc-showroom-panel` + `brand-sc-showroom-context-strip` (count, matrix, checkout, linesheets, publish)
- Per-article: matrix link, article chat
- Footer CTA: matrix магазина + linesheets
- e2e core-01 cross-role asserts

## 4. Слабые стороны / P1

- Смысловой дубль с `brand-sc-linesheets` — нужен diff: витрина = live published, linesheets = PDF/pack
- Нет inline preview qty matrix на карточке
- UAT 0/69 — ручной проход showroom→matrix магазина

## 5. Волна 88

- Канон testids `brand-sc-showroom-*` + `data-audit-legacy`
- Context strip расширен (publish link)
- liveScore 7.3 → 7.5
