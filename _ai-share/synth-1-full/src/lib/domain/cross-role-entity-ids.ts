/**
 * Канон для межролевых ссылок и экранов (см. `CROSS_ROLE_FLOWS.md` §3–4, `CORE_OPERATING_CHAIN.md` P0-ENTITY).
 *
 * Первичный идентификатор оптового заказа в UI/DTO: **`wholesaleOrderId`** (сервер), в legacy {@link B2BOrder} — поле **`order`**.
 *
 * **Коллекция (collection):** на полу бренда и в production-URL используется **`collectionId`** (`stages-url.ts` → `COLLECTION_ID_PARAM`).
 * В shop-контуре лукбуков / «заказ по коллекции» тот же id сущности часто передаётся как **`collection`** — см. {@link SHOP_B2B_COLLECTION_QUERY_PARAM}.
 *
 * **Тред / чат:** глубокие ссылки «сообщения с контекстом заказа» задают пару **`order` + `orderId`** (оба = wholesale id) — см. {@link B2B_WHOLESALE_ORDER_CONTEXT_QUERY} и `routes.ts` (`*MessagesB2bOrderContextHref`).
 */

import type { B2BOrder } from '@/lib/types';
import type { WholesaleOrderId } from '@/lib/order/operational-order-dto';

export type { WholesaleOrderId };

/**
 * Имена query-параметров, которыми чаты и матрица помечают контекст оптового заказа (дублируют `routes.ts`, не менять рассинхронно).
 */
export const B2B_WHOLESALE_ORDER_CONTEXT_QUERY = {
  order: 'order',
  orderId: 'orderId',
} as const;

/**
 * Shop: id коллекции в лукбуках / deep link к заказу по коллекции (`?collection=…`).
 * Для бренда тот же id в других экран — обычно `collectionId`.
 */
export const SHOP_B2B_COLLECTION_QUERY_PARAM = 'collection';

/** Значение, по которому бренд и ритейлер ссылаются на одну и ту же сделку B2B. */
export function getWholesaleOrderIdFromB2BOrder(order: B2BOrder): WholesaleOrderId {
  return order.order;
}
