'use client';

import { useEffect, useState } from 'react';
import type { ScrollExperienceConfig } from '@/lib/types';
import {
  loadScrollExperienceConfig,
  SCROLL_EXPERIENCE_DEFAULTS,
} from '@/lib/product-scroll-switcher';

/** Флаги из /api/runway/config (fallback scroll-experience.json). */
export function useScrollExperienceFlags() {
  const [config, setConfig] = useState<ScrollExperienceConfig>(SCROLL_EXPERIENCE_DEFAULTS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/runway/config');
        if (res.ok) {
          const apiConfig = (await res.json()) as ScrollExperienceConfig;
          if (!cancelled) setConfig(apiConfig);
          return;
        }
      } catch {
        /* static fallback */
      }

      const c = await loadScrollExperienceConfig();
      if (!cancelled) setConfig(c);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    enableCatalogBadge: config.enableCatalogBadge !== false,
    enableQuickViewEntry: config.enableQuickViewEntry !== false,
    config,
  };
}
