import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2FactoryProductionHandoffQueue } from '@/lib/server/workshop2-b2b-production-handoff';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

/** GET — входящие серии B2B → цех (после подтверждения брендом). */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const factoryId = req.nextUrl.searchParams.get('factoryId')?.trim() || 'fact-1';
  const queue = await listWorkshop2FactoryProductionHandoffQueue({ factoryId });

  return NextResponse.json({
    ok: true,
    ...queue,
    messageRu:
      queue.items.length > 0
        ? `${queue.items.length} серий(я) с контекстом B2B/W2.`
        : 'Нет входящих серий — бренд подтверждает B2B и передаёт на производство.',
  });
}
