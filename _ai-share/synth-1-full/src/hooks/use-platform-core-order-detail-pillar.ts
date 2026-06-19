'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CoreHubPillarId } from '@/lib/platform-core-hub-matrix';

const PRODUCTION_HASHES = new Set(['production-handoff', 'production-dossier', 'order-production']);

/** Столп карточки B2B-заказа: `?pillar=order_production` или production hash. */
export function usePlatformCoreOrderDetailPillarId(): CoreHubPillarId {
  const searchParams = useSearchParams();
  const [pillarId, setPillarId] = useState<CoreHubPillarId>('collection_order');

  useEffect(() => {
    const sync = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
      const pillarParam = searchParams.get('pillar');
      if (pillarParam === 'order_production' || PRODUCTION_HASHES.has(hash)) {
        setPillarId('order_production');
      } else {
        setPillarId('collection_order');
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [searchParams]);

  return pillarId;
}
