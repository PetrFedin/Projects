'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Brand comms cabinet · CO registry + shop monetization + CRM peers. */
export function BrandCmCabinetSpinePeerStrip({ collectionId, orderId }: Props) {
  const resolvedOrderId = orderId?.trim() || '';
  const session = buildBrandOrderCommsSession({
    collectionId,
    orderId: resolvedOrderId || undefined,
  });
  const crmHref = brandCrmSegmentationFeatureHref('segments', collectionId);
  const pricelistHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-cm-cabinet-spine-peer-strip">
      {resolvedOrderId ? (
        <>
          <Link href={session.registryHref} data-testid="brand-cm-cabinet-registry-link" className={hubGadget.goldenLink}>
            Registry
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.handoffHref} data-testid="brand-cm-cabinet-handoff-link" className={hubGadget.goldenLink}>
            Handoff
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
        </>
      ) : null}
      <Link href={session.shopMatrixHref} data-testid="brand-cm-cabinet-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopCheckoutHref} data-testid="brand-cm-cabinet-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={crmHref} data-testid="brand-cm-cabinet-crm-segments-link" className={hubGadget.goldenLink}>
        CRM segments
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={pricelistHref} data-testid="brand-cm-cabinet-crm-pricelist-link" className={hubGadget.goldenLink}>
        Pricelist
      </Link>
      {resolvedOrderId ? (
        <>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.replenishmentAtpHref} data-testid="brand-cm-cabinet-replenishment-link" className={hubGadget.goldenLink}>
            Replenishment
          </Link>
        </>
      ) : null}
    </div>
  );
}
