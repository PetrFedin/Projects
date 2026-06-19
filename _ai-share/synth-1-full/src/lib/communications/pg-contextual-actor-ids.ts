import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';

/** Demo actor ids when JWT/session uid недоступен (e2e, hub без auth). */
export const PG_CONTEXTUAL_CABINET_ACTOR_ID: Record<PgContextualThreadsCabinet, string> = {
  brand: 'user_petr',
  shop: 'shop-buyer',
  factory: 'factory-ops',
};

/** Session uid → actor для PG read-state (mock-auth / FastAPI profile). */
export function resolvePgContextualActorId(
  cabinet: PgContextualThreadsCabinet,
  opts?: { sessionUid?: string | null }
): string {
  const uid = opts?.sessionUid?.trim();
  if (uid) return uid;
  return PG_CONTEXTUAL_CABINET_ACTOR_ID[cabinet];
}
