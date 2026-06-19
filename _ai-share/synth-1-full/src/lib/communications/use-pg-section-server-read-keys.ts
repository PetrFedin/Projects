'use client';

import { useEffect, useState } from 'react';
import { subscribePgSectionVisitState } from '@/lib/communications/pg-contextual-section-read-state';
import { isPlatformCorePgB2bOrder } from '@/lib/platform-core-demo-order';

/** Server-persisted section visit keys for cross-device unread (GET section-read-state). */
export function usePgSectionServerReadKeys(orderId: string, readerId: string): Set<string> {
  const [keys, setKeys] = useState<Set<string>>(() => new Set());
  const [visitTick, setVisitTick] = useState(0);

  useEffect(() => subscribePgSectionVisitState(() => setVisitTick((t) => t + 1)), []);

  useEffect(() => {
    const oid = orderId.trim();
    const rid = readerId.trim();
    if (!oid || !isPlatformCorePgB2bOrder(oid) || !rid) {
      setKeys(new Set());
      return;
    }

    let cancelled = false;
    const params = new URLSearchParams({ orderId: oid, readerId: rid });
    void fetch(`/api/messages/contextual/section-read-state?${params}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json as { keys?: string[] } | null;
        if (cancelled || !data?.keys) return;
        setKeys(new Set(data.keys));
      })
      .catch(() => {
        /* best-effort */
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, readerId, visitTick]);

  return keys;
}
