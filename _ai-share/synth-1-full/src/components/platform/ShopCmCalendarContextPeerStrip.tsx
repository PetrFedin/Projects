'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { shopReplenishmentTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { shopOrderCommsFeatureHref } from '@/lib/b2b/shop-order-comms';
import {
  ROUTES,
  shopB2bCheckoutCollectionHref,
  shopB2bTrackingOrderHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Shop calendar · order comms + tracking + replenishment peers. */
export function ShopCmCalendarContextPeerStrip({ collectionId, orderId }: Props) {
  const resolvedOrderId = orderId?.trim() || '';
  const trackingHref = resolvedOrderId
    ? shopB2bTrackingOrderHref(resolvedOrderId)
    : shopB2bTrackingOrderHref('');
  const chatHref = resolvedOrderId
    ? shopMessagesB2bOrderContextHref(resolvedOrderId)
    : `${ROUTES.shop.messages}?collection=${encodeURIComponent(collectionId)}`;
  const orderCommsHref = resolvedOrderId
    ? shopOrderCommsFeatureHref(resolvedOrderId, 'chat', collectionId)
    : shopB2bCheckoutCollectionHref(collectionId);
  const replenishmentHref = shopReplenishmentTabHref(
    'stock-atp',
    collectionId,
    resolvedOrderId || undefined
  );

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-cm-calendar-context-peer-strip">
      {resolvedOrderId ? (
        <>
          <Link href={trackingHref} data-testid="shop-cm-calendar-tracking-link" className={hubGadget.goldenLink}>
            Tracking
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={chatHref} data-testid="shop-cm-calendar-order-chat-link" className={hubGadget.goldenLink}>
            Order chat
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
        </>
      ) : null}
      <Link href={orderCommsHref} data-testid="shop-cm-calendar-order-comms-link" className={hubGadget.goldenLink}>
        Order comms
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={replenishmentHref} data-testid="shop-cm-calendar-replenishment-link" className={hubGadget.goldenLink}>
        Replenishment
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={shopB2bCheckoutCollectionHref(collectionId)}
        data-testid="shop-cm-calendar-checkout-link"
        className={hubGadget.goldenLink}
      >
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={brandCrmSegmentationFeatureHref('segments', collectionId)}
        data-testid="shop-cm-calendar-brand-crm-link"
        className={hubGadget.goldenLink}
      >
        Brand CRM
      </Link>
    </div>
  );
}
