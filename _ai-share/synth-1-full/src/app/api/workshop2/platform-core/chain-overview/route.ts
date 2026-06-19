import { NextRequest, NextResponse } from 'next/server';

import { getPlatformCoreChainOverview } from '@/lib/server/platform-core-chain-overview';
import { isWorkshop2PgConnectionError } from '@/lib/server/workshop2-pg-pool';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

/** GET /api/workshop2/platform-core/chain-overview?collectionId=SS27 */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() || 'SS27';
  try {
    const overview = await getPlatformCoreChainOverview(collectionId);
    return NextResponse.json({ ok: true, overview });
  } catch (err) {
    if (isWorkshop2PgConnectionError(err)) {
      return NextResponse.json(
        {
          ok: false,
          pgUnavailable: true,
          messageRu: 'PostgreSQL :5433 недоступен — npm run db:core:up && npm run core:bootstrap',
        },
        { status: 503 }
      );
    }
    throw err;
  }
}
