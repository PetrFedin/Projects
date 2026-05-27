import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { buildWorkshop2AttributeRegistryPayload } from '@/lib/production/workshop2-attribute-registry';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET ?leafId= — реестр алиасов info-pick ↔ catalog + неразрешённые ключи листа. */
async function getAttributeAliases(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const leafId = req.nextUrl.searchParams.get('leafId')?.trim() || undefined;
  const leaf = leafId ? findHandbookLeafById(leafId) : null;

  const payload = buildWorkshop2AttributeRegistryPayload({
    ...(leafId ? { leafId } : {}),
    ...(leaf ? { l1Name: leaf.l1Name, l2Name: leaf.l2Name, l3Name: leaf.l3Name } : {}),
  });

  return NextResponse.json({ ok: true, ...payload });
}

export const GET = withWorkshop2ApiErrorRu(getAttributeAliases);
