'use client';

import { useEffect, useState } from 'react';
import type { ScrollExperienceConfig } from '@/lib/types';
import {
  loadScrollExperienceConfig,
  SCROLL_EXPERIENCE_DEFAULTS,
} from '@/lib/product-scroll-switcher';

/** Клиентский кэш конфига scroll-experience (singleton promise). */
let configPromise: Promise<ScrollExperienceConfig> | null = null;

function getConfigPromise() {
  if (!configPromise) configPromise = loadScrollExperienceConfig();
  return configPromise;
}

export function useScrollExperienceConfig(): ScrollExperienceConfig {
  const [config, setConfig] = useState<ScrollExperienceConfig>(SCROLL_EXPERIENCE_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    getConfigPromise().then((loaded) => {
      if (!cancelled) setConfig(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
