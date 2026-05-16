'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';

let techPackSessionBlobSetter: Dispatch<SetStateAction<Record<string, string>>> | null = null;

/** Вызывать после `useState` для session-blob техпака (каждый рендер). */
export function registerWorkshop2Phase1TechPackSessionBlobSetter(
  setter: Dispatch<SetStateAction<Record<string, string>>>
) {
  techPackSessionBlobSetter = setter;
}

/** Сброс кэша session-blob при смене коллекции/артикула (тот же слот хука, что и раньше был `useEffect`). */
export function useWorkshop2Phase1DossierTechPackBlobResetOnArticleChange(
  collectionId: string,
  articleId: string
) {
  useEffect(() => {
    techPackSessionBlobSetter?.({});
  }, [articleId, collectionId]);
}
