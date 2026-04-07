import type { Product } from '@/lib/types';
import type { RegionalStockV1 } from './types';

/** Региональная логистика и остатки (RF Clusters). */
export function getRegionalStocks(product: Product): RegionalStockV1[] {
  const baseQty = product.id.length % 100;
  
  return [
    { warehouse: 'Central (Moscow)', quantity: baseQty, deliveryDays: 1, lastSync: '2026-03-31' },
    { warehouse: 'South (Krasnodar)', quantity: Math.floor(baseQty * 0.4), deliveryDays: 3, lastSync: '2026-03-31' },
    { warehouse: 'Ural (Ekaterinburg)', quantity: Math.floor(baseQty * 0.2), deliveryDays: 4, lastSync: '2026-03-30' },
    { warehouse: 'Siberia (Novosibirsk)', quantity: Math.floor(baseQty * 0.1), deliveryDays: 5, lastSync: '2026-03-31' },
  ];
}
