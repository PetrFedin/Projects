'use client';

import { Suspense, type ComponentType } from 'react';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bLegacyTailCorePage } from '@/app/shop/b2b/shop-b2b-legacy-tail-core';

type Props = {
  legacyPath: string;
  LegacyPage: ComponentType;
};

/** Core: tail-редирект без загрузки legacy bundle; иначе — legacy-страница. */
export function ShopB2bLegacySplitPage({ legacyPath, LegacyPage }: Props) {
  if (isPlatformCoreMode()) {
    return (
      <Suspense fallback={null}>
        <ShopB2bLegacyTailCorePage legacyPath={legacyPath} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={null}>
      <LegacyPage />
    </Suspense>
  );
}
