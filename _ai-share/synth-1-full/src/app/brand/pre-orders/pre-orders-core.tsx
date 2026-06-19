'use client';

import { PlatformCoreBrandPreOrdersPanel } from '@/components/platform/PlatformCoreBrandPreOrdersPanel';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';

/** Core: только PG prebook-панель; B2C mock и легаси-табы вне golden path. */
export function BrandPreOrdersCorePage() {
  return (
    <div className="space-y-4 p-4" data-testid="brand-pre-orders-core">
      <PlatformCoreListChrome highlightRole="brand" pillarId="collection_order">
        <PlatformCoreBrandPreOrdersPanel />
      </PlatformCoreListChrome>
    </div>
  );
}
