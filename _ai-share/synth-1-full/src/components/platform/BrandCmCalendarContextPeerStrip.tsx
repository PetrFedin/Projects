'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { brandMessagesB2bOrderContextHref, ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Brand calendar · order spine + CRM + shop downstream peers. */
export function BrandCmCalendarContextPeerStrip({ collectionId, orderId }: Props) {
  const resolvedOrderId = orderId?.trim() || '';
  const session = buildBrandOrderCommsSession({
    collectionId,
    orderId: resolvedOrderId || undefined,
  });
  const crmHref = brandCrmSegmentationFeatureHref('segments', collectionId);
  const pricelistHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);
  const messagesHref = resolvedOrderId
    ? brandMessagesB2bOrderContextHref(resolvedOrderId)
    : `${ROUTES.brand.messages}?collection=${encodeURIComponent(collectionId)}`;

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-cm-calendar-context-peer-strip">
      {resolvedOrderId ? (
        <>
          <Link href={session.handoffHref} data-testid="brand-cm-calendar-handoff-link" className={hubGadget.goldenLink}>
            Handoff
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.registryHref} data-testid="brand-cm-calendar-registry-link" className={hubGadget.goldenLink}>
            Registry
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.shopTrackingHref} data-testid="brand-cm-calendar-shop-tracking-link" className={hubGadget.goldenLink}>
            Shop tracking
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={messagesHref} data-testid="brand-cm-calendar-order-chat-link" className={hubGadget.goldenLink}>
            Order chat
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
        </>
      ) : null}
      <Link href={crmHref} data-testid="brand-cm-calendar-crm-segments-link" className={hubGadget.goldenLink}>
        CRM segments
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={pricelistHref} data-testid="brand-cm-calendar-crm-pricelist-link" className={hubGadget.goldenLink}>
        Pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.factoryQueueHref} data-testid="brand-cm-calendar-factory-queue-link" className={hubGadget.goldenLink}>
        Factory queue
      </Link>
    </div>
  );
}
