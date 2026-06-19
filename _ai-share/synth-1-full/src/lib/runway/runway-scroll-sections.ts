import type {
  ColorInfo,
  Product,
  ProductScrollSwitcherSection,
  ScrollExperienceConfig,
} from '@/lib/types';
import {
  DEFAULT_SCROLL_SWITCHER_COLORS,
  DEFAULT_SCROLL_SWITCHER_LABELS,
} from '@/lib/scroll-switcher-constants';
import { SCROLL_EXPERIENCE_V3_DEFAULTS } from '@/lib/runway/scroll-experience-schema';
import {
  resolveSectionImage,
  resolveSectionPosterUrl,
  resolveSectionThumbImage,
} from '@/lib/runway/scroll-section-media';

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

function formatComposition(composition: Product['composition']): string | undefined {
  if (!composition) return undefined;
  if (typeof composition === 'string') return composition;
  return composition.map((c) => `${c.percentage}% ${c.material}`).join(', ');
}

function enrichSection(
  product: Product,
  section: ProductScrollSwitcherSection,
  index: number,
  _config?: ScrollExperienceConfig
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
