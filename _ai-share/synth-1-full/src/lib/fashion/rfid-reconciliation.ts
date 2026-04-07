import type { RfidReconciliationV1 } from './types';

/** Сверка остатков по RFID для розничных магазинов. */
export function getRfidReconciliation(sku: string): RfidReconciliationV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  const expected = 50 + (seed % 20);
  const scanned = seed % 10 === 0 ? expected - 2 : expected; // Demo discrepancy every 10th SKU

  return {
    sku,
    expectedQty: expected,
    scannedQty: scanned,
    discrepancy: scanned - expected,
    lastScanDate: new Date().toISOString().split('T')[0],
    status: scanned === expected ? 'matched' : 'discrepancy',
  };
}
