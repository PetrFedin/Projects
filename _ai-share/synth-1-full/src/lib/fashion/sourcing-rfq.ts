import type { Product } from '@/lib/types';
import type { SourcingRfqV1 } from './types';

/** Создает черновик запроса котировок (Sourcing RFQ). */
export function createSourcingRfq(product: Product, qty: number): SourcingRfqV1 {
  return {
    id: `RFQ-${product.sku}-${Date.now().toString().slice(-4)}`,
    sku: product.sku,
    targetQty: qty,
    targetPrice: Math.round(product.price * 0.2), // Target 20% of retail
    status: 'draft',
  };
}
