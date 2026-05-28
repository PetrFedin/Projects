'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RunwayLookItem } from '@/lib/types';
import { RUNWAY_CART_UPSELL_DISMISS_MS } from '@/lib/scroll-switcher-constants';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayCartUpsellStripProps {
  items: RunwayLookItem[];
  sectionLabel: string;
  visible: boolean;
  onDismiss: () => void;
  className?: string;
}

/** Slide-in upsell после add-to-cart — complete the look, 5 сек dismissible. */
export function RunwayCartUpsellStrip({
  items,
  sectionLabel,
  visible,
  onDismiss,
  className,
}: RunwayCartUpsellStripProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!visible) {
      setEntered(false);
      return;
    }
    const enterTimer = window.setTimeout(() => setEntered(true), 16);
    const dismissTimer = window.setTimeout(onDismiss, RUNWAY_CART_UPSELL_DISMISS_MS);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [visible, onDismiss]);

  if (!visible || items.length === 0) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto absolute left-0 right-0 top-14 z-40 px-3 transition-transform duration-300 md:px-6',
        entered ? 'translate-y-0' : '-translate-y-full opacity-0',
        className
      )}
      role="region"
      aria-label={t('runway.aria.cartUpsell')}
      data-runway-cart-upsell
    >
      <div className="mx-auto flex max-w-xl items-start gap-2 rounded-xl border border-primary/30 bg-background/95 p-3 shadow-lg backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-primary">{t('runway.cartUpsell.title')}</p>
          <p className="text-[10px] text-muted-foreground">
            {t('runway.cartUpsell.subtitle', { label: sectionLabel })}
          </p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5">
            {items.slice(0, 4).map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="flex min-w-[120px] shrink-0 items-center gap-2 rounded-lg border border-border/60 bg-card/80 p-1.5 text-xs hover:border-primary/40"
              >
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="truncate font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onDismiss}
          aria-label={t('runway.aria.closeHint')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
