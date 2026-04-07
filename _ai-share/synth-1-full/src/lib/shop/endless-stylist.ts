/**
 * Endless Stylist Tablet — сборка полного образа из онлайн-каталога на планшете продавца.
 * Связи: Clienteling, каталог, заказы. Инфра под API.
 */

export interface StylistLook {
  id: string;
  /** Позиции в образе */
  items: { productId: string; sku?: string; name: string; imageUrl?: string }[];
  customerId?: string;
  createdAt: string;
}

export interface StylistSession {
  id: string;
  staffId: string;
  customerId?: string;
  lookIds: string[];
  orderId?: string;
  startedAt: string;
}

export const ENDLESS_STYLIST_API = {
  createLook: '/api/v1/shop/stylist/looks',
  getCatalog: '/api/v1/shop/stylist/catalog',
  createOrderFromLook: '/api/v1/shop/stylist/looks/:id/order',
} as const;
