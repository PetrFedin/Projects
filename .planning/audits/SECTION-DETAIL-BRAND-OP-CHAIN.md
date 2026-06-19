# SECTION-DETAIL — brand-op-chain (Статус цепочки · PO)

> **Роль:** бренд · столп 4 «Выпуск» · order 2  
> **Оценка:** 7.5 (live) · UAT e2e core-01/03  
> **Peer:** shop-op-tracking (read), mfr prod-orders (ops), brand-op-handoff (write)  
> **URL:** `/brand/b2b-orders/[orderId]?pillar=order_production`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| 5 chain steps read-only | MES advance |
| PO id + poStatusLabelRu | Ack очереди цеха |
| Мониторинг materials/WMS steps | Shop amend |
| Cross-links: factory queue, shop tracking | |

## 2. Cross-role поток

```
chain-status API (+ SSE) → brand UI
       ↓
handoff write (brand-op-handoff) → mfr ack → sup materials
       ↓
shop tracking read · factory queue/prod-orders read
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Chain card + PO card + pillar steps | Один URL с handoff/dossier разделами |
| SSE poll в card/facts/pillar | Два context strip (chain card + facts) |
| Peer links shop tracking | SSE badge скрыт без EventSource |

## 4. Было сломано / шум (волна 56)

| Проблема | Фикс |
|----------|------|
| SECTION bad «нет SSE» — устарело после 55 | poll + badges |
| PO card: только queue + dossier | + prod-orders, shop tracking, chat |
| cross-links: только реестр/ритейлеры | + чат, календарь, трекинг |
| factory queue generic demo href | `factoryProductionHandoffQueueHref(orderId, …)` |
| resolveHref без pillar context | `brandB2bOrderChainContextHref` |
| Facts chain one-shot fetch | `usePlatformCoreChainStatusPoll` |

## 5. Волна 56 — сделано

- `brandB2bOrderChainContextHref()`
- `brand-order-chain-context-strip` + SSE badge на facts
- PO id кликабелен → prod-orders
- Pillar: `brand-op-chain-steps`, `brand-op-chain-sse-live-badge`
- Chain card: `brand-order-chain-status-card`
- SECTION_AUDIT + core-01 asserts

## 6. P1+

- Слить context strips (chain card vs facts) в один канон
- Poll fallback indicator
- Inventory reserve label на PO card (как shop tracking)
