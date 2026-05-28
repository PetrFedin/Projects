'use client';

import { useEffect } from 'react';
import { validateRunwayProductsForDev } from '@/lib/runway/runway-dev-validation';
import { loadProductsCatalog } from '@/lib/runway/RunwayExperienceService';

/** Dev-only: console.table валидации scroll-video каталога при первом mount runway. */
export function useRunwayDevValidation(enabled = true): void {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;
    let cancelled = false;
    loadProductsCatalog()
      .then((catalog) => {
        if (!cancelled) validateRunwayProductsForDev(catalog);
      })
      .catch(() => {
        /* catalog unavailable in test env */
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
