import 'server-only';

import {
  listWorkshop2B2bOrdersForCollection,
  listWorkshop2B2bOrdersAll,
} from '@/lib/server/workshop2-b2b-orders-repository';
import { workshop2B2bProductionHandoffPoId } from '@/lib/server/workshop2-b2b-production-handoff';
import {
  workshop2B2bOrderStatusLabelRu,
  type Workshop2B2bOrderRecord,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import { workshop2BuyerLabelRu } from '@/lib/order/brand-workshop2-b2b-order-ui';
import { BRAND_CORE_W2_COLLECTION_IDS } from '@/lib/order/brand-workshop2-b2b-order-ui';
import {
  isIntegrationImportedWholesaleOrderId,
  resolveWholesaleOrderSourcePlatform,
  wholesaleImportChannelLabelRu,
} from '@/lib/integrations/spine/integration-ui-utils';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { mapOperationalOrderToW2DetailView } from '@/lib/integrations/spine/spine-operational-to-w2-order';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { listImportedOrdersAsB2B } from '@/lib/integrations/spine/imported-orders-persistence';
import { listSpineImportedOrdersFromPg } from '@/lib/integrations/spine/imported-orders-persistence.pg';
import {
  ensureSpineOperationalStoreReady,
  isSpineOperationalPgEnabled,
} from '@/lib/integrations/spine/spine-operational-store';
import { isSpineOperationalPgPrimary } from '@/lib/integrations/spine/spine-pg-hydrate-guards';
import type { B2BOrder } from '@/lib/types';

function spineChannelLabelForOrder(orderId: string): string {
  if (!isIntegrationImportedWholesaleOrderId(orderId)) return '';
  const platform = resolveWholesaleOrderSourcePlatform(orderId);
  return platform ? wholesaleImportChannelLabelRu(platform) : '';
}

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function listBrandRegistryExportOrders(input: {
  collectionId?: string;
  partner?: string;
}): Promise<Workshop2B2bOrderRecord[]> {
  const collectionId = input.collectionId?.trim();
  const partner = input.partner?.trim();

  let orders: Workshop2B2bOrderRecord[];
  if (!collectionId || collectionId === 'all') {
    const byCollection = await Promise.all(
      BRAND_CORE_W2_COLLECTION_IDS.map((cid) => listWorkshop2B2bOrdersForCollection(cid))
    );
    orders = byCollection.flat().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } else {
    orders = await listWorkshop2B2bOrdersForCollection(collectionId);
  }

  if (partner && partner !== 'all') {
    orders = orders.filter((o) => workshop2BuyerLabelRu(o.buyerId) === partner);
  }

  return mergeSpineImportedOrdersForBrandExport(orders, collectionId);
}

async function listSpineImportedOrdersForExport(): Promise<B2BOrder[]> {
  if (isSpineOperationalPgPrimary() && isSpineOperationalPgEnabled()) {
    await ensureSpineOperationalStoreReady(['imported_orders']);
    const rows = await listSpineImportedOrdersFromPg();
    return rows.map((r) => r.record.order);
  }
  return listImportedOrdersAsB2B();
}

async function mergeSpineImportedOrdersForBrandExport(
  nativeOrders: Workshop2B2bOrderRecord[],
  collectionId?: string
): Promise<Workshop2B2bOrderRecord[]> {
  const existing = new Set(nativeOrders.map((o) => o.id));
  const collectionFallback =
    collectionId?.trim() && collectionId !== 'all'
      ? collectionId.trim()
      : PLATFORM_CORE_DEMO.collectionId;
  const imported = (await listSpineImportedOrdersForExport()).filter(
    (o) => isIntegrationImportedWholesaleOrderId(o.order) && !existing.has(o.order)
  );
  const spineRows = imported.map((o) =>
    mapOperationalOrderToW2DetailView(
      o.order,
      { status: o.status, amount: o.amount, buyerId: o.shop, collectionId: collectionFallback },
      collectionFallback
    )
  );
  const merged = [...nativeOrders, ...spineRows];
  if (collectionId && collectionId !== 'all') {
    return merged
      .filter(
        (o) =>
          o.collectionId === collectionId ||
          (isIntegrationImportedWholesaleOrderId(o.id) && o.collectionId === collectionFallback)
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return merged.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function buildBrandRegistryExportCsv(orders: Workshop2B2bOrderRecord[]): string {
  const header = [
    'orderId',
    'buyerId',
    'buyerLabelRu',
    'collectionId',
    'articleId',
    'totalRub',
    'status',
    'statusLabelRu',
    'productionOrderId',
    'orderMode',
    'spineChannel',
    'updatedAt',
  ];
  const rows = orders.map((o) =>
    [
      escapeCsvCell(o.id),
      escapeCsvCell(o.buyerId ?? ''),
      escapeCsvCell(workshop2BuyerLabelRu(o.buyerId)),
      escapeCsvCell(o.collectionId ?? ''),
      escapeCsvCell(o.articleId ?? o.lines[0]?.articleId ?? ''),
      String(o.totalRub ?? 0),
      escapeCsvCell(o.status),
      escapeCsvCell(workshop2B2bOrderStatusLabelRu(o.status)),
      escapeCsvCell(workshop2B2bProductionHandoffPoId(o.id)),
      escapeCsvCell(o.tier === 'prebook' ? 'pre_order' : 'buy_now'),
      escapeCsvCell(spineChannelLabelForOrder(o.id)),
      escapeCsvCell(o.updatedAt),
    ].join(',')
  );
  return [header.join(','), ...rows].join('\n');
}

export function buildBrandRegistryExportJson(orders: Workshop2B2bOrderRecord[]): {
  ok: true;
  exportedAt: string;
  count: number;
  source: 'pg' | 'memory';
  orders: Array<{
    orderId: string;
    buyerId: string;
    buyerLabelRu: string;
    collectionId: string;
    articleId: string;
    totalRub: number;
    status: string;
    statusLabelRu: string;
    productionOrderId: string;
    orderMode: string;
    spineChannel: string;
    updatedAt: string;
  }>;
} {
  return {
    ok: true,
    exportedAt: new Date().toISOString(),
    count: orders.length,
    source: isWorkshop2PostgresEnabled() ? 'pg' : 'memory',
    orders: orders.map((o) => ({
      orderId: o.id,
      buyerId: o.buyerId ?? '',
      buyerLabelRu: workshop2BuyerLabelRu(o.buyerId),
      collectionId: o.collectionId ?? '',
      articleId: o.articleId ?? o.lines[0]?.articleId ?? '',
      totalRub: o.totalRub ?? 0,
      status: o.status,
      statusLabelRu: workshop2B2bOrderStatusLabelRu(o.status),
      productionOrderId: workshop2B2bProductionHandoffPoId(o.id),
      orderMode: o.tier === 'prebook' ? 'pre_order' : 'buy_now',
      spineChannel: spineChannelLabelForOrder(o.id),
      updatedAt: o.updatedAt,
    })),
  };
}

export function brandRegistryExportJsonHeaders(collectionId: string): Record<string, string> {
  const slug = collectionId.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'all';
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Disposition': `attachment; filename="brand-b2b-registry-${slug}.json"`,
    'Cache-Control': 'no-store',
    'X-Platform-Core-Export-Source': isWorkshop2PostgresEnabled() ? 'pg' : 'memory',
    'X-Platform-Core-Export-Kind': 'brand_registry_json',
  };
}

export function brandRegistryExportHeaders(collectionId: string): Record<string, string> {
  const slug = collectionId.replace(/[^a-zA-Z0-9_-]+/g, '_') || 'all';
  return {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="brand-b2b-registry-${slug}.csv"`,
    'Cache-Control': 'no-store',
    'X-Platform-Core-Export-Source': isWorkshop2PostgresEnabled() ? 'pg' : 'memory',
    'X-Platform-Core-Export-Kind': 'brand_registry',
  };
}

/** Test / admin: all orders without collection filter. */
export async function listAllBrandRegistryExportOrders(): Promise<Workshop2B2bOrderRecord[]> {
  return listWorkshop2B2bOrdersAll();
}
