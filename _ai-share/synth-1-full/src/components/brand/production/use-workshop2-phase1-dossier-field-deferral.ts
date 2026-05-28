'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Переключение «позже» по атрибуту и массовая установка для группы. */
export function useWorkshop2Phase1DossierFieldDeferralActions(
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>
) {
  const toggleDeferAttribute = useCallback(
    (attributeId: string) => {
      setDossier((prev) => {
        const nextSet = new Set(prev.deferredAttrIds ?? []);
        if (nextSet.has(attributeId)) nextSet.delete(attributeId);
        else nextSet.add(attributeId);
        return { ...prev, deferredAttrIds: Array.from(nextSet) };
      });
    },
    [setDossier]
  );

  const deferGroupSetAll = useCallback(
    (ids: readonly string[], nextChecked: boolean) => {
      setDossier((prev) => {
        const nextSet = new Set(prev.deferredAttrIds ?? []);
        for (const id of ids) {
          if (nextChecked) nextSet.add(id);
          else nextSet.delete(id);
        }
        return { ...prev, deferredAttrIds: Array.from(nextSet) };
      });
    },
    [setDossier]
  );

  return { toggleDeferAttribute, deferGroupSetAll };
}
