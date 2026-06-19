# SECTION-DETAIL — Календарь (столп 5 «Связь»)

> **Кластер:** `brand-cm-calendar` · `shop-cm-calendar-order` · `shop-cm-calendar-logistics` · `mfr-cm-calendar` · `sup-cm-calendar`  
> **Почему второй:** после чата — **5 из 5 ролей/разделов** с B2B-событиями из `calendar-events` API и cross-nav чат ↔ календарь (core-13).  
> **Оценки (честно):** brand 7.4 · shop-order 7.4 · shop-logistics 7.3 · mfr 7.5 · sup 7.4 · UAT 0/5 (волна 70).

## 1. Зачем раздел каждой роли

| Роль | Обязательный функционал | Не нужно в core |
|------|------------------------|-----------------|
| **Бренд** | Слоты отгрузки/handoff, EventDialog + «Чат», контекст заказа | Drag-create слотов, Gantt всей сети |
| **Магазин** | Окна поставки, слой logistics, клик → чат, трекинг | Два пункта «календарь» в hub |
| **Цех** | Этапы PO/production в календаре, cross-nav, контекст заказа | Редактирование слотов бренда |
| **Поставщик** | Logistics layer, `/factory/calendar?role=supplier` | Production ACL (`/factory/production/calendar`) |

## 2. Cross-role поток данных

```
PG order lifecycle → getPlatformCoreB2bCalendarEvents (handoff, delivery_window, materials)
       ↓
/api/workshop2/platform-core/calendar-events?collectionId&orderId
       ↓
mapPlatformCoreB2bEventToCalendar (targetChatId)
       ↓
brand: EventDialog → чат | shop/mfr/sup: клик → messages (fast path)
       ↓
PlatformCoreCommsCrossNav (4 роли, core-13)
```

**Работает:** API + targetChatId, brand strip, shop logistics strip, golden core-02 calendar→messages, factory comms banner (mfr без order в URL).  
**Не работает / частично:** drag слотов (brand), delivery confirm event (sup), preview треда у shop (by design fast-nav), не все PO у mfr в feed, push/SSE unread в calendar view.

## 3. По ролям — хорошо / плохо / тупики

### Бренд (`brand-cm-calendar` · 7.1)

| ✅ | ⚠️ / ❌ |
|----|---------|
| EventDialog read-only + кнопка «Чат» | Нет drag слотов |
| W2 events + B2B merge | layers=tasks в href — ок для W2, B2B не фильтруется |
| `brand-calendar-order-context-strip` | Нет слоя logistics (не критично для бренда) |

**Тупики:** нет — registry/handoff/chat из strip.

### Магазин (`shop-cm-calendar-order` · 7.2 / `shop-cm-calendar-logistics` · 7.1)

| ✅ | ⚠️ / ❌ |
|----|---------|
| `externalEventsOnly`, logistics strip + toggle | Два audit-раздела = один экран (слои) |
| Клик события → messages (golden) | Нет EventDialog preview (в отличие от brand) |
| `/shop/calendar` → redirect на b2b | Было: hub «Календарь заказ» + «Календарь закупки» (шум) |
| | Было: `shopCalendarB2bOrderContextHref` с `layers=tasks` — logistics strip скрыт |

**Тупики:** нет — tracking/order/chat из strip.

### Цех (`mfr-cm-calendar` · 7.3)

| ✅ | ⚠️ / ❌ |
|----|---------|
| production calendar + PG events | События не из всех PO в очереди |
| Factory comms banner (без order в URL) | Не было order context strip при `?order=` |
| core-13 cross-nav | Нет Gantt milestone view (P2) |

### Поставщик (`sup-cm-calendar` · 7.2)

| ✅ | ⚠️ / ❌ |
|----|---------|
| `/factory/calendar?role=supplier` (canonical) | resolveHref указывал на productionCalendar (ACL) |
| logistics layers в URL | Нет delivery confirm event |
| e2e supplier calendar без policy banner при order | Нет ETA/map logistics (P2) |

## 4. Шум и канон

| Проблема | Где | Волна 46 |
|----------|-----|----------|
| Два календаря в hub shop | `platform-core-hub-matrix` | ✅ один CTA, layers=orders,logistics |
| shop context href `layers=tasks` в core | `routes.ts` | ✅ `orders,logistics` |
| sup SECTION resolveHref → production | `platform-core-readiness-sections` | ✅ `ROUTES.factory.calendar` |
| mfr/sup без strip при order | factory calendar pages | ✅ context strip |
| shop nav `ROUTES.shop.calendar` | normalized data | augment → b2b (уже) |

## 5. План доработок (волны 46+)

| Приоритет | Задача | Разделы |
|-----------|--------|---------|
| P1 | Shop/mfr optional EventDialog preview (opt-in, не ломать golden) | shop-cm-calendar-* |
| P1 | Все PO из prod-orders в calendar-events для mfr | mfr-cm-calendar |
| P2 | delivery_confirm event + ETA для sup | sup-cm-calendar |
| P2 | Drag slot → create thread (brand) | brand-cm-calendar |
| P2 | Gantt milestone view | mfr-cm-calendar |

## 6. Волна 70 — сделано

| Изменение | Деталь |
|-----------|--------|
| Hub | `brand/shop/mfr/sup-cm-calendar-link` + events count |
| Strips | `*-cm-calendar-context-strip` (канон testids) |
| Shop | Order links всегда видны (не только logistics layer) |
| Brand | + chain + tracking в strip |
| Supplier | procurement href `role=supplier` |
| Pages | `*-cm-calendar-events-badge` |

## 7. Волна 46 — сделано

- `shopCalendarB2bOrderContextHref`: core → `layers=orders,logistics`
- `factoryCalendarB2bOrderContextHref`: `layers=tasks,orders,production`
- Hub shop comms: убран дубль «Календарь · закупки»
- Factory/supplier calendar: `factory-calendar-order-context-strip` при `?order=`
- `sup-cm-calendar` resolveHref → canonical supplier calendar
- SECTION_AUDIT good/bad обновлены
