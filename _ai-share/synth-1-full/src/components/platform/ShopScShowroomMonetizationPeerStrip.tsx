'use client';

import Link from 'next/link';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { ROUTES } from '@/lib/routes';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

type Props = {
  collectionId: string;
  orderId?: string;
};

/** Showroom · partners + linesheet + replenishment monetization peers. */
export function ShopScShowroomMonetizationPeerStrip({ collectionId, orderId }: Props) {
  const session = buildShopShowroomBuySession({ collectionId, orderId });

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-sc-showroom-monetization-peer-strip">
      <Link href={session.linesheetHref} data-testid="shop-sc-showroom-linesheet-link" className={hubGadget.goldenLink}>
        Linesheet
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link href={ROUTES.shop.b2bPartnersDiscover} data-testid="shop-sc-showroom-partners-link" className={hubGadget.goldenLink}>
        Partners
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={session.collaborativeApprovalsHref}
        data-testid="shop-sc-showroom-collaborative-link"
        className={hubGadget.goldenLink}
      >
        Approvals
      </Link>
      <span className={hubGadget.goldenSep} aria-hidden>
        ·
      </span>
      <Link
        href={session.replenishmentAlertsHref}
        data-testid="shop-sc-showroom-replenishment-link"
        className={hubGadget.goldenLink}
      >
        Replenishment
      </Link>
    </div>
  );
}
