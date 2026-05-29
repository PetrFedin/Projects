'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';
import { waitForIdle } from '@/lib/wait-for-idle';
import {
  loadHomeCmsConfig,
  readHomeCmsConfigCache,
  seedHomeCmsConfigCache,
} from '@/components/home/lib/home-cms-config-cache';

/** Прогрев client cache из RSC baseline до shell prefetch / mid-fold mount. */
export function useSeedHomeCmsConfig(initialCms?: CmsHomeConfig): void {
  useLayoutEffect(() => {
    if (initialCms === undefined) return;
    if (readHomeCmsConfigCache() !== undefined) return;
    seedHomeCmsConfigCache(initialCms);
  }, [initialCms]);
}

/** CMS home config — RSC initial + singleton cache; localStorage override после idle. */
export function useHomeCmsConfig(initialCms?: CmsHomeConfig) {
  const [cfg, setCfg] = useState<CmsHomeConfig>(initialCms ?? DEFAULT_HOME_CMS);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await waitForIdle();
      if (cancelled) return;
      const data = await loadHomeCmsConfig();
      if (!cancelled) setCfg(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [initialCms]);

  return cfg;
}
