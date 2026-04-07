/**
 * Ship-from-Store — отправка онлайн-заказа из ближайшей точки (омниканал).
 * Связи: Заказы, склад, логистика, BOPIS. Инфра под API.
 */

export type ShipFromStoreStatus = 'eligible' | 'assigned' | 'picking' | 'shipped' | 'cancelled';

export interface ShipFromStoreAssignment {
  id: string;
  orderId: string;
  /** Точка, из которой отправили */
  storeId: string;
  storeName: string;
  status: ShipFromStoreStatus;
  assignedAt: string;
  shippedAt?: string;
  trackingNumber?: string;
}

export interface StoreEligibility {
  storeId: string;
  storeName: string;
  availableQty: number;
  distanceKm?: number;
}

export const SHIP_FROM_STORE_API = {
  getEligibleStores: '/api/v1/shop/ship-from-store/eligible',
  assignStore: '/api/v1/shop/ship-from-store/assign',
  listAssignments: '/api/v1/shop/ship-from-store/assignments',
  createShipment: '/api/v1/shop/ship-from-store/ship',
} as const;
