'use client';

import Link from 'next/link';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
};

/** Shop SC cabinet · platform hub + marketroom + checkout. */
export function ShopScCabinetB2bPeerStrip({ collectionId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-sc-cabinet-b2b-peer-strip">
      <Link href={session.hubHref} data-testid="shop-sc-cabinet-platform-hub-link" className={hubGadget.goldenLink}>
        Platform B2B
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.marketroomShowcaseHref} data-testid="shop-sc-cabinet-marketroom-link" className={hubGadget.goldenLink}>
        Marketroom
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.buyPathHref} data-testid="shop-sc-cabinet-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
    </div>
  );
}
