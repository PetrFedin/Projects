# SECTION-DETAIL — shop-op-tracking (Трекинг цепочки)

> **Роль:** магазин · столп 4 «Выпуск» · order 1  
> **Оценка:** 7.6 (live) · UAT e2e core-02/06/01  
> **Peer:** brand-op-chain (write handoff), mfr queue (ops), sup materials (step 5)

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Read-only 5 шагов chain-status | Handoff POST |
| PO id, reserve WMS, materials badge | Редактирование MES |
| Чат/календарь/карточка из строки | Amend server API |

## 2. Cross-role поток

```
brand handoff → chain-status API ← mfr ack / sup PATCH
       ↓
chain-status-batch (tracking list) + SSE stream (poll fallback)
       ↓
shop read-only UI → chat/calendar/order detail
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Batch chains + poll/SSE badge | Acknowledge delivery — P1 |
| Materials done + pending badges (волна 81) | |
| Выпуск/registry с order context (волна 81) | |
| Reserve badge честный copy | |
| Канон `shop-op-tracking-*` testids (волна 81) | |

## 4. Было сломано / шум (волна 50)

| Проблема | Фикс |
|----------|------|
| `shop-order-po-tracking-link` → `/tracking` без `?order=` | `shopB2bTrackingOrderHref(orderId)` |
| Пустой empty — текст без ссылок | registry + matrix CTA |
| Шаги без `platform-core-chain-step-*` | testids как в pillar card |
| `?orderId=` не скроллил карточку | `resolveFocusOrderId` |
| SECTION bad «Poll не SSE» устарел | SSE есть в hook |
| resolveHref без demo order | `shopB2bTrackingOrderHref(demo)` |

## 5. Волна 50 — сделано

- Context strip `shop-tracking-order-context-strip` при `?order=`
- Toolbar: реестр + SSE live badge
- Chain step testids + data-order
- Order detail PO tracking canonical href

## 6. Волна 81 — сделано

- `shop-op-tracking-list` / `shop-op-tracking-focus-row` / row testids
- Context strip: выпуск + registry `?order=`
- Materials pending badge до sup PATCH
- Step link materials_supplied → карточка выпуска

## 7. P1+

- Acknowledge delivery (shop batch)
