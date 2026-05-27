import type { Product } from '@/lib/types';
import type {
  BrandRunwayOverrideEntry,
  BrandRunwayOverridesFile,
} from '@/lib/brand-runway-overrides';
import { mergeProductsWithRunwayOverrides } from '@/lib/brand-runway-overrides';

export type RunwayProductPatch = BrandRunwayOverrideEntry;

/** Применить patch-файл к одному SKU (поверх products.json / overrides). */
export function applyRunwayProductPatch(product: Product, patch: RunwayProductPatch): Product {
  if (!patch || Object.keys(patch).length === 0) return product;

  return {
    ...product,
    ...(patch.displayMode != null ? { displayMode: patch.displayMode } : {}),
    ...(patch.featuredScrollExperience != null
      ? { featuredScrollExperience: patch.featuredScrollExperience }
      : {}),
    ...(patch.scrollVideoUrl != null ? { scrollVideoUrl: patch.scrollVideoUrl } : {}),
    ...(patch.scrollSwitcherSections != null
      ? { scrollSwitcherSections: patch.scrollSwitcherSections }
      : {}),
  };
}

/** Merge overrides + slug→patch map в каталог. */
export function mergeProductsWithRunwayLayers(
  products: Product[],
  overrides: BrandRunwayOverridesFile,
  patches: Record<string, RunwayProductPatch> = {}
): Product[] {
  const withOverrides = mergeProductsWithRunwayOverrides(products, overrides);
  if (!patches || Object.keys(patches).length === 0) return withOverrides;

  return withOverrides.map((product) => {
    const patch = patches[product.slug];
    if (!patch) return product;
    return applyRunwayProductPatch(product, patch);
  });
}
