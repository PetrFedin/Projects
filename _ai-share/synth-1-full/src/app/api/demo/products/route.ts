/**
 * Demo API — продукты для презентации.
 * Rewrite /data/products.json → этот endpoint.
 */
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { products } = await import('@/lib/products');
    const list = Array.isArray(products) ? products : [];
    return NextResponse.json(list);
  } catch {
    try {
      const { PRODUCTS } = await import('@/data/products.mock');
      const mapped = (PRODUCTS || []).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.title || p.name,
        brand: p.brand,
        price: p.price,
        images: [{ id: p.id, url: p.image, alt: p.title }],
        category: p.category,
        sku: p.id,
        color: p.color,
      }));
      return NextResponse.json(mapped);
    } catch (_) {
      return NextResponse.json([], { status: 200 });
    }
  }
}
