'use client';

import type { ReactNode } from 'react';
import { PlatformCoreChainOverviewProvider } from '@/components/platform/usePlatformCoreChainOverview';
import { PlatformCoreThemeBridge } from '@/components/platform/PlatformCoreThemeBridge';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';

type Props = {
  children: ReactNode;
  collectionId?: string;
};

/** Единый provider chain-overview для всех Platform Core chrome-слоёв. */
export function PlatformCoreChromeShell({
  children,
  collectionId = PLATFORM_CORE_DEMO.collectionId,
}: Props) {
  return (
    <PlatformCoreChainOverviewProvider collectionId={collectionId}>
      <PlatformCoreThemeBridge />
      {children}
    </PlatformCoreChainOverviewProvider>
  );
}
