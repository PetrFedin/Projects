'use client';

import { useMemo, useRef } from 'react';
import type { Workshop2DossierMetricsFlushContext } from '@/lib/production/workshop2-dossier-metrics-ingest';

export type UseWorkshop2Phase1DossierW2MetricsFlushContextZoneInput = {
  appUserUid?: string | null;
  orgId?: string | null;
};

/** W2 dossier metrics flush ctx + SKU ref (getter avoids TDZ with skuDraft). */
export function useWorkshop2Phase1DossierW2MetricsFlushContextZone({
  appUserUid,
  orgId,
}: UseWorkshop2Phase1DossierW2MetricsFlushContextZoneInput) {
  const w2MetricsSkuRef = useRef<string | null>(null);
  const w2DossierMetricsCtx = useMemo<Workshop2DossierMetricsFlushContext>(
    () => ({
      appUserUid: appUserUid ?? null,
      orgId: orgId ?? null,
      get sku() {
        return w2MetricsSkuRef.current;
      },
    }),
    [appUserUid, orgId]
  );
  return { w2MetricsSkuRef, w2DossierMetricsCtx };
}
