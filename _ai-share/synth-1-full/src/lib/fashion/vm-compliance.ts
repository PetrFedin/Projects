import type { VmComplianceV1 } from './types';

/** Скоринг соответствия выкладки (VM Compliance) по фотоотчетам из магазинов. */
export function getVmComplianceScore(sku: string, storeId: string = 'STORE-MOSCOW-01'): VmComplianceV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 23;

  const score = 75 + (seed % 25); // 75-100%
  const status: VmComplianceV1['photoReportStatus'] = score > 90 ? 'approved' : (score > 80 ? 'pending' : 'rejected');

  const notes = status === 'approved' ? ['Perfect alignment with SS26 Planogram'] : ['Color blocking mismatch', 'Incorrect hanger type'];

  return {
    storeId,
    sku,
    planogramMatchScore: score,
    photoReportStatus: status,
    lastReportDate: new Date().toISOString().split('T')[0],
    complianceNotes: notes,
  };
}
