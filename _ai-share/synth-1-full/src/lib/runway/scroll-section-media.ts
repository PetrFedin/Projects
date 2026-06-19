import type { Product, ProductScrollSwitcherSection } from '@/lib/types';

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
