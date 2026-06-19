import { brandOrderCommsFeatureHref } from '@/lib/b2b/brand-order-comms';
import {
  brandOrderCommsTabHref,
} from '@/lib/b2b/brand-collection-order-hrefs';
import { buildShopInventoryOpsSession } from '@/lib/b2b/shop-inventory-ops';
import {
  shopLandedMarginTabHref,
  shopMatrixWorkspaceTabHref,
  shopOrderCommsTabHref,
  shopReplenishmentTabHref,
} from '@/lib/b2b/shop-collection-order-hrefs';
import { manufacturerOrderCommsFeatureHref } from '@/lib/b2b/manufacturer-order-comms';
import { buildSupplierMrpSupplySession } from '@/lib/fashion/supplier-mrp-supply';
import { supplierCommsEntitiesHref } from '@/lib/fashion/supplier-comms-entity-threads';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  ROUTES,
  factorySupplierCalendarB2bOrderContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  shopB2bTrackingOrderHref,
} from '@/lib/routes';

export type SupplierOrderCommsSession = {
  orderId: string;
  collectionId: string;
  articleId: string;
  orderTabHref: string;
  messagesHref: string;
  calendarHref: string;
  supplyTabHref: string;
  brandBomHref: string;
  shopTrackingHref: string;
  shopOrderCommsHref: string;
  brandOrderChatHref: string;
  brandOrderHandoffHref: string;
  shopLandedMarginHref: string;
  shopMatrixHref: string;
  replenishmentAtpHref: string;
  inventoryOverviewHref: string;
  manufacturerOrderHref: string;
  entitiesHref: string;
};

export function buildSupplierOrderCommsSession(input?: {
  orderId?: string;
  collectionId?: string;
  articleId?: string;
}): SupplierOrderCommsSession {
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const articleId = input?.articleId?.trim() || PLATFORM_CORE_DEMO.demoArticleId || 'demo-ss27-01';
  const base = `${ROUTES.factory.supplierMessages}?order=${encodeURIComponent(orderId)}&collection=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`;
  const supply = buildSupplierMrpSupplySession({ collectionId, articleId, orderId });
  const inventory = buildShopInventoryOpsSession({ collectionId, orderId });

  return {
    orderId,
    collectionId,
    articleId,
    orderTabHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=order`,
    messagesHref: factorySupplierMessagesB2bOrderContextHref(orderId),
    calendarHref: factorySupplierCalendarB2bOrderContextHref(orderId),
    supplyTabHref: supply.supplyTabHref,
    brandBomHref: supply.brandBomHref,
    shopTrackingHref: `${shopB2bTrackingOrderHref(orderId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=tracking`,
    shopOrderCommsHref: shopOrderCommsTabHref('tracking', orderId, collectionId),
    brandOrderChatHref: brandOrderCommsFeatureHref(orderId, 'chat', collectionId),
    brandOrderHandoffHref: brandOrderCommsTabHref('handoff', orderId, collectionId),
    shopLandedMarginHref: shopLandedMarginTabHref('rollup', collectionId, orderId),
    shopMatrixHref: shopMatrixWorkspaceTabHref('matrix', collectionId, orderId),
    replenishmentAtpHref: shopReplenishmentTabHref('stock-atp', collectionId, orderId),
    inventoryOverviewHref: inventory.overviewHref,
    manufacturerOrderHref: manufacturerOrderCommsFeatureHref(orderId, collectionId),
    entitiesHref: supplierCommsEntitiesHref(collectionId, articleId),
  };
}

export function supplierOrderCommsFeatureHref(
  orderId: string,
  collectionId?: string,
  articleId?: string
): string {
  return buildSupplierOrderCommsSession({ orderId, collectionId, articleId }).orderTabHref;
}
