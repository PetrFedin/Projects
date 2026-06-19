# SECTION-DETAIL — sup-op-procurement (Закупка · PATCH)

> **Роль:** поставщик · столп 4 «Выпуск» · order 1  
> **Оценка:** 7.6 (live) · UAT e2e core-01/02  
> **URL:** `/factory/production/materials?view=procurement&role=supplier`  
> **Peer:** mfr-op-materials (read), sup-op-bom-po, brand handoff → PO queue

## 1. Зачем поставщику

| Обязательно | Не нужно |
|-------------|----------|
| PATCH bulk-confirm material-request | Handoff POST (brand) |
| BOM × PO qty + handoff gate | Редактирование досье |
| Idempotent badge после confirm | Цеховой WMS write |
| Cross-links: queue, dossier, чаты | Multi-article wizard (P1) |

## 2. Cross-role поток

```
brand handoff → PO в queue (qty)
       ↓
supplier procurement (role=supplier) → bulk-confirm
       ↓
chain materials_supplied → brand/shop/mfr badges (read)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Write только при role=supplier | Один article per view |
| Handoff gate на кнопке confirm | Multi-article wizard — P1 |
| Context strip + tracking (волна 80) | Дубль CTA hub ↔ workspace (осознанный) |
| Success strip → peer roles (волна 80) | Push notification — P2 |
| RU PO status + poll refresh queue (волна 80) | |

## 4. Было сломано / шум (волна 63)

| Проблема | Фикс |
|----------|------|
| Нет context strip у supplier | `sup-op-procurement-context-strip` |
| Inline cabinet back href | `factorySupplierCoreOrderProductionCabinetHref` |
| Manufacturer strip без supplier parity | Отдельный strip по activeRole |

## 5. Волна 63 — сделано

- Supplier context strip + canonical cabinet href
- SECTION_AUDIT live 7.4
- core-01: role=supplier asserts

## 6. Волна 80 — сделано

- `sup-op-procurement-panel` / `sup-op-procurement-bulk-confirm` канон testids
- RU статус очереди · handoff refresh на chain poll
- Success strip: tracking + чат бренду после confirm
- Tracking в context strip + hub card (`sup-op-cabinet-tracking-link`)

## 7. P1+

- Multi-article procurement wizard
- SSE push materials_supplied (P2)
