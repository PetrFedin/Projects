/**
 * POST — stub-процессор очереди PLM (dev / ручной retry в UI).
 */
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { processWorkshop2PlmOutboxWithRetry } from '@/lib/server/workshop2-plm-runtime';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

export const POST = withWorkshop2ApiErrorRu(async function postPlmOutboxProcess(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let limit = 20;
  try {
    const body = (await req.json()) as { limit?: number };
    if (typeof body.limit === 'number' && body.limit > 0 && body.limit <= 100) {
      limit = body.limit;
    }
  } catch {
    /* пустое тело — limit по умолчанию */
  }

  const result = await processWorkshop2PlmOutboxWithRetry({ limit });
  const total = result.dispatched + result.acked + result.failed;
  return NextResponse.json({
    ok: true,
    ...result,
    processed: total,
    messageRu:
      total > 0
        ? `Отправлено: ${result.dispatched}, ACK: ${result.acked}, ошибок: ${result.failed}.`
        : 'Очередь пуста — нечего обрабатывать.',
  });
});
