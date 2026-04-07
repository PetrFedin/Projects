import type { SizeConversionRow } from './types';

/** Демо-таблица верхней одежды (не замена брендового fit guide). */
export const APPAREL_SIZE_TABLE: SizeConversionRow[] = [
  { label: 'XXS', eu: '40', us: '0', uk: '4' },
  { label: 'XS', eu: '42', us: '2', uk: '6' },
  { label: 'S', eu: '44', us: '4', uk: '8' },
  { label: 'M', eu: '46', us: '6', uk: '10' },
  { label: 'L', eu: '48', us: '8', uk: '12' },
  { label: 'XL', eu: '50', us: '10', uk: '14' },
  { label: 'XXL', eu: '52', us: '12', uk: '16' },
];

/** Обувь EU → US (муж., усреднённо). */
export const FOOTWEAR_EU_US: { eu: string; us: string }[] = [
  { eu: '39', us: '6.5' },
  { eu: '40', us: '7' },
  { eu: '41', us: '8' },
  { eu: '42', us: '8.5' },
  { eu: '43', us: '9.5' },
  { eu: '44', us: '10' },
  { eu: '45', us: '11' },
];

export function findApparelRowByLabel(label: string): SizeConversionRow | undefined {
  const n = label.trim().toUpperCase();
  return APPAREL_SIZE_TABLE.find((r) => r.label.toUpperCase() === n);
}
