# SECTION-DETAIL — shop-op-cabinet (Кабинет · после отправки)

> **Роль:** магазин · столп 4 «Выпуск» · order 4  
> **Оценка:** 7.5 (live) · UAT e2e core-01  
> **Компонент:** `OrderProductionPillarCard` variant=shop в `/shop/core?pillar=order_production`  
> **Peer:** shop-op-tracking, shop-op-order-status, shop-op-registry

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| 5 chain steps read-only в hub | Handoff POST |
| PO / WMS / materials badges | MES / ERP |
| CTA → трекинг, реестр, карточка, чат | Редактирование очереди цеха |
| Live refresh chain (poll/SSE) | Bulk acknowledge |

## 2. Cross-role поток

```
chain-status API (+ SSE stream для demo order)
       ↓
OrderProductionPillarCard shop (hub insight)
       ↓
shop-op-tracking / order-status / registry (deep screens)
       ↓
brand handoff → mfr ack → sup materials (badges read-only)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Compact-only, без full/compact дубля | `shop-op-tracking-hub-link` живёт на столпе 3 (CollectionOrder) |
| Parity badges с brand/mfr (read-only) | SSE badge скрыт без EventSource |
| Все peer-CTA в одной строке | Нет poll indicator в UI |

## 4. Было сломано / шум (волна 54)

| Проблема | Фикс |
|----------|------|
| Только трекинг + календарь в CTA | + реестр, карточка (production context), чат |
| Нет PO badge у shop | `shop-op-cabinet-po-badge` |
| Нет WMS/materials badges | parity с mfr/brand |
| One-shot fetch без live bump | `usePlatformCoreChainStatusPoll` |
| Manufacturer queue API на shop | split useEffect по variant |
| SECTION good «hub-link» на неверном разделе | уточнён audit |

## 5. Волна 54 — сделано

- SSE poll + `shop-op-cabinet-sse-live-badge`
- `shop-op-cabinet-chain-steps` + status badges
- CTA: registry (`shopB2bOrdersProductionRegistryHref`), order (`shopB2bOrderProductionContextHref`), chat
- `data-variant` на card root
- core-01 asserts

## 6. P1+

- Poll fallback indicator когда SSE off
- Cross-pillar «Трекинг» на collection_order → явная подпись «после отправки»
