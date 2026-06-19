import { buildPgContextualThreadsResponse } from '@/lib/server/pg-contextual-message-threads-handler';

/** GET /api/factory/messages/threads — contextual PG threads для кабинета цеха. */
export async function GET(request: Request) {
  return buildPgContextualThreadsResponse('factory', request);
}
