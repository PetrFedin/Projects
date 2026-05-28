import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '@/lib/types';
import {
  productSupportsScrollVideo,
  resolveScrollSwitcherSections,
  resolveSectionPosterUrl,
} from '@/lib/product-scroll-switcher';
import { resolveRunwayHeroOgImagePath } from '@/lib/runway/runway-og-images';

export interface RunwayMetadataSearchParams {
  view?: string;
  section?: string;
}

function loadProductsFromDisk(): Product[] {
  try {
    const path = join(process.cwd(), 'public/data/products.json');
    return JSON.parse(readFileSync(path, 'utf8')) as Product[];
  } catch {
    return [];
  }
}

/** OG/title для deep link ?view=runway&section=N. */
export function buildRunwayProductMetadata(
  product: Product,
  searchParams: RunwayMetadataSearchParams = {},
  siteOrigin = 'https://syntha.os'
) {
  const isRunway = searchParams?.view === 'runway' && productSupportsScrollVideo(product);
  const sections = resolveScrollSwitcherSections(product);
  const sectionIndex = Math.min(
    Math.max(0, Number.parseInt(searchParams.section ?? '0', 10) || 0),
    Math.max(0, sections.length - 1)
  );
  const section = sections[sectionIndex] ?? sections[0];

  const sectionLabel = section?.label;
  const title = isRunway
    ? sectionLabel
      ? `${product.name} — ${sectionLabel} | Runway`
      : `${product.name} | Runway`
    : product.name;

  const description = isRunway
    ? section?.sectionDescription?.trim() ||
      `Runway-витрина: ${product.name}${sectionLabel ? ` · вариант «${sectionLabel}»` : ''}. ${product.brand}.`
    : (product.description?.slice(0, 160) ?? product.name);

  const sectionPoster =
    isRunway && section ? resolveSectionPosterUrl(product, section, sectionIndex) : undefined;
  const heroOg = isRunway ? resolveRunwayHeroOgImagePath(product.slug, sectionPoster) : undefined;

  const imagePath = heroOg ?? sectionPoster ?? product.images[0]?.url ?? '/og-image.jpg';

  const imageUrl = imagePath.startsWith('http')
    ? imagePath
    : `${siteOrigin}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

  const canonical = `${siteOrigin}/products/${product.slug}${
    isRunway ? `?view=runway${sectionIndex > 0 ? `&section=${sectionIndex}` : ''}` : ''
  }`;

  return { title, description, imageUrl, canonical, isRunway };
}

export function findProductBySlug(slug: string): Product | undefined {
  return loadProductsFromDisk().find((p) => p.slug === slug);
}
