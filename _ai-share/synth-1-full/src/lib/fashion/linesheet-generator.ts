import type { Product } from '@/lib/types';
import type { LineSheetV1 } from './types';

/** Генератор лайт-шитов для оптовых продаж (B2B Line Sheets). */
export function generateLineSheet(products: Product[]): LineSheetV1 {
  return {
    id: `LS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    collectionName: 'Main Collection SS26',
    items: products.slice(0, 15).map(p => ({
      sku: p.sku,
      wholesalePrice: Math.round(p.price * 0.55),
      moq: 50,
    })),
    lastExported: new Date().toISOString().split('T')[0],
  };
}
