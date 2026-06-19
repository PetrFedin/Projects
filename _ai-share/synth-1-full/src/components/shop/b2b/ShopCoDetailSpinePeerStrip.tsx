'use client';

import Link from 'next/link';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { shopOrderCommsFeatureHref } from '@/lib/b2b/shop-order-comms';
import { shopMatrixWorkspaceTabHref, shopReplenishmentTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { shopB2bCheckoutCollectionHref, shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  orderId: string;
  collectionId: string;
};

/** Shop order detail · matrix + checkout + collaborative + tracking peers. */
export function ShopCoDetailSpinePeerStrip({ orderId, collectionId }: Props) {
  const collaborative = buildShopCollaborativeOrderSession({ collectionId, orderId });
  const matrixHref = shopMatrixWorkspaceTabHref('matrix', collectionId, orderId);
  const checkoutHref = shopB2bCheckoutCollectionHref(collectionId);
  const trackingHref = shopB2bTrackingOrderHref(orderId);
  const chatHref = shopOrderCommsFeatureHref(orderId, 'chat', collectionId);
  const replenishmentHref = shopReplenishmentTabHref('stock-atp', collectionId, orderId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-co-detail-context-strip">
      <Link href={matrixHref} data-testid="shop-co-detail-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="shop-co-detail-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={collaborative.sessionHref} data-testid="shop-co-detail-collaborative-link" className={hubGadget.goldenLink}>
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={trackingHref} data-testid="shop-co-detail-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={chatHref} data-testid="shop-co-detail-order-chat-link" className={hubGadget.goldenLink}>
        Order chat
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={replenishmentHref} data-testid="shop-co-detail-replenishment-link" className={hubGadget.goldenLink}>
        Replenishment
      </Link>
    </div>
  );
}
