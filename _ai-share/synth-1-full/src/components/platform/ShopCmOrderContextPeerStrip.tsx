'use client';

import Link from 'next/link';
import { buildShopOrderCommsSession } from '@/lib/b2b/shop-order-comms';
import { shopB2bCheckoutCollectionHref, shopB2bOrdersCollectionRegistryHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId: string;
};

/** Shop order comms · CO registry + matrix + brand handoff peers. */
export function ShopCmOrderContextPeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopOrderCommsSession({ collectionId, orderId });
  const checkoutHref = shopB2bCheckoutCollectionHref(collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-cm-order-context-strip">
      <Link href={shopB2bOrdersCollectionRegistryHref(orderId)} data-testid="shop-cm-order-registry-link" className={hubGadget.goldenLink}>
        Registry
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.matrixHref} data-testid="shop-cm-order-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="shop-cm-order-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.brandOrderHandoffHref} data-testid="shop-cm-order-brand-handoff-link" className={hubGadget.goldenLink}>
        Brand handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.trackingHref} data-testid="shop-cm-order-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.collaborativeHref} data-testid="shop-cm-order-collaborative-link" className={hubGadget.goldenLink}>
        Collaborative
      </Link>
    </div>
  );
}
