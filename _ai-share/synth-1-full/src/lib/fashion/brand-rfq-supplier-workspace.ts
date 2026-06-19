import { shopShowroomTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';

export type BrandRfqSupplierSession = {
  collectionId: string;
  articleId: string;
  orderId: string;
  upstreamHref: string;
  rfqHref: string;
  commsHref: string;
  supplierBomHref: string;
  materialPassportHref: string;
  shopShowroomHref: string;
};

export function brandRfqSupplierFeatureHref(
  featureId: 'upstream' | 'rfq' | 'comms',
  collectionId?: string,
  articleId?: string
): string {
  const session = buildBrandRfqSupplierSession({ collectionId, articleId });
  if (featureId === 'upstream') return session.upstreamHref;
  if (featureId === 'rfq') return session.rfqHref;
  return session.commsHref;
}

export function buildBrandRfqSupplierSession(input?: {
  collectionId?: string;
  articleId?: string;
  orderId?: string;
}): BrandRfqSupplierSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const articleId = input?.articleId?.trim() || PLATFORM_CORE_DEMO.demoArticleId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const base = `${ROUTES.brand.integrationsCentric}?collection=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`;

  return {
    collectionId,
    articleId,
    orderId,
    upstreamHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=upstream`,
    rfqHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=rfq`,
    commsHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=comms`,
    supplierBomHref: `${ROUTES.brand.suppliersRfq}?${PILLAR_CAPABILITY_FEATURE_PARAM}=bom&collection=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`,
    materialPassportHref: `${ROUTES.brand.fabricPassportRollup}?${PILLAR_CAPABILITY_FEATURE_PARAM}=rollup&collection=${encodeURIComponent(collectionId)}`,
    shopShowroomHref: shopShowroomTabHref('showroom', collectionId, orderId),
  };
}
