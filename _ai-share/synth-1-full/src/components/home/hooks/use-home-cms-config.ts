'use client';

import { useEffect, useState } from 'react';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';
import { waitForIdle } from '@/lib/wait-for-idle';
import {
  loadHomeCmsConfig,
  seedHomeCmsConfigCache,
} from '@/components/home/lib/home-cms-config-cache';

/** CMS home config — RSC initial + singleton cache; localStorage override после idle. */
export function useHomeCmsConfig(initialCms?: CmsHomeConfig) {
  const [cfg, setCfg] = useState<CmsHomeConfig>(initialCms ?? DEFAULT_HOME_CMS);

  useEffect(() => {
    if (initialCms) seedHomeCmsConfigCache(initialCms);

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
