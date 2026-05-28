'use client';

import { cn } from '@/lib/utils';
import { ErpAccountingSyncBanner } from '@/components/shop/ErpAccountingSyncBanner';
import { ShopAnalyticsSegmentNav } from '@/components/shop/ShopAnalyticsSegmentNav';

export type ShopAnalyticsSegmentErpStripProps = {
  className?: string;
  navClassName?: string;
  bannerClassName?: string;
  /** На страницах без финансового контекста — только переключатель срезов. */
  showErpBanner?: boolean;
  /** Пробрасывается в баннер (например на shopify-sync). */
  hideSettingsLink?: boolean;
};

/**
 * Единый блок «срез аналитики + доверие к учёту» для `/shop/analytics*`, B2B-аналитики, отчётов и маржи.
 */
export function ShopAnalyticsSegmentErpStrip({
  className,
  navClassName,
  bannerClassName,
  showErpBanner = true,
  hideSettingsLink,
}: ShopAnalyticsSegmentErpStripProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between',
        className
      )}
    >
      <ShopAnalyticsSegmentNav className={navClassName} />
      {showErpBanner ? (
        <ErpAccountingSyncBanner
          className={cn('max-w-full sm:max-w-md', bannerClassName)}
          hideSettingsLink={hideSettingsLink}
        />
      ) : null}
    </div>
  );
}
