# SECTION-DETAIL — Чат · оптовый заказ (столп 5 «Связь»)

> **Кластер:** `brand-cm-order-chat` · `shop-cm-order-chat` · `mfr-cm-order` · `sup-cm-order`  
> **Почему первый:** единственный функциональный раздел с **одинаковой бизнес-ролью во всех 4 ролях** — координация по B2B-заказу `B2B-DEMO-SHOP1-SS27`.  
> **Оценки (честно):** brand 7.4 · shop 7.6 · mfr 7.5 · sup 7.4 · UAT 0/4 (волна 68).

## 1. Зачем раздел каждой роли

| Роль | Обязательный функционал | Не нужно в core |
|------|------------------------|-----------------|
| **Бренд** | Тред `b2b_order`, шаблоны ship-window/qty, unread, связь с реестром/handoff | CRM массовых рассылок, AI-бот заказа |
| **Магазин** | Тот же тред с buyer actor, amend-контекст, превью в реестре | Редактирование ТЗ, PO-очередь |
| **Цех** | Тред по PO, ссылки из очереди handoff и prod-orders, cross к поставщику | Редактирование матрицы заказа |
| **Поставщик** | Тред по заказу (материалы/логистика), RFQ→chat redirect | Управление handoff бренда |

## 2. Cross-role поток данных

```
Shop checkout → PG order → brand registry (SSE)
       ↓
brand-cm-order-chat ←→ shop-cm-order-chat   (PG contextual threads, readerId per role)
       ↓
brand handoff → mfr-cm-order ←→ sup-cm-order (factory/supplier messages, role query)
       ↓
calendar-events (targetChatId) ↔ core-13 cross-nav (4 роли)
```

**Работает:** PG threads, placeholder при пустом треде, server read receipts (волна 33), registry SSE bump unread (28), core-13/14 e2e.  
**Не работает / частично:** push (только poll/SSE hub), unified inbox всех PO у цеха, пользовательские шаблоны, JWT-bound actor.

## 3. По ролям — хорошо / плохо / тупики

### Бренд (`brand-cm-order-chat` · 7.2)

| ✅ | ⚠️ / ❌ |
|----|---------|
| Universal inbox sidebar, B2B шаблоны, превью в реестре | Нет своих шаблонов (только preset) |
| PG unread + server read-state | Нет push в W2 workspace при новом сообщении |
| `bad[]` только «шаблоны» | Policy strip дубль на factory calendar (см. banner) |

**Тупики:** нет — CTA из реестра, detail, calendar ведут в тред с `order=`.

### Магазин (`shop-cm-order-chat` · 7.5)

| ✅ | ⚠️ / ❌ |
|----|---------|
| Единственный раздел с **пустым bad[]** | Article-chat из витрины — отдельный раздел, не order-chat |
| buyer org/session (35–38), amend контекст рядом | Нет server amend — чат не отражает правки заказа автоматически |
| Article links matrix/showroom | Два календаря в nav (шум, canonical `/shop/b2b/calendar`) |

### Цех (`mfr-cm-order` · 7.4)

| ✅ | ⚠️ / ❌ |
|----|---------|
| `mfr-op-queue-chat-*` → messages (исправлено в39) | Inbox не агрегирует все PO из prod-orders |
| `factory-production-order-chat-*` | Нет attach TZ из досье в тред |
| CTA «Поставщик» в compact cabinet | Full card без cross-link поставщику (только compact) |

### Поставщик (`sup-cm-order` · 7.2)

| ✅ | ⚠️ / ❌ |
|----|---------|
| `/factory/supplier/messages` + order context | Дубль entry: dev chat vs article chat |
| Universal inbox merge в API | Нет quote templates в slim |
| core-13 calendar cross-nav | Dedupe banner e2e слабый |

## 4. Шум и канон

| Проблема | Где | Волна 45 |
|----------|-----|----------|
| «Все треды» только brand/shop/mfr compact | `CommsPillarCard` | ✅ supplier + full card |
| Дубль unread badge на «Чат» и «Все треды» | compact | Оставить один badge на inbox |
| Factory comms: handoff в full card рядом с чатом | не тупик, но смешивает столпы 4/5 | label «Очередь передачи» ок |

## 5. Волна 68 — сделано

| Изменение | Деталь |
|-----------|--------|
| Context strips | `*-cm-order-context-strip` на workspace (4 роли) |
| Hub testids | `brand/shop/mfr/sup-cm-order-chat-link` |
| Unread badge | Только на «Все треды», не на «Чат» |
| sup resolveHref | `factorySupplierMessagesB2bOrderContextHref` |

## 6. План доработок (P1+)

| Приоритет | Задача | Разделы |
|-----------|--------|---------|
| P1 | Unified PO inbox sidebar (все PG orders для mfr/sup) | mfr-cm-order, sup-cm-order |
| P1 | Пользовательские B2B-шаблоны (save preset) | brand-cm-order-chat |
| P2 | Push/SSE unread в W2 article panel | brand-cm-article-chat |
| P2 | Full card: CTA «Поставщик» для manufacturer | mfr-cm-cabinet |
| P2 | Quote templates supplier | sup-cm-order |
| P3 | Слить dev↔article chat entry (supplier) | sup-cm-article |

## 7. UAT (4 пункта кластера)

1. Бренд: реестр → превью треда → полный чат → шаблон ship-window отправляется.
2. Магазин: tracking CTA «Чат» → тот же order context → unread сбрасывается после read.
3. Цех: handoff queue snippet «Чат» → `/factory/production/messages?order=…` (не handoff URL).
4. Поставщик: procurement → messages с order → core-13 calendar → обратно в чат.

## 8. Следующий SECTION-DETAIL

`brand-cm-article-chat` / `mfr-cm-article` / `sup-cm-article` — чат по артикулу W2 (3 роли + cross к BOM).
