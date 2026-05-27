'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import type { RunwaySectionAvailability } from '@/lib/product-scroll-switcher';
import { RunwayMetaStrip } from '@/components/product/scroll-switcher/RunwayMetaStrip';
import { RunwayPriceDisplay } from '@/components/product/scroll-switcher/RunwayPriceDisplay';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayRichInfoPanelProps {
  product: Product;
  displayMaterial: string;
  displayVariant: string;
  displayDimensions?: string;
  madeInLabel: string;
  price: number;
  originalPrice?: number;
  showStrikePrice?: boolean;
  cashbackAmount?: number;
  variantSku?: string;
  brandHref?: string;
  compact?: boolean;
  requiresSize?: boolean;
  availableSizes?: string[];
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
  sectionAvailability?: RunwaySectionAvailability;
  lowStockQuantity?: number;
  onSizeGuideClick?: () => void;
  showSizeGuide?: boolean;
  missingSize?: boolean;
  selectionSummary?: string;
  addToCartLabel?: string;
  onAddToCart?: () => void;
  onMoreDetails?: () => void;
  showCheckoutShortcut?: boolean;
  className?: string;
  align?: 'left' | 'right';
}

/** Правая/левая панель runway: материал, цвет, SKU, цена с дельтой — чистая сетка. */
export function RunwayRichInfoPanel({
  product,
  displayMaterial,
  displayVariant,
  displayDimensions,
  madeInLabel,
  price,
  originalPrice,
  showStrikePrice,
  cashbackAmount = 0,
  variantSku,
  brandHref,
  compact = false,
  requiresSize = false,
  availableSizes = [],
  selectedSize,
  onSizeSelect,
  sectionAvailability,
  lowStockQuantity,
  onSizeGuideClick,
  showSizeGuide = true,
  missingSize = false,
  selectionSummary,
  addToCartLabel,
  onAddToCart,
  onMoreDetails,
  showCheckoutShortcut = false,
  className,
  align = 'right',
}: RunwayRichInfoPanelProps) {
  const isRight = align === 'right';

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background/90 p-4 text-foreground shadow-sm backdrop-blur-md',
        isRight ? 'min-w-[200px] text-right' : 'max-w-[240px]',
        className
      )}
    >
      {align === 'left' ? (
        <>
          {brandHref ? (
            <Link
              href={brandHref}
              className="pointer-events-auto text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-primary"
            >
              {product.brand}
            </Link>
          ) : (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>
          )}
          <h2 className="mt-1 font-headline text-base font-bold leading-tight lg:text-sm">
            {product.name}
          </h2>
        </>
      ) : null}

      <dl
        className={cn('grid gap-2.5 text-xs', isRight ? 'mt-0' : 'mt-4', isRight && 'text-right')}
      >
        <div className={cn('grid gap-0.5', isRight && 'justify-items-end')}>
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {t('runway.label.material')}
          </dt>
          <dd className={cn('line-clamp-3 text-foreground', !isRight && 'mt-0.5')}>
            {displayMaterial}
          </dd>
        </div>
        <div className={cn('grid gap-0.5', isRight && 'justify-items-end')}>
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {t('runway.label.color')}
          </dt>
          <dd className="font-medium text-foreground">{displayVariant}</dd>
        </div>
        {displayDimensions ? (
          <div className={cn('grid gap-0.5', isRight && 'justify-items-end')}>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {t('runway.label.dimensions')}
            </dt>
            <dd className="text-foreground">{displayDimensions}</dd>
          </div>
        ) : null}
        <div className={cn('grid gap-0.5', isRight && 'justify-items-end')}>
          <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {t('runway.label.origin')}
          </dt>
          <dd className="text-foreground">{madeInLabel}</dd>
        </div>
        {variantSku ? (
          <div className={cn('grid gap-0.5', isRight && 'justify-items-end')}>
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {t('runway.label.sku')}
            </dt>
            <dd className="font-mono text-[11px] text-muted-foreground">{variantSku}</dd>
          </div>
        ) : null}
      </dl>

      {isRight ? (
        <div className="mt-4 flex flex-col items-end gap-1">
          <RunwayPriceDisplay
            price={price}
            originalPrice={originalPrice}
            showStrikePrice={showStrikePrice}
          />
          {cashbackAmount > 0 ? (
            <Badge variant="success" className="mt-1 text-[9px]">
              {t('runway.cashback', { amount: cashbackAmount.toLocaleString('ru-RU') })}
            </Badge>
          ) : null}
        </div>
      ) : null}

      {!compact && align === 'left' && onMoreDetails ? (
        <button
          type="button"
          onClick={onMoreDetails}
          className="pointer-events-auto mt-4 text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {t('runway.moreDetails')}
        </button>
      ) : null}

      {requiresSize && availableSizes.length > 0 ? (
        <div className={cn('pointer-events-auto mt-3', isRight && 'text-right')}>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {t('runway.label.size')}
          </p>
          <div className={cn('mt-1.5 flex flex-wrap gap-1.5', isRight && 'justify-end')}>
            {availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeSelect?.(size)}
                className={cn(
                  'min-w-[2.25rem] rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                  selectedSize === size
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background/80 hover:border-primary/60'
                )}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {sectionAvailability ? (
        <RunwayMetaStrip
          availability={sectionAvailability}
          lowStockQuantity={lowStockQuantity}
          onSizeGuideClick={onSizeGuideClick}
          showSizeGuide={showSizeGuide}
          className={cn('pointer-events-none mt-3', isRight ? 'text-left' : '')}
        />
      ) : null}

      {missingSize ? (
        <Badge variant="warning" className="pointer-events-none mt-3 text-[9px]">
          {t('runway.selectSize')}
        </Badge>
      ) : selectedSize && !(requiresSize && availableSizes.length > 0) ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t('runway.sizeSelected', { size: selectedSize! })}
        </p>
      ) : null}

      {selectionSummary ? (
        <p className="mt-3 text-xs font-medium text-foreground">
          {t('runway.selectedPrefix')} <span className="text-primary">{selectionSummary}</span>
        </p>
      ) : null}

      {isRight && onAddToCart && addToCartLabel ? (
        <>
          <Button
            type="button"
            size="lg"
            className="pointer-events-auto mt-4 w-full"
            onClick={onAddToCart}
            data-runway-add-to-cart
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addToCartLabel}
          </Button>
          {showCheckoutShortcut ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="pointer-events-auto mt-2 w-full"
              asChild
              data-runway-checkout-shortcut
            >
              <Link href="/checkout">{t('runway.checkoutShortcut')}</Link>
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
