# SECTION-DETAIL — brand-sc-publish (Публикация · витрина)

> **Роль:** бренд · столп 2 · order 3  
> **Оценка:** 7.4 (live)  
> **URL:** `/brand/linesheets?collection=SS27` (publish UI) · W2 hub (bulk publish API)

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| W2 → published-articles gate | Shop cart |
| Unpublish per article | Amend write |
| Peer preview: shop showroom | MES depth |

## 2. Cross-role

```
brand W2 publish gate → published-articles API
       ↓
shop-sc-showroom / shop-sc-matrix (buyer sees published)
       ↑ unpublish
brand-sc-linesheets row action
```

## 3. Что работает

- `brand-sc-publish-panel` на linesheets: count + W2 + showroom + peer shop
- Unpublish PUT API в таблице linesheets
- `Workshop2HubShowroomPublishButton` канон testids (готов к W2 mount)
- SS27 seed published articles

## 4. Слабые стороны / P1

- Publish button / bulk menu **не смонтированы** на W2 page (orphan components)
- Нет audit log публикации
- «B2B linesheet» link был тупиком на shop showroom — исправлено в hub button

## 5. Волна 90

- Publish panel на linesheets
- Hub button: shop showroom + brand linesheets links после publish
- liveScore 7.2 → 7.4
