'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import { fetchPgContextualThreads } from '@/lib/brand/brand-pg-contextual-chat-client';
import type { PgContextualThreadsCabinet } from '@/lib/server/pg-contextual-message-threads-handler';
import { WORKSHOP2_B2B_ORDER_CONTEXT_TYPE } from '@/lib/production/workshop2-b2b-order-lifecycle';

/** contextId (order id) → превью последнего сообщения в треде b2b_order. */
export function useB2bOrderThreadPreviews(
  cabinet: PgContextualThreadsCabinet,
  enabled: boolean
): Record<string, string> {
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const { tick: registryTick } = usePlatformCoreB2bRegistryPoll(enabled);

  useEffect(() => {
    if (!enabled) {
      setPreviews({});
      return;
    }
    let cancelled = false;
    void fetchPgContextualThreads(cabinet).then(({ threads }) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const t of threads) {
        if (t.contextType !== WORKSHOP2_B2B_ORDER_CONTEXT_TYPE) continue;
        const id = t.contextId?.trim();
        const preview = t.lastMessagePreview?.trim();
        if (!id || !preview) continue;
        next[id] = preview;
      }
      setPreviews(next);
    });
    return () => {
      cancelled = true;
    };
  }, [cabinet, enabled, registryTick]);

  return useMemo(() => previews, [previews]);
}
