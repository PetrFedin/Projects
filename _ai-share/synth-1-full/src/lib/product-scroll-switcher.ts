import type {
  ColorInfo,
  Product,
  ProductScrollSwitcherSection,
  RunwayLookItem,
  ScrollExperienceConfig,
  SizeAvailabilityStatus,
} from '@/lib/types';
import {
  DEFAULT_SCROLL_SWITCHER_COLORS,
  DEFAULT_SCROLL_SWITCHER_LABELS,
} from '@/lib/scroll-switcher-constants';
import { SCROLL_EXPERIENCE_V3_DEFAULTS } from '@/lib/runway/scroll-experience-schema';
import { loadScrollExperienceConfig as loadScrollExperienceConfigFromService } from '@/lib/runway/RunwayExperienceService';
import {
  countSectionViewsToday,
  readScrollExperienceEventLog,
  type ScrollExperienceEventLogEntry,
} from '@/lib/scroll-experience-analytics';
import { t } from '@/lib/runway/runway-i18n';
import { safeResolveVideoCdnUrl } from '@/lib/runway/runway-media-fallback';
import { resolveVideoCdnOptions, resolveVideoCdnUrl } from '@/lib/runway/runway-video-cdn';

export {
  loadRunwayExperience,
  loadRunwayProduct,
  loadRunwayProducts,
  loadBrandRunwayCatalog,
  mergeProductWithOverrides,
  loadProductsCatalog,
  loadAllScrollVideoProducts,
} from '@/lib/runway/RunwayExperienceService';

export {
  DEFAULT_SCROLL_SWITCHER_COLORS,
  DEFAULT_SCROLL_SWITCHER_LABELS,
} from '@/lib/scroll-switcher-constants';

/** Fallback, если scroll-experience.json недоступен. */
export const SCROLL_EXPERIENCE_DEFAULTS = SCROLL_EXPERIENCE_V3_DEFAULTS;

export function productSupportsScrollVideo(product: Product): boolean {
  return product.displayMode === 'scroll-video';
}

/** У товара заданы отдельные клипы на секции (crossfade вместо scrub). */
export function productUsesPerSectionVideo(product: Product): boolean {
  return (
    product.scrollSwitcherSections?.some((section) => Boolean(section.sectionVideoUrl)) ?? false
  );
}

export interface ScrollVideoSources {
  /** H.264 MP4 — приоритет для Safari и iOS. */
  mp4?: string;
  /** WebM VP9 — fallback для Chrome/Firefox. */
  webm?: string;
  /** Poster из первой секции / hero-изображения. */
  poster?: string;
}

/** Базовый URL scroll-видео: scrollVideoUrl → videoUrls[0] (+ CDN prefix). */
export function resolveScrollVideoUrl(
  product: Product,
  config?: ScrollExperienceConfig
): string | undefined {
  const sources = resolveScrollVideoSources(product, config);
  return sources.mp4 ?? sources.webm;
}

/**
 * Источники видео для `<video>`: MP4 + WebM fallback и poster.
 * Если в JSON указан .webm — пара .mp4 подставляется по тому же basename.
 */
/** Видео активной секции: sectionVideoUrl → product scrollVideoUrl (+ CDN prefix). */
export function resolveSectionVideoUrl(
  product: Product,
  section: ProductScrollSwitcherSection | undefined,
  index = 0,
  config?: ScrollExperienceConfig
): string | undefined {
  const raw = section?.sectionVideoUrl ?? product.scrollVideoUrl ?? product.videoUrls?.[0]?.url;
  return safeResolveVideoCdnUrl(raw, resolveVideoCdnOptions(config, product.brand));
}

