/**
 * POST — процессор outbox cross-module domain events (chat mirror + optional webhook).
 */
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { processWorkshop2DomainEventOutboxBatch } from '@/lib/server/workshop2-domain-events';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

export const POST = withWorkshop2ApiErrorRu(async function postDomainEventsProcess(
  req: NextRequest
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let limit = 20;
  try {
    const body = (await req.json()) as { limit?: number };
    if (typeof body.limit === 'number' && body.limit > 0 && body.limit <= 100) {
      limit = body.limit;
    }
  } catch {
    /* пустое тело */
  }

  const result = await processWorkshop2DomainEventOutboxBatch(limit);
  const total = result.dispatched + result.failed;
  return NextResponse.json({
    ok: true,
    ...result,
    processed: total,
    messageRu:
      total > 0
        ? `Диспетчеризовано: ${result.dispatched}, ошибок: ${result.failed}.`
        : 'Очередь domain events пуста.',
  });
});
