import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { getWorkshop2CategoryLeafMeta } from '@/lib/server/workshop2-references-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET: метаданные листа категории L3 (?leafId=). */
async function getCategories(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const leafId = req.nextUrl.searchParams.get('leafId')?.trim() ?? '';
  if (!leafId) {
    return NextResponse.json(
      { ok: false, error: 'leaf_id_required', message: 'Укажите leafId' },
      { status: 400 }
    );
  }

  const data = await getWorkshop2CategoryLeafMeta(leafId);
  return NextResponse.json({
    ok: true,
    source: data.source,
    leafId,
    item: data.item,
  });
}

export const GET = withWorkshop2ApiErrorRu(getCategories);