/** MP4/WebM/poster для секции (per-section clip или общий scrollVideoUrl). */
export function resolveSectionVideoSources(
  product: Product,
  section: ProductScrollSwitcherSection | undefined,
  index = 0,
  config?: ScrollExperienceConfig
): ScrollVideoSources {
  const raw = section?.sectionVideoUrl ?? product.scrollVideoUrl ?? product.videoUrls?.[0]?.url;
  if (!raw) return {};

  const cdnOpts = resolveVideoCdnOptions(config, product.brand);
  const resolved = safeResolveVideoCdnUrl(raw, cdnOpts);
  if (!resolved) return {};
  const poster = resolveSectionPosterUrl(
    product,
    section ?? resolveScrollSwitcherSections(product)[index],
    index
  );

  let sources: ScrollVideoSources;
  if (resolved.endsWith('.mp4')) {
    sources = { mp4: resolved, webm: resolved.replace(/\.mp4$/i, '.webm'), poster };
  } else if (resolved.endsWith('.webm')) {
    sources = { webm: resolved, mp4: resolved.replace(/\.webm$/i, '.mp4'), poster };
  } else {
    sources = { mp4: resolved, poster };
  }

  return sources;
}

export function resolveScrollVideoSources(
  product: Product,
  config?: ScrollExperienceConfig
): ScrollVideoSources {
  const raw = product.scrollVideoUrl ?? product.videoUrls?.[0]?.url;
  if (!raw) return {};

  const cdnOpts = resolveVideoCdnOptions(config, product.brand);
  const resolved = safeResolveVideoCdnUrl(raw, cdnOpts);
  if (!resolved) return {};
  const sections = resolveScrollSwitcherSections(product, config);
  const poster = resolveSectionPosterUrl(product, sections[0], 0);

  let sources: ScrollVideoSources;
  if (resolved.endsWith('.mp4')) {
    sources = { mp4: resolved, webm: resolved.replace(/\.mp4$/i, '.webm'), poster };
  } else if (resolved.endsWith('.webm')) {
    sources = { webm: resolved, mp4: resolved.replace(/\.webm$/i, '.mp4'), poster };
  } else {
    sources = { mp4: resolved, poster };
  }

  return sources;
}

function formatComposition(composition: Product['composition']): string | undefined {
  if (!composition) return undefined;
  if (typeof composition === 'string') return composition;
  return composition.map((c) => `${c.percentage}% ${c.material}`).join(', ');
}

/** Превью секции: явный thumb → изображение по colorName → по индексу. */
export function resolveSectionThumbImage(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number
): string | undefined {
  if (section.thumbImageUrl) return section.thumbImageUrl;

  const colorKey = section.colorName ?? section.label;
  const byColor = product.images.find((img) => img.colorName === colorKey);
  if (byColor?.url) return byColor.url;

  return product.images[index]?.url ?? product.images[0]?.url;
}

/** Hero на сцене: sectionImageUrl → полное фото по colorName → thumb → fallback по индексу. */
export function resolveSectionImage(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number
): string | undefined {
  if (section.sectionImageUrl) return section.sectionImageUrl;

  const colorKey = section.colorName ?? section.label;
  const byColor = product.images.find((img) => img.colorName === colorKey);
  if (byColor?.url) return byColor.url;

  return resolveSectionThumbImage(product, section, index);
}

/** Poster для `<video>` и OG: posterUrl → hero section image. */
export function resolveSectionPosterUrl(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number
): string | undefined {
  const poster = (section as ProductScrollSwitcherSection & { posterUrl?: string }).posterUrl;
  if (poster?.trim()) return poster.trim();
  return resolveSectionImage(product, section, index);
}

function enrichSection(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number,
  config?: ScrollExperienceConfig
): ProductScrollSwitcherSection {
  const colorName = section.colorName ?? section.label;
  const matchedColor = product.availableColors?.find((c) => c.name === colorName);

  return {
    ...section,
    colorName,
    color: section.color || matchedColor?.hex || section.color,
    variantSku: section.variantSku ?? (colorName ? `${product.sku}-${colorName}` : product.sku),
    thumbImageUrl: resolveSectionThumbImage(product, section, index),
    sectionImageUrl: section.sectionImageUrl ?? resolveSectionImage(product, section, index),
    posterUrl:
      (section as ProductScrollSwitcherSection & { posterUrl?: string }).posterUrl ??
      resolveSectionPosterUrl(product, section, index),
    material: section.material ?? product.material ?? formatComposition(product.composition),
    dimensions: section.dimensions ?? (product.attributes?.dimensions as string | undefined),
    price: section.price,
  };
}

