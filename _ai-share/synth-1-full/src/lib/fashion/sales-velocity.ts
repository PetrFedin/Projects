import type { Product } from '@/lib/types';
import type { SalesVelocityRow } from './types';

/** Демо-расчет скорости продаж (в проде — из BI / BigQuery). */
export function buildSalesVelocityRows(products: Product[]): SalesVelocityRow[] {
  return products
    .map((p) => {
      const randomSold = Math.floor(Math.random() * 200);
      const randomStock = Math.floor(Math.random() * 150);
      const velocity = randomSold / 30; // units/day
      const daysToOOS = velocity > 0 ? Math.round(randomStock / velocity) : null;

      let status: SalesVelocityRow['status'] = 'stable';
      if (randomSold > 120 && daysToOOS !== null && daysToOOS < 14) status = 'critical';
      else if (randomSold > 100) status = 'bestseller';
      else if (randomSold < 20) status = 'slow-mover';

      return {
        sku: p.sku,
        name: p.name,
        category: p.category,
        unitsSold: randomSold,
        inventoryLevel: randomStock,
        daysToOOS,
        status,
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold);
}
