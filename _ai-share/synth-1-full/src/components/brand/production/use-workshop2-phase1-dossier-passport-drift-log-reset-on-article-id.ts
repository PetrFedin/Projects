'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';

/** Сброс «журнал паспорта просмотрен» при смене артикула. */
export function useWorkshop2Phase1DossierPassportDriftLogResetOnArticleId(
  articleId: string,
  setPassportDriftLogDone: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    setPassportDriftLogDone(false);
  }, [articleId, setPassportDriftLogDone]);
}
