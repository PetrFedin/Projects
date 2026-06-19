'use client';

import { Suspense } from 'react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';
import { PillarCapabilityWorkspaceChrome } from '@/components/platform/PillarCapabilityWorkspaceChrome';
import {
  ShopLandedMarginHubPanel,
  ShopLandedMarginPricelistPanel,
  ShopLandedMarginRollupPanel,
} from '@/components/shop/b2b/ShopLandedMarginPanels';
import {
  ShopLandedMarginGoldenPathStrip,
  shopLandedMarginGoldenPathStepFromFeature,
} from '@/components/shop/b2b/ShopLandedMarginGoldenPathStrip';
import { ShopCoLandedMarginSpinePeerStrip } from '@/components/platform/ShopCoLandedMarginSpinePeerStrip';
import { usePillarCapabilityWorkspace } from '@/hooks/use-pillar-capability-workspace';
import { resolvePageCollectionId } from '@/lib/platform-core-hub-matrix';
import { useSearchParams } from 'next/navigation';

function MarginAnalysisWorkspaceBody() {
  const searchParams = useSearchParams();
  const collectionId = resolvePageCollectionId({ collection: searchParams.get('collection') ?? searchParams.get('collectionId') });
  const orderId =
    searchParams.get('order') ?? searchParams.get('orderId') ?? searchParams.get('wholesaleOrderId') ?? undefined;
  const ctx = { collectionId, orderId, role: 'shop' as const };
  const { activeFeatureId } = usePillarCapabilityWorkspace('shop-landed-margin');

  return (
    <PillarCapabilityWorkspaceChrome
      workspaceId="shop-landed-margin"
      ctx={ctx}
      crossLinksTitle="Margin → collaborative → replenishment"
      beforeTabs={<B2bOrderUrlContextBanner variant="shop" />}
    >
      <div className="mb-4">
        <ShopLandedMarginGoldenPathStrip
          collectionId={collectionId}
          orderId={orderId}
          activeStep={shopLandedMarginGoldenPathStepFromFeature(activeFeatureId)}
        />
        <ShopCoLandedMarginSpinePeerStrip collectionId={collectionId} orderId={orderId} />
      </div>
      {activeFeatureId === 'hub' ? <ShopLandedMarginHubPanel /> : null}
      {activeFeatureId === 'rollup' ? <ShopLandedMarginRollupPanel /> : null}
      {activeFeatureId === 'pricelist' ? <ShopLandedMarginPricelistPanel /> : null}
    </PillarCapabilityWorkspaceChrome>
  );
}

export default function B2bMarginAnalysisHubPage() {
  return (
    <CabinetPageContent
      maxWidth="4xl"
      className="space-y-6"
      data-testid="page-shop-b2b-margin-analysis"
    >
      <Suspense fallback={null}>
        <MarginAnalysisWorkspaceBody />
      </Suspense>
    </CabinetPageContent>
  );
}