/**
 * Секции switcher: кастомные из JSON → цвета товара → 3 дефолтных секции.
 */
export function resolveScrollSwitcherSections(
  product: Product,
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): ProductScrollSwitcherSection[] {
  if (product.scrollSwitcherSections?.length) {
    return product.scrollSwitcherSections.map((section, index) =>
      enrichSection(product, section, index, config)
    );
  }

  const activeColors = product.availableColors?.filter((c) => c.status !== 'disabled') ?? [];

  if (activeColors.length > 0) {
    return activeColors.map((color, index) => sectionFromColor(product, color, index));
  }

  const palette = config.defaultSectionColors ?? [...DEFAULT_SCROLL_SWITCHER_COLORS];
  const labels = config.defaultSectionLabels ?? [...DEFAULT_SCROLL_SWITCHER_LABELS];
  const colorVariants = [product.color];

  return palette.map((color, index) => ({
    id: `section-${index}`,
    label: colorVariants[index] ?? labels[index] ?? `Variant ${index + 1}`,
    color,
    colorName: colorVariants[index],
    variantSku: product.sku,
    material: product.material ?? formatComposition(product.composition),
    dimensions: product.attributes?.dimensions as string | undefined,
    thumbImageUrl: product.images[index]?.url ?? product.images[0]?.url,
  }));
}

function sectionFromColor(
  product: Product,
  color: ColorInfo,
  index: number
): ProductScrollSwitcherSection {
  return {
    id: color.id || `section-${index}`,
    label: color.name,
    color: color.hex,
    colorName: color.name,
    variantSku: `${product.sku}-${color.name}`,
    material: product.material ?? formatComposition(product.composition),
    dimensions: product.attributes?.dimensions as string | undefined,
    thumbImageUrl: resolveSectionThumbImage(
      product,
      { id: color.id, label: color.name, color: color.hex, colorName: color.name },
      index
    ),
  };
}

/** Цвет PDP, соответствующий активной секции switcher. */
export function resolveColorForSection(
  product: Product,
  section: ProductScrollSwitcherSection
): ColorInfo | undefined {
  const key = section.colorName ?? section.label;
  return product.availableColors?.find((c) => c.name === key);
}

/** Индекс секции по выбранному цвету (для синхронизации PDP ↔ runway). */
export function resolveSectionIndexForColor(
  product: Product,
  colorName: string | undefined,
  config?: ScrollExperienceConfig
): number {
  const sections = resolveScrollSwitcherSections(product, config);
  if (!colorName) return 0;

  const idx = sections.findIndex(
    (section) => section.colorName === colorName || section.label === colorName
  );
  return idx >= 0 ? idx : 0;
}

/** Цена активной секции: override секции → базовая цена товара. */
export function resolveSectionPrice(
  product: Product,
  section: ProductScrollSwitcherSection | undefined
): number {
  if (section?.price != null && Number.isFinite(section.price)) {
    return section.price;
  }
  return product.price;
}

/** Hero SKU из конфига (fallback — featuredProductSlug). */
export function resolveHeroProductSlugs(
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): string[] {
  if (config.heroProductSlugs?.length) {
    return config.heroProductSlugs.slice(0, 10);
  }
  if (config.featuredProductSlug) {
    return [config.featuredProductSlug];
  }
  return [];
}

