import { buildShopInventoryOpsSession } from '@/lib/b2b/shop-inventory-ops';
import {
  brandLandedMarginTabHref,
  brandOrderCommsTabHref,
} from '@/lib/b2b/brand-collection-order-hrefs';
import {
  shopCollaborativeTabHref,
  shopLandedMarginTabHref,
  shopMatrixWorkspaceTabHref,
  shopOrderCommsTabHref,
  shopReplenishmentTabHref,
  shopWorkingOrderTabHref,
} from '@/lib/b2b/shop-collection-order-hrefs';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_B2B_MARKETROOM_HREF } from '@/lib/platform-core-mode-surfaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  shopB2bCheckoutCollectionHref,
  shopB2bTrackingOrderHref,
  shopCalendarB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';

export type ShopWorkingOrderSession = {
  wholesaleOrderId: string;
  collectionId: string;
  versionsHref: string;
  bulkHref: string;
  handoffHref: string;
  matrixHref: string;
  prepackHref: string;
  replenishmentHref: string;
  replenishmentRulesHref: string;
  collaborativeHref: string;
  messagesHref: string;
  calendarHref: string;
  orderCommsHref: string;
  landedMarginHref: string;
  brandOrderChatHref: string;
  brandOrderHandoffHref: string;
  brandLandedMarginHref: string;
  collaborativeSessionHref: string;
  inventoryOverviewHref: string;
  platformMarketroomHref: string;
  checkoutHref: string;
  trackingHref: string;
};

export function buildShopWorkingOrderSession(input?: {
  wholesaleOrderId?: string;
  collectionId?: string;
}): ShopWorkingOrderSession {
  const wholesaleOrderId = input?.wholesaleOrderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const inventory = buildShopInventoryOpsSession({ collectionId, orderId: wholesaleOrderId });

  return {
    wholesaleOrderId,
    collectionId,
    versionsHref: shopWorkingOrderTabHref('versions', wholesaleOrderId, collectionId),
    bulkHref: shopWorkingOrderTabHref('bulk', wholesaleOrderId, collectionId),
    handoffHref: shopWorkingOrderTabHref('handoff', wholesaleOrderId, collectionId),
    matrixHref: shopMatrixWorkspaceTabHref('matrix', collectionId, wholesaleOrderId),
    prepackHref: shopMatrixWorkspaceTabHref('prepack', collectionId, wholesaleOrderId),
    replenishmentHref: shopReplenishmentTabHref('stock-atp', collectionId, wholesaleOrderId),
    replenishmentRulesHref: shopReplenishmentTabHref('rules', collectionId, wholesaleOrderId),
    collaborativeHref: shopCollaborativeTabHref('approvals', wholesaleOrderId, collectionId),
    messagesHref: shopMessagesB2bOrderContextHref(wholesaleOrderId),
    calendarHref: shopCalendarB2bOrderContextHref(wholesaleOrderId),
    orderCommsHref: shopOrderCommsTabHref('tracking', wholesaleOrderId, collectionId),
    landedMarginHref: shopLandedMarginTabHref('rollup', collectionId, wholesaleOrderId),
    brandOrderChatHref: brandOrderCommsTabHref('chat', wholesaleOrderId, collectionId),
    brandOrderHandoffHref: brandOrderCommsTabHref('handoff', wholesaleOrderId, collectionId),
    brandLandedMarginHref: brandLandedMarginTabHref('simulator', collectionId, wholesaleOrderId),
    collaborativeSessionHref: shopCollaborativeTabHref('session', wholesaleOrderId, collectionId),
    inventoryOverviewHref: inventory.overviewHref,
    platformMarketroomHref: `${PLATFORM_CORE_B2B_MARKETROOM_HREF}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=showcase`,
    checkoutHref: `${shopB2bCheckoutCollectionHref(collectionId)}&order=${encodeURIComponent(wholesaleOrderId)}`,
    trackingHref: shopB2bTrackingOrderHref(wholesaleOrderId),
  };
}

export function shopWorkingOrderFeatureHref(
  wholesaleOrderId: string,
  featureId: 'versions' | 'bulk' | 'handoff',
  collectionId?: string
): string {
  return shopWorkingOrderTabHref(featureId, wholesaleOrderId, collectionId);
}
