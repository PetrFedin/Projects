/**
 * Faire: Values-based фильтры — Eco, Sustainable, Women-owned и т.п.
 * Используется в каталоге и поиске для фильтрации по ценностям бренда/продукта.
 */

export type ValuesFilterId =
  | 'eco'
  | 'sustainable'
  | 'women_owned'
  | 'organic'
  | 'recycled'
  | 'ethical'
  | 'local'
  | 'vegan'
  | 'fair_trade'
  | 'b_corp';

export interface ValuesFilterOption {
  id: ValuesFilterId;
  label: string;
  shortLabel: string;
  description?: string;
}

export const VALUES_FILTER_OPTIONS: ValuesFilterOption[] = [
  { id: 'eco', label: 'Эко', shortLabel: 'Эко', description: 'Экологичные материалы и процессы' },
  { id: 'sustainable', label: 'Устойчивое производство', shortLabel: 'Sustainable' },
  { id: 'women_owned', label: 'Основан женщинами', shortLabel: 'Women-owned' },
  { id: 'organic', label: 'Органик', shortLabel: 'Organic' },
  { id: 'recycled', label: 'Переработанные материалы', shortLabel: 'Recycled' },
  { id: 'ethical', label: 'Этичное производство', shortLabel: 'Ethical' },
  { id: 'local', label: 'Локальное производство', shortLabel: 'Local' },
  { id: 'vegan', label: 'Vegan', shortLabel: 'Vegan' },
  { id: 'fair_trade', label: 'Fair Trade', shortLabel: 'Fair Trade' },
  { id: 'b_corp', label: 'B Corp', shortLabel: 'B Corp' },
];

export const VALUES_FILTER_KEY = 'Ценности';

/** Проверка продукта по выбранным values-фильтрам (продукт должен иметь соответствующие теги/атрибуты) */
export function productMatchesValues(
  productValues: string[] | undefined,
  selectedValues: string[]
): boolean {
  if (!selectedValues.length) return true;
  if (!productValues?.length) return false;
  const productSet = new Set(productValues.map((v) => v.toLowerCase()));
  return selectedValues.some((v) => productSet.has(v.toLowerCase()));
}
