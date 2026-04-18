'use client';

import { useEffect, useMemo, useState } from 'react';
import { listB2BOrdersForOperationalUi } from '@/lib/order/b2b-orders-list-read-model';
import { parseOperationalOrdersV1ListResponse } from '@/lib/order/operational-order-dto.schema';
import { operationalOrderListRowDtoToB2BOrder } from '@/lib/order/operational-order-dto';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';

/** Кабинет бренда (`brand`) или shop/distributor (`shop` → API header, fallback как `retailer` в read-model). */
export type OperationalOrdersListActor = 'brand' | 'shop';

const ACTOR_HEADERS: Record<OperationalOrdersListActor, { 'x-syntha-api-actor-role': string }> = {
  brand: { 'x-syntha-api-actor-role': 'brand' },
  shop: { 'x-syntha-api-actor-role': 'shop' },
};

function readModelRole(actor: OperationalOrdersListActor): PlatformRole {
  return actor === 'shop' ? 'retailer' : 'brand';
}

function fetchOperationalOrders(actor: OperationalOrdersListActor): B2BOrder[] {
  return listB2BOrdersForOperationalUi({ actorRole: readModelRole(actor) });
}

/**
 * Список operational B2B: v1 HTTP → legacy → {@link listB2BOrdersForOperationalUi} (demo read-model).
 */
export function useOperationalOrdersList(actor: OperationalOrdersListActor): B2BOrder[] {
  const [rows, setRows] = useState<B2BOrder[] | null>(null);

  useEffect(() => {
    const headers = ACTOR_HEADERS[actor];
    let cancelled = false;
    (async () => {
      try {
        const v1 = await fetch('/api/b2b/v1/operational-orders', {
          headers: { ...headers },
          cache: 'no-store',
        });
        if (v1.ok) {
          const raw: unknown = await v1.json();
          const parsed = parseOperationalOrdersV1ListResponse(raw);
          if (parsed.success && !cancelled) {
            setRows(parsed.data.data.orders.map(operationalOrderListRowDtoToB2BOrder));
            return;
          }
        }
        const leg = await fetch('/api/b2b/operational-orders', {
          headers: { ...headers },
          cache: 'no-store',
        });
        if (leg.ok) {
          const j = (await leg.json()) as { ok?: boolean; data?: { orders?: B2BOrder[] } };
          if (j?.ok && Array.isArray(j.data?.orders) && !cancelled) {
            setRows(j.data!.orders!);
            return;
          }
        }
      } catch {
        /* read-model fallback */
      }
      if (!cancelled) {
        setRows(fetchOperationalOrders(actor));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor]);

  return useMemo(() => rows ?? fetchOperationalOrders(actor), [rows, actor]);
}

/** Реестр бренда `/brand/b2b-orders`. */
export function useB2BOperationalOrdersList(): B2BOrder[] {
  return useOperationalOrdersList('brand');
}

/** Хаб shop/distributor `/shop/b2b/orders` (tenant filter через API). */
export function useShopB2BOperationalOrdersList(): B2BOrder[] {
  return useOperationalOrdersList('shop');
}
