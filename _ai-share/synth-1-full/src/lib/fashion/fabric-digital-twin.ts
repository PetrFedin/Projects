import type { FabricDigitalTwinV1 } from './types';

/** Техническая спецификация "Цифровой двойник" качества ткани. */
export function getFabricTwinData(sku: string): FabricDigitalTwinV1 {
  // Demo simulation logic
  const seed = sku.split('-')[1] || '100';
  let numSeed = parseInt(seed, 10);
  if (isNaN(numSeed)) numSeed = sku.length * 7;

  return {
    sku,
    martindaleCycles: 20000 + (numSeed * 100),
    pillingGrade: (numSeed % 2 === 0) ? 4 : 4.5,
    colorFastness: 4.8,
    breathabilityGsm: 180 + (numSeed % 50),
    washDurability: 50 + (numSeed % 20),
  };
}
