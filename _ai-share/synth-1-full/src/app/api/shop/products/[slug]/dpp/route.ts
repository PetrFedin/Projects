/**
 * GET /api/shop/products/[slug]/dpp — DPP JSON-LD из связанного досье Workshop2.
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2B2cDppApiPayload } from '@/lib/production/workshop2-b2c-dpp-linkage';
import { findWorkshop2DossierByB2cProductSlug } from '@/lib/production/workshop2-b2c-dpp-linkage.server';

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const trimmed = slug?.trim();
  if (!trimmed) {
    return NextResponse.json(
      { ok: false, error: 'slug_required', messageRu: 'Укажите slug товара.' },
      { status: 400 }
    );
  }

  const hit = await findWorkshop2DossierByB2cProductSlug(trimmed);
  const payload = buildWorkshop2B2cDppApiPayload({ slug: trimmed, hit });

  return NextResponse.json({
    ok: payload.available,
    ...payload,
  });
}
