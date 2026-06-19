'use client';

import Link from 'next/link';
import { buildManufacturerProductionOpsSession } from '@/lib/production/manufacturer-production-ops';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId: string;
  factoryId: string;
  articleId?: string;
};

/** Mfr OP cabinet compact · handoff + brand + shop + cut ticket peers. */
export function MfrOpCabinetSpinePeerStrip({ collectionId, orderId, factoryId, articleId }: Props) {
  const session = buildManufacturerProductionOpsSession({
    collectionId,
    orderId,
    factoryId,
    articleId,
  });

  return (
    <div className={hubGadget.goldenPath} data-testid="mfr-op-cabinet-spine-peer-strip">
      <Link href={session.handoffQueueHref} data-testid="mfr-op-cabinet-handoff-queue-link" className={hubGadget.goldenLink}>
        Handoff queue
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.brandOrderHandoffHref} data-testid="mfr-op-cabinet-brand-handoff-link" className={hubGadget.goldenLink}>
        Brand handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="mfr-op-cabinet-shop-tracking-link" className={hubGadget.goldenLink}>
        Shop tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.cutTicketHref} data-testid="mfr-op-cabinet-cut-ticket-link" className={hubGadget.goldenLink}>
        Cut ticket
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.materialsHref} data-testid="mfr-op-cabinet-materials-link" className={hubGadget.goldenLink}>
        Materials
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.manufacturerOrderCommsHref} data-testid="mfr-op-cabinet-order-comms-link" className={hubGadget.goldenLink}>
        Order comms
      </Link>
    </div>
  );
}
