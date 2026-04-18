import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { getStylistProductPool } from '@/lib/ai-stylist';
=======
import { getStylistProductPool } from '@/lib/ai-stylist/product-source';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';
>>>>>>> recover/cabinet-wip-from-stash

export async function GET(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const category = searchParams.get('category');
  const excludeIds = searchParams.get('excludeIds')?.split(',').filter(Boolean) ?? [];

  if (!productId || !category) {
<<<<<<< HEAD
    return NextResponse.json({ error: 'productId and category required' }, { status: 400 });
=======
    return jsonError(
      {
        code: 'BAD_REQUEST',
        message: 'productId and category required',
        status: 400,
        meta,
      },
      { headers: { 'x-request-id': requestId } }
    );
>>>>>>> recover/cabinet-wip-from-stash
  }

  const pool = getStylistProductPool();
  const product = pool.find((p) => p.id === productId);
  const candidates = pool.filter(
    (p) =>
      p.category === category &&
      p.id !== productId &&
      !excludeIds.includes(p.id) &&
      p.brand !== 'My Wardrobe'
  );

  const scored = candidates.map((p) => {
    let score = 0;
    if (product && p.color === product.color) score += 3;
    if (product && p.tags.some((t) => product.tags.includes(t))) score += 1;
    return { ...p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const result = scored.slice(0, 5).map((p) => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
    category: p.category,
    price: p.price,
    image: p.image,
    slug: p.slug ?? p.id,
    color: p.color,
  }));

  return NextResponse.json({ alternatives: result }, { headers: { 'x-request-id': requestId } });
}
