'use client';

import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

/** Обёртка над `setDossierInternal`: в режиме только чтения — toast и no-op. */
export function useWorkshop2Phase1DossierWriteGuardedSetDossier(
  tzWriteDisabled: boolean,
  toast: ToastFn,
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>
) {
  return useCallback(
    (u: SetStateAction<Workshop2DossierPhase1>) => {
      if (tzWriteDisabled) {
        toast({
          title: 'Только просмотр',
          description: 'Недостаточно права «Редактировать производство» для этой учётной записи.',
          variant: 'destructive',
        });
        return;
      }
      setDossierInternal(u);
    },
    [tzWriteDisabled, toast, setDossierInternal]
  );
}
