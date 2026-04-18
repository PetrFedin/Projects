import type { B2BQualityClaimV1 } from './types';

/** Управление претензиями по качеству (B2B Quality Claims). */
export function getB2BQualityClaim(sku: string): B2BQualityClaimV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 17;

  const reasons: B2BQualityClaimV1['reason'][] = [
    'fabric_defect',
    'stitching',
    'stain',
    'size_deviation',
  ];
  const statuses: B2BQualityClaimV1['status'][] = [
    'open',
    'under_review',
    'resolved',
    'credit_note_issued',
  ];

  return {
    claimId: `CLM-${seed}-RU`,
    sku,
    partnerId: 'RETAIL-PRO-01',
    reason: reasons[seed % reasons.length],
    status: statuses[seed % statuses.length],
    evidenceUrls: [`https://evidence.cdn/${sku}/defect-1.jpg`],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
  };
}
