'use client';

import Link from 'next/link';
import { GitCompare, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { t } from '@/lib/runway/runway-i18n';

function formatProductPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

export interface RunwayCartActionsProps {
  product: Product;
  activeSection: number;
  sectionCount: number;
  price: number;
  resolvedOriginalPrice?: number;
  showStrikePrice?: boolean;
  displayVariant: string;
  missingSize?: boolean;
  selectionSummary?: string;
  addToCartLabel: string;
  onAddToCart: () => void;
  onOpenCompare: () => void;
  /** После add-to-cart — ссылка на /checkout при непустой корзине. */
  showCheckoutShortcut?: boolean;
}

/** Мобильная панель цены/корзины — вынесена из orchestrator. */
export function RunwayCartActions({
  product,
  activeSection,
  sectionCount,
  price,
  resolvedOriginalPrice,
  showStrikePrice,
  displayVariant,
  missingSize,
  selectionSummary,
  addToCartLabel,
  onAddToCart,
  onOpenCompare,
  showCheckoutShortcut = false,
}: RunwayCartActionsProps) {
  return (
    <div
      className="pointer-events-auto absolute bottom-24 left-0 right-0 z-10 px-4 md:hidden"
      data-runway-price-panel
    >
      <div className="rounded-lg border border-border bg-background/90 p-4 text-foreground shadow-sm backdrop-blur-md">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {t('runway.mobileVariant', { current: activeSection + 1, total: sectionCount })}
        </p>
        <p className="font-headline text-base font-bold">{product.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-primary">{formatProductPrice(price)}</span>
          {showStrikePrice && resolvedOriginalPrice ? (
            <span className="text-muted-foreground line-through">
              {formatProductPrice(resolvedOriginalPrice)}
            </span>
          ) : null}
          <span className="text-muted-foreground">· {displayVariant}</span>
        </div>
        {missingSize ? (
          <Badge variant="warning" className="mt-2 text-[9px]">
            {t('runway.selectSize')}
          </Badge>
        ) : null}
        {selectionSummary ? (
          <p className="mt-2 text-xs font-medium">
            {t('runway.selectedPrefix')} <span className="text-primary">{selectionSummary}</span>
          </p>
        ) : null}
        {sectionCount > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 min-h-[44px] w-full"
            onClick={onOpenCompare}
            data-runway-compare-open
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {t('runway.compareVariants')}
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          className="mt-3 min-h-[44px] w-full"
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
            size="sm"
            className="mt-2 min-h-[44px] w-full"
            asChild
            data-runway-checkout-shortcut
          >
            <Link href="/checkout">{t('runway.checkoutShortcut')}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
