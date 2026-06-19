'use client';

import Link from 'next/link';
import { buildShopOrderCommsSession } from '@/lib/b2b/shop-order-comms';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId: string;
};

/** Shop OP cabinet · post-confirm production + margin peers. */
export function ShopOpCabinetSpinePeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopOrderCommsSession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-op-cabinet-spine-peer-strip">
      <Link href={session.brandOrderHandoffHref} data-testid="shop-op-cabinet-brand-handoff-link" className={hubGadget.goldenLink}>
        Brand handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.trackingHref} data-testid="shop-op-cabinet-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.landedMarginHref} data-testid="shop-op-cabinet-landed-margin-link" className={hubGadget.goldenLink}>
        Landed margin
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.inventoryOverviewHref} data-testid="shop-op-cabinet-inventory-link" className={hubGadget.goldenLink}>
        Inventory
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.chatHref} data-testid="shop-op-cabinet-order-comms-link" className={hubGadget.goldenLink}>
        Order comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.workingOrderHref} data-testid="shop-op-cabinet-working-order-link" className={hubGadget.goldenLink}>
        Working order
      </Link>
    </div>
  );
}