/** Товар в списке hero runway SKU. */
export function isHeroRunwayProduct(
  product: Product,
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): boolean {
  const slugs = resolveHeroProductSlugs(config);
  if (slugs.length === 0) return productSupportsScrollVideo(product);
  return slugs.includes(product.slug) && productSupportsScrollVideo(product);
}

/** Фильтр каталога по hero SKU (playlist / featured). */
export function filterHeroScrollProducts(
  products: Product[],
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): Product[] {
  const slugs = resolveHeroProductSlugs(config);
  const scrollVideo = products.filter(productSupportsScrollVideo);
  if (slugs.length === 0) return scrollVideo;
  const order = new Map(slugs.map((slug, index) => [slug, index]));
  return scrollVideo
    .filter((p) => order.has(p.slug))
    .sort((a, b) => order.get(a.slug)! - order.get(b.slug)!);
}

/** Товар для featured-блока на главной. */
export function resolveFeaturedScrollProduct(
  products: Product[],
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): Product | undefined {
  const heroProducts = filterHeroScrollProducts(products, config);
  if (heroProducts.length > 0) return heroProducts[0];

  if (config.featuredProductSlug) {
    const bySlug = products.find(
      (product) =>
        product.slug === config.featuredProductSlug && productSupportsScrollVideo(product)
    );
    if (bySlug) return bySlug;
  }

  const flagged = products.find(
    (product) => product.featuredScrollExperience && productSupportsScrollVideo(product)
  );
  if (flagged) return flagged;

  return products.find(productSupportsScrollVideo);
}

/** Загрузка scroll-experience.json (клиент / SSR fetch) — v3 normalize. */
export async function loadScrollExperienceConfig(): Promise<ScrollExperienceConfig> {
  return loadScrollExperienceConfigFromService();
}

/** Featured scroll-товар для бренда (каталог / hero). */
export function resolveBrandFeaturedScrollProduct(
  products: Product[],
  brandName: string,
  config: ScrollExperienceConfig = SCROLL_EXPERIENCE_DEFAULTS
): Product | undefined {
  const slug = config.brandFeatured?.[brandName];
  if (slug) {
    const match = products.find((p) => p.slug === slug && productSupportsScrollVideo(p));
    if (match) return match;
  }

  return products.find((p) => p.brand === brandName && productSupportsScrollVideo(p));
}

/** Соседние секции для preload изображений. */
export function resolveAdjacentSectionImageUrls(
  product: Product,
  activeIndex: number,
  config?: ScrollExperienceConfig
): { prev?: string; next?: string } {
  const sections = resolveScrollSwitcherSections(product, config);
  if (sections.length < 1) return {};

  const prevIdx = Math.max(0, activeIndex - 1);
  const nextIdx = Math.min(sections.length - 1, activeIndex + 1);

  return {
    prev: resolveSectionImage(product, sections[prevIdx], prevIdx),
    next: resolveSectionImage(product, sections[nextIdx], nextIdx),
  };
}

export type RunwayStockStatus = 'in_stock' | 'pre_order' | 'out_of_stock' | 'outlet';

export interface RunwaySectionAvailability {
  status: RunwayStockStatus;
  label: string;
  lifecycleStatus?: ColorInfo['lifecycleStatus'];
  isOutlet: boolean;
}

export interface RunwaySectionViewModel extends ProductScrollSwitcherSection {
  index: number;
  thumbUrl?: string;
  heroUrl?: string;
  /** Источники видео секции (sectionVideoUrl или fallback product). */
  videoSources: ScrollVideoSources;
  hasSectionVideo: boolean;
  price: number;
  originalPrice?: number;
  showOutlet: boolean;
  availability: RunwaySectionAvailability;
  matchedColor?: ColorInfo;
  /** Storytelling-подпись секции (opt-in из JSON). */
  sectionStory?: string;
  /** Аксессуары образа для секции. */
  lookItems: RunwayLookItem[];
}

export interface RunwaySocialProofViewModel {
  viewsToday: number;
  isPopular: boolean;
  label: string;
}

