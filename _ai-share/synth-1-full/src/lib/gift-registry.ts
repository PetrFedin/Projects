/**
 * Список подарков (Gift Registry) — РФ: свадьба, ДР, юбилей.
 * Инфраструктура под API: типы и эндпоинты. При подключении API — заменить mock на вызовы.
 * Связи: клиентская база, розничные заказы, отображение «куплено» по всей сети.
 */

export type GiftRegistryEventType = 'wedding' | 'birthday' | 'anniversary' | 'other';

export type GiftRegistryItemStatus = 'wished' | 'reserved' | 'purchased';

/** Элемент списка подарков */
export interface GiftRegistryItem {
  id: string;
  productId: string;
  sku?: string;
  title: string;
  imageUrl?: string;
  /** Цена в рублях (для отображения) */
  priceRub?: number;
  quantity: number;
  status: GiftRegistryItemStatus;
  /** Кто купил (при purchased): id заказа или «гость») */
  purchasedByOrderId?: string;
  purchasedByLabel?: string;
}

/** Список подарков */
export interface GiftRegistry {
  id: string;
  ownerUserId: string;
  eventType: GiftRegistryEventType;
  eventDate?: string;        // ISO date
  title: string;               // например «Свадьба Марии и Ивана»
  description?: string;
  createdAt: string;
  items: GiftRegistryItem[];
  /** Видимость: только по ссылке / по сети бренда */
  visibility: 'link_only' | 'network';
  /** Синхронизация «куплено» по всей сети магазинов/сайту */
  syncPurchasedAcrossNetwork: boolean;
}

/** Эндпоинты для будущего API (без вызовов) */
export const GIFT_REGISTRY_API = {
  list: '/api/v1/gift-registry',
  get: '/api/v1/gift-registry/:id',
  create: '/api/v1/gift-registry',
  update: '/api/v1/gift-registry/:id',
  addItem: '/api/v1/gift-registry/:id/items',
  removeItem: '/api/v1/gift-registry/:id/items/:itemId',
  /** Покупка из списка: привязка заказа к позиции (по всей сети) */
  markPurchased: '/api/v1/gift-registry/:id/items/:itemId/purchased',
  /** Бренд: списки по заказам/клиентам */
  listForBrand: '/api/v1/gift-registry/brand',
} as const;
