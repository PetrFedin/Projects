# SECTION-DETAIL — Очередь передачи / handoff (столп 4)

> **Кластер:** `brand-op-handoff` · `mfr-op-handoff-queue` · `sup-op-handoff-read` (+ chain в `brand-op-chain`)  
> **Сквозной поток:** brand POST handoff → PG queue → mfr bulk-ack → prod-orders → sup PATCH  
> **Оценки:** brand 7.7 · mfr 7.7 · sup 7.4 · UAT e2e core-02/03.

## 1. Cross-role

```
brand confirm-production-handoff POST
       ↓
/api/workshop2/factory/production-handoff-queue
       ↓
mfr: bulk-acknowledge + retry-erp + чат на строке
       ↓
/factory/production/orders (MES, accept)
       ↓
sup: materials PATCH (gated on PO in queue)
```

## 2. По ролям

| Роль | Раздел | Обязательно | Не нужно |
|------|--------|-------------|----------|
| Бренд | brand-op-handoff | POST, retry, bulk, factory queue CTA | MES, ack цеха |
| Цех | mfr-op-handoff-queue | bulk ack, ERP retry, dossier/chat | Handoff write |
| Поставщик | sup-op-handoff-read | queue count, PO deep-link | Ack/write |

## 3. Хорошо / плохо

### brand-op-handoff (7.7)

| ✅ | ⚠️ |
|----|-----|
| Handoff API + e2e | ERP auto-retry после bulk (P1) |
| `brand-op-handoff-factory-queue-link` / `brand-op-handoff-prod-orders-link` | Handoff UI размазан: detail + registry + pillar |
| SSE/poll badge (`brand-op-chain-*`, волна 76) | |

### mfr-op-handoff-queue (7.7)

| ✅ | ⚠️ |
|----|-----|
| `mfr-op-handoff-queue-panel` + RU статусы | Дубль bulk-ack panel vs prod-orders — осознанный split |
| Registry link + row `mfr-op-handoff-queue-orders-link-*` | Navigate после bulk ack → registry (P1) |
| ERP alert + poll refresh (волна 77) | |
| factory-handoff-row-* e2e | |

### sup-op-handoff-read (7.4)

| ✅ | ⚠️ |
|----|-----|
| `sup-op-handoff-read-strip` + queue count | Dedicated handoff-queue SSE (P2) |
| `sup-op-handoff-read-po-link` / queue CTA | Push нового PO |

## 4. Волна 49 — канон ссылок

**Проблема:** 8+ мест с голым `/factory/production#handoff-queue` без `?order=&factoryId=&collection=` — терялся demo-контекст, scroll к нужной серии.

**Исправлено:**
- `factoryProductionHandoffQueueHref()` в `routes.ts`
- `factoryHandoffQueueHrefForDemo()` делегирует в него
- CommsPillarCard, ContextBar, calendar strip, B2bOrderChainStatusCard, order detail facts, hub-matrix trail/actions
- PO link после handoff → `ROUTES.factory.productionOrders`
- mfr hub: `mfr-op-all-production-orders-link` при >3 PO

## 5. P1+

| Задача |
|--------|
| SSE на handoff queue для sup/mfr |
| ERP auto-retry backoff после brand bulk |
| Supplier read-only panel на factory production (peer view) |
