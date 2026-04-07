import type { StaffCommissionV1 } from './types';

/** Расчет комиссионных и бонусов для персонала магазинов. */
export function getStaffCommissionScheme(sku: string): StaffCommissionV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;
  
  return {
    sku,
    baseCommissionPercent: 2.5,
    bonusAmountRub: seed % 5 === 0 ? 500 : 0, // Extra 500 RUB per item if it's a focus SKU
    targetQuantity: 50,
    currentQuantity: 12 + (seed % 30),
    incentiveType: seed % 5 === 0 ? 'vm_compliance' : 'volume',
  };
}
