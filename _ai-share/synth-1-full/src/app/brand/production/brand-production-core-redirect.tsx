'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { WORKSHOP2_COL_PARAM } from '@/lib/production/workshop2-url';
import { ROUTES } from '@/lib/routes';

/** Core: legacy PLM floor → Workshop2 golden path. */
export function BrandProductionCoreRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      `${ROUTES.brand.productionWorkshop2}?${WORKSHOP2_COL_PARAM}=${PLATFORM_CORE_DEMO.collectionId}`
    );
  }, [router]);

  return null;
}
