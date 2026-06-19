'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** Реестр B2B — один экран в collection_order; legacy `?pillar=order_production` → filter-only URL. */
export function useB2bRegistryLegacyOrderProductionPillarRedirect(basePath: string): void {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('pillar') !== 'order_production') return;
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete('pillar');
    const qs = sp.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }, [basePath, router, searchParams]);
}
