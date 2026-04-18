/**
 * Рекомендация размеров и fit (Size / Fit).
 * Подбор размера по росту/весу/предпочтению (fit small / true to size / large),
 * размерная сетка по бренду, предупреждение «часто берут на размер больше».
 * Связь со справочниками размеров и атрибутами (chartMap, size-mapping).
 */

export type FitPreference = 'slim' | 'true_to_size' | 'regular' | 'oversized';

export interface SizeChartEntry {
  size: string;
  retailerSize?: string;
  chestMin: number;
  chestMax: number;
  waistMin: number;
  waistMax: number;
  hipsMin: number;
  hipsMax: number;
  /** Рост (см), опционально для упрощённого подбора */
  heightMin?: number;
  heightMax?: number;
}

/** Сетка из маппинга размеров (EU → ритейл, обхваты в см). Диапазон ±2 см. */
const DEFAULT_GRID_CM: {
  size: string;
  retailerSize: string;
  chest: number;
  waist: number;
  hips: number;
}[] = [
  { size: 'EU 32', retailerSize: 'XXS', chest: 80, waist: 62, hips: 86 },
  { size: 'EU 34', retailerSize: 'XS', chest: 84, waist: 64, hips: 88 },
  { size: 'EU 36', retailerSize: 'S', chest: 88, waist: 68, hips: 92 },
  { size: 'EU 38', retailerSize: 'M', chest: 92, waist: 72, hips: 96 },
  { size: 'EU 40', retailerSize: 'L', chest: 96, waist: 76, hips: 100 },
  { size: 'EU 42', retailerSize: 'XL', chest: 100, waist: 80, hips: 104 },
];

const RANGE_CM = 2;

function toSizeChartEntry(row: (typeof DEFAULT_GRID_CM)[0]): SizeChartEntry {
  return {
    size: row.size,
    retailerSize: row.retailerSize,
    chestMin: row.chest - RANGE_CM,
    chestMax: row.chest + RANGE_CM,
    waistMin: row.waist - RANGE_CM,
    waistMax: row.waist + RANGE_CM,
    hipsMin: row.hips - RANGE_CM,
    hipsMax: row.hips + RANGE_CM,
  };
}

const DEFAULT_CHART: SizeChartEntry[] = DEFAULT_GRID_CM.map(toSizeChartEntry);

/** Размерные сетки по бренду. При API — из PIM/справочников. */
const CHARTS_BY_BRAND: Record<string, SizeChartEntry[]> = {
  syntha: DEFAULT_CHART,
  'a.p.c.': DEFAULT_CHART,
  apc: DEFAULT_CHART,
  'acne studios': DEFAULT_CHART,
  acne: DEFAULT_CHART,
};

export function getSizeChartByBrand(brandIdOrName: string): SizeChartEntry[] {
  const key = brandIdOrName.toLowerCase().replace(/\s+/g, '');
  const byName = Object.keys(CHARTS_BY_BRAND).find((k) => key.includes(k) || k.includes(key));
  return byName ? CHARTS_BY_BRAND[byName] : DEFAULT_CHART;
}

export interface SizeRecommendation {
  size: string;
  retailerSize?: string;
  source: 'measurements' | 'height_weight' | 'reviews';
  message: string;
  sizeUpWarning?: boolean;
  sizeUpMessage?: string;
}

