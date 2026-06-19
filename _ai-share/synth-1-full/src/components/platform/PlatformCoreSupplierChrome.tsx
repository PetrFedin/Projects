'use client';

import type { ReactNode } from 'react';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';

type Props = {
  children?: ReactNode;
};

/** Поставщик: pillar strip + контент; переходы — в strip и cross-role. */
export function PlatformCoreSupplierChrome({ children }: Props) {
  return (
    <div data-testid="platform-core-supplier-chrome">
      <PlatformCoreListChrome highlightRole="supplier" pillarId="order_production">
        {children}
      </PlatformCoreListChrome>
    </div>
  );
}
