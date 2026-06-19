'use client';

import type { ReactNode } from 'react';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';

type Props = {
  collectionId?: string;
  variant?: 'brand' | 'manufacturer';
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
};

/** Столп 1 · ТЗ → образец: ListChrome + контент; cross-role внизу. */
export function PlatformCoreDevelopmentChrome({
  collectionId,
  variant = 'brand',
  backHref,
  backLabel,
  children,
}: Props) {
  const highlightRole = variant === 'manufacturer' ? 'manufacturer' : 'brand';

  return (
    <div data-testid="platform-core-development-chrome">
      <PlatformCoreListChrome
        highlightRole={highlightRole}
        pillarId="development"
        pageCollectionId={collectionId}
        backHref={backHref}
        backLabel={backLabel}
      >
        {children}
      </PlatformCoreListChrome>
    </div>
  );
}
