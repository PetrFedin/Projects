# SECTION-DETAIL — Столп 4 «Выпуск» (order_production)

> **19 разделов:** brand×5 · shop×4 · mfr×5 · sup×5  
> **Сквозная ось:** `chain-status` API → 5 шагов → handoff queue → PO → materials_supplied  
> **Оценки (честно):** brand 7.1–7.4 · shop 7.3–7.4 · mfr 7.2–7.4 · sup 7.0–7.3 · UAT частично (e2e).

## 1. Cross-role поток данных

```
Shop checkout → brand confirm → brand handoff POST → production-handoff-queue (PG)
       ↓
mfr bulk-acknowledge → production-orders → MES strip
       ↓
sup PATCH materials → chain step materials_supplied
       ↓
chain-status (/api/workshop2/b2b/orders/:id/chain-status) — все роли read
       ↓
shop tracking panel (batch chains) · brand order card · pillar cards
```

## 2. По ролям — обязательно / не нужно

| Роль | Обязательно | Не нужно |
|------|-------------|----------|
| **Бренд** | Handoff POST, chain card, W2 dossier context, bulk handoff | Редактирование MES цеха |
| **Магазин** | Read-only tracking, PO на карточке, CSV | Handoff UI |
| **Цех** | Handoff queue ack, prod-orders, dossier read | Матрица магазина |
| **Поставщик** | Procurement PATCH, BOM progress, queue read | Handoff write |

## 3. Кластер A — chain / tracking (все роли)

| Раздел | ✅ | ⚠️ |
|--------|-----|-----|
| brand-op-chain | B2bOrderChainStatusCard, SSE/poll badge (76) | Дубль strip на order detail |
| shop-op-tracking | 5 steps, reserve, sse/poll badge (76) | ETA производства |
| mfr-op-* steps | WMS badge, queue | Queue snippet max 3 в hub |
| sup-op-chain | workspace sse/poll badge (76) | Push бренду |

## 4. Кластер B — hub cabinet cards (4 роли)

| Раздел | Проблема (до 48) | Волна 48 / 74 |
|--------|------------------|---------------|
| brand-op-cabinet | full/compact дубль | compact-only; SSE/poll badge (74) |
| shop-op-cabinet | tracking CTA дубль | + календарь; poll badge (74) |
| mfr-op-cabinet | queue только в full | snippet + CTA; poll badge (74) |
| sup-op-cabinet | full/compact CTA дубль | compact-only; poll badge (74) |

## 5. Тупики / шум / канон

- `OrderProductionPillarCard` full-ветка не использовалась (только hub compact).
- `SupplierProcurementPillarCard` duplicate testids full vs compact.
- brand-op-registry `bad`: «batch handoff» — **ложно** (есть `brand-b2b-bulk-handoff`).
- Hardcoded `/brand/b2b-orders/` → `brandB2bOrderHref`.

## 6. План P1+

| Задача | Разделы |
|--------|---------|
| SSE chain-status в pillar cards | *-op-chain, shop-op-tracking |
| Multi-article procurement wizard | sup-op-procurement, sup-op-bom-po |
| W2 field-lock после handoff | brand-op-dossier |
| Unified PO inbox mfr | mfr-op-production-orders |

## 7. Волна 48 — сделано

- `OrderProductionPillarCard` compact-only + mfr queue snippet + shop calendar CTA
- `SupplierProcurementPillarCard` compact-only CTA row
- SECTION_AUDIT cabinet + registry fixes
