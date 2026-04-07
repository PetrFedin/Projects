import type { SupplierQcReportV1 } from './types';

/** Хаб контроля качества (ОТК) для поставщиков. */
export function getSupplierQcReport(sku: string): SupplierQcReportV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 17;

  const passRate = 95 + (seed % 5);
  const status: SupplierQcReportV1['status'] = passRate > 97 ? 'approved' : (passRate > 94 ? 'rework' : 'rejected');

  return {
    sku,
    batchId: `BATCH-${seed}-2026`,
    inspectionDate: new Date().toISOString().split('T')[0],
    passRate,
    criticalDefects: status === 'approved' ? [] : ['Minor stitching inconsistency', 'Label alignment'],
    supplierName: seed % 2 === 0 ? 'Ivanovo Textile Group' : 'Ural Garment Factory',
    status,
  };
}
