import type { Product, ProductDisplayMode, ProductScrollSwitcherSection } from '@/lib/types';

/** Запись override для одного SKU (бренд-админка / dev). */
export interface BrandRunwayOverrideEntry {
  displayMode?: ProductDisplayMode;
  featuredScrollExperience?: boolean;
  scrollVideoUrl?: string;
  /** Локальные правки секций runway (label, color, story, ai tip). */
  scrollSwitcherSections?: ProductScrollSwitcherSection[];
}

export type BrandRunwayOverridesFile = Record<string, Record<string, BrandRunwayOverrideEntry>>;

export const BRAND_RUNWAY_OVERRIDES_STORAGE_KEY = 'syntha-brand-runway-overrides';
/** Per-brand videoCdnBaseUrl override (демо localStorage до правки scroll-experience.json). */
export const BRAND_RUNWAY_CDN_STORAGE_KEY = 'syntha-brand-runway-cdn-overrides';

const OVERRIDES_JSON_PATH = '/data/brand-runway-overrides.json';

/** Слияние статического JSON + localStorage (клиент) поверх products.json. */
export function mergeProductsWithRunwayOverrides(
  products: Product[],
  overrides: BrandRunwayOverridesFile
): Product[] {
  if (!overrides || Object.keys(overrides).length === 0) return products;

  return products.map((product) => {
    const brandMap = overrides[product.brand];
    if (!brandMap) return product;
    const entry = brandMap[product.slug];
    if (!entry) return product;

    return {
      ...product,
      ...(entry.displayMode != null ? { displayMode: entry.displayMode } : {}),
      ...(entry.featuredScrollExperience != null
        ? { featuredScrollExperience: entry.featuredScrollExperience }
        : {}),
      ...(entry.scrollVideoUrl != null ? { scrollVideoUrl: entry.scrollVideoUrl } : {}),
      ...(entry.scrollSwitcherSections != null
        ? { scrollSwitcherSections: entry.scrollSwitcherSections }
        : {}),
    };
  });
}

/** Загрузка overrides из public/data (SSR/клиент fetch). */
export async function loadBrandRunwayOverridesFromJson(): Promise<BrandRunwayOverridesFile> {
  try {
    const res = await fetch(OVERRIDES_JSON_PATH);
    if (!res.ok) return {};
    return (await res.json()) as BrandRunwayOverridesFile;
  } catch {
    return {};
  }
}

/** Чтение localStorage overrides (только браузер). */
export function loadBrandRunwayOverridesFromStorage(): BrandRunwayOverridesFile {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(BRAND_RUNWAY_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as BrandRunwayOverridesFile;
  } catch {
    return {};
  }
}

/** Чтение per-brand CDN override из localStorage. */
export function loadBrandRunwayCdnFromStorage(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(BRAND_RUNWAY_CDN_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveBrandRunwayCdnToStorage(map: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BRAND_RUNWAY_CDN_STORAGE_KEY, JSON.stringify(map));
}

/**
 * CDN base URL for a brand: API/scroll-experience first, localStorage offline cache second.
 */
export function resolveBrandVideoCdnBaseUrl(
  brandName: string,
  scrollConfig?: { videoCdnBaseUrl?: string; brandVideoCdnBaseUrl?: Record<string, string> },
  localOverrides?: Record<string, string>
): string | undefined {
  const fromConfig = scrollConfig?.brandVideoCdnBaseUrl?.[brandName]?.trim();
  if (fromConfig) return fromConfig;
  const local = localOverrides?.[brandName]?.trim();
  if (local) return local;
  return scrollConfig?.videoCdnBaseUrl?.trim() || undefined;
}

/** Merge API scroll config with offline localStorage CDN map (API wins per brand). */
export function mergeBrandVideoCdnSources(
  scrollConfig:
    | { videoCdnBaseUrl?: string; brandVideoCdnBaseUrl?: Record<string, string> }
    | null
    | undefined,
  localOverrides: Record<string, string>
): { videoCdnBaseUrl?: string; brandVideoCdnBaseUrl?: Record<string, string> } {
  const apiMap = scrollConfig?.brandVideoCdnBaseUrl ?? {};
  const mergedBrand: Record<string, string> = { ...localOverrides };

  for (const [brand, url] of Object.entries(apiMap)) {
    const trimmed = url?.trim();
    if (trimmed) mergedBrand[brand] = trimmed;
    else delete mergedBrand[brand];
  }

  return {
    videoCdnBaseUrl: scrollConfig?.videoCdnBaseUrl,
    brandVideoCdnBaseUrl: Object.keys(mergedBrand).length ? mergedBrand : undefined,
  };
}

/** Сохранение в localStorage (демо без API). */
export function saveBrandRunwayOverridesToStorage(overrides: BrandRunwayOverridesFile): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BRAND_RUNWAY_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

/** JSON + localStorage (localStorage побеждает по полям бренда). */
export function mergeOverrideMaps(
  fromJson: BrandRunwayOverridesFile,
  fromStorage: BrandRunwayOverridesFile
): BrandRunwayOverridesFile {
  const merged: BrandRunwayOverridesFile = { ...fromJson };

  for (const [brand, storageEntries] of Object.entries(fromStorage)) {
    merged[brand] = { ...(merged[brand] ?? {}), ...storageEntries };
  }

  return merged;
}

export function setBrandRunwayOverride(
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

/** Применить overrides к одному SKU — для превью и экспорта в products.json. */
export function applyBrandOverridesToProduct(
  product: Product,
  overrides: BrandRunwayOverridesFile
): Product {
  const [merged] = mergeProductsWithRunwayOverrides([product], overrides);
  return merged ?? product;
}
