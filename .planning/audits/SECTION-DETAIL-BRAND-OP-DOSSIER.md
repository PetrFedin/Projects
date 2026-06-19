# SECTION-DETAIL — brand-op-dossier (Досье · W2 бренда)

> **Роль:** бренд · столп 4 «Выпуск» · order 3  
> **Оценка:** 7.6 (live) · UAT e2e core-01  
> **Peer:** mfr factory dossier (read), brand-op-handoff (write freeze), sup BOM (materials step)  
> **URL:** `/brand/b2b-orders/[orderId]?pillar=order_production#production-dossier`

## 1. Зачем бренду

| Обязательно | Не нужно |
|-------------|----------|
| Проверка gates/BOM перед handoff | MES advance |
| Diff ТЗ после передачи (read) | Редактирование factory dossier |
| Ссылка на W2 material + peer досье цеха | Shop amend |
| Cross-links: handoff, chain, chat | |

## 2. Cross-role поток

```
W2 dossier (brand write) → confirm handoff → dossierVersionAtHandoff в PO
       ↓
chain-status API (+ SSE) → diff summary на order detail
       ↓
factory dossier (mfr read) · sup materials step · shop tracking (no W2)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Карточка + locked/changed badges + diff lines | Field-lock в W2 редакторе — только бейдж |
| Context strip + canonical hrefs | Два CTA «Досье цеха» (strip + справа) |
| Deep-link `#production-dossier` + pillar sync | Poll indicator когда SSE off — общий P1 |
| `brandW2ProductionTzHref` → material BOM | |

## 4. Было сломано / шум (волна 57)

| Проблема | Фикс |
|----------|------|
| resolveHref вёл в W2 без контекста заказа | `brandB2bOrderDossierContextHref` |
| Hardcoded `/factory/production/dossier/` | `factoryProductionDossierHref(article, { collectionId })` |
| W2 link без секции material | `brandW2ProductionTzHref` |
| Дубль «Досье цеха» на PO card | убран `brand-order-detail-dossier-link` |
| Нет cross-nav на карточке ТЗ | `brand-order-dossier-context-strip` |
| Pillar «ТЗ» без order context | `brand-op-order-dossier-link` + `brand-op-w2-dossier-link` |

## 5. Волна 57 — сделано

- `brandB2bOrderDossierContextHref`, `brandW2ProductionTzHref`, `factoryProductionDossierHref`
- `id="production-dossier"` + hash scroll в order chrome
- Context strip: передача, цепочка, чат, досье цеха
- SECTION_AUDIT live 7.6 + core-01 asserts

## 6. P1+

- Read-only gates в W2 workspace после PO (не только бейдж)
- Слить дубли context strips (chain card vs dossier vs facts)
- e2e: factory dossier href с `?collection=` после handoff
