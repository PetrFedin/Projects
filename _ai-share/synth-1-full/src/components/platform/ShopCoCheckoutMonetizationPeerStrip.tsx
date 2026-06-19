'use client';

import Link from 'next/link';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { shopOrderCommsFeatureHref } from '@/lib/b2b/shop-order-comms';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { shopB2bOrdersCollectionRegistryHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Checkout · greenfield buyer CRM + collaborative + order comms. */
export function ShopCoCheckoutMonetizationPeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopCollaborativeOrderSession({ collectionId, orderId });
  const crmSegmentsHref = brandCrmSegmentationFeatureHref('segments', collectionId);
  const orderCommsHref = shopOrderCommsFeatureHref(session.orderId, 'chat', collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-co-checkout-monetization-peer-strip">
      <Link
        href={crmSegmentsHref}
        data-testid="shop-co-checkout-brand-crm-link"
        className={hubGadget.goldenLink}
      >
        Brand CRM
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={session.approvalsHref}
        data-testid="shop-co-checkout-collaborative-link"
        className={hubGadget.goldenLink}
      >
        Approvals
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={orderCommsHref} data-testid="shop-co-checkout-order-comms-link" className={hubGadget.goldenLink}>
        Order comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={shopB2bOrdersCollectionRegistryHref(session.orderId)}
        data-testid="shop-co-checkout-registry-link"
        className={hubGadget.goldenLink}
      >
        Registry
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.trackingHref} data-testid="shop-co-checkout-tracking-link" className={hubGadget.goldenLink}>
        Tracking
      </Link>
    </div>
  );
}
