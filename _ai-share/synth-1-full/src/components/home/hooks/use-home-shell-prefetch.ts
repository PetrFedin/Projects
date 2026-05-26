'use client';

import { useEffect } from 'react';
import { scheduleIdleMount } from '@/lib/wait-for-idle';
import { HOME_ROLES_NEEDING_PRODUCTS } from '@/components/home/hooks/home-data-roles';
import { prefetchHomeProductsCatalog } from '@/components/home/lib/home-products-catalog';
import { prefetchHomeCmsConfig } from '@/components/home/lib/home-cms-config-cache';

type UseHomeShellPrefetchOptions = {
  viewRole?: string;
  idleTimeout?: number;
  idleFallbackMs?: number;
};

/**
 * Ранний warmup CMS + products из shell — параллельно с lazy mid-fold.
 * Idempotent singleton caches в lib/home-*-catalog / home-cms-config-cache.
 */
export function useHomeShellPrefetch({
  viewRole = 'client',
  idleTimeout = 900,
  idleFallbackMs = 250,
}: UseHomeShellPrefetchOptions = {}) {
  useEffect(() => {
    const cancelIdle = scheduleIdleMount(
      () => {
        prefetchHomeCmsConfig();
        if (HOME_ROLES_NEEDING_PRODUCTS.has(viewRole)) {
          prefetchHomeProductsCatalog();
        }
      },
      idleTimeout,
      idleFallbackMs
    );

    return () => cancelIdle?.();
  }, [viewRole, idleTimeout, idleFallbackMs]);
}
