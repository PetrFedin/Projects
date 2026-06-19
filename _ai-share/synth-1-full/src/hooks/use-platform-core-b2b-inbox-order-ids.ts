'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import {
  BRAND_CORE_W2_COLLECTION_IDS,
  workshop2B2bOrderToBrandListRow,
} from '@/lib/order/brand-workshop2-b2b-order-ui';
import {
  SHOP_CORE_W2_COLLECTION_IDS,
  workshop2B2bOrderToShopListRow,
} from '@/lib/order/shop-workshop2-b2b-order-ui';
import { normalizeShopCoreBuyerId } from '@/lib/order/shop-core-buyer-context';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { usePlatformCoreB2bRegistryPoll } from '@/hooks/use-platform-core-b2b-registry-poll';
import {
  filterPlatformCoreBrandOrderRows,
  filterPlatformCoreShopOrderRows,
} from '@/lib/platform-core-b2b-registry-url';
import { b2bV1SynthaActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers';
import { parseOperationalOrdersV1ListResponse } from '@/lib/order/operational-order-dto.schema';
import { isIntegrationImportedWholesaleOrderId } from '@/lib/integrations/spine/integration-ui-utils';

async function fetchSpineOperationalOrderIds(actorRole: 'brand' | 'shop'): Promise<string[]> {
  const res = await fetch('/api/b2b/v1/operational-orders', {
    headers: { ...b2bV1SynthaActorRoleHeaders(actorRole) },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const parsed = parseOperationalOrdersV1ListResponse(await res.json());
  if (!parsed.success) return [];
  return parsed.data.data.orders
    .filter((o) => isIntegrationImportedWholesaleOrderId(o.wholesaleOrderId))
    .map((o) => o.wholesaleOrderId);
}

async function fetchAllocationSpineOrderIds(): Promise<string[]> {
  const res = await fetch('/api/integrations/v1/allocation/queue?limit=20', { cache: 'no-store' });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: { items?: Array<{ wholesaleOrderId?: string }> };
  };
  return (json.data?.items ?? [])
    .map((i) => String(i.wholesaleOrderId ?? '').trim())
    .filter((id) => isIntegrationImportedWholesaleOrderId(id));
}

function mergeOrderIdsPriority(...groups: string[][]): string[] {
  return [...new Set(groups.flat().filter(Boolean))];
}

export type PlatformCoreB2bInboxCabinet = 'brand' | 'shop' | 'manufacturer' | 'supplier';

async function fetchHandoffQueueB2bOrderIds(): Promise<string[]> {
  const headers = buildWorkshop2ApiRequestHeaders();
  const res = await fetch(
    `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(PLATFORM_CORE_DEMO.factoryId)}`,
    { headers, cache: 'no-store' }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as {
    ok?: boolean;
    items?: Array<{ b2bOrderId?: string }>;
  };
  if (!json.ok || !Array.isArray(json.items)) return [];
  return [
    ...new Set(json.items.map((item) => String(item.b2bOrderId ?? '').trim()).filter(Boolean)),
  ];
}

async function fetchOrderIdsForCabinet(
  cabinet: PlatformCoreB2bInboxCabinet,
  shopBuyerId?: string
): Promise<string[]> {
  const headers = buildWorkshop2ApiRequestHeaders();
  if (cabinet === 'manufacturer' || cabinet === 'supplier') {
    return fetchHandoffQueueB2bOrderIds();
  }

  if (cabinet === 'brand') {
    const w2Responses = await Promise.all(
      BRAND_CORE_W2_COLLECTION_IDS.map(async (collectionId) => {
        const res = await fetch(
          `/api/brand/b2b/orders?collectionId=${encodeURIComponent(collectionId)}`,
          { headers, cache: 'no-store' }
        );
        if (!res.ok) return [] as Workshop2B2bOrderRecord[];
        const json = (await res.json()) as { ok?: boolean; orders?: Workshop2B2bOrderRecord[] };
        return json.ok && Array.isArray(json.orders) ? json.orders : [];
      })
    );
    const w2Ids = w2Responses
      .flat()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((o) => workshop2B2bOrderToBrandListRow(o).order);
    if (isPlatformCoreMode()) {
      return filterPlatformCoreBrandOrderRows(
        w2Ids.map((order) => ({ order })),
        PLATFORM_CORE_DEMO.demoOrderId
      ).map((r) => r.order);
    }
    const [spineAllocation, spineOperational] = await Promise.all([
      fetchAllocationSpineOrderIds(),
      fetchSpineOperationalOrderIds('brand'),
    ]);
    return mergeOrderIdsPriority(spineAllocation, spineOperational, w2Ids);
  }

  const buyerId = normalizeShopCoreBuyerId(shopBuyerId);
  const shopResponses = await Promise.all(
    SHOP_CORE_W2_COLLECTION_IDS.map(async (collectionId) => {
      const res = await fetch(
        `/api/shop/b2b/orders?buyerId=${encodeURIComponent(buyerId)}&collectionId=${encodeURIComponent(collectionId)}`,
        { headers, cache: 'no-store' }
      );
      if (!res.ok) return [] as Workshop2B2bOrderRecord[];
      const json = (await res.json()) as { ok?: boolean; orders?: Workshop2B2bOrderRecord[] };
      return json.ok && Array.isArray(json.orders) ? json.orders : [];
    })
  );
  const w2Ids = shopResponses
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((o) => workshop2B2bOrderToShopListRow(o).order);
  if (isPlatformCoreMode()) {
    return filterPlatformCoreShopOrderRows(
      w2Ids.map((order) => ({ orderId: order, order })),
      PLATFORM_CORE_DEMO.demoOrderId
    ).map((r) => r.orderId ?? r.order);
  }
  const [spineAllocation, spineOperational] = await Promise.all([
    fetchAllocationSpineOrderIds(),
    fetchSpineOperationalOrderIds('shop'),
  ]);
  return mergeOrderIdsPriority(spineAllocation, spineOperational, w2Ids);
}

/** Id заказов из PG-реестра для универсального inbox в /messages (brand + shop + manufacturer + supplier). */
export function usePlatformCoreB2bInboxOrderIds(
  cabinet: PlatformCoreB2bInboxCabinet | null,
  shopBuyerId?: string
): { orderIds: string[]; ready: boolean } {
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [ready, setReady] = useState(!cabinet);
  const { tick: registryTick } = usePlatformCoreB2bRegistryPoll(Boolean(cabinet));

  useEffect(() => {
    if (!cabinet) {
      setOrderIds([]);
      setReady(true);
      return;
    }
    let cancelled = false;
    setReady(false);
    void fetchOrderIdsForCabinet(cabinet, shopBuyerId)
      .then((ids) => {
        if (!cancelled) {
          setOrderIds(ids);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrderIds([]);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cabinet, shopBuyerId, registryTick]);

  return useMemo(() => ({ orderIds, ready }), [orderIds, ready]);
}
