# SECTION-DETAIL — Чат · артикул W2 (столп 5 + cross-entry)

> **Кластер:** `brand-cm-article-chat` · `mfr-cm-article` · `sup-cm-article` · shop (витрина/матрица, без отдельного section id)  
> **Контекст PG:** `contextType=workshop2_article` · `contextId=SS27:demo-ss27-01`  
> **Следующий после:** [SECTION-DETAIL-CM-ORDER-CHAT.md](./SECTION-DETAIL-CM-ORDER-CHAT.md)

## 1. Зачем раздел каждой роли

| Роль | Обязательно | Не нужно |
|------|-------------|----------|
| **Бренд** | Уточнение ТЗ цеху/поставщику, attach ZIP ТЗ, export | RFQ-форма, редактирование BOM поставщика |
| **Магазин** | Вопрос по артикулу до заказа (showroom/matrix) | W2 dossier edit, handoff |
| **Цех** | Read-only: уточнить состав/образец у бренда | Attach TZ (автор — бренд) |
| **Поставщик** | Цена/срок материалов по BOM, quote в чате | Создание ТЗ, matrix |

## 2. Cross-role поток

```
Brand W2 dossier ──publish──► Factory dossier (read-only)
       │                              │
       ├─ article-chat ──────────────┤ mfr-cm-article
       │                              │
       └─ BOM in dossier ───────────► sup-cm-article / sup-dev-chat (тот же URL)
              │
Shop showroom/matrix ──article-chat──► shop messages (вопрос бренду)
```

**Работает:** PG threads, шаблоны `article-tz` / `article-sample` / `article-price-quote`, attach TZ (brand), `factory-dossier-article-chat-link`, showroom/matrix chat CTAs.  
**Не работает:** push в W2 workspace panel, unified dedupe e2e factory banner, SLA quote card.

## 3. По ролям

### Бренд (`brand-cm-article-chat` · 7.3)

| ✅ | ❌ / ⚠️ |
|----|---------|
| `brand-dossier-article-chat-link`, export + attach TZ | Push только через messages/inbox |
| Cross: досье цеха, sample handoff, supplier BOM | RFQ legacy в supply panel (вне core path) |

### Магазин (entry: `shop-sc-showroom`, `shop-co-matrix` · ~7.4)

| ✅ | ❌ |
|----|-----|
| `shop-showroom-article-chat-link-*`, matrix chat | Нет отдельного `shop-cm-article-chat` в audit |
| `comms-pillar-article-chat-compact` | Article-chat не из order-chat раздела |

### Цех (`mfr-cm-article` · 7.3)

| ✅ | ❌ |
|----|-----|
| `factory-dossier-article-chat-link` | Attach TZ (read-only роль) |
| comms pillar article CTA | Dedupe banner e2e слабый |

### Поставщик (`sup-cm-article` · 7.3)

| ✅ | ❌ |
|----|-----|
| `/factory/supplier/messages` canonical | **Дубль nav:** `sup-dev-chat` (столп 1) = тот же href |
| `article-price-quote` template | Нет structured quote card в UI |

## 4. Волна 69 — сделано

| Изменение | Деталь |
|-----------|--------|
| Context strips | `*-cm-article-context-strip` (brand/mfr/sup/shop) |
| Hub testids | `brand/shop/mfr/sup-cm-article-chat-link` |
| W2 drawer | `brand-cm-article-messages-link` → full messages |
| sup-dev-chat | Unified `sup-cm-article-chat-link` (alias) |
| Order strip | Скрыт при `contextType=workshop2_article` (шум) |

**Оценки:** brand 7.5 · mfr 7.5 · sup 7.5

## 5. Волна 45 — исправления

| Файл | Изменение |
|------|-----------|
| `CommsPillarCard` | Article chat для **supplier** + canonical hrefs |
| `materials-core` | Procurement «Чат» → `factorySupplierMessagesB2bOrderContextHref` |
| `SupplierProcurementPillarCard` | Canonical supplier URLs + testids article/order |
| `platform-core-b2b-message-templates` | `article-price-quote` |

## 6. План P1+

| P | Задача |
|---|--------|
| P1 | SSE unread в `Workshop2ArticleWorkspaceChatPanel` |
| P1 | Hub: один CTA sup-dev-chat ↔ sup-cm-article |
| P2 | E2E article templates на supplier messages |
| P2 | Quote card UI (не только template text) |
| P3 | Слить shop article entry в optional `shop-cm-article-chat` section id |

## 7. UAT (4 пункта)

1. Бренд W2: attach TZ → messages → `contextual-chat-attachment-link` виден.  
2. Цех dossier: «Чат по артикулу» → factory messages с article context.  
3. Поставщик materials: «Чат · артикул» → шаблон «Запрос цены материала».  
4. Магазин showroom: «Вопрос по артикулу» → shop messages, не order chat.
