import type { SustainabilityLedgerV1 } from './types';

/** Прозрачный реестр материалов и эко-следа (Sustainability Ledger). */
export function getSustainabilityLedger(sku: string): SustainabilityLedgerV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  return {
    sku,
    materialOrigin: seed % 2 === 0 ? 'Ivanovo Cotton' : 'Ural Linen Hub',
    carbonFootprintKg: 12.5 + (seed % 10),
    waterUsageLiters: 1500 + (seed % 1000),
    isRecyclable: seed % 2 === 0,
    certificates: ['OEKO-TEX Standard 100', 'GOTS (Organic)'],
  };
}

export function getOrderSustainabilityScore(skus: string[]): number {
  return skus.length > 0 ? 82 : 0; // Mock aggregate score
}
