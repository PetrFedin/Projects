'use client';

import Link from 'next/link';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Shop showroom · platform B2B + checkout + registry peers. */
export function ShopScShowroomB2bPeerStrip({ collectionId, orderId }: Props) {
  const platform = buildPlatformB2bHubSession({ collectionId, orderId });
  const session = buildShopShowroomBuySession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-sc-showroom-b2b-peer-strip">
      <Link href={platform.hubHref} data-testid="shop-sc-showroom-platform-hub-link" className={hubGadget.goldenLink}>
        Platform B2B
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.checkoutHref} data-testid="shop-sc-showroom-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={platform.marketroomShowcaseHref} data-testid="shop-sc-showroom-marketroom-link" className={hubGadget.goldenLink}>
        Marketroom
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={platform.partnersDirectoryHref} data-testid="shop-sc-showroom-partners-directory-link" className={hubGadget.goldenLink}>
        Partners
      </Link>
    </div>
  );
}
