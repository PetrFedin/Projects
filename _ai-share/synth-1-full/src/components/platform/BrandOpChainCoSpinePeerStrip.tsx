'use client';

import Link from 'next/link';
import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import { ROUTES, shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  orderId: string;
  collectionId: string;
};

/** Brand OP chain card · shop monetization + handoff + factory peers. */
export function BrandOpChainCoSpinePeerStrip({ orderId, collectionId }: Props) {
  const session = buildBrandProductionHandoffSession({ orderId, collectionId });
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}&order=${encodeURIComponent(orderId)}`;
  const checkoutHref = `${ROUTES.shop.b2bCheckout}?collection=${encodeURIComponent(collectionId)}&order=${encodeURIComponent(orderId)}`;

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-op-chain-co-spine-peer-strip">
      <Link href={session.handoffTabHref} data-testid="brand-op-chain-handoff-link" className={hubGadget.goldenLink}>
        Handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={matrixHref} data-testid="brand-op-chain-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="brand-op-chain-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={shopB2bTrackingOrderHref(orderId)} data-testid="brand-op-chain-shop-tracking-link" className={hubGadget.goldenLink}>
        Shop tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.manufacturerOrderCommsHref} data-testid="brand-op-chain-mfr-comms-link" className={hubGadget.goldenLink}>
        Factory comms
      </Link>
    </div>
  );
}
