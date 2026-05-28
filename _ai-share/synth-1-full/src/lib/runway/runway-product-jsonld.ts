import type { Product } from '@/lib/types';
import {
  productSupportsScrollVideo,
  resolveScrollSwitcherSections,
  resolveSectionImage,
  resolveSectionPrice,
} from '@/lib/product-scroll-switcher';
import type { RunwayMetadataSearchParams } from '@/lib/runway-metadata';

const SITE_ORIGIN = 'https://syntha.os';

/** Schema.org Product с color variant для ?view=runway&section=N. */
export function buildRunwayProductJsonLd(
  product: Product,
  searchParams: RunwayMetadataSearchParams = {},
  siteOrigin = SITE_ORIGIN
): Record<string, unknown> | null {
  if (searchParams?.view !== 'runway' || !productSupportsScrollVideo(product)) {
    return null;
  }

  const sections = resolveScrollSwitcherSections(product);
  const sectionIndex = Math.min(
    Math.max(0, Number.parseInt(searchParams.section ?? '0', 10) || 0),
    Math.max(0, sections.length - 1)
  );
  const section = sections[sectionIndex] ?? sections[0];
  if (!section) return null;

  const imagePath = resolveSectionImage(product, section, sectionIndex) ?? product.images[0]?.url;
  const imageUrl = imagePath?.startsWith('http')
    ? imagePath
    : `${siteOrigin}${imagePath?.startsWith('/') ? '' : '/'}${imagePath ?? ''}`;

  const price = resolveSectionPrice(product, section, sectionIndex);
  const colorLabel = section.label || section.colorName || product.color;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: section.variantSku ?? product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    color: colorLabel,
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: `${siteOrigin}/products/${product.slug}?view=runway&section=${sectionIndex}`,
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'runwaySection',
        value: String(sectionIndex),
      },
      {
        '@type': 'PropertyValue',
        name: 'runwayVariantLabel',
        value: colorLabel,
      },
    ],
  };
}
