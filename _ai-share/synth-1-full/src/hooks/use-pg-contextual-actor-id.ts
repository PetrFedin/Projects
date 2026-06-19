'use client';

import { useMemo } from 'react';
import { resolvePgContextualActorId } from '@/lib/communications/pg-contextual-actor-ids';
import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';
import { useAuth } from '@/providers/auth-provider';

/** JWT/session uid для PG contextual read-state; fallback — demo preset кабинета. */
export function usePgContextualActorId(cabinet: PgContextualThreadsCabinet): string {
  const { user } = useAuth();
  return useMemo(
    () => resolvePgContextualActorId(cabinet, { sessionUid: user?.uid }),
    [cabinet, user?.uid]
  );
}
