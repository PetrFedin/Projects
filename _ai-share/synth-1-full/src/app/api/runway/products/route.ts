/**
 * Production API — полный каталог scroll-video товаров из products.json.
 * Используется ApiRunwayProductRepository при NEXT_PUBLIC_RUNWAY_DATA_SOURCE=api.
 */
import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '@/lib/types';

function loadScrollVideoProductsFromDisk(): Product[] {
  try {
    const path = join(process.cwd(), 'public/data/products.json');
    const products = JSON.parse(readFileSync(path, 'utf8')) as Product[];
    return products.filter((p) => p.displayMode === 'scroll-video');
  } catch {
    return [];
  }
}

export async function GET() {
  const products = loadScrollVideoProductsFromDisk();
  return NextResponse.json(products, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  });
}
