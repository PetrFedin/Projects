'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId: string;
};

/** Brand order chat · CO spine + shop monetization + CRM peers. */
export function BrandCmOrderContextPeerStrip({ collectionId, orderId }: Props) {
  const session = buildBrandOrderCommsSession({ collectionId, orderId });
  const crmHref = brandCrmSegmentationFeatureHref('segments', collectionId);
  const pricelistHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-cm-order-context-strip">
      <Link href={session.registryHref} data-testid="brand-cm-order-registry-link" className={hubGadget.goldenLink}>
        Registry
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.handoffHref} data-testid="brand-cm-order-handoff-link" className={hubGadget.goldenLink}>
        Handoff
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopMatrixHref} data-testid="brand-cm-order-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopCheckoutHref} data-testid="brand-cm-order-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopTrackingHref} data-testid="brand-cm-order-shop-tracking-link" className={hubGadget.goldenLink}>
        Shop tracking
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.calendarHref} data-testid="brand-cm-order-calendar-link" className={hubGadget.goldenLink}>
        Calendar
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={crmHref} data-testid="brand-cm-order-crm-segments-link" className={hubGadget.goldenLink}>
        CRM segments
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={pricelistHref} data-testid="brand-cm-order-crm-pricelist-link" className={hubGadget.goldenLink}>
        Pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.productionOpsHref} data-testid="brand-cm-order-production-ops-link" className={hubGadget.goldenLink}>
        Production ops
      </Link>
    </div>
  );
}
