/**
 * POST — сброс failed событий PLM outbox в pending и повторная отправка.
 */
import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { retryWorkshop2PlmOutboxFailed } from '@/lib/server/workshop2-plm-outbox';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

async function postPlmOutboxRetryFailed(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let limit = 20;
  try {
    const body = (await req.json()) as { limit?: number };
    if (typeof body.limit === 'number' && body.limit > 0 && body.limit <= 100) {
      limit = body.limit;
    }
  } catch {
    /* default */
  }

  const result = await retryWorkshop2PlmOutboxFailed(limit);
  return NextResponse.json({
    ok: true,
    ...result,
    messageRu:
      result.reset > 0
        ? `Сброшено failed: ${result.reset}; отправлено: ${result.dispatched}, ACK: ${result.acked}, ошибок: ${result.failed}.`
        : 'Нет failed-событий для повтора.',
  });
}

export const POST = withWorkshop2ApiErrorRu(postPlmOutboxRetryFailed);
