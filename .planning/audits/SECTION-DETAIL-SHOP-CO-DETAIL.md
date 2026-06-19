# SECTION-DETAIL — shop-co-detail (Карточка заказа)

> **Роль:** магазин · столп 3 «Оптовый заказ» · order 4  
> **Оценка:** 7.6 (live) · UAT e2e core-01/02  
> **Peer:** shop-op-order-status (тот же URL + `?pillar=order_production`)  
> **URL:** `/shop/b2b/orders/B2B-DEMO-SHOP1-SS27`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Статус + сумма + строки | Brand handoff write |
| Amend до handoff (матрица/чат) | PO ETA card (столп 4) |
| Read-only chain + трекинг | Mfr queue |
| Cross-links matrix/showroom | |

## 2. Cross-role

```
matrix → checkout → shop-co-detail
       ↓
amend (matrix/chat) до handoff
       ↓
brand confirm → tracking read
```

## 3. Хорошо / плохо

| ✅ | ⚠️ |
|----|-----|
| `shop-co-detail-amend-card` | Нет server-side amend |
| Context strip matrix/showroom | Дубль shop-op-order-status |
| Production strips gated by pillar | |

## 4. Волна 84

- `shop-co-detail-panel`, context strip, footer cross-links
- Amend только в collection_order pillar
- ETA / op context strip только с `?pillar=order_production`

## 5. P1+

- Structured amend request + brand approve
