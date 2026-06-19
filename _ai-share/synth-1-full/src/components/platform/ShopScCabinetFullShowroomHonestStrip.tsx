'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
};

/** Hub mini vs full showroom — honest alias + CTA to PG cart path. */
export function ShopScCabinetFullShowroomHonestStrip({ collectionId }: Props) {
  const fullHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid="shop-sc-cabinet-full-showroom-honest-strip"
    >
      <span className={hubGadget.muted} data-testid="shop-sc-cabinet-mini-honest-hint">
        Hub mini — size/qty/cart PG на полной витрине
      </span>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={fullHref}
        data-testid="shop-sc-cabinet-full-showroom-link"
        className={hubGadget.goldenLink}
      >
        Полная витрина →
      </Link>
    </div>
  );
}
