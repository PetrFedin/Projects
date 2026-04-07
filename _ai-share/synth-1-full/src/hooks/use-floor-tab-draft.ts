'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FloorTabScope } from '@/lib/production-data/port';
import { getProductionDataPort } from '@/lib/production-data';

/**
 * Черновик вкладки цеха: загрузка из ProductionDataPort при монтировании, merge с default, save().
 */
export function useFloorTabDraftState<T extends Record<string, unknown>>(
  scope: FloorTabScope,
  defaultData: T
) {
  const defaultRef = useRef(defaultData);
  defaultRef.current = defaultData;

  const [data, setData] = useState<T>(() => ({ ...defaultData }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await getProductionDataPort().getFloorTabDraft(scope);
        if (cancelled) return;
        if (raw && typeof raw === 'object' && (raw as { v?: number }).v === 1) {
          setData({ ...(defaultRef.current as object), ...(raw as object) } as T);
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  const save = useCallback(async () => {
    const payload = {
      ...(data as object),
      v: 1 as const,
      updatedAt: new Date().toISOString(),
    };
    await getProductionDataPort().saveFloorTabDraft(scope, payload);
  }, [scope, data]);

  return { data, setData, save, hydrated };
}
