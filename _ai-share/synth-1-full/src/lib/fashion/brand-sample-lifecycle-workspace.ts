import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import { buildBrandShowroomBuySession } from '@/lib/fashion/brand-showroom-buy';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';

export type BrandSampleLifecycleWorkspaceSession = {
  collectionId: string;
  orderId: string;
  hubHref: string;
  roundsHref: string;
  handoffTabHref: string;
  factoryPackHref: string;
  releaseGateHref: string;
  shopShowroomHref: string;
  manufacturerHandoffHref: string;
};

export function buildBrandSampleLifecycleWorkspaceSession(input?: {
  collectionId?: string;
  orderId?: string;
}): BrandSampleLifecycleWorkspaceSession {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const orderId = input?.orderId?.trim() || PLATFORM_CORE_DEMO.demoOrderId;
  const base = `${ROUTES.brand.productionWorkshop2}?collection=${encodeURIComponent(collectionId)}`;
  const handoff = buildBrandProductionHandoffSession({ collectionId, orderId });
  const showroom = buildBrandShowroomBuySession({ collectionId });

  return {
    collectionId,
    orderId,
    hubHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=hub`,
    roundsHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=rounds`,
    handoffTabHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=handoff`,
    factoryPackHref: `${base}&${PILLAR_CAPABILITY_FEATURE_PARAM}=factory-pack`,
    releaseGateHref: `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=checklist`,
    shopShowroomHref: showroom.shopShowroomHref,
    manufacturerHandoffHref: handoff.factoryQueueHref,
  };
}

export function brandSampleLifecycleFeatureHref(
  featureId: 'hub' | 'rounds' | 'handoff' | 'factory-pack',
  collectionId?: string
): string {
  const session = buildBrandSampleLifecycleWorkspaceSession({ collectionId });
  if (featureId === 'hub') return session.hubHref;
  if (featureId === 'rounds') return session.roundsHref;
  if (featureId === 'handoff') return session.handoffTabHref;
  return session.factoryPackHref;
}
