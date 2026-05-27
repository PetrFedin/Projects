/**
 * Production API — один товар по slug из public/data/products.json.
 */
import { NextResponse } from 'next/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '@/lib/types';

function loadProductsFromDisk(): Product[] {
  try {
    const path = join(process.cwd(), 'public/data/products.json');
    return JSON.parse(readFileSync(path, 'utf8')) as Product[];
  } catch {
    return [];
  }
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = loadProductsFromDisk().find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found', slug }, { status: 404 });
  }

  return NextResponse.json(product, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  });
}
