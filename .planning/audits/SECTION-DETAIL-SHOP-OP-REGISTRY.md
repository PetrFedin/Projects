# SECTION-DETAIL — shop-op-registry (Реестр · контекст)

> **Роль:** магазин · столп 4 «Выпуск» · order 3  
> **Оценка:** 7.7 (live) · UAT e2e core-01/02  
> **Peer:** shop-op-tracking (chain detail), shop-op-order-status (card), shop-co-registry (тот же URL, столп 3)  
> **URL:** `/shop/b2b/orders?pillar=order_production&filter=in_production`

## 1. Зачем магазину

| Обязательно | Не нужно |
|-------------|----------|
| Список заказов с PO / chain badge | Handoff write |
| Фильтр «В производстве» | MES / ERP ops |
| Переходы трекинг / выпуск / чат | Редактирование очереди цеха |
| CSV export | Batch acknowledge (P1) |

## 2. Cross-role поток

```
shop list API ← PG orders per buyer/collection
       ↓
chain-status-batch (per row PO, handedOff, steps)
       ↓
registry filter in_production ↔ tracking list ↔ order card (production context)
       ↓
brand confirm/handoff → mfr ack → sup materials (read-only badges)
```

## 3. Хорошо / плохо (честно)

| ✅ | ⚠️ |
|----|-----|
| Shared orders-core с shop-co-registry | Два раздела аудита — один экран |
| Filter + chain summaries | Нет acknowledge delivery batch |
| URL sync + focus `?order=` (волна 78) | |
| Thread preview на строке | |
| SSE registry poll | |

## 4. Было сломано / шум (волна 53)

| Проблема | Фикс |
|----------|------|
| ListChrome всегда collection_order | `?pillar=order_production` |
| resolveHref без фильтра выпуска | `shopB2bOrdersProductionRegistryHref` |
| Дубль «Карточка» + order id link | Одна ссылка + «Выпуск» при handedOff |
| «Цепочка» без testid | `shop-b2b-order-tracking-*` |
| PO колонка не кликабельна | `shop-b2b-order-po-link-*` → tracking |
| Error без retry | `reload()` в hook + кнопка |
| Filter empty — пустая таблица | `shop-b2b-registry-filter-empty` |
| Hub «Мои заказы» без контекста выпуска | production registry href |

## 5. Волна 53 — сделано

- `shopB2bOrdersProductionRegistryHref()` в `routes.ts`
- Context strip: трекинг / календарь / все vs в производстве
- Toolbar: filter + CSV в одной строке
- Row actions: трекинг, выпуск (if handedOff), чат
- Hook `reload()` для retry
- SECTION_AUDIT + core-02 asserts

## 6. Волна 78 — сделано

- `shopB2bOrdersRegistryHref` + URL sync на toggle
- `shop-op-registry-focus-row` при `?order=`
- Канон: `shop-op-registry-filter-in-production`

## 7. P1+

- Acknowledge delivery batch (peer tracking)
