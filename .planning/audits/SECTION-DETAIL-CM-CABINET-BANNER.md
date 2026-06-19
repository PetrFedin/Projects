# SECTION-DETAIL — Кабинет · связь + контекст-баннер (столп 5)

> **Кластер:** `brand-cm-banner` · `brand-cm-cabinet` · `shop-cm-cabinet` · `mfr-cm-cabinet` · `sup-cm-cabinet`  
> **Почему третий:** hub-вход во **все 4 роли** + единый chrome сообщений/календаря; баннер — dedupe URL-контекста.  
> **Оценки:** brand-banner 7.4 · brand-cabinet 7.7 · shop-cabinet 7.7 · mfr-cabinet 7.9 · sup-cabinet 7.7 · UAT 0/5.

## 1. Зачем раздел каждой роли

| Роль | Кабинет (hub) | Баннер (workspace) | Не нужно |
|------|---------------|-------------------|----------|
| **Бренд** | CommsPillarCard compact: чат/календарь/артикул/inbox | `brand-cm-banner` slim при `?order=` | Full card дубль, RU workspace banner в core |
| **Магазин** | То же + buyer switcher на workspace | B2bOrderUrlContextBanner off в core | Notifications center |
| **Цех** | + CTA поставщик, очередь handoff | Factory banner off при order в URL | Policy strip в workspace |
| **Поставщик** | inbox-all parity (волна 45) | То же factory dedupe | Push, hub CTA дубль full card |

## 2. Cross-role поток

```
/role/core?pillar=comms → CommsPillarCard (chain-overview + calendar-events counts)
       ↓
«Открыть рабочий экран» → messages/calendar + PlatformCoreCommsWorkspaceExtras
       ↓
CommunicationsEntityContextBanner (brand/shop) | Factory delegate (mfr/sup)
       ↓
hasUrlContext → slim banner 1× | !hasUrlContext → demo PO banner (factory only без order)
```

## 3. По разделам

### brand-cm-banner (7.4)

| ✅ | ⚠️ |
|----|-----|
| `brand-cm-banner` testid (волна 71) | Policy strip вне workspace (non-core paths) |
| Core B2B msg/cal hrefs при `?order=` | Production-context banner ещё syntha tasks |
| slimWorkspace без CTA-дубля с cross-nav | |
| core-14 dedupe + core-13 cross-nav | |

### brand-cm-cabinet (7.6)

| ✅ | ⚠️ |
|----|-----|
| `brand-cm-cabinet-thread-search` в hub (волна 72) | Unified inbox всех PO |
| `brand-cm-thread-search` в workspace slimCore | |
| hub links 68–70, unread на inbox | |

### shop-cm-cabinet (7.6)

| ✅ | ⚠️ |
|----|-----|
| `shop-cm-cabinet-thread-search` (волна 72) | Notifications prefs |
| shop-cm-thread-search workspace | |

### mfr-cm-cabinet (7.8)

| ✅ | ⚠️ |
|----|-----|
| `mfr-cm-cabinet-thread-search` (волна 72) | Unified inbox всех PO |
| supplier-thread, handoff compact | |

### sup-cm-cabinet (7.6)

| ✅ | ⚠️ |
|----|-----|
| `sup-cm-cabinet-thread-search` (волна 72) | Push / SSE unread |
| sup-cm-thread-search workspace | |

## 4. Волна 71 — сделано

- `CommunicationsEntityContextBanner`: core B2B `msgHref`/`calHref`; testids `brand-cm-banner` / `shop-cm-banner`
- `PlatformCoreFactoryCommsContextBanner`: `mfr-cm-banner` / `sup-cm-banner`; calendar → `factory*CalendarB2bOrderContextHref` в core
- e2e core-01/02/14: role-specific banner testids
- SECTION_AUDIT live scores обновлены

## 5. Волна 72 — сделано

- `CommsPillarThreadStrip`: PG threads + поиск в hub (4 роли)
- `ChatList` slimCore: RU «Треды» / «Поиск тредов…»
- `*-cm-thread-search` testids в messages workspace
- e2e core-01: cabinet-thread-search (4 роли)

## 6. Волна 73 — unified PO inbox

- `mergeCommsHubInboxThreadRows` — все PO реестра/очереди + placeholder (parity messages)
- `*-cm-cabinet-po-inbox` testid; mfr/sup метки `PO … · orderId`
- «Ещё N заказов» → «Все треды»

## 7. План P1+ (волна 74+)

| Задача | Разделы |
|--------|---------|
| Push / SSE unread в hub card | все cabinet |
| Production-context banner → W2 hrefs в core | brand-cm-banner |
| SSE poll indicator | *-op-cabinet |
