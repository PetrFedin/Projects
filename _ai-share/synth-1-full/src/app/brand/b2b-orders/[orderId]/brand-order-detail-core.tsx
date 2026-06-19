'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import {
  BrandOrderCommsChatPanel,
  BrandOrderCommsHandoffPanel,
} from '@/components/brand/b2b/BrandOrderCommsPanels';
import {
  BrandOrderCommsGoldenPathStrip,
  brandOrderCommsGoldenPathStepFromFeature,
} from '@/components/brand/b2b/BrandOrderCommsGoldenPathStrip';
import { PlatformCoreOrderDetailChrome } from '@/components/platform/PlatformCoreOrderDetailChrome';
import { BrandCoRegistryRetailOnboardingStrip } from '@/components/platform/BrandCoRegistryRetailOnboardingStrip';
import { OrderCommsWorkspaceNotificationBar } from '@/components/platform/OrderCommsWorkspaceNotificationBar';
import { PillarCapabilityWorkspaceChrome } from '@/components/platform/PillarCapabilityWorkspaceChrome';
import { usePillarCapabilityWorkspace } from '@/hooks/use-pillar-capability-workspace';
import { useWorkshop2B2bOrderDetail } from '@/hooks/use-workshop2-b2b-order-detail';
import { getPlatformCoreDemoByOrderId, resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';

const PlatformCoreB2bOrderDetailFacts = dynamic(
  () =>
    import('@/components/platform/PlatformCoreB2bOrderDetailFacts').then((m) => ({
      default: m.PlatformCoreB2bOrderDetailFacts,
    })),
  {
    ssr: false,
    loading: () => (
      <p className="text-text-muted text-sm" data-testid="platform-core-order-detail-facts-loading">
        Загрузка карточки заказа…
      </p>
    ),
  }
);

type Props = {
  orderId: string;
};

function BrandB2bOrderDetailWorkspaceBody({ orderId }: Props) {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({
    collection: searchParams.get('collection'),
    fallback: getPlatformCoreDemoByOrderId(orderId).collectionId,
  });
  const ctx = { orderId, collectionId, role: 'brand' as const };
  const { activeFeatureId } = usePillarCapabilityWorkspace('brand-order-comms');

  return (
    <PillarCapabilityWorkspaceChrome
      workspaceId="brand-order-comms"
      ctx={ctx}
      crossLinksTitle="Shop tracking → collaborative → replenishment"
    >
      <OrderCommsWorkspaceNotificationBar variant="brand" />
      <div className="mb-4">
        <BrandOrderCommsGoldenPathStrip
          orderId={orderId}
          collectionId={collectionId}
          activeStep={brandOrderCommsGoldenPathStepFromFeature(activeFeatureId)}
        />
      </div>
      {activeFeatureId === 'detail' ? (
        <>
          <div className="mb-4">
            <BrandCoRegistryRetailOnboardingStrip collectionId={collectionId} orderId={orderId} />
          </div>
          <PlatformCoreB2bOrderDetailFacts orderId={orderId} variant="brand" />
        </>
      ) : null}
      {activeFeatureId === 'chat' ? (
        <BrandOrderCommsChatPanel orderId={orderId} collectionId={collectionId} />
      ) : null}
      {activeFeatureId === 'handoff' ? (
        <BrandOrderCommsHandoffPanel orderId={orderId} collectionId={collectionId} />
      ) : null}
    </PillarCapabilityWorkspaceChrome>
  );
}

export function BrandB2bOrderDetailCorePage({ orderId }: Props) {
  useWorkshop2B2bOrderDetail(orderId, true);

  return (
    <CabinetPageContent maxWidth="full" className="w-full pb-16">
      <PlatformCoreOrderDetailChrome orderId={orderId} variant="brand">
        <Suspense fallback={null}>
          <BrandB2bOrderDetailWorkspaceBody orderId={orderId} />
        </Suspense>
      </PlatformCoreOrderDetailChrome>
    </CabinetPageContent>
  );
}
