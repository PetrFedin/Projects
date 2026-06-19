import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import {
  shopLandedMarginTabHref,
  shopOrderCommsTabHref,
} from '@/lib/b2b/shop-collection-order-hrefs';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { manufacturerHandoffFeatureHref } from '@/lib/production/manufacturer-handoff-queue';
import {
  brandProductionOperationsB2bOrderContextHref,
  factoryProductionDossierContextHref,
  ROUTES,
} from '@/lib/routes';

export type ManufacturerQcGateSession = {
  orderId: string;
  collectionId: string;
  articleId: string;
  factoryId: string;
  qcTabHref: string;
  brandQcTabHref: string;
  liveQcHref: string;
  handoffHref: string;
  dossierHref: string;
  brandHandoffHref: string;
  shopOrderCommsHref: string;
  shopLandedMarginHref: string;
};

export function buildManufacturerQcGateSession(input?: {
  orderId?: string;
  collectionId?: string;
  articleId?: string;
  factoryId?: string;
}): ManufacturerQcGateSession {
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const articleId = input?.articleId?.trim() || PLATFORM_CORE_DEMO.demoArticleId || 'demo-ss27-01';
  const factoryId = input?.factoryId?.trim() || PLATFORM_CORE_DEMO.factoryId;
  const brandOps = brandProductionOperationsB2bOrderContextHref(orderId);

  return {
    orderId,
    collectionId,
    articleId,
    factoryId,
    qcTabHref: manufacturerHandoffFeatureHref('qc-gate', { factoryId, collectionId, orderId }),
    brandQcTabHref: `${brandOps}&${PILLAR_CAPABILITY_FEATURE_PARAM}=qc-gate`,
    liveQcHref: ROUTES.brand.processLiveQc,
    handoffHref: manufacturerHandoffFeatureHref('handoff', { factoryId, collectionId, orderId }),
    dossierHref: factoryProductionDossierContextHref(articleId, { collectionId, orderId }),
    brandHandoffHref: `${brandOps}&${PILLAR_CAPABILITY_FEATURE_PARAM}=handoff`,
    shopOrderCommsHref: shopOrderCommsTabHref('tracking', orderId, collectionId),
    shopLandedMarginHref: shopLandedMarginTabHref('rollup', collectionId, orderId),
  };
}
