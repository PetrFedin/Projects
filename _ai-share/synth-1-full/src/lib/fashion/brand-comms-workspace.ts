import { brandOrderCommsFeatureHref } from '@/lib/b2b/brand-order-comms';
import { shopOrderCommsTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';

export type BrandCommsWorkspaceSession = {
  collectionId: string;
  orderId: string;
  inboxHref: string;
  entitiesHref: string;
  orderChatHref: string;
  orderHandoffHref: string;
  shopTrackingHref: string;
};

export function brandCommsWorkspaceFeatureHref(
  featureId: 'inbox' | 'entities',
  collectionId?: string,
  orderId?: string
): string {
  const session = buildBrandCommsWorkspaceSession({ collectionId, orderId });
  return featureId === 'inbox' ? session.inboxHref : session.entitiesHref;
}

export function buildBrandCommsWorkspaceSession(input?: {
  collectionId?: string;
  orderId?: string;
}): BrandCommsWorkspaceSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const base = `${ROUTES.brand.messages}?collection=${encodeURIComponent(collectionId)}`;

  return {
    collectionId,
    orderId,
    inboxHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=inbox`,
    entitiesHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=entities`,
    orderChatHref: brandOrderCommsFeatureHref(orderId, 'chat', collectionId),
    orderHandoffHref: brandOrderCommsFeatureHref(orderId, 'handoff', collectionId),
    shopTrackingHref: shopOrderCommsTabHref('tracking', orderId, collectionId),
  };
}
