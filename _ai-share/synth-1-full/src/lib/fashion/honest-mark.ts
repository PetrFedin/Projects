import type { Product } from '@/lib/types';
import type { HonestMarkStatusV1 } from './types';

/** Проверка соответствия системе "Честный ЗНАК" (Mandatory Labeling RF). */
export function getHonestMarkStatus(product: Product): HonestMarkStatusV1 {
  const isFootwear = product.category === 'Footwear';
  const isLinen = product.category === 'Top' && product.name.toLowerCase().includes('shirt');

  // Эвристика ТН ВЭД кодов
  const tnvedMap: Record<string, string> = {
    Outerwear: '6201',
    Top: '6105',
    Dress: '6204',
    Footwear: '6403',
  };

  return {
    sku: product.sku,
    status: product.id.length % 5 === 0 ? 'pending' : 'active',
    gtin: `46${product.id.slice(0, 11).padEnd(11, '0')}`,
    tnved: tnvedMap[product.category] || '6101',
    labelType: isFootwear ? 'footwear' : isLinen ? 'linen' : 'clothing',
    updatedAt: new Date().toISOString(),
  };
}
