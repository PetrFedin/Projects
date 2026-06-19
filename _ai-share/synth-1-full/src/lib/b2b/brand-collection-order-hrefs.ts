import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { brandB2bOrderHref, ROUTES } from '@/lib/routes';

export function brandOrderCommsTabHref(
  featureId: 'detail' | 'chat' | 'handoff',
  orderId: string = PLATFORM_CORE_DEMO.demoOrderId,
  collectionId?: string
): string {
  const collection = collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  return `${brandB2bOrderHref(orderId)}?${PILLAR_CAPABILITY_FEATURE_PARAM}=${featureId}&collection=${encodeURIComponent(collection)}`;
}

export function brandLandedMarginTabHref(
  featureId: 'simulator' | 'pricelist' | 'shop-rollup',
  collectionId: string = PLATFORM_CORE_DEMO.collectionId,
  orderId?: string
): string {
  const resolvedOrderId = orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const base = `${ROUTES.brand.marginSimulator}?collection=${encodeURIComponent(collectionId)}&order=${encodeURIComponent(resolvedOrderId)}`;
  return `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=${featureId}`;
}
