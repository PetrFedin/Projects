/**
 * Фильтрация товаров по запросу стилиста
 */

export interface FilterParams {
  audience: string;
  season: string;
  budgetMax?: number;
  colors?: string[];
  brandFilter?: string; // напр. "syntha"
}

/** Фильтр по аудитории, сезону, бюджету, цветам и бренду Syntha */
<<<<<<< HEAD
export function filterProducts(
  products: Array<{
=======
export function filterProducts<
  T extends {
>>>>>>> recover/cabinet-wip-from-stash
    id: string;
    audience: string;
    season: string;
    price: number;
    color: string;
    brand: string;
<<<<<<< HEAD
  }>,
  params: FilterParams
): typeof products {
=======
  },
>(products: T[], params: FilterParams): T[] {
>>>>>>> recover/cabinet-wip-from-stash
  return products.filter((p) => {
    if (params.brandFilter && !p.brand.toLowerCase().includes(params.brandFilter.toLowerCase())) {
      return false;
    }
    if (p.audience !== 'Unisex' && p.audience !== params.audience) {
      return false;
    }

    const productSeason = p.season;
    if (productSeason !== 'All' && params.season !== 'All') {
      if ((params.season === 'Spring' || params.season === 'Summer') && productSeason !== 'SS')
        return false;
      if ((params.season === 'Autumn' || params.season === 'Winter') && productSeason !== 'FW')
        return false;
    }

    if (params.budgetMax && p.price > params.budgetMax) return false;
    if (
      params.colors?.length &&
      !params.colors.map((x) => x.toLowerCase()).includes(p.color.toLowerCase())
    )
      return false;

    return true;
  });
}
