import { buildPgContextualThreadsResponse } from '@/lib/server/pg-contextual-message-threads-handler';

/** GET /api/brand/messages/threads — агрегат contextual PG threads (RU main path). */
export async function GET(request: Request) {
  return buildPgContextualThreadsResponse('brand', request);
}
