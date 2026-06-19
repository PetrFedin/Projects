'use client';

import Link from 'next/link';
import { buildShopReplenishmentSession } from '@/lib/b2b/shop-replenishment-workspace';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Replenishment · checkout + collaborative + brand order chat peers. */
export function ShopReplenishmentCoSpinePeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopReplenishmentSession({ collectionId, orderId });
  const collaborative = buildShopCollaborativeOrderSession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-replenishment-co-spine-peer-strip">
      <Link href={session.checkoutHref} data-testid="shop-replenishment-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.workingOrderHref} data-testid="shop-replenishment-working-order-link" className={hubGadget.goldenLink}>
        Working order
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={collaborative.sessionHref} data-testid="shop-replenishment-collaborative-link" className={hubGadget.goldenLink}>
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.brandOrderChatHref} data-testid="shop-replenishment-brand-chat-link" className={hubGadget.goldenLink}>
        Brand chat
      </Link>
    </div>
  );
}
