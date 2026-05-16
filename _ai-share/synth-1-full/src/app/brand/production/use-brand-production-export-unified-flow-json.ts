'use client';

import { useCallback } from 'react';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';

export function useBrandProductionExportUnifiedFlowJson(args: {
  unifiedDoc: CollectionSkuFlowDoc;
  collectionFlowKey: string;
}) {
  const { unifiedDoc, collectionFlowKey } = args;

  return useCallback(() => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([JSON.stringify(unifiedDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unified-sku-flow-${collectionFlowKey}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [unifiedDoc, collectionFlowKey]);
}
