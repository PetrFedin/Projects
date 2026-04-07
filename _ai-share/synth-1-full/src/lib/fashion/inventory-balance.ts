import type { Product } from '@/lib/types';
import type { InventoryTransferV1 } from './types';

/** Предлагает переброску остатков между складами (демо-алгоритм). */
export function buildStockTransferProposals(products: Product[]): InventoryTransferV1[] {
  const locations = ['Warehouse North', 'Warehouse South', 'Flagship Store', 'Online Central'];
  const proposals: InventoryTransferV1[] = [];

  products.slice(0, 15).forEach((p, idx) => {
    if (idx % 3 === 0) {
      proposals.push({
        sku: p.sku,
        fromLocation: locations[idx % locations.length],
        toLocation: locations[(idx + 1) % locations.length],
        quantity: 12 + (idx % 10),
        reason: idx % 2 === 0 ? 'oos_prevention' : 'slow_mover_liquidation',
      });
    }
  });

  return proposals;
}
