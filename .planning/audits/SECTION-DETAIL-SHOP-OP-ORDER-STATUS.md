# SECTION-DETAIL — shop-op-order-status (Карточка · статус PO)

> **Роль:** магазин · столп 4 «Выпуск» · order 2  
> **Оценка:** 7.6 (live) · UAT e2e core-01/02  
> **Peer:** shop-op-tracking (list), brand-op-handoff (write), mfr prod-orders (ops)  
> **URL:** `/shop/b2b/orders/[orderId]` · deep link `?pillar=order_production#order-production`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Read-only 5 шагов chain-status | Handoff POST |
| PO id, poStatusLabelRu, ETA | MES advance / ERP retry |
| Трекинг, чат, календарь из карточки | Редактирование очереди цеха |
| Amend до handoff (см. shop-co-detail) | «вид бренда» как основной путь |

## 2. Cross-role поток

```
shop submit → brand confirm → brand handoff POST
       ↓
chain-status API (handedOff, productionOrderId, steps)
       ↓
shop order card: chain steps + PO card + eta (read-only)
       ↓
shop tracking list / chat / calendar (peer sections)
       ↓
mfr ack + MES · sup materials PATCH
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| B2bOrderChainStatusCard shop read-only | Дубль с shop-co-detail (один URL, два раздела аудита) |
| PO card + tracking link | Push notification при materials — P2 |
| materials_supplied badge (волна 79) | Нет acknowledge delivery — P1 |
| SSE/poll на карточке (волна 79) | Дубль аудита с shop-co-detail |
| Amend gated на !handedOff | |
| Registry → production registry с `?order=` | |

## 4. Было сломано / шум (волна 52)

| Проблема | Фикс |
|----------|------|
| `platform-core-shop-chain-steps` в аудите, testid не было | `data-testid` на `<ul>` chain card (shop) |
| Pillar strip всегда collection_order | `?pillar=order_production` + hash `#production-handoff` |
| resolveHref без контекста выпуска | `shopB2bOrderProductionContextHref` |
| ETA + PO + cross-links — 3× трекинг | context strip + убраны ссылки из eta card |
| Chain card shop без трекинга | `shop-order-chain-tracking-link` |
| brand PO link без order context | `factoryProductionOrdersOrderContextHref` (brand only) |

## 5. Волна 52 — сделано

- `shopB2bOrderProductionContextHref()` в `routes.ts`
- `shop-order-production-context-strip` при handedOff
- Pillar sync в `PlatformCoreOrderDetailChrome`
- Chain steps testid + tracking CTA
- SECTION_AUDIT + core-02 asserts

## 6. Волна 79 — сделано

- `shop-op-order-status-*` testids (chain card, context strip, PO link)
- SSE/poll badge на chain card + context strip
- `materials_supplied` badge + step → tracking link
- `#order-production` hash scroll · registry canonical href
- `shopB2bOrderProductionContextHref` → `#order-production`

## 7. P1+

- Acknowledge delivery (shop batch, peer tracking)
- Push notification при materials_supplied (P2)
