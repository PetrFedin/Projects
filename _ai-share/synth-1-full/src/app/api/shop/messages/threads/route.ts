import { buildPgContextualThreadsResponse } from '@/lib/server/pg-contextual-message-threads-handler';

/** GET /api/shop/messages/threads — contextual PG threads для кабинета байера (B2B only). */
export async function GET(request: Request) {
  return buildPgContextualThreadsResponse('shop', request);
}
