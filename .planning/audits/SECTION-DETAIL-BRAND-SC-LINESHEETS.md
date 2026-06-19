# SECTION-DETAIL — brand-sc-linesheets (Лайншиты · коллекция)

> **Роль:** бренд · столп 2 · order 1  
> **Оценка:** 7.3 (live)  
> **URL:** `/brand/linesheets?collection=SS27`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Таблица опубликованных артикулов + PDF | Shop cart write |
| Peer preview: matrix qty магазина | MES |
| Unpublish с витрины | Amend от имени магазина |
| CTA W2 при empty | Дубль showroom UI |

## 2. Cross-role

```
brand W2 publish → brand-sc-linesheets (PDF/pack) ↔ brand-sc-showroom (live vitrine)
       ↓ peer
shop-sc-matrix / shop-co-checkout (matrix qty badge)
```

## 3. Что работает

- PG published-articles list
- PDF download с count
- Per-row matrix link + qty badge из demo order
- Unpublish API
- Context strip: PDF, витрина, W2, matrix/checkout магазина

## 4. Слабые стороны / P1

- Смысловое пересечение с showroom — diff: linesheet = pack/PDF + unpublish, showroom = buyer-facing
- Empty PDF edge cases
- Нет batch publish из строки
- UAT linesheet unpublish → showroom sync

## 5. Волна 89

- `brand-sc-linesheets-panel` + context strip (вместо дублирующих top buttons)
- Канон testids `brand-sc-linesheets-*`
- liveScore 7.1 → 7.3
