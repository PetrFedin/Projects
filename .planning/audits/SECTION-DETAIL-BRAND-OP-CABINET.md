# SECTION-DETAIL — brand-op-cabinet (Кабинет · заказ→производство)

> **Роль:** бренд · столп 4 «Выпуск» · order 5  
> **Оценка:** 7.7 (live) · UAT e2e core-01  
> **Компонент:** `OrderProductionPillarCard` variant=brand в `/brand/core?pillar=order_production`  
> **Peer:** brand-op-registry, brand-op-chain, shop-op-tracking (read)

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| 5 chain steps read-only в hub | MES advance |
| BOM preview + materials/WMS badges | Shop amend |
| CTA → handoff, реестр, карточка, peer tracking | Ack очереди цеха |
| Live chain-status (poll/SSE) | Дубль full/compact card |

## 2. Cross-role поток

```
chain-status API (+ SSE для demo order)
       ↓
OrderProductionPillarCard brand (hub insight)
       ↓
brand-op-handoff / registry / chain / dossier (deep screens)
       ↓
shop tracking read · mfr prod-orders · sup materials (badges)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Parity CTA с shop cabinet | Дубль данных с order detail |
| PO → prod-orders кликабелен | |
| SSE/poll badge всегда виден (волна 74) | |
| BOM + materials + WMS badges | Много ссылок в одной строке |
| compact-only (волна 48) | |

## 4. Было сломано / шум (волна 59)

| Проблема | Фикс |
|----------|------|
| SECTION bad «нет SSE» — устарело | poll + `brand-op-chain-sse-live-badge` |
| Только handoff/закупка/чат/2×ТЗ | + реестр, карточка, трекинг, календарь |
| PO badge не кликабелен | Link → `factoryProductionOrdersOrderContextHref` |
| Нет WMS badge | `brand-op-cabinet-wms-reserve-badge` |
| shared testid `order-production-pillar-compact-cta` | `brand-op-cabinet-handoff-link` |
| resolveHref inline string | `brandCoreOrderProductionCabinetHref` |

## 5. Волна 59 — сделано

- Peer CTA row (`brand-op-cabinet-*`)
- PO link + WMS badge
- SECTION_AUDIT live 7.6 + core-01 asserts

## 6. Волна 74 — SSE/poll badge

- `PlatformCoreChainStatusRefreshBadge` — Live или «Опрос · chain-status»
- testids: `brand-op-cabinet-sse-live-badge` / `brand-op-cabinet-poll-badge`

## 7. P1+

- Сжать CTA (группировка «Связь» / «Производство»)
