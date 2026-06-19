import type {
  ColorInfo,
  Product,
  ProductScrollSwitcherSection,
  ScrollExperienceConfig,
} from '@/lib/types';
import {
  countSectionViewsToday,
  readScrollExperienceEventLog,
  type ScrollExperienceEventLogEntry,
} from '@/lib/scroll-experience-analytics';
import { t } from '@/lib/runway/runway-i18n';
import type { ScrollVideoSources } from '@/lib/runway/scroll-video-sources';
import {
  resolveScrollVideoSourcesCore,
  resolveSectionVideoSourcesCore,
} from '@/lib/runway/scroll-video-sources';
import {
  resolveSectionImage,
  resolveSectionPosterUrl,
  resolveSectionThumbImage,
} from '@/lib/runway/scroll-section-media';
import {
  productSupportsScrollVideo,
  productUsesPerSectionVideo,
  resolveColorForSection,
  resolveScrollSwitcherSections,
  resolveSectionIndexForColor,
  resolveSectionPrice,
  SCROLL_EXPERIENCE_DEFAULTS,
} from '@/lib/runway/runway-scroll-sections';
import type { RunwayLookItem } from '@/lib/types';

function resolveSectionVideoSources(
  product: Parameters<typeof resolveSectionVideoSourcesCore>[0],
  section: Parameters<typeof resolveSectionVideoSourcesCore>[1],
  index: number,
  config?: Parameters<typeof resolveSectionVideoSourcesCore>[3]
): ScrollVideoSources {
  const sections = resolveScrollSwitcherSections(product, config);
  return resolveSectionVideoSourcesCore(product, section, index, config, sections[index]);
}

function resolveScrollVideoSources(
  product: Parameters<typeof resolveScrollVideoSourcesCore>[0],
  config?: Parameters<typeof resolveScrollVideoSourcesCore>[1]
): ScrollVideoSources {
  const sections = resolveScrollSwitcherSections(product, config);
  return resolveScrollVideoSourcesCore(product, config, sections[0]);
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

  const productAvailability = product.availability;
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
 * Memoize на уровне вызывающего (useMemo по product.id).
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
  return products
    .filter(productSupportsScrollVideo)
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
