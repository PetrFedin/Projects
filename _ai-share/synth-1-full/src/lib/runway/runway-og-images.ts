/**
 * OG-изображения для hero runway PDP (?view=runway).
 * Путь — section-0 poster; при section>0 используется poster активной секции.
 */
export const RUNWAY_HERO_OG_IMAGES: Record<string, string> = {
  'silk-midi-dress': '/images/demo/runway/silk-midi-dress-section-0.jpg',
  'cashmere-crewneck-sweater': '/images/demo/runway/cashmere-crewneck-sweater-section-0.jpg',
};

/** Дефолтный OG для runway deep link hero SKU. */
export function resolveRunwayHeroOgImagePath(
  productSlug: string,
  sectionPosterPath?: string
): string | undefined {
  if (sectionPosterPath?.startsWith('/')) return sectionPosterPath;
  return RUNWAY_HERO_OG_IMAGES[productSlug];
}