export interface RunwayAdjacentProducts {
  prev?: { slug: string; name: string };
  next?: { slug: string; name: string };
}

export interface RunwayProductViewModel {
  sections: RunwaySectionViewModel[];
  hasVideo: boolean;
  /** Общий fallback-ролик товара. */
  videoSources: ScrollVideoSources;
  usesPerSectionVideo: boolean;
  activeSectionIndex: number;
  activeSection: RunwaySectionViewModel;
  displayPrice: number;
  variantSku: string;
  validationWarnings: string[];
}

/** Статус наличия по цвету секции (lifecycleStatus + sizeAvailability). */
export function resolveSectionStock(
  product: Product,
  section: ProductScrollSwitcherSection
): RunwaySectionAvailability {
  const color = resolveColorForSection(product, section);

  if (color?.lifecycleStatus === 'outlet') {
    return { status: 'outlet', label: 'Outlet', lifecycleStatus: 'outlet', isOutlet: true };
  }

  if (color?.lifecycleStatus === 'archived') {
    return {
      status: 'out_of_stock',
      label: 'Снят с продажи',
      lifecycleStatus: 'archived',
      isOutlet: false,
    };
  }

  const sizes = color?.sizeAvailability ?? [];
  if (sizes.some((s) => s.status === 'in_stock' && (s.quantity ?? 0) > 0)) {
    return {
      status: 'in_stock',
      label: 'В наличии',
      lifecycleStatus: color?.lifecycleStatus,
      isOutlet: false,
    };
  }
  if (sizes.some((s) => s.status === 'pre_order')) {
    return {
      status: 'pre_order',
      label: 'Предзаказ',
      lifecycleStatus: color?.lifecycleStatus,
      isOutlet: false,
    };
  }

  const productAvailability = product.availability as SizeAvailabilityStatus | undefined;
  if (productAvailability === 'in_stock') {
    return {
      status: 'in_stock',
      label: 'В наличии',
      lifecycleStatus: color?.lifecycleStatus,
      isOutlet: Boolean(product.outlet),
    };
  }
  if (productAvailability === 'pre_order') {
    return {
      status: 'pre_order',
      label: 'Предзаказ',
      lifecycleStatus: color?.lifecycleStatus,
      isOutlet: false,
    };
  }

  return {
    status: product.outlet ? 'outlet' : 'out_of_stock',
    label: product.outlet ? 'Outlet' : 'Нет в наличии',
    lifecycleStatus: color?.lifecycleStatus,
    isOutlet: Boolean(product.outlet),
  };
}

/** Алиас для UI — то же, что resolveSectionStock. */
export function resolveSectionAvailability(
  product: Product,
  section: ProductScrollSwitcherSection
): RunwaySectionAvailability {
  return resolveSectionStock(product, section);
}

function buildSectionViewModel(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number,
  config?: ScrollExperienceConfig
): RunwaySectionViewModel {
  if (!section?.id || !section.label) {
    throw new Error(`[scroll-switcher] ${product.slug}: invalid section at index ${index}`);
  }

  const matchedColor = resolveColorForSection(product, section);
  const price = resolveSectionPrice(product, section);
  const availability = resolveSectionStock(product, section);
  const showOutlet =
    availability.isOutlet || Boolean(product.outlet || matchedColor?.lifecycleStatus === 'outlet');

  const videoSources = resolveSectionVideoSources(product, section, index, config);
  const thumbUrl = resolveSectionThumbImage(product, section, index);
  const heroUrl = resolveSectionImage(product, section, index);

  return {
    ...section,
    index,
    thumbUrl: thumbUrl ?? undefined,
    heroUrl: heroUrl ?? undefined,
    videoSources,
    hasSectionVideo: Boolean(videoSources.mp4 || videoSources.webm),
    price,
    originalPrice: showOutlet ? product.originalPrice : undefined,
    showOutlet,
    availability,
    matchedColor,
    sectionStory: section.sectionStory,
    lookItems: resolveSectionLookItems(product, section),
  };
}

