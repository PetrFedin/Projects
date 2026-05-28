import type { Product } from '@/lib/types';
import {
  buildRunwayProductViewModel,
  filterScrollVideoProducts,
  productSupportsScrollVideo,
  resolveBrandScrollVideoProducts,
  type RunwayProductViewModel,
} from '@/lib/product-scroll-switcher';
import {
  loadBrandRunwayOverridesFromJson,
  loadBrandRunwayOverridesFromStorage,
  mergeOverrideMaps,
  mergeProductsWithRunwayOverrides,
  type BrandRunwayOverrideEntry,
  type BrandRunwayOverridesFile,
} from '@/lib/brand-runway-overrides';
import {
  normalizeScrollExperienceConfig,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from '@/lib/runway/scroll-experience-schema';
import type { ScrollExperienceConfig } from '@/lib/types';
import {
  loadRunwayProductCatalog,
  resetRunwayProductRepository,
} from '@/lib/runway/RunwayProductRepository';
import { mergeProductsWithRunwayLayers } from '@/lib/runway/runway-product-merge';

const PRODUCT_PATCHES_API_PATH = '/api/runway/product-config';

const SCROLL_EXPERIENCE_JSON_PATH = '/data/scroll-experience.json';
const SCROLL_EXPERIENCE_API_PATH = '/api/runway/config';

let configCache: ScrollExperienceConfig | null = null;
let configPromise: Promise<ScrollExperienceConfig> | null = null;
let patchesCache: Record<string, BrandRunwayOverrideEntry> | null = null;
let patchesPromise: Promise<Record<string, BrandRunwayOverrideEntry>> | null = null;

/** Загрузка product patches (data/runway-product-patches via API). */
export async function loadRunwayProductPatches(
  force = false
): Promise<Record<string, BrandRunwayOverrideEntry>> {
  if (!force && patchesCache) return patchesCache;
  if (!force && patchesPromise) return patchesPromise;

  patchesPromise = (async () => {
    try {
      const res = await fetch(PRODUCT_PATCHES_API_PATH);
      if (!res.ok) return {};
      const body = (await res.json()) as { patches?: Record<string, BrandRunwayOverrideEntry> };
      const patches = body.patches ?? {};
      patchesCache = patches;
      return patches;
    } catch {
      return {};
    } finally {
      patchesPromise = null;
    }
  })();

  return patchesPromise;
}

async function mergeCatalogWithRunwayLayers(
  catalog: Product[],
  options?: { withOverrides?: boolean }
): Promise<Product[]> {
  const jsonOverrides =
    options?.withOverrides !== false ? await loadBrandRunwayOverridesFromJson() : {};

  let overrides = jsonOverrides;
  if (options?.withOverrides !== false && typeof window !== 'undefined') {
    overrides = mergeOverrideMaps(jsonOverrides, loadBrandRunwayOverridesFromStorage());
  }

  const patches = await loadRunwayProductPatches();
  return mergeProductsWithRunwayLayers(catalog, overrides, patches);
}

/** Загрузка каталога через RunwayProductRepository (json | api). */
export async function loadProductsCatalog(force = false): Promise<Product[]> {
  return loadRunwayProductCatalog(force);
}

/** Каталог с brand overrides + product patches — единый merge для PDP / embed / playlist. */
export async function loadRunwayProducts(options?: {
  withOverrides?: boolean;
  forceCatalog?: boolean;
}): Promise<Product[]> {
  return mergeCatalogWithRunwayLayers(await loadProductsCatalog(options?.forceCatalog), options);
}

/** Один SKU через merged catalog (patches/overrides). Единая точка входа для fetch. */
export async function loadRunwayProduct(
  slug: string,
  options?: { withOverrides?: boolean; forceCatalog?: boolean }
): Promise<Product | null> {
  const products = await loadRunwayProducts(options);
  return products.find((p) => p.slug === slug) ?? null;
}

/** Загрузка scroll-experience.json с v3-нормализацией. */
export async function loadScrollExperienceConfig(force = false): Promise<ScrollExperienceConfig> {
  if (!force && configCache) return configCache;
  if (!force && configPromise) return configPromise;

  configPromise = (async () => {
    try {
      const apiRes = await fetch(SCROLL_EXPERIENCE_API_PATH);
      if (apiRes.ok) {
        const raw = await apiRes.json();
        const normalized = normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
        configCache = normalized;
        return normalized;
      }
    } catch {
      /* static fallback */
    }

    try {
      const res = await fetch(SCROLL_EXPERIENCE_JSON_PATH);
      if (!res.ok) return SCROLL_EXPERIENCE_V3_DEFAULTS;
      const raw = await res.json();
      const normalized = normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
      configCache = normalized;
      return normalized;
    } catch {
      return SCROLL_EXPERIENCE_V3_DEFAULTS;
    } finally {
      configPromise = null;
    }
  })();

  return configPromise;
}

export interface RunwayExperienceBundle {
  product: Product;
  viewModel: RunwayProductViewModel;
  config: ScrollExperienceConfig;
}

/** Полный bundle runway для PDP / gallery. */
export async function loadRunwayExperience(
  productSlug: string,
  options?: { activeColorName?: string; withOverrides?: boolean }
): Promise<RunwayExperienceBundle | null> {
  const [config, products] = await Promise.all([
    loadScrollExperienceConfig(),
    mergeCatalogWithRunwayLayers(await loadProductsCatalog(), options),
  ]);

  const product = products.find((p) => p.slug === productSlug);
  if (!product || !productSupportsScrollVideo(product)) return null;

  const viewModel = buildRunwayProductViewModel(product, {
    activeColorName: options?.activeColorName,
    config,
  });

  return { product, viewModel, config };
}

/** Scroll-video каталог бренда (по имени бренда из products.json). */
export async function loadBrandRunwayCatalog(
  brandName: string,
  options?: { withOverrides?: boolean }
): Promise<Product[]> {
  const [products] = await Promise.all([
    mergeCatalogWithRunwayLayers(await loadProductsCatalog(), options),
  ]);

  return resolveBrandScrollVideoProducts(products, brandName);
}

/** Слияние одного товара с brand overrides (backward compat API). */
export function mergeProductWithOverrides(
  product: Product,
  overrides: BrandRunwayOverridesFile
): Product {
  const [merged] = mergeProductsWithRunwayOverrides([product], overrides);
  return merged ?? product;
}

/** Патч override для одного SKU (удобно для админки). */
export function patchProductOverride(
  overrides: BrandRunwayOverridesFile,
  brandName: string,
  slug: string,
  patch: BrandRunwayOverrideEntry
): BrandRunwayOverridesFile {
  return {
    ...overrides,
    [brandName]: {
      ...(overrides[brandName] ?? {}),
      [slug]: {
        ...(overrides[brandName]?.[slug] ?? {}),
        ...patch,
      },
    },
  };
}

/** Сброс кэша (тесты / hot reload). */
export function resetRunwayExperienceCache(): void {
  resetRunwayProductRepository();
  configCache = null;
  configPromise = null;
  patchesCache = null;
  patchesPromise = null;
}

/** Все scroll-video SKU (фильтр каталога). */
export async function loadAllScrollVideoProducts(): Promise<Product[]> {
  const catalog = await loadProductsCatalog();
  return filterScrollVideoProducts(catalog);
}
