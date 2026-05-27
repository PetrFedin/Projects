'use client';

import { Truck, Undo2, Ruler, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { RunwaySectionAvailability } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayMetaStripProps {
  availability: RunwaySectionAvailability;
  /** Количество на складе для активного размера (если известно). */
  lowStockQuantity?: number;
  /** Открыть AI гид по размерам (как на PDP). */
  onSizeGuideClick?: () => void;
  showSizeGuide?: boolean;
  className?: string;
}

const STATUS_CLASS: Record<RunwaySectionAvailability['status'], string> = {
  in_stock: 'text-green-700',
  pre_order: 'text-amber-700',
  out_of_stock: 'text-red-700',
  outlet: 'text-orange-700',
};

/**
 * Микро-строки runway: наличие, доставка, возврат, гид по размерам.
 * Повторяет ключевые сигналы standard PDP без дублирования всей колонки.
 */
export function RunwayMetaStrip({
  availability,
  lowStockQuantity,
  onSizeGuideClick,
  showSizeGuide = true,
  className,
}: RunwayMetaStripProps) {
  const isLowStock =
    availability.status === 'in_stock' &&
    lowStockQuantity != null &&
    lowStockQuantity > 0 &&
    lowStockQuantity <= 3;

  return (
    <div
      className={cn('space-y-2 text-xs text-muted-foreground', className)}
      data-runway-meta-strip
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className={cn('font-medium', STATUS_CLASS[availability.status])}>{availability.label}</p>
        {isLowStock ? (
          <Badge variant="warning" className="gap-1 text-[9px] font-semibold uppercase">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            {t('runway.meta.lowStock', { count: lowStockQuantity! })}
          </Badge>
        ) : null}
      </div>
      <div className="flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{t('runway.meta.delivery')}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Undo2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>{t('runway.meta.returns')}</span>
      </div>
      {showSizeGuide && onSizeGuideClick ? (
        <button
          type="button"
          onClick={onSizeGuideClick}
          className="pointer-events-auto inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
          data-runway-size-guide
        >
          <Ruler className="h-3.5 w-3.5" aria-hidden />
          {t('runway.meta.aiSizeGuide')}
        </button>
      ) : null}
    </div>
  );
}
