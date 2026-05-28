'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayPriceDisplayProps {
  price: number;
  originalPrice?: number;
  showStrikePrice?: boolean;
  className?: string;
}

function formatProductPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : '−';
  return `${sign}${Math.abs(delta).toLocaleString('ru-RU')} ₽`;
}

/** Цена с анимацией тика и подсветкой дельты при смене секции. */
export function RunwayPriceDisplay({
  price,
  originalPrice,
  showStrikePrice,
  className,
}: RunwayPriceDisplayProps) {
  const prevPriceRef = useRef(price);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    const prev = prevPriceRef.current;
    if (prev !== price && prev > 0) {
      const diff = price - prev;
      setDelta(diff);
      const t = window.setTimeout(() => setDelta(null), 1800);
      prevPriceRef.current = price;
      return () => window.clearTimeout(t);
    }
    prevPriceRef.current = price;
  }, [price]);

  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {delta != null && delta !== 0
          ? t('runway.newPriceAnnouncement', { price: formatProductPrice(price) })
          : null}
      </div>
      <div className="flex flex-wrap items-baseline justify-end gap-2">
        <p
          key={`price-${price}`}
          className="animate-runway-price-tick text-base font-bold tabular-nums text-primary"
        >
          {formatProductPrice(price)}
        </p>
        {delta != null && delta !== 0 ? (
          <span
            className={cn(
              'animate-runway-price-delta text-xs font-semibold tabular-nums',
              delta > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            )}
          >
            {formatDelta(delta)}
          </span>
        ) : null}
      </div>
      {showStrikePrice && originalPrice ? (
        <p className="text-sm text-muted-foreground line-through">
          {formatProductPrice(originalPrice)}
        </p>
      ) : null}
    </div>
  );
}