/** Рекомендация размера: по замерам (грудь/талия/бёдра), по росту/весу или «по отзывам» (мок). */
export function getRecommendedSize(params: {
  productId?: string;
  brandId?: string;
  brandName?: string;
  category?: string;
  heightCm?: number;
  weightKg?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  fitPreference?: FitPreference;
}): SizeRecommendation {
  const brand = params.brandName ?? params.brandId ?? 'Syntha';
  const chart = getSizeChartByBrand(brand);

  if (params.chestCm != null && params.waistCm != null && params.hipsCm != null) {
    const match = findBestMatchByMeasurements(
      { chest: params.chestCm, waist: params.waistCm, hips: params.hipsCm },
      chart,
      params.fitPreference ?? 'true_to_size'
    );
    return {
      size: match.size,
      retailerSize: match.retailerSize,
      source: 'measurements',
      message: `По вашим замерам: ${match.retailerSize ?? match.size}. Грудь ${params.chestCm}, талия ${params.waistCm}, бёдра ${params.hipsCm} см.`,
      sizeUpWarning: getSizeUpWarning(params.productId ?? '', brand, params.category),
      sizeUpMessage: getSizeUpWarning(params.productId ?? '', brand, params.category)
        ? 'По отзывам часто берут на размер больше.'
        : undefined,
    };
  }

  if (params.heightCm != null && params.weightKg != null) {
    const size = sizeFromHeightWeight(params.heightCm, params.weightKg);
    const entry = chart.find((e) => e.retailerSize === size || e.size.includes(size));
    return {
      size: entry?.size ?? size,
      retailerSize: entry?.retailerSize ?? size,
      source: 'height_weight',
      message: `По росту ${params.heightCm} см и весу ${params.weightKg} кг: рекомендуем ${entry?.retailerSize ?? size}.`,
      sizeUpWarning: getSizeUpWarning(params.productId ?? '', brand, params.category),
      sizeUpMessage: getSizeUpWarning(params.productId ?? '', brand, params.category)
        ? 'Часто берут на размер больше.'
        : undefined,
    };
  }

  const fallback = chart[Math.floor(chart.length / 2)];
  return {
    size: fallback.size,
    retailerSize: fallback.retailerSize,
    source: 'reviews',
    message: 'Укажите рост/вес или замеры для точного подбора. По отзывам чаще всего заказывают M.',
    sizeUpWarning: getSizeUpWarning(params.productId ?? '', brand, params.category),
    sizeUpMessage: getSizeUpWarning(params.productId ?? '', brand, params.category)
      ? 'По отзывам часто берут на размер больше.'
      : undefined,
  };
}

function findBestMatchByMeasurements(
  m: { chest: number; waist: number; hips: number },
  chart: SizeChartEntry[],
  preference: FitPreference
): SizeChartEntry {
  const scores = chart.map((entry) => {
    const chestDelta = delta(m.chest, entry.chestMin, entry.chestMax);
    const waistDelta = delta(m.waist, entry.waistMin, entry.waistMax);
    const hipsDelta = delta(m.hips, entry.hipsMin, entry.hipsMax);
    const total = chestDelta * 0.5 + waistDelta * 0.3 + hipsDelta * 0.2;
    return { entry, total };
  });
  scores.sort((a, b) => a.total - b.total);
  let idx = 0;
  if (preference === 'oversized' && scores.length > 1) idx = Math.min(1, scores.length - 1);
  if (preference === 'slim' && scores.length > 1)
    idx = Math.max(
      0,
      scores.findIndex((s) => s.total <= 1)
    );
  return scores[idx]?.entry ?? chart[0];
}

function delta(value: number, min: number, max: number): number {
  if (value < min) return min - value;
  if (value > max) return value - max;
  return 0;
}

function sizeFromHeightWeight(heightCm: number, weightKg: number): string {
  const bmi = weightKg / (heightCm / 100) ** 2;
  if (heightCm < 165 && weightKg < 60) return 'XS';
  if (heightCm < 170 && weightKg < 70) return 'S';
  if (heightCm < 178 && weightKg < 85) return 'M';
  if (heightCm < 185 && weightKg < 95) return 'L';
  return 'XL';
}

/** Мок: «часто берут на размер больше» по продукту/бренду/категории. */
export function getSizeUpWarning(
  productId: string,
  brandIdOrName: string,
  category?: string
): boolean | string {
  const cat = (category ?? '').toLowerCase();
  if (
    cat.includes('верхн') ||
    cat.includes('пальто') ||
    cat.includes('курт') ||
    cat.includes('outerwear')
  )
    return true;
  const hash = (productId + brandIdOrName).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  if (hash % 3 === 0) return true;
  return false;
}

export function getSizeUpWarningMessage(
  productId: string,
  brandIdOrName: string,
  category?: string
): string | null {
  const w = getSizeUpWarning(productId, brandIdOrName, category);
  if (w === true) return 'По отзывам часто берут на размер больше.';
  if (typeof w === 'string') return w;
  return null;
}
