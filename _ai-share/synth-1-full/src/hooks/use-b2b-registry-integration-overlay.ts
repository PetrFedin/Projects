'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { b2bV1SynthaActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers';
import { parseOperationalOrdersV1ListResponse } from '@/lib/order/operational-order-dto.schema';
import type { OperationalOrderListRowDto } from '@/lib/order/operational-order-dto';
import type { BrandB2bOrderListRow } from '@/lib/order/brand-workshop2-b2b-order-ui';
import type { OperationalOrderIntegration } from '@/lib/integrations/spine/integration-external-ref.schema';
import {
  isIntegrationImportedWholesaleOrderId,
  mapOperationalStatusLabelRu,
} from '@/lib/integrations/spine/integration-ui-utils';

export type B2bRegistryIntegrationOverlay = {
  integrationByOrderId: Record<string, OperationalOrderIntegration>;
  importedBrandRows: BrandB2bOrderListRow[];
  importedShopRows: Array<{
    orderId: string;
    brand: string;
    status: string;
    amount: string;
    collectionId?: string;
    integration?: OperationalOrderIntegration;
  }>;
  loadState: 'idle' | 'loading' | 'ready' | 'error';
  reload: () => void;
};

function dtoToBrandRow(d: OperationalOrderListRowDto): BrandB2bOrderListRow {
  return {
    order: d.wholesaleOrderId,
    shop: d.shop,
    status: mapOperationalStatusLabelRu(d.status),
    amount: d.amount,
    date: d.date,
    orderMode: d.orderMode === 'pre_order' ? 'pre_order' : 'buy_now',
    integration: d.integration,
  };
}

function dtoToShopRow(d: OperationalOrderListRowDto) {
  return {
    orderId: d.wholesaleOrderId,
    brand: d.brand,
    status: mapOperationalStatusLabelRu(d.status),
    amount: d.amount,
    collectionId: d.eventId,
    integration: d.integration,
  };
}

/**
 * Overlay operational v1 + integration meta для реестров brand/shop (столп 3).
 */
export function useB2bRegistryIntegrationOverlay(
  actor: 'brand' | 'shop',
  enabled: boolean,
  reloadNonce = 0
): B2bRegistryIntegrationOverlay {
  const [rows, setRows] = useState<OperationalOrderListRowDto[]>([]);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoadState('idle');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    void (async () => {
      try {
        const res = await fetch('/api/b2b/v1/operational-orders', {
          headers: { ...b2bV1SynthaActorRoleHeaders(actor === 'shop' ? 'shop' : 'brand') },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('v1 list failed');
        const parsed = parseOperationalOrdersV1ListResponse(await res.json());
        if (!parsed.success) throw new Error('parse failed');
        if (!cancelled) {
          setRows(parsed.data.data.orders);
          setLoadState('ready');
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadState('error');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, enabled, reloadNonce, tick]);

  return useMemo(() => {
    const integrationByOrderId: Record<string, OperationalOrderIntegration> = {};
    for (const r of rows) {
      if (r.integration) integrationByOrderId[r.wholesaleOrderId] = r.integration;
    }

    const imported = rows.filter((r) => isIntegrationImportedWholesaleOrderId(r.wholesaleOrderId));

    return {
      integrationByOrderId,
      importedBrandRows: imported.map(dtoToBrandRow),
      importedShopRows: imported.map(dtoToShopRow),
      loadState,
      reload,
    };
  }, [rows, loadState, reload]);
}
