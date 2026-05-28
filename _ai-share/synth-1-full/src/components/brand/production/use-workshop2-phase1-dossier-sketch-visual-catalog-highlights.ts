'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

/** Подсветка строк визуального каталога по подсказке со скетча; сброс вне general/construction. */
export function useWorkshop2Phase1DossierSketchVisualCatalogHighlights(
  activeSection: Workshop2TzSignoffSectionKey
) {
  const [sketchVisualCatalogHighlightIds, setSketchVisualCatalogHighlightIds] = useState<string[]>(
    []
  );
  const sketchVisualCatalogHighlightSet = useMemo(
    () => new Set(sketchVisualCatalogHighlightIds),
    [sketchVisualCatalogHighlightIds]
  );

  const onVisualCatalogSuggestFromSketch = useCallback((ids: string[]) => {
    setSketchVisualCatalogHighlightIds(ids);
  }, []);

  useEffect(() => {
    if (!['general', 'construction'].includes(activeSection)) {
      setSketchVisualCatalogHighlightIds([]);
    }
  }, [activeSection]);

  return { sketchVisualCatalogHighlightSet, onVisualCatalogSuggestFromSketch };
}
