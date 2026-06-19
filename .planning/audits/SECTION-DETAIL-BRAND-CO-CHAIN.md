# SECTION-DETAIL — brand-co-chain (Этапы цепочки · заказ)

> **Роль:** бренд · столп 3 · order 4  
> **Оценка:** 7.6 (live)  
> **URL:** `/brand/b2b-orders/B2B-DEMO-SHOP1-SS27` (+ hub pillar card)

## 1. Зачем

| Обязательно | Не нужно |
|-------------|----------|
| shop_sent / brand_confirmed | materials_supplied write |
| Confirm + handoff CTA | MES advance |
| Чат при SLA | Полная 5-step цепочка (столп 4) |

## 2. Cross-role

```
shop checkout → shop_sent
       ↓
brand confirm → brand_confirmed → handoff → pillar 4
```

## 3. Волна 85

- `brand-co-chain-card` · steps filter · `brand-co-chain-context-strip`
- Hub: `brand-co-chain-hub-steps` · `collection-order-handoff-link`
- Factory queue в co strip после handoff (read bridge)

## 4. P1+

- Inline confirm без scroll
