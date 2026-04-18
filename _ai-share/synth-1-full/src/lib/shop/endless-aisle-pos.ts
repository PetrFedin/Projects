/**
 * Endless Aisle POS — заказ отсутствующего размера со склада бренда из примерочной (планшет).
 * Связи: Склад, каталог, BOPIS, заказы. Инфра под API.
 */

export type EndlessAisleOrderStatus =
  | 'created'
  | 'reserved'
  | 'shipping'
  | 'at_store'
  | 'ready_pickup'
  | 'picked_up'
  | 'cancelled';

export interface EndlessAisleRequest {
  id: string;
  storeId: string;
  /** SKU который клиент примерял, размер отсутствовал в магазине */
  requestedSku: string;
  sizeRequested: string;
  /** Склад бренда, с которого резервируют */
  sourceWarehouseId?: string;
  status: EndlessAisleOrderStatus;
  orderId?: string;
  /** BOPIS: доставка в эту точку */
  pickupPointId?: string;
  createdAt: string;
}

export const ENDLESS_AISLE_POS_API = {
  createRequest: '/api/v1/shop/endless-aisle/request',
  listRequests: '/api/v1/shop/endless-aisle/requests',
  getCatalogBySku: '/api/v1/shop/endless-aisle/catalog-by-sku',
  reserveFromWarehouse: '/api/v1/shop/endless-aisle/reserve',
} as const;
