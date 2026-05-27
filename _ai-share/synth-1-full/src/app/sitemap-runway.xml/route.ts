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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Dedicated sitemap для runway PDP deep links (?view=runway). */
export async function GET() {
  const now = new Date().toISOString();
  const products = loadScrollVideoProducts();

  const urls = products.flatMap((product) => [
    `${SITE_ORIGIN}/products/${product.slug}?view=runway`,
    `${SITE_ORIGIN}/products/${product.slug}`,
  ]);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('view=runway') ? '0.85' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
