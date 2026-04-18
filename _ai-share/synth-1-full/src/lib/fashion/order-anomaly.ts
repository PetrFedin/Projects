import type { OrderAnomalyV1 } from './types';

/** AI-симуляция обнаружения аномалий в оптовых заказах. */
export function detectOrderAnomalies(items: { sku: string; quantity: number }[]): OrderAnomalyV1[] {
  const anomalies: OrderAnomalyV1[] = [];

  items.forEach((item) => {
    // Overstock simulation: quantity > 1000 for single SKU in B2B context
    if (item.quantity > 1000) {
      anomalies.push({
        sku: item.sku,
        quantity: item.quantity,
        anomalyType: 'overstock',
        severity: 'high',
        reason: 'Quantity exceeds typical partner capacity for this category.',
        suggestion: 'Reduce by 30% to avoid inventory risk at POS.',
      });
    }

    // Size imbalance simulation: many items, few sizes (simplified)
    if (item.quantity > 50 && item.quantity % 12 !== 0) {
      anomalies.push({
        sku: item.sku,
        quantity: item.quantity,
        anomalyType: 'size_imbalance',
        severity: 'medium',
        reason: "Order doesn't follow full size curve pack rules (multiples of 12).",
        suggestion: 'Adjust to nearest pack multiple to optimize logistics.',
      });
    }
  });

  return anomalies;
}
