import { NextRequest, NextResponse } from 'next/server';

import { listWorkshop2PgCollections } from '@/lib/server/workshop2-collections-list-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

/** GET /api/workshop2/collections — PG collection ids для dynamic registry filter. */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const collections = await listWorkshop2PgCollections();
  return NextResponse.json({
    ok: true,
    collections,
    messageRu:
      collections.length > 0
        ? `${collections.length} коллекций в PostgreSQL.`
        : 'Коллекции не найдены — запустите db:core:bootstrap.',
  });
}