/**
 * Единая view-model runway для компонента и PDP.
 * Мemoize на уровне вызывающего (useMemo по product.id).
 */
export function buildRunwayProductViewModel(
  product: Product,
  options?: {
    activeColorName?: string;
    config?: ScrollExperienceConfig;
  }
): RunwayProductViewModel {
  const config = options?.config ?? SCROLL_EXPERIENCE_DEFAULTS;
  const rawSections = resolveScrollSwitcherSections(product, config);
  const sections = rawSections.map((section, index) =>
    buildSectionViewModel(product, section, index, config)
  );
  const activeSectionIndex = resolveSectionIndexForColor(product, options?.activeColorName, config);
  const safeIndex =
    sections.length > 0 ? Math.min(Math.max(activeSectionIndex, 0), sections.length - 1) : 0;
  const activeSection = sections[safeIndex];
  if (!activeSection && sections.length > 0) {
    throw new Error(`[scroll-switcher] ${product.slug}: activeSection unresolved`);
  }

  const videoSources = resolveScrollVideoSources(product, config);
  const usesPerSectionVideo = productUsesPerSectionVideo(product);
  const hasVideo =
    usesPerSectionVideo ||
    Boolean(videoSources.mp4 || videoSources.webm) ||
    sections.some((s) => s.hasSectionVideo);

  return {
    sections,
    hasVideo,
    videoSources,
    usesPerSectionVideo,
    activeSectionIndex: safeIndex,
    activeSection: activeSection ?? sections[0]!,
    displayPrice: activeSection?.price ?? product.price,
    variantSku: activeSection?.variantSku ?? product.sku,
    validationWarnings: validateScrollVideoProduct(product, rawSections),
  };
}

/** Dev-предупреждения: секции vs цвета, missing images. */
export function validateScrollVideoProduct(
  product: Product,
  sections: ProductScrollSwitcherSection[] = resolveScrollSwitcherSections(product)
): string[] {
  if (!productSupportsScrollVideo(product)) return [];

  const warnings: string[] = [];
  const colorNames = new Set(
    product.availableColors?.filter((c) => c.status !== 'disabled').map((c) => c.name) ?? []
  );

  if (product.scrollSwitcherSections?.length && colorNames.size > 0) {
    for (const section of sections) {
      const key = section.colorName ?? section.label;
      if (key && !colorNames.has(key)) {
        warnings.push(`Секция «${key}» не найдена в availableColors`);
      }
    }
  }

  sections.forEach((section, index) => {
    if (!resolveSectionImage(product, section, index)) {
      warnings.push(`Секция ${index} («${section.label}»): нет hero/thumb изображения`);
    }
  });

  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.warn(`[scroll-switcher] ${product.slug}:`, warnings);
  }

  return warnings;
}

/** Строгая проверка контента для CI (stories, looks, 3 секции). */
export function validateScrollVideoContent(product: Product): string[] {
  if (!productSupportsScrollVideo(product)) return [];

  const errors: string[] = [];
  const sections = product.scrollSwitcherSections ?? resolveScrollSwitcherSections(product);

  if (sections.length !== 3) {
    errors.push(`${product.slug}: ожидается 3 секции, найдено ${sections.length}`);
  }

  if (!product.description?.trim()) {
    errors.push(`${product.slug}: пустое description`);
  }

  sections.forEach((section, index) => {
    if (!section.sectionStory?.trim()) {
      errors.push(`${product.slug} section ${index}: нет sectionStory`);
    }
    if (!section.sectionTitle?.trim()) {
      errors.push(`${product.slug} section ${index}: нет sectionTitle`);
    }
    if (!section.sectionDescription?.trim()) {
      errors.push(`${product.slug} section ${index}: нет sectionDescription`);
    }
    const looks = resolveSectionLookItems(product, section);
    if (looks.length < 2) {
      errors.push(`${product.slug} section ${index}: нужно минимум 2 sectionLookItems`);
    }
    if (!resolveSectionImage(product, section, index)) {
      errors.push(`${product.slug} section ${index}: нет hero/thumb изображения`);
    }
    if (!resolveSectionPosterUrl(product, section, index)) {
      errors.push(`${product.slug} section ${index}: нет posterUrl / hero изображения`);
    }
  });

  return errors;
}

