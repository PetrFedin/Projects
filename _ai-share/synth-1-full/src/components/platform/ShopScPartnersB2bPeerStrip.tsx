'use client';

import Link from 'next/link';
import { buildShopB2bPartnersSession } from '@/lib/b2b/shop-b2b-partners-workspace';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Shop partners workspace · platform B2B + monetization spine. */
export function ShopScPartnersB2bPeerStrip({ collectionId, orderId }: Props) {
  const partners = buildShopB2bPartnersSession({ collectionId, orderId });
  const platform = buildPlatformB2bHubSession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-sc-partners-b2b-peer-strip">
      <Link href={platform.hubHref} data-testid="shop-sc-partners-platform-hub-link" className={hubGadget.goldenLink}>
        Platform B2B
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={partners.platformMarketroomHref} data-testid="shop-sc-partners-marketroom-link" className={hubGadget.goldenLink}>
        Marketroom
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={partners.shopMatrixHref} data-testid="shop-sc-partners-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={platform.buyPathHref} data-testid="shop-sc-partners-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
    </div>
  );
}
