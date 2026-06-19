'use client';

import Link from 'next/link';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { shopB2bTrackingOrderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Matrix · replenishment + collaborative + tracking spine. */
export function ShopCoMatrixSpinePeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopCollaborativeOrderSession({ collectionId, orderId });
  const showroom = buildShopShowroomBuySession({ collectionId, orderId: session.orderId });
  const trackingHref = shopB2bTrackingOrderHref(session.orderId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-co-matrix-spine-peer-strip">
      <Link
        href={session.sessionHref}
        data-testid="shop-co-matrix-collaborative-link"
        className={hubGadget.goldenLink}
      >
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={session.replenishmentHref}
        data-testid="shop-co-matrix-replenishment-link"
        className={hubGadget.goldenLink}
      >
        Replenishment
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.workingOrderHref} data-testid="shop-co-matrix-working-order-link" className={hubGadget.goldenLink}>
        Working order
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={trackingHref} data-testid="shop-co-matrix-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={showroom.replenishmentRulesHref} data-testid="shop-co-matrix-rules-link" className={hubGadget.goldenLink}>
        Rules
      </Link>
    </div>
  );
}
