import { shopLandedMarginFeatureHref } from '@/lib/b2b/shop-landed-margin';
import { shopOrderCommsFeatureHref } from '@/lib/b2b/shop-order-comms';
import { shopWorkingOrderFeatureHref } from '@/lib/b2b/shop-working-order-session';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import {
  PLATFORM_CORE_B2B_BASE,
  PLATFORM_CORE_B2B_MARKETROOM_HREF,
  PLATFORM_CORE_B2B_PARTNERS_HREF,
} from '@/lib/platform-core-mode-surfaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { buildBrandShowroomBuySession } from '@/lib/fashion/brand-showroom-buy';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';

export type PlatformB2bMarketroomSession = {
  collectionId: string;
  showcaseHref: string;
  discoverHref: string;
  buyPathHref: string;
  platformHubHref: string;
  shopShowroomHref: string;
  shopLinesheetHref: string;
  shopBuyHref: string;
  shopMatrixHref: string;
  shopPrepackHref: string;
  shopLandedMarginHref: string;
  shopOrderCommsHref: string;
  brandPreviewHref: string;
  brandPublishHref: string;
  partnersHref: string;
  launchReadinessHref: string;
  syndicationHref: string;
  collaborativeHref: string;
  workingOrderHref: string;
  replenishmentHref: string;
  replenishmentAtpHref: string;
  shopPartnersHref: string;
};

export function buildPlatformB2bMarketroomSession(input?: {
  collectionId?: string;
  orderId?: string;
}): PlatformB2bMarketroomSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const shop = buildShopShowroomBuySession({ collectionId, orderId });
  const brand = buildBrandShowroomBuySession({ collectionId });
  const base = `${PLATFORM_CORE_B2B_MARKETROOM_HREF}?collection=${encodeURIComponent(collectionId)}`;

  return {
    collectionId,
    showcaseHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=showcase`,
    discoverHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=discover`,
    buyPathHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=buy-path`,
    platformHubHref: `${PLATFORM_CORE_B2B_BASE}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=hub`,
    shopShowroomHref: shop.showroomHref,
    shopLinesheetHref: shop.linesheetHref,
    shopBuyHref: shop.buyHref,
    shopMatrixHref: shop.matrixHref,
    shopPrepackHref: shop.prepackHref,
    shopLandedMarginHref: shopLandedMarginFeatureHref('rollup', collectionId, orderId),
    shopOrderCommsHref: shopOrderCommsFeatureHref(orderId, 'tracking', collectionId),
    brandPreviewHref: brand.previewHref,
    brandPublishHref: brand.publishHref,
    partnersHref: `${PLATFORM_CORE_B2B_PARTNERS_HREF}?${PILLAR_CAPABILITY_FEATURE_PARAM}=directory&collection=${encodeURIComponent(collectionId)}`,
    launchReadinessHref: brand.launchReadinessHref,
    syndicationHref: brand.syndicationHref,
    collaborativeHref: shop.collaborativeHref,
    workingOrderHref: shopWorkingOrderFeatureHref(orderId, 'versions', collectionId),
    replenishmentHref: shop.replenishmentAlertsHref,
    replenishmentAtpHref: shop.replenishmentAtpHref,
    shopPartnersHref: `${PLATFORM_CORE_B2B_PARTNERS_HREF}?collection=${encodeURIComponent(collectionId)}&${PILLAR_CAPABILITY_FEATURE_PARAM}=directory`,
  };
}

export function platformB2bMarketroomFeatureHref(
  featureId: 'showcase' | 'discover' | 'buy-path',
  collectionId?: string
): string {
  const session = buildPlatformB2bMarketroomSession({ collectionId });
  if (featureId === 'showcase') return session.showcaseHref;
  if (featureId === 'discover') return session.discoverHref;
  return session.buyPathHref;
}
