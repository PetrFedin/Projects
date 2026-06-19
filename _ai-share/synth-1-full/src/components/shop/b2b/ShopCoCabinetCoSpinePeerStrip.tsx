'use client';

import Link from 'next/link';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { shopB2bCheckoutCollectionHref, shopB2bMatrixReorderHref } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId: string;
};

/** Shop CO cabinet compact · CRM + checkout + collaborative + matrix peers. */
export function ShopCoCabinetCoSpinePeerStrip({ collectionId, orderId }: Props) {
  const collaborative = buildShopCollaborativeOrderSession({ collectionId, orderId });
  const crmHref = brandCrmSegmentationFeatureHref('pricelist', collectionId);

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-co-cabinet-co-spine-peer-strip">
      <Link href={shopB2bMatrixReorderHref(collectionId, orderId)} data-testid="shop-co-cabinet-matrix-link" className={hubGadget.goldenLink}>
        Matrix
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={shopB2bCheckoutCollectionHref(collectionId)} data-testid="shop-co-cabinet-checkout-link" className={hubGadget.goldenLink}>
        Checkout
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={collaborative.approvalsHref} data-testid="shop-co-cabinet-collaborative-link" className={hubGadget.goldenLink}>
        Approvals
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={crmHref} data-testid="shop-co-cabinet-brand-pricelist-link" className={hubGadget.goldenLink}>
        Brand pricelist
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={collaborative.replenishmentHref} data-testid="shop-co-cabinet-replenishment-link" className={hubGadget.goldenLink}>
        ATP
      </Link>
    </div>
  );
}
