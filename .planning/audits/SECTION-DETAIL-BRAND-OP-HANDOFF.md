# SECTION-DETAIL — brand-op-handoff (Передача в производство)

> **Роль:** бренд · столп 4 «Выпуск» · order 1  
> **Оценка:** 7.7 (live) · UAT e2e core-02/03  
> **Peer:** mfr handoff queue (ack), sup materials (read), shop tracking (read)  
> **URL:** `/brand/b2b-orders/[orderId]?pillar=order_production#production-handoff`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| POST confirm-production-handoff | MES / ERP retry цеха |
| Bulk handoff из реестра | Ack очереди цеха |
| Retry + error UI | Shop tracking write |
| Cross-links: factory queue, shop tracking | |

## 2. Cross-role поток

```
brand POST confirm-production-handoff
       ↓
PG production-handoff-queue + chain-status handedOff
       ↓
mfr bulk-ack → prod-orders → MES
       ↓
sup materials PATCH
       ↓
shop tracking read-only
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Инвест-момент handoff в e2e | ERP auto-retry после bulk — P1 |
| Bulk + single path | Handoff UI размазан: detail + registry + pillar |
| Factory queue canonical hrefs | |
| Strip CTA канон (`brand-op-handoff-*`, волна 77) | |

## 4. Волна 77

- Канон testids на context strip после handoff
- SSE «только EventSource» снят — poll fallback в chain card (волна 76)

## 5. Было сломано / шум (волна 55)

| Проблема | Фикс |
|----------|------|
| Кнопка disabled при `brandConfirmed` — блок confirmed-not-handed-off | `disabled={handoffDone}` |
| Hardcoded `/brand/b2b-orders/${id}#production-handoff` | `brandB2bOrderHandoffContextHref` |
| Нет cross-role strip после handoff | `brand-order-handoff-context-strip` |
| One-shot chain fetch | SSE poll + live badge |
| Реестр: дубль «Карточка», PO не кликабельна | canonical hrefs + PO→queue |
| resolveHref без pillar context | handoff context href + awaiting registry |

## 6. Волна 55 — сделано

- `brandB2bOrderHandoffContextHref`, `brandB2bOrdersAwaitingHandoffRegistryHref`
- B2bOrderChainStatusCard: strip, SSE, fix button gating, `platform-core-brand-chain-steps`
- brand b2b-orders-core: production pillar, context strip, row links, error retry
- Hub matrix + calendar + CollectionOrder + OrderProduction pillar CTAs
- SECTION_AUDIT + core-02 asserts

## 7. P1+

- ERP auto-retry backoff после bulk handoff
- Sync `filter=awaiting_handoff` в URL при toggle реестра
