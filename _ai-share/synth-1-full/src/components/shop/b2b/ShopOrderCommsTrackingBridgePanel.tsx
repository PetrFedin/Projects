'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { buildShopOrderCommsSession } from '@/lib/b2b/shop-order-comms';

type Props = {
  orderId?: string;
  collectionId?: string;
};

/** Cross-role strip: brand comms ↔ shop workspace tabs (above tracking list). */
export function ShopOrderCommsTrackingBridgePanel({ orderId, collectionId }: Props) {
  const shop = useMemo(
    () => (orderId?.trim() ? buildShopOrderCommsSession({ orderId, collectionId }) : null),
    [orderId, collectionId]
  );
  const brand = useMemo(
    () => (orderId?.trim() ? buildBrandOrderCommsSession({ orderId, collectionId }) : null),
    [orderId, collectionId]
  );

  if (!shop || !brand) {
    return null;
  }

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid="shop-order-comms-tracking-bridge-strip"
    >
      <span className="text-text-muted shrink-0">Brand ↔ shop</span>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={brand.detailHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-brand-detail-link"
      >
        Brand order
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={brand.chatHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-brand-chat-link"
      >
        Brand chat
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={brand.handoffHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-brand-handoff-link"
      >
        Brand handoff
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={brand.brandLandedMarginHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-brand-margin-link"
      >
        Brand margin
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.chatHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-shop-chat-link"
      >
        Shop chat
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.replenishmentAtpHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-replenishment-link"
      >
        Replenishment ATP
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.collaborativeApprovalsHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-collaborative-link"
      >
        Collaborative
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.landedMarginHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-shop-margin-link"
      >
        Shop margin
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.matrixHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-matrix-link"
      >
        Matrix
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.inventoryOverviewHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-inventory-link"
      >
        Inventory
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.platformMarketroomHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-platform-marketroom-link"
      >
        Platform marketroom
      </Link>
      <span className={hubGadget.goldenSep}>·</span>
      <Link
        href={shop.workingOrderHref}
        className={hubGadget.goldenLink}
        data-testid="shop-tracking-bridge-working-order-link"
      >
        Working order
      </Link>
    </div>
  );
}
