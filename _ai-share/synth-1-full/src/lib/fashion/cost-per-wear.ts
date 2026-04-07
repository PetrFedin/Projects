import type { Product } from '@/lib/types';
import type { CostPerWearV1 } from './types';

/** Расчет стоимости за один выход (Investment dressing). */
export function calculateCostPerWear(product: Product, estimatedWears?: number): CostPerWearV1 {
  const price = product.price;
  
  // Эвристика ожидаемого срока службы на основе категории
  const defaultWears: Record<string, number> = {
    'Outerwear': 150,
    'Top': 60,
    'Bottom': 100,
    'Footwear': 200,
    'Accessory': 80,
    'Dress': 40,
  };

  const projected = estimatedWears ?? (defaultWears[product.category] || 50);
  const cpw = Math.round((price / projected) * 100) / 100;

  return {
    sku: product.sku,
    retailPrice: price,
    projectedWears: projected,
    costPerWear: cpw,
    investmentGrade: cpw < 100 ? 'high' : cpw < 300 ? 'medium' : 'low',
  };
}
