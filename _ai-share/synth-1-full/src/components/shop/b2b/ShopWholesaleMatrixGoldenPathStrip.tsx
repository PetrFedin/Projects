'use client';

import Link from 'next/link';
import { buildShopWholesaleMatrixSession } from '@/lib/b2b/shop-wholesale-matrix-workspace';
import { hubGadget } from '@/components/platform/platform-core-hub-gadget-styles';
import { cn } from '@/lib/utils';

export type ShopWholesaleMatrixGoldenPathStepId =
  | 'matrix'
  | 'inspector'
  | 'prepack'
  | 'checkout'
  | 'registry'
  | 'tracking';

type Props = {
  collectionId?: string;
  orderId?: string;
  articleId?: string;
  activeStep?: ShopWholesaleMatrixGoldenPathStepId;
};

const STEPS: { id: ShopWholesaleMatrixGoldenPathStepId; label: string }[] = [
  { id: 'matrix', label: 'Matrix' },
  { id: 'inspector', label: 'Inspector' },
  { id: 'prepack', label: 'Pre-pack' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'registry', label: 'Registry' },
  { id: 'tracking', label: 'Tracking' },
];

export function ShopWholesaleMatrixGoldenPathStrip({
  collectionId,
  orderId,
  articleId,
  activeStep,
}: Props) {
  const session = buildShopWholesaleMatrixSession({ collectionId, orderId, articleId });

  const hrefFor = (id: ShopWholesaleMatrixGoldenPathStepId): string => {
    if (id === 'matrix') return session.matrixHref;
    if (id === 'inspector') return session.inspectorHref;
    if (id === 'prepack') return session.prepackHref;
    if (id === 'checkout') return session.checkoutHref;
    if (id === 'registry') return session.registryHref;
    return session.orderCommsHref;
  };

  return (
    <div className={hubGadget.goldenPath} data-testid="shop-wholesale-matrix-golden-path-strip">
      {STEPS.map((step, index) => (
        <span key={step.id} className="contents">
          {index > 0 ? (
            <span className={hubGadget.goldenSep} aria-hidden>
              ·
            </span>
          ) : null}
          <Link
            href={hrefFor(step.id)}
            className={cn(hubGadget.goldenLink, activeStep === step.id && 'font-bold underline')}
            data-testid={`shop-wholesale-matrix-golden-${step.id}-link`}
          >
            {step.label}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function shopWholesaleMatrixGoldenPathStepFromFeature(
  featureId: string | null | undefined
): ShopWholesaleMatrixGoldenPathStepId | undefined {
  if (featureId === 'matrix') return 'matrix';
  if (featureId === 'inspector') return 'inspector';
  if (featureId === 'prepack') return 'prepack';
  return undefined;
}
