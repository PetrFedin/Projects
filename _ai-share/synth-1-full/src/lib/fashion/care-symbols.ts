import type { Product } from '@/lib/types';
import type { CareSymbolDef } from './types';

/** Стандартный набор пиктограмм ухода (демо → позже из PIM / GS1). */
export const CARE_SYMBOL_LIBRARY: CareSymbolDef[] = [
  { id: 'wash_30', label: 'Стирка до 30 °C', short: '30°' },
  { id: 'wash_40', label: 'Стирка до 40 °C', short: '40°' },
  { id: 'no_bleach', label: 'Не отбеливать', short: '⊘Cl' },
  { id: 'no_tumble', label: 'Без сушки барабаном', short: '⊘Dry' },
  { id: 'cool_iron', label: 'Глажка низкой температуры', short: 'Iron·' },
  { id: 'dry_clean', label: 'Химчистка (P)', short: 'P' },
  { id: 'line_dry', label: 'Сушка на горизонтали', short: 'Flat' },
];

const DEFAULT_CARE_IDS = ['wash_30', 'no_bleach', 'cool_iron', 'no_tumble'];

export function resolveCareSymbolIds(product: Product): string[] {
  const raw = product.attributes?.care;
  if (Array.isArray(raw) && raw.length) return raw.map(String);
  if (typeof raw === 'string' && raw.trim())
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return [...DEFAULT_CARE_IDS];
}

export function careSymbolsForProduct(product: Product): CareSymbolDef[] {
  const ids = new Set(resolveCareSymbolIds(product));
  return CARE_SYMBOL_LIBRARY.filter((c) => ids.has(c.id));
}
