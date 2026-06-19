# SECTION-DETAIL — mfr-op-production-orders (Производственные заказы)

> **Роль:** цех · столп 4 «Выпуск» · order 2  
> **Оценка:** 7.5 (live) · UAT e2e core-02/03/11/12  
> **Peer:** mfr-op-handoff-queue (panel), brand-op-handoff (write), sup materials (step 5)

## 1. Зачем цеху

| Обязательно | Не нужно |
|-------------|----------|
| Реестр PO из PG queue | Handoff POST от бренда |
| Bulk/single accept, ERP retry | Редактирование B2B заказа |
| MES cut/sew/qc/released | Shop tracking write |
| Chain badge read-only | Supplier PATCH materials |

## 2. Cross-role поток

```
brand handoff POST
       ↓
/api/workshop2/factory/production-handoff-queue
       ↓
mfr: /factory/production#handoff-queue (быстрый ack)
       ↓
/factory/production/orders — полный реестр: MES, ERP, bulk, ссылки
       ↓
sup materials PATCH (gated on PO in queue)
       ↓
shop chain-status read (tracking)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Тот же API что handoff panel | Дубль bulk-ack на /production и /orders |
| MES strip + advance API | live_failed ERP UI только на строке |
| Per-row handoff/chat/procurement/dossier | |
| scroll-to-row + focus-row (волна 75) | |
| ERP alert banner в header (волна 75) | EMPTY27 без MES e2e |
| core-12 bulk path | Bulk ERP retry всех серий |

## 4. Было сломано / шум (волна 51)

| Проблема | Фикс |
|----------|------|
| «Очередь» на строке → generic demo href | `factoryProductionHandoffQueueHref(row.b2bOrderId, …)` |
| Empty/error — мёртвый текст | CTA handoff + hub + retry |
| resolveHref без demo order | `factoryProductionOrdersOrderContextHref` |
| Hub «Все PO» без контекста | pillar link с `?order=` |
| Calendar prod-orders без order | context href с orderId |
| Нет context strip при deep link | `factory-production-orders-order-context-strip` |

## 5. Волна 51 — сделано

- `factoryProductionOrdersOrderContextHref()` в `routes.ts`
- Context strip + toolbar (очередь, обновить)
- Row highlight `bg-amber-50/60` при `?order=`
- Empty/error states с рабочими ссылками
- Per-row handoff testid `factory-production-order-handoff-*`
- SECTION_AUDIT + core-02 assert context strip

## 6. Волна 75 — сделано

- `factory-production-orders-focus-row` + scrollIntoView при `?order=`
- `factory-production-orders-erp-alert` + retry CTA (focus order приоритет)
- hub/empty links → `factoryCoreOrderProductionCabinetHref`
- Copy: panel=быстрый ack, registry=MES/ERP

## 7. P1+

- Bulk ERP retry для всех attention rows
- Ack на panel → deep-link на registry с `?order=`
