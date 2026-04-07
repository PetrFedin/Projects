'use client';

import { BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT } from '@/lib/production/unified-sku-flow-store';

/**
 * Синхронизация UI после записи flow в хранилище (сейчас localStorage, позже — ответ API).
 * Реализация персистенции: ProductionDataPort (см. getProductionDataPort).
 */
export function subscribeUnifiedSkuFlowSaved(
  fn: (detail: { collectionKey: string }) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const k = (e as CustomEvent<{ collectionKey?: string }>).detail?.collectionKey;
    if (k) fn({ collectionKey: k });
  };
  window.addEventListener(BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT, handler as EventListener);
  return () => window.removeEventListener(BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT, handler as EventListener);
}
