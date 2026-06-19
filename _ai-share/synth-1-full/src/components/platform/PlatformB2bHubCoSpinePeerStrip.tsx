'use client';

import Link from 'next/link';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId?: string;
  orderId?: string;
};

/** Platform B2B hub · full monetization spine beyond golden path. */
export function PlatformB2bHubCoSpinePeerStrip({ collectionId, orderId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId, orderId });
  const crmHref = brandCrmSegmentationFeatureHref('pricelist', session.collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="platform-b2b-hub-co-spine-peer-strip">
      <Link href={session.buyPathHref} data-testid="platform-b2b-hub-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.shopMatrixHref} data-testid="platform-b2b-hub-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.collaborativeHref} data-testid="platform-b2b-hub-collaborative-link" className={hubGadget.goldenLink}>
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.replenishmentAtpHref} data-testid="platform-b2b-hub-replenishment-link" className={hubGadget.goldenLink}>
        ATP
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={crmHref} data-testid="platform-b2b-hub-brand-pricelist-link" className={hubGadget.goldenLink}>
        Brand pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={ROUTES.shop.b2bOrders} data-testid="platform-b2b-hub-registry-link" className={hubGadget.goldenLink}>
        Registry
      </Link>
    </div>
  );
}
