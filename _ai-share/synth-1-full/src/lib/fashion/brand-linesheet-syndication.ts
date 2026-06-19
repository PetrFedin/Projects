import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { buildBrandShowroomBuySession } from '@/lib/fashion/brand-showroom-buy';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES, shopB2bMatrixReorderHref } from '@/lib/routes';

export type BrandLinesheetSyndicationSession = {
  collectionId: string;
  checklistHref: string;
  syndicationHref: string;
  showroomPublishHref: string;
  linesheetsHref: string;
  brandShowroomHref: string;
  shopShowroomHref: string;
  shopBuyPathHref: string;
  matrixHref: string;
  techpackGateHref: string;
};

export function buildBrandLinesheetSyndicationSession(input?: {
  collectionId?: string;
  orderId?: string;
}): BrandLinesheetSyndicationSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const showroom = buildBrandShowroomBuySession({ collectionId });
  const base = ROUTES.brand.launchReadiness;

  return {
    collectionId,
    checklistHref: `${base}?${PILLAR_CAPABILITY_FEATURE_PARAM}=checklist`,
    syndicationHref: `${base}?${PILLAR_CAPABILITY_FEATURE_PARAM}=syndication`,
    showroomPublishHref: `${base}?${PILLAR_CAPABILITY_FEATURE_PARAM}=showroom-publish`,
    linesheetsHref: ROUTES.brand.b2bLinesheets,
    brandShowroomHref: showroom.previewHref,
    shopShowroomHref: showroom.shopShowroomHref,
    shopBuyPathHref: showroom.shopBuyPathHref,
    matrixHref: shopB2bMatrixReorderHref(collectionId, orderId),
    techpackGateHref: `${base}?${PILLAR_CAPABILITY_FEATURE_PARAM}=techpack-gate`,
  };
}
