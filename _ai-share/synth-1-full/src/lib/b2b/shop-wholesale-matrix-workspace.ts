import { buildShopInventoryOpsSession } from '@/lib/b2b/shop-inventory-ops';
import { shopCollaborativeOrderFeatureHref } from '@/lib/b2b/shop-collaborative-order';
import { brandOrderCommsTabHref } from '@/lib/b2b/brand-collection-order-hrefs';
import {
  shopMatrixWorkspaceTabHref,
  shopOrderCommsTabHref,
  shopReplenishmentTabHref,
  shopShowroomTabHref,
  shopWorkingOrderTabHref,
} from '@/lib/b2b/shop-collection-order-hrefs';
import { shopLandedMarginFeatureHref } from '@/lib/b2b/shop-landed-margin';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_B2B_MARKETROOM_HREF } from '@/lib/platform-core-mode-surfaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  ROUTES,
  shopB2bCheckoutCollectionHref,
  shopB2bOrdersCollectionRegistryHref,
} from '@/lib/routes';

export type ShopWholesaleMatrixSession = {
  collectionId: string;
  orderId: string;
  matrixHref: string;
  inspectorHref: string;
  prepackHref: string;
  brandPackRulesCurveHref: string;
  brandPackRulesShopPrepackHref: string;
  replenishmentHref: string;
  replenishmentRulesHref: string;
  workingOrderHref: string;
  workingOrderBulkHref: string;
  collaborativeHref: string;
  landedMarginHref: string;
  showroomHref: string;
  orderCommsHref: string;
  brandOrderChatHref: string;
  inventoryOverviewHref: string;
  platformMarketroomHref: string;
  checkoutHref: string;
  registryHref: string;
};

export function shopWholesaleMatrixFeatureHref(
  featureId: 'matrix' | 'inspector' | 'prepack',
  collectionId?: string,
  orderId?: string,
  articleId?: string
): string {
  return shopMatrixWorkspaceTabHref(
    featureId,
    collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId,
    orderId,
    articleId
  );
}

export function buildShopWholesaleMatrixSession(input?: {
  collectionId?: string;
  orderId?: string;
  articleId?: string;
}): ShopWholesaleMatrixSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const brandBase = `${ROUTES.brand.packRules}?collection=${encodeURIComponent(collectionId)}`;
  const inventory = buildShopInventoryOpsSession({ collectionId, orderId });

  return {
    collectionId,
    orderId,
    matrixHref: shopMatrixWorkspaceTabHref('matrix', collectionId, orderId),
    inspectorHref: shopMatrixWorkspaceTabHref('inspector', collectionId, orderId, input?.articleId),
    prepackHref: shopMatrixWorkspaceTabHref('prepack', collectionId, orderId),
    brandPackRulesCurveHref: `${brandBase}&${PILLAR_CAPABILITY_FEATURE_PARAM}=curve`,
    brandPackRulesShopPrepackHref: `${brandBase}&${PILLAR_CAPABILITY_FEATURE_PARAM}=shop-prepack`,
    replenishmentHref: shopReplenishmentTabHref('stock-atp', collectionId, orderId),
    replenishmentRulesHref: shopReplenishmentTabHref('rules', collectionId, orderId),
    workingOrderHref: shopWorkingOrderTabHref('versions', orderId, collectionId),
    workingOrderBulkHref: shopWorkingOrderTabHref('bulk', orderId, collectionId),
    collaborativeHref: shopCollaborativeOrderFeatureHref(orderId, 'approvals', collectionId),
    landedMarginHref: shopLandedMarginFeatureHref('rollup', collectionId, orderId),
    showroomHref: shopShowroomTabHref('showroom', collectionId, orderId),
    orderCommsHref: shopOrderCommsTabHref('tracking', orderId, collectionId),
    brandOrderChatHref: brandOrderCommsTabHref('chat', orderId, collectionId),
    inventoryOverviewHref: inventory.overviewHref,
    platformMarketroomHref: `${PLATFORM_CORE_B2B_MARKETROOM_HREF}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=showcase`,
    checkoutHref: shopB2bCheckoutCollectionHref(collectionId),
    registryHref: shopB2bOrdersCollectionRegistryHref(orderId),
  };
}
