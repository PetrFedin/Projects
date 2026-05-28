import type { MetadataRoute } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '@/lib/types';
import { productSupportsScrollVideo } from '@/lib/product-scroll-switcher';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://syntha.os';

function loadScrollVideoProducts(): Product[] {
  try {
    const path = join(process.cwd(), 'public/data/products.json');
    const products = JSON.parse(readFileSync(path, 'utf8')) as Product[];
    return products.filter(productSupportsScrollVideo);
  } catch {
    return [];
  }
}

/** Sitemap с runway deep links для scroll-video SKU. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const runwayProducts = loadScrollVideoProducts();

  const productEntries: MetadataRoute.Sitemap = runwayProducts.flatMap((product) => [
    {
      url: `${SITE_ORIGIN}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_ORIGIN}/products/${product.slug}?view=runway`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
  ]);

  return [
    {
      url: `${SITE_ORIGIN}/runway`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${SITE_ORIGIN}/runway/playlist`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    ...productEntries,
  ];
}