/** Scroll-video товары из массива (каталог / админка). */
export function filterScrollVideoProducts(products: Product[]): Product[] {
  return products.filter(productSupportsScrollVideo);
}

/** Аксессуары образа для секции — явные sectionLookItems или пустой массив. */
export function resolveSectionLookItems(
  _product: Product,
  section: ProductScrollSwitcherSection
): RunwayLookItem[] {
  if (!section.sectionLookItems?.length) return [];
  return section.sectionLookItems.filter(
    (item) => item.slug && item.name && item.imageUrl && Number.isFinite(item.price)
  );
}

/**
 * Social proof из реальных analytics-событий за сегодня.
 * Если просмотров нет — null (UI не показывает fake «127 views»).
 */
export function resolveAnalyticsSocialProof(
  productSlug: string,
  sectionIndex: number,
  events?: ScrollExperienceEventLogEntry[]
): RunwaySocialProofViewModel | null {
  const log = events ?? readScrollExperienceEventLog();
  const viewsToday = countSectionViewsToday(productSlug, sectionIndex, log);
  if (viewsToday === 0) return null;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayMs = startOfDay.getTime();

  const sectionCounts = new Map<number, number>();
  for (const e of log) {
    if (
      e.timestamp < todayMs ||
      e.productSlug !== productSlug ||
      e.sectionIndex == null ||
      (e.event !== 'scroll_experience_view' && e.event !== 'scroll_experience_section_change')
    ) {
      continue;
    }
    sectionCounts.set(e.sectionIndex, (sectionCounts.get(e.sectionIndex) ?? 0) + 1);
  }

  const maxViews = Math.max(0, ...sectionCounts.values());
  const isPopular = viewsToday >= maxViews && viewsToday > 1;
  const label = isPopular
    ? t('runway.popularVariant')
    : t('runway.viewsToday', { count: viewsToday });

  return { viewsToday, isPopular, label };
}

/** Товар с валидными секциями для runway UI (не показываем сломанный switcher). */
export function productHasValidRunwaySections(product: Product): boolean {
  if (!productSupportsScrollVideo(product)) return false;
  const sections = resolveScrollSwitcherSections(product);
  if (sections.length < 1) return false;
  return sections.every((section, index) => Boolean(resolveSectionImage(product, section, index)));
}

/** Scroll-video SKU бренда, отсортированные по slug. */
export function resolveBrandScrollVideoProducts(products: Product[], brandName: string): Product[] {
  return filterScrollVideoProducts(products)
    .filter((p) => p.brand === brandName)
    .sort((a, b) => a.slug.localeCompare(b.slug, 'ru'));
}

/** Соседние scroll-video товары того же бренда (для RunwayNextProduct). */
export function resolveAdjacentBrandScrollVideoProducts(
  product: Product,
  catalog: Product[]
): RunwayAdjacentProducts {
  const brandProducts = resolveBrandScrollVideoProducts(catalog, product.brand);
  if (brandProducts.length < 2) return {};

  const idx = brandProducts.findIndex((p) => p.slug === product.slug);
  if (idx < 0) return {};

  const prev = idx > 0 ? brandProducts[idx - 1] : undefined;
  const next = idx < brandProducts.length - 1 ? brandProducts[idx + 1] : undefined;

  return {
    prev: prev ? { slug: prev.slug, name: prev.name } : undefined,
    next: next ? { slug: next.slug, name: next.name } : undefined,
  };
}
