import type { ClickAndCollectV1 } from './types';

/** Управление статусами заказов Click & Collect (самовывоз из магазина). */
export function getClickAndCollectStatus(orderId: string): ClickAndCollectV1 {
  const seed = parseInt(orderId.split('-')[1] || '100', 10);
  const date = new Date();
  date.setDate(date.getDate() + 1); // ready tomorrow
  
  return {
    orderId,
    storeId: 'STORE-MOSCOW-CENTRAL',
    readyForPickupDate: date.toISOString().split('T')[0],
    storageDaysLimit: 7,
    status: seed % 3 === 0 ? 'ready' : (seed % 3 === 1 ? 'in_transit_to_store' : 'picking')
  };
}
