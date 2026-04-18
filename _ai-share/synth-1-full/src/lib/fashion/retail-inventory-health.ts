import type { RetailInventoryHealthV1 } from './types';

/** Аналитика здоровья остатков в конкретном магазине. */
export function getRetailInventoryHealth(sku: string, storeId: string): RetailInventoryHealthV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 17;
  const onHand = 15 + (seed % 50);
  const minBuffer = 20;

  let status: RetailInventoryHealthV1['status'] = 'healthy';
  let action = 'Maintain current display.';

  if (onHand < minBuffer) {
    status = onHand < 5 ? 'critical' : 'at_risk';
    action = onHand < 5 ? 'Emergency restock required.' : 'Plan restock within 3 days.';
  } else if (onHand > minBuffer * 2.5) {
    status = 'excess';
    action = 'Initiate markdown or Store-to-Store swap.';
  }

  return {
    storeId,
    sku,
    onHand,
    minBuffer,
    status,
    action,
  };
}
