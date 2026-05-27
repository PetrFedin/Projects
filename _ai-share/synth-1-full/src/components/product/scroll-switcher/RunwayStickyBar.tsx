'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RunwaySectionViewModel } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayStickyBarProps {
  visible: boolean;
  productName: string;
  productSlug: string;
  section: RunwaySectionViewModel;
  className?: string;
}

/** Sticky mini-bar под PDP после прокрутки мимо runway switcher. */
export function RunwayStickyBar({
  visible,
  productName,
  productSlug,
  section,
  className,
}: RunwayStickyBarProps) {
  if (!visible) return null;

  const thumb = section.thumbUrl ?? section.heroUrl;
  const priceLabel = `${section.price.toLocaleString('ru-RU')} ₽`;

  const scrollToRunway = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'runway');
    url.searchParams.set('section', String(section.index));
    window.history.replaceState(null, '', url.toString());
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur-md md:hidden',
        'duration-300 animate-in slide-in-from-bottom-4',
        className
      )}
      role="region"
      aria-label={t('runway.aria.currentVariant')}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          {thumb ? (
            <Image src={thumb} alt={section.label} fill className="object-cover" sizes="40px" />
          ) : (
            <div className="h-full w-full" style={{ backgroundColor: section.color }} aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{productName}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {section.label} · <span className="tabular-nums text-primary">{priceLabel}</span>
          </p>
        </div>
        <Button type="button" size="sm" variant="default" className="shrink-0 text-xs" asChild>
          <Link href={`/products/${productSlug}?view=runway&section=${section.index}`}>
            <ArrowUp className="mr-1 h-3.5 w-3.5" />
            {t('runway.sticky.return')}
          </Link>
        </Button>
        <button
          type="button"
          className="sr-only"
          onClick={scrollToRunway}
          aria-hidden
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
