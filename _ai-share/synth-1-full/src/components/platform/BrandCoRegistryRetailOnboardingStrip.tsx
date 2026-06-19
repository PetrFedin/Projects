'use client';

import Link from 'next/link';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Brand CO registry · retailer CRM + shop monetization onboarding peers. */
export function BrandCoRegistryRetailOnboardingStrip({ collectionId, orderId }: Props) {
  const session = buildShopShowroomBuySession({ collectionId, orderId });
  const crmHref = brandCrmSegmentationFeatureHref('segments', collectionId);
  const pricelistHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="brand-co-registry-retail-onboarding-strip">
      <Link href={crmHref} data-testid="brand-co-registry-crm-segments-link" className={hubGadget.goldenLink}>
        CRM segments
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={pricelistHref} data-testid="brand-co-registry-crm-pricelist-link" className={hubGadget.goldenLink}>
        Pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.showroomHref} data-testid="brand-co-registry-shop-showroom-link" className={hubGadget.goldenLink}>
        Shop showroom
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.matrixHref} data-testid="brand-co-registry-shop-matrix-link" className={hubGadget.goldenLink}>
        Shop matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={session.checkoutHref} data-testid="brand-co-registry-shop-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
    </div>
  );
}
