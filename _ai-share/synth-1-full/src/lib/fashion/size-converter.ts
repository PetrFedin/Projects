import type { Product } from '@/lib/types';
import type { SizeConversionV1 } from './types';

/** Конвертер размеров для рынка РФ. */
export function convertSize(size: string, category: string): SizeConversionV1[] {
  // Базовая эвристика для женской одежды (RU 42 = EU 36 = S)
  const conversions: Record<string, any> = {
    'S': { RU: '42', EU: '36', US: '4', INTL: 'S' },
    'M': { RU: '44', EU: '38', US: '6', INTL: 'M' },
    'L': { RU: '46', EU: '40', US: '8', INTL: 'L' },
    'XL': { RU: '48', EU: '42', US: '10', INTL: 'XL' },
  };

  const c = conversions[size] || { RU: '42', EU: '36', US: '4', INTL: 'S' };
  
  return [
    { system: 'RU', value: c.RU },
    { system: 'EU', value: c.EU },
    { system: 'US', value: c.US },
    { system: 'INTL', value: c.INTL },
  ];
}
