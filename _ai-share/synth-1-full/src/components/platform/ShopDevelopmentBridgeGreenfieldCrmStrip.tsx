'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { buildShopB2bPartnersSession } from '@/lib/b2b/shop-b2b-partners-workspace';
import { fetchShopBuyerCrmProfile } from '@/lib/b2b/shop-buyer-crm-profile-store';
import type { ShopBuyerCrmProfile } from '@/lib/b2b/shop-buyer-crm-profile';
import { useShopCoreBuyerId } from '@/hooks/use-shop-core-buyer-id';
import { ROUTES, shopB2bCheckoutCollectionHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
};

/** Empty-cell shop dev · greenfield buyer CRM + monetization spine. */
export function ShopDevelopmentBridgeGreenfieldCrmStrip({ collectionId }: Props) {
  const { buyerId } = useShopCoreBuyerId();
  const [profile, setProfile] = useState<ShopBuyerCrmProfile | null>(null);
  const [storageMode, setStorageMode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchShopBuyerCrmProfile(buyerId).then((res) => {
      if (cancelled) return;
      setProfile(res.profile);
      setStorageMode(res.storageMode);
    });
    return () => {
      cancelled = true;
    };
  }, [buyerId]);

  const partners = buildShopB2bPartnersSession({ collectionId });
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}`;
  const showroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;

  return (
    <div
      className="border-border-subtle space-y-2 rounded-md border bg-bg-surface2/40 px-3 py-2"
      data-testid="shop-development-bridge-greenfield-crm-strip"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-text-muted text-[10px] font-semibold uppercase">Buyer CRM</span>
        {profile ? (
          <Badge variant="secondary" className="text-[9px]" data-testid="shop-dev-bridge-crm-segment">
            {profile.segmentNameRu}
          </Badge>
        ) : null}
        {storageMode ? (
          <Badge variant="outline" className="text-[9px]" data-testid="shop-dev-bridge-crm-source">
            {storageMode}
          </Badge>
        ) : null}
      </div>
      <div className={hubGadget.goldenPath}>
        <Link href={showroomHref} data-testid="shop-dev-bridge-crm-showroom-link" className={hubGadget.goldenLink}>
          Showroom
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link href={matrixHref} data-testid="shop-dev-bridge-crm-matrix-link" className={hubGadget.goldenLink}>
          Matrix
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link href={partners.discoverHref} data-testid="shop-dev-bridge-crm-partners-link" className={hubGadget.goldenLink}>
          Partners
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link href={partners.brandCrmSegmentsHref} data-testid="shop-dev-bridge-crm-brand-segments-link" className={hubGadget.goldenLink}>
          Brand CRM
        </Link>
        <span className={hubGadget.goldenSep} aria-hidden>
          ·
        </span>
        <Link
          href={shopB2bCheckoutCollectionHref(collectionId)}
          data-testid="shop-dev-bridge-crm-checkout-link"
          className={hubGadget.goldenLink}
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
