'use client';

import Link from 'next/link';
import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import { ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  orderId: string;
  collectionId: string;
  factoryId?: string;
};

/** Brand handoff tab · shop monetization + factory comms peers. */
export function BrandOpHandoffCoSpinePeerStrip({ orderId, collectionId, factoryId }: Props) {
  const session = buildBrandProductionHandoffSession({ orderId, collectionId, factoryId });
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}&order=${encodeURIComponent(orderId)}`;
  const checkoutHref = `${ROUTES.shop.b2bCheckout}?collection=${encodeURIComponent(collectionId)}&order=${encodeURIComponent(orderId)}`;

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-op-handoff-co-spine-peer-strip">
      <Link href={matrixHref} data-testid="brand-op-handoff-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="brand-op-handoff-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="brand-op-handoff-shop-tracking-link" className={hubGadget.goldenLink}>
        Shop tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.manufacturerOrderCommsHref} data-testid="brand-op-handoff-mfr-comms-link" className={hubGadget.goldenLink}>
        Factory comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopReplenishmentAtpHref} data-testid="brand-op-handoff-replenishment-link" className={hubGadget.goldenLink}>
        ATP
      </Link>
    </div>
  );
}
