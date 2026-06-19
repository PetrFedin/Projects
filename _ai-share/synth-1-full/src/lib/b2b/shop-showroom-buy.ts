import {
  shopCollaborativeTabHref,
  shopLandedMarginTabHref,
  shopMatrixWorkspaceTabHref,
  shopOrderCommsTabHref,
  shopReplenishmentTabHref,
  shopShowroomTabHref,
  shopWorkingOrderTabHref,
} from '@/lib/b2b/shop-collection-order-hrefs';
import { brandOrderCommsTabHref } from '@/lib/b2b/brand-collection-order-hrefs';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_B2B_MARKETROOM_HREF } from '@/lib/platform-core-mode-surfaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  ROUTES,
  shopB2bCheckoutCollectionHref,
  shopB2bOrdersCollectionRegistryHref,
  shopB2bTrackingOrderHref,
} from '@/lib/routes';

export type ShopShowroomBuySession = {
  collectionId: string;
  orderId: string;
  showroomHref: string;
  linesheetHref: string;
  buyHref: string;
  matrixHref: string;
  prepackHref: string;
  checkoutHref: string;
  collaborativeHref: string;
  collaborativeApprovalsHref: string;
  replenishmentAlertsHref: string;
  replenishmentAtpHref: string;
  replenishmentRulesHref: string;
  workingOrderHref: string;
  workingOrderBulkHref: string;
  ordersHref: string;
  orderCommsHref: string;
  landedMarginHref: string;
  brandOrderChatHref: string;
  platformMarketroomHref: string;
  registryHref: string;
  trackingHref: string;
  stream3dHref: string;
};

export function buildShopShowroomBuySession(input?: {
  collectionId?: string;
  orderId?: string;
}): ShopShowroomBuySession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;

  return {
    collectionId,
    orderId,
    showroomHref: shopShowroomTabHref('showroom', collectionId, orderId),
    linesheetHref: shopShowroomTabHref('linesheet', collectionId, orderId),
    buyHref: shopShowroomTabHref('buy', collectionId, orderId),
    matrixHref: shopMatrixWorkspaceTabHref('matrix', collectionId, orderId),
    prepackHref: shopMatrixWorkspaceTabHref('prepack', collectionId, orderId),
    checkoutHref: shopB2bCheckoutCollectionHref(collectionId),
    collaborativeHref: shopCollaborativeTabHref('session', orderId, collectionId),
    collaborativeApprovalsHref: shopCollaborativeTabHref('approvals', orderId, collectionId),
    replenishmentAlertsHref: shopReplenishmentTabHref('alerts', collectionId, orderId),
    replenishmentAtpHref: shopReplenishmentTabHref('stock-atp', collectionId, orderId),
    replenishmentRulesHref: shopReplenishmentTabHref('rules', collectionId, orderId),
    workingOrderHref: shopWorkingOrderTabHref('versions', orderId, collectionId),
    workingOrderBulkHref: shopWorkingOrderTabHref('bulk', orderId, collectionId),
    ordersHref: `${ROUTES.shop.b2bOrders}?collection=${encodeURIComponent(collectionId)}`,
    orderCommsHref: shopOrderCommsTabHref('tracking', orderId, collectionId),
    landedMarginHref: shopLandedMarginTabHref('rollup', collectionId, orderId),
    brandOrderChatHref: brandOrderCommsTabHref('chat', orderId, collectionId),
    platformMarketroomHref: `${PLATFORM_CORE_B2B_MARKETROOM_HREF}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=showcase`,
    registryHref: shopB2bOrdersCollectionRegistryHref(orderId),
    trackingHref: `${shopB2bTrackingOrderHref(orderId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=tracking`,
    stream3dHref: `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=3d-stream&order=${encodeURIComponent(orderId)}`,
  };
}

export function shopShowroomBuyFeatureHref(
  collectionId: string,
  featureId: 'showroom' | 'linesheet' | 'buy',
  orderId?: string
): string {
  return shopShowroomTabHref(featureId, collectionId, orderId);
}
