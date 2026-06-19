# Глоссарий идентификаторов (Этап 0)

Согласованные имена сущностей и id для сквозных ссылок в чате, календаре, API и UI. Реализация в коде может использовать префиксы (`B2B_*`, query-параметры) — здесь зафиксирован **смысл**.

| ID / поле | Сущность | Кто владеет | Где используется |
|-----------|----------|-------------|------------------|
| `wholesaleOrderId` | Оптовый заказ B2B (канонический идентификатор заказа) | Бренд (подтверждение); создатель — магазин или дистрибутор | Реестры заказов, экспорт, чат/календарь, deep links |
| `b2bOrderId` / внутренний заказ | Обёртка заказа в конкретном кабинете (если отличается от wholesale) | По контракту read-model | UI-списки; маппинг на `wholesaleOrderId` обязателен |
| `collectionId` | Коллекция (набор SKU под одной публикацией) | Бренд | Шоурум, презентации, фильтры заказа |
| `skuId` | Торговая единица (размер/цвет/вариант) | Бренд | Строки заказа, остатки, маркировка |
| `brandId` | Бренд-продавец | Платформа / бренд | Партнёрство, шоурум, заказы |
| `distributorId` | Дистрибутор (мультибрендовый канал) | Дистрибутор | Заказы «через дистрибутора», портфель брендов |
| `shopId` / `retailerId` | Магазин (покупатель B2B) | Магазин | Заказы, доставка, претензии как инициатор |
| `poId` | Заказ на производство (purchase order в цех) | Бренд → производство | Производство, приёмка ГП |
| `productionBatchId` | Партия производства | Производство / бренд | Приёмка брендом до отгрузки в магазин |
| `shipmentId` | Отгрузка / перевозка | Логистика | Трекинг, приёмка |
| `threadId` | Поток чата с контекстом сущности | Система | Привязка к `wholesaleOrderId`, `collectionId`, … |
| `integration.externalOrderId` | Внешний id заказа (JOOR/NuOrder/Zedonk/AM) | Внешняя платформа | Только ref; канон сделки — `wholesaleOrderId` (ADR-002) |
| `IntegrationExternalRef` | Связь ext id ↔ syntha entity | Connector | `platform`, `externalId`, `synthaEntityType`, `synthaEntityId` |
| `eligibleForCollection` | SKU допущен в showroom/matrix | Бренд / Centric Approved | Gate F-ELIGIBLE; API `GET …/integrations/v1/articles/:col/:art/eligible` |
| `sourcePlatform` | Источник wholesale-заказа | OO DTO `integration` | `syntha` \| `joor` \| `nuorder` \| … |
| `calendarEventId` | Событие календаря | Система | Сроки ЭДО, отгрузки, встречи, дедлайны гейтов |
| `supplierId` | Поставщик сырья/фурнитуры | Бренд (контракт) | RFQ, поставки на фабрику — **не** прямая линия к магазину |
| `manual` / `partial` | Пометка источника себестоимости | Бренд / финконтур | Прозрачность для инвестора и аудита |
| `cogsAcknowledgedAt` / `cogsAcknowledgedBy` | Отметка явного подтверждения при неполной себестоимости (аудит) | Бренд | См. [ADR-0001](./ADR/ADR-0001-cost-confirmation-without-full-cogs.md) |

**Инвариант:** в одном оптовом заказе на протяжении жизненного цикла используется **один** `wholesaleOrderId` (см. `src/lib/domain/cross-role-entity-ids.ts`).

---

## Согласование с кодом (этап 0, пункт A3 чеклиста)

Источник канона: **`src/lib/domain/cross-role-entity-ids.ts`** (+ типы `WholesaleOrderId` в `operational-order-dto`, `B2BOrder` в `@/lib/types`).

| Глоссарий (продукт) | В коде / DTO | Примечание |
|---------------------|--------------|------------|
| `wholesaleOrderId` | Тип `WholesaleOrderId`; в `B2BOrder` поле **`order`**; извлечение: `getWholesaleOrderIdFromB2BOrder()` | Один канон на сделку |
| Query чата/контекста заказа | `B2B_WHOLESALE_ORDER_CONTEXT_QUERY`: `order`, `orderId` | Не менять рассинхронно с `routes.ts` |
| `collectionId` (бренд) / shop `collection` | `SHOP_B2B_COLLECTION_QUERY_PARAM` = `'collection'` | Один id сущности, разные имена параметра по контуру |
| `integration.*` / `IntegrationExternalRef` | `OperationalOrderIntegration` в `operational-order-dto.schema.ts`; refs в `src/lib/integrations/spine/` | ADR-002 Wave A5+ |
| `eligibleForCollection` | `GET /api/integrations/v1/articles/:collectionId/:articleId/eligible` | Centric Approved **or** W2 signoff/lifecycle |
| `cogsAcknowledgedAt` / `cogsAcknowledgedBy` | *Пока нет в DTO* | Ввод в этапе 2 по [ADR-0001](./ADR/ADR-0001-cost-confirmation-without-full-cogs.md) |

Остальные id из таблицы выше (`skuId`, `poId`, `threadId`, …) — в глоссарии как **продуктовые**; при появлении расхождений с типами/API обновлять эту секцию и чеклист A3.

**РФ-документы (поля продукта, не исчерпывающий список):** УПД, счёт-фактура, статусы ЭДО, признаки НДС, идентификаторы маркировки (ГИС МТ) — уточняются в ADR по волне интеграции.
