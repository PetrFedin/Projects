'use client';

import dynamic from 'next/dynamic';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { FactoryProductionOrdersWorkspacePage } from '@/app/factory/production/orders/factory-production-orders-workspace';

const FactoryOrdersLegacyPage = dynamic(() => import('@/components/brand/b2b-orders/page'), {
  ssr: false,
});

export default function FactoryOrdersPage() {
  const coreMode = isPlatformCoreMode();

  return (
    <div className="space-y-4 p-4" data-testid="factory-production-orders-page">
      {coreMode ? (
        <PlatformCoreListChrome highlightRole="manufacturer" pillarId="order_production">
          <FactoryProductionOrdersWorkspacePage />
        </PlatformCoreListChrome>
      ) : (
        <FactoryOrdersLegacyPage />
      )}
    </div>
  );
}
