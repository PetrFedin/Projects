'use client';

import type { ComponentType, ReactElement } from 'react';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopB2bLegacyTailCorePage } from '@/app/shop/b2b/shop-b2b-legacy-tail-core';

/** Core mode: side-path B2B → tail redirect по `PLATFORM_CORE_SHOP_B2B_LEGACY_REDIRECTS`. */
export function withShopB2bCoreLegacyGuard(
  legacyPath: string,
  LegacyPage: ComponentType
): () => ReactElement {
  function GuardedShopB2bPage() {
    if (isPlatformCoreMode()) {
      return <ShopB2bLegacyTailCorePage legacyPath={legacyPath} />;
    }
    return <LegacyPage />;
  }
  return GuardedShopB2bPage;
}
