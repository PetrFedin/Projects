'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';

/** Сброс подсветки строки «уведомить» при смене артикула/коллекции. */
export function useWorkshop2Phase1DossierTzNotifyHighlightResetOnArticleChange(
  collectionId: string,
  articleId: string,
  setTzNotifyHighlightRowKey: Dispatch<SetStateAction<string | null>>
) {
  useEffect(() => {
    setTzNotifyHighlightRowKey(null);
  }, [articleId, collectionId, setTzNotifyHighlightRowKey]);
}
