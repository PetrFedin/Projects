/**
 * JOOR-style константы: окна доставки, MOQ по стилю.
 * Связь с матрицей заказа и страницей заказа.
 */

import type { B2BDeliveryWindow } from '@/lib/order/b2b-order-payload';

/** Окна доставки (дропы) — Start Ship Date / Complete Ship Date */
export const JOOR_DELIVERY_WINDOWS: B2BDeliveryWindow[] = [
  {
    id: 'drop1',
    label: 'Drop 1: Июль 2026',
    startShipDate: '2026-07-01',
    completeShipDate: '2026-07-15',
    cancelDate: '2026-06-20',
  },
  {
    id: 'drop2',
    label: 'Drop 2: Август 2026',
    startShipDate: '2026-08-01',
    completeShipDate: '2026-08-15',
    cancelDate: '2026-07-20',
  },
  {
    id: 'drop3',
    label: 'Drop 3: Сентябрь 2026',
    startShipDate: '2026-09-01',
    completeShipDate: '2026-09-15',
    cancelDate: '2026-08-20',
  },
];

/** JOOR: минимальный заказ по стилю (productId -> MOQ). При API — с бэкенда. */
export const JOOR_MOQ_BY_PRODUCT: Record<string, number> = {
  p1: 12,
  '1': 10,
  '2': 8,
  '3': 6,
  '4': 12,
  '5': 6,
};

/** Получить MOQ для продукта */
export function getMoqForProduct(productId: string): number {
  return JOOR_MOQ_BY_PRODUCT[productId] ?? 6;
}
