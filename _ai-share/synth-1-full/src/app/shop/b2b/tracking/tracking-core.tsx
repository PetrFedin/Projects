'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { tid } from '@/lib/ui/test-ids';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { PlatformCoreShopB2bTrackingPanel } from '@/components/platform/PlatformCoreShopB2bTrackingPanel';
import { PillarCapabilityWorkspaceChrome } from '@/components/platform/PillarCapabilityWorkspaceChrome';
import {
  ShopOrderCommsCalendarPanel,
  ShopOrderCommsChatPanel,
} from '@/components/shop/b2b/ShopOrderCommsPanels';
import { ShopOrderCommsTrackingBridgePanel } from '@/components/shop/b2b/ShopOrderCommsTrackingBridgePanel';
import { OrderCommsWorkspaceNotificationBar } from '@/components/platform/OrderCommsWorkspaceNotificationBar';
import {
  ShopOrderCommsGoldenPathStrip,
  shopOrderCommsGoldenPathStepFromFeature,
} from '@/components/shop/b2b/ShopOrderCommsGoldenPathStrip';
import { ShopCmOrderContextPeerStrip } from '@/components/platform/ShopCmOrderContextPeerStrip';
import { usePillarCapabilityWorkspace } from '@/hooks/use-pillar-capability-workspace';
import { resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';

function ShopB2bTrackingWorkspaceBody() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') });
  const orderId =
    searchParams.get('order')?.trim() ||
    searchParams.get('orderId')?.trim() ||
    searchParams.get('wholesaleOrderId')?.trim() ||
    undefined;
  const ctx = { collectionId, orderId, role: 'shop' as const };
  const { activeFeatureId } = usePillarCapabilityWorkspace('shop-order-comms');

  return (
    <PillarCapabilityWorkspaceChrome
      workspaceId="shop-order-comms"
      ctx={ctx}
      crossLinksTitle="Matrix → collaborative → replenishment"
      className="min-w-0"
    >
      <OrderCommsWorkspaceNotificationBar variant="shop" />
      {orderId ? (
        <div className="mb-4">
          <ShopCmOrderContextPeerStrip collectionId={collectionId} orderId={orderId} />
        </div>
      ) : null}
      <div className="mb-4">
        <ShopOrderCommsGoldenPathStrip
          orderId={orderId}
          collectionId={collectionId}
          activeStep={shopOrderCommsGoldenPathStepFromFeature(activeFeatureId)}
        />
      </div>
      {activeFeatureId === 'tracking' ? (
        <div className="min-w-0 space-y-3">
          <ShopOrderCommsTrackingBridgePanel orderId={orderId} collectionId={collectionId} />
          <PlatformCoreShopB2bTrackingPanel />
        </div>
      ) : null}
      {activeFeatureId === 'chat' ? (
        <ShopOrderCommsChatPanel orderId={orderId} collectionId={collectionId} />
      ) : null}
      {activeFeatureId === 'calendar' ? (
        <ShopOrderCommsCalendarPanel orderId={orderId} collectionId={collectionId} />
      ) : null}
    </PillarCapabilityWorkspaceChrome>
  );
}

export function ShopB2bTrackingCorePage() {
  return (
    <CabinetPageContent
      maxWidth="4xl"
      className="min-w-0 space-y-6"
      data-testid={tid.page('shop-b2b-tracking')}
    >
      <PlatformCoreListChrome highlightRole="shop" pillarId="comms">
        <Suspense fallback={null}>
          <ShopB2bTrackingWorkspaceBody />
        </Suspense>
      </PlatformCoreListChrome>
    </CabinetPageContent>
  );
}
