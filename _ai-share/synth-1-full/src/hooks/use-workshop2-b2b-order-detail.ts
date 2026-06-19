'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { b2bV1SynthaActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers';
import { parseOperationalOrderV1DetailResponse } from '@/lib/order/operational-order-dto.schema';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';
import { mapOperationalOrderToW2DetailView } from '@/lib/integrations/spine/spine-operational-to-w2-order';

export type Workshop2B2bOrderDetailView = Workshop2B2bOrderRecord & {
  statusLabelRu: string;
  buyerLabelRu: string;
  paymentTermsLabelRu: string | null;
};

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function useWorkshop2B2bOrderDetail(
  orderId: string,
  enabled: boolean,
  options?: { collectionFallback?: string }
): {
  order: Workshop2B2bOrderDetailView | null;
  loadState: LoadState;
} {
  const [order, setOrder] = useState<Workshop2B2bOrderDetailView | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');

  useEffect(() => {
    const id = orderId.trim();
    if (!enabled || !id) {
      setOrder(null);
      setLoadState('idle');
      return;
    }

    let cancelled = false;
    setLoadState('loading');

    (async () => {
      try {
        const res = await fetch(`/api/workshop2/b2b/orders/${encodeURIComponent(id)}`, {
          headers: buildWorkshop2ApiRequestHeaders(),
          cache: 'no-store',
        });
        const json = (await res.json()) as {
          ok?: boolean;
          order?: Workshop2B2bOrderDetailView;
        };
        if (!cancelled) {
          if (res.ok && json.ok && json.order) {
            setOrder(json.order);
            setLoadState('ready');
            return;
          }
          if (isIntegrationImportedWholesaleOrderId(id)) {
            const opRes = await fetch(
              `/api/b2b/v1/operational-orders/${encodeURIComponent(id)}`,
              {
                headers: { ...b2bV1SynthaActorRoleHeaders('brand') },
                cache: 'no-store',
              }
            );
            const parsed = parseOperationalOrderV1DetailResponse(await opRes.json());
            if (parsed.success) {
              setOrder(
                mapOperationalOrderToW2DetailView(
                  id,
                  parsed.data.data.order,
                  options?.collectionFallback ?? 'SS27'
                )
              );
              setLoadState('ready');
              return;
            }
          }
          setOrder(null);
          setLoadState('error');
        }
      } catch {
        if (!cancelled) {
          setOrder(null);
          setLoadState('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, enabled, options?.collectionFallback]);

  return useMemo(() => ({ order, loadState }), [order, loadState]);
}
