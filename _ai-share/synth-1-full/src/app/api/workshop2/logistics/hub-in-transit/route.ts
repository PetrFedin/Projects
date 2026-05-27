/**
 * GET — артикулы с отгрузкой in_transit (badge на хабе).
 */
import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { listWorkshop2LogisticsInTransitArticleKeys } from '@/lib/server/workshop2-logistics-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

async function getHubInTransit(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const keys = await listWorkshop2LogisticsInTransitArticleKeys();
  return NextResponse.json({ ok: true, articleKeys: keys });
}

export const GET = withWorkshop2ApiErrorRu(getHubInTransit);
