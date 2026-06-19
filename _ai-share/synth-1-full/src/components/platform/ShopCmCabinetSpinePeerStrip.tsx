'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildShopOrderCommsSession } from '@/lib/b2b/shop-order-comms';
import { shopB2bCheckoutCollectionHref, shopB2bOrdersCollectionRegistryHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Shop comms cabinet · registry + matrix + brand peers. */
export function ShopCmCabinetSpinePeerStrip({ collectionId, orderId }: Props) {
  const resolvedOrderId = orderId?.trim() || '';
  const session = buildShopOrderCommsSession({
    collectionId,
    orderId: resolvedOrderId || undefined,
  });
  const pricelistHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);
  const checkoutHref = shopB2bCheckoutCollectionHref(collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-cm-cabinet-spine-peer-strip">
      {resolvedOrderId ? (
        <>
          <Link href={shopB2bOrdersCollectionRegistryHref(resolvedOrderId)} data-testid="shop-cm-cabinet-registry-link" className={hubGadget.goldenLink}>
            Registry
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.trackingHref} data-testid="shop-cm-cabinet-tracking-link" className={hubGadget.goldenLink}>
            Tracking
          </Link>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
        </>
      ) : null}
      <Link href={session.matrixHref} data-testid="shop-cm-cabinet-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={checkoutHref} data-testid="shop-cm-cabinet-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={pricelistHref} data-testid="shop-cm-cabinet-brand-pricelist-link" className={hubGadget.goldenLink}>
        Brand pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.replenishmentAtpHref} data-testid="shop-cm-cabinet-replenishment-link" className={hubGadget.goldenLink}>
        ATP
      </Link>
      {resolvedOrderId ? (
        <>
          <span className={hubGadget.goldenSep} aria-hidden>
            ·
          </span>
          <Link href={session.brandOrderChatHref} data-testid="shop-cm-cabinet-brand-chat-link" className={hubGadget.goldenLink}>
            Brand chat
          </Link>
        </>
      ) : null}
    </div>
  );
}
