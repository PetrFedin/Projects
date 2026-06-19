'use client';

import { usePathname } from 'next/navigation';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { isShopB2bCoreAllowedPath } from '@/lib/platform-core-shop-b2b-golden-paths';
import { ShopB2bLegacyTailCorePage } from '@/app/shop/b2b/shop-b2b-legacy-tail-core';

type Props = {
  children: React.ReactNode;
};

/** Core: любой B2B side-path вне golden/redirect → tail + канонический переход. */
export function ShopB2bCoreLayoutGuard({ children }: Props) {
  const pathname = usePathname() ?? '/shop/b2b';
  if (!isPlatformCoreMode()) return children;
  if (isShopB2bCoreAllowedPath(pathname)) return children;
  return <ShopB2bLegacyTailCorePage legacyPath={pathname} />;
}
