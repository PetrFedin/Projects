'use client';

import { useMemo } from 'react';
import {
  normalizeProductionFlowProfileId,
  PRODUCTION_FLOW_PROFILES,
} from '@/lib/production/collection-production-profiles';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';

export function useStagesDependenciesProductionProfile(flowDoc: CollectionSkuFlowDoc) {
  const productionProfileId = useMemo(
    () => normalizeProductionFlowProfileId(flowDoc.productionProfileId),
    [flowDoc.productionProfileId]
  );
  const productionProfileHint = useMemo(
    () => PRODUCTION_FLOW_PROFILES.find((p) => p.id === productionProfileId)?.hint ?? '',
    [productionProfileId]
  );
  const productionProfileLabel = useMemo(
    () => PRODUCTION_FLOW_PROFILES.find((p) => p.id === productionProfileId)?.label ?? '',
    [productionProfileId]
  );

  return { productionProfileId, productionProfileHint, productionProfileLabel };
}
