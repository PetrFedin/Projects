/**
 * Pre-pack · size curve для shop matrix (Aptos pattern).
 * SoT кривой — brand pack-rules / size chart; shop — read-only apply.
 */

export const SHOP_MATRIX_SIZE_CURVE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export type ShopMatrixSizeCurve = Record<(typeof SHOP_MATRIX_SIZE_CURVE_SIZES)[number], number>;

/** Demo curve: сумма весов = 12 (pack multiple). */
export const DEFAULT_SHOP_MATRIX_SIZE_CURVE: ShopMatrixSizeCurve = {
  XS: 1,
  S: 2,
  M: 3,
  L: 3,
  XL: 2,
  XXL: 1,
};

export type ShopMatrixPrepackBreakdown = {
  packCount: number;
  packSize: number;
  totalUnits: number;
  bySize: Record<string, number>;
};

export function buildShopMatrixPrepackBreakdown(input: {
  packCount: number;
  packSize?: number;
  curve?: ShopMatrixSizeCurve;
}): ShopMatrixPrepackBreakdown {
  const curve = input.curve ?? DEFAULT_SHOP_MATRIX_SIZE_CURVE;
  const weightSum = SHOP_MATRIX_SIZE_CURVE_SIZES.reduce((s, size) => s + (curve[size] ?? 0), 0);
  const packSize = input.packSize ?? weightSum;
  const packCount = Math.max(1, Math.floor(input.packCount));
  const totalUnits = packCount * packSize;
  const bySize: Record<string, number> = {};

  for (const size of SHOP_MATRIX_SIZE_CURVE_SIZES) {
    const weight = curve[size] ?? 0;
    bySize[size] = weightSum > 0 ? Math.round((totalUnits * weight) / weightSum) : 0;
  }

  return { packCount, packSize, totalUnits, bySize };
}

export function shopMatrixPrepackSizeSummary(bySize: Record<string, number>): string {
  return Object.entries(bySize)
    .filter(([, qty]) => qty > 0)
    .map(([size, qty]) => `${size}:${qty}`)
    .join(' · ');
}
