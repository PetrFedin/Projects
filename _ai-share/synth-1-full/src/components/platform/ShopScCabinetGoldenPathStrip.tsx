'use client';

import Link from 'next/link';
import {
  ROUTES,
  shopB2bCheckoutCollectionHref,
  shopB2bOrdersCollectionRegistryHref,
  shopB2bOrderHref,
} from '@/lib/routes';

import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';

export type ShopScGoldenPathOmitStep = 'showroom' | 'matrix';

/** Единая цепочка sample_collection магазина — без текущего шага. */
export function ShopScCabinetGoldenPathStrip({
  collectionId,
  activeOrderId,
  omitStep,
}: {
  collectionId: string;
  activeOrderId?: string;
  omitStep?: ShopScGoldenPathOmitStep;
}) {
  const showroomHref = `${ROUTES.shop.b2bShowroom}?collection=${encodeURIComponent(collectionId)}`;
  const matrixHref = `${ROUTES.shop.b2bMatrix}?collection=${encodeURIComponent(collectionId)}`;

  const parts: Array<{ key: string; href: string; label: string; testId: string; legacy?: string }> =
    [];

  if (omitStep !== 'showroom') {
    parts.push({
      key: 'showroom',
      href: showroomHref,
      label: 'Витрина',
      testId: 'shop-sc-golden-path-showroom',
      legacy: 'shop-sc-cabinet-showroom-link',
    });
  }
  if (omitStep !== 'matrix') {
    parts.push({
      key: 'matrix',
      href: matrixHref,
      label: 'Матрица',
      testId: 'shop-sc-golden-path-matrix',
      legacy: 'shop-sc-cabinet-matrix-link',
    });
  }
  parts.push(
    {
      key: 'checkout',
      href: shopB2bCheckoutCollectionHref(collectionId),
      label: 'Checkout',
      testId: 'shop-sc-golden-path-checkout',
      legacy: 'shop-sc-cabinet-checkout-link',
    },
    {
      key: 'registry',
      href: shopB2bOrdersCollectionRegistryHref(collectionId),
      label: 'Реестр',
      testId: 'shop-sc-golden-path-registry',
      legacy: 'shop-sc-cabinet-registry-link',
    }
  );

  if (activeOrderId?.trim()) {
    parts.push({
      key: 'order',
      href: shopB2bOrderHref(activeOrderId.trim()),
      label: 'Заказ',
      testId: 'shop-co-matrix-active-order-link',
    });
  }

  return (
    <div
      className={hubGadget.goldenPath}
      data-testid="shop-sc-cabinet-golden-path"
      data-audit-legacy="shop-sc-cabinet-context-strip"
    >
      {parts.map((part, index) => (
        <span key={part.key} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span className={hubGadget.goldenSep} aria-hidden>·</span> : null}
          <Link
            href={part.href}
            className={hubGadget.goldenLink}
            data-testid={part.testId}
            {...(part.legacy ? { 'data-audit-legacy': part.legacy } : {})}
          >
            {part.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
