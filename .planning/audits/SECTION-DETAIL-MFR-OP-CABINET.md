# SECTION-DETAIL — mfr-op-cabinet (Кабинет · выпуск)

> **Роль:** цех · столп 4 «Выпуск» · order 5  
> **Оценка:** 7.6 (live) · UAT e2e core-01  
> **Компонент:** `OrderProductionPillarCard` variant=manufacturer в `/factory/production/core?pillar=order_production`  
> **Peer:** mfr-op-handoff-queue, mfr-op-production-orders, shop-op-tracking (read)

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| 3 chain steps (WMS, PO, materials) read | Handoff POST (brand) |
| Queue snippet + ack path | Shop amend |
| CTA → queue, prod-orders, materials, dossier | Bulk handoff write |
| Live chain-status poll/SSE | Full registry в hub |

## 2. Cross-role поток

```
brand handoff → handoff queue API
       ↓
OrderProductionPillarCard mfr (hub) + queue poll
       ↓
prod-orders ack · materials read · dossier · shop tracking peer
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Parity CTA с brand/shop cabinet | Queue max 3 строк |
| PO snippet → prod-orders (не queue) | Дубль с /production handoff panel |
| SSE + materials/WMS badges | SSE badge только при EventSource |

## 4. Было сломано / шум (волна 62)

| Проблема | Фикс |
|----------|------|
| Нет SSE poll для manufacturer | poll + `mfr-op-cabinet-sse-live-badge` |
| Нет testid chain steps | `mfr-op-cabinet-chain-steps` |
| Только 3 CTA (queue, закупка, досье) | + prod-orders, tracking, chat |
| PO snippet → generic queue href | → `factoryProductionOrdersOrderContextHref` |
| shared `order-production-pillar-compact-cta` | `mfr-op-cabinet-handoff-link` |
| resolveHref inline | `factoryCoreOrderProductionCabinetHref` |
| Queue fetch one-shot | refresh на `chainPollTick` |

## 5. Волна 62 — сделано

- Peer CTA row + PO/materials badges
- SECTION_AUDIT live 7.6
- **Столп 4 manufacturer: 5/5**

## 6. P1+

- Poll fallback indicator
- Inline expand queue без ухода с hub
