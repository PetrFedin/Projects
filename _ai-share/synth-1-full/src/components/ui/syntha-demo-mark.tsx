'use client';

import { Badge } from '@/components/ui/badge';
import { SYNTHA_DEMO_BADGE_LABEL, showSynthaDemoUiMarker } from '@/lib/demo-ui';
import { cn } from '@/lib/utils';

type SynthaDemoMarkProps = {
  className?: string;
  /** Меньше отступы и шрифт — в строке заголовка модуля */
  compact?: boolean;
};

/**
 * Единая отметка «Демо» для экранов на мок-данных и демо-сценариях.
 */
export function SynthaDemoMark({ className, compact }: SynthaDemoMarkProps) {
  if (!showSynthaDemoUiMarker()) return null;

  return (
    <Badge
      variant="secondary"
      title="Демонстрационные данные и сценарии; не продакшен."
      className={cn(
        'shrink-0 border border-amber-200/90 bg-amber-50 font-bold text-amber-950 shadow-sm',
        compact
          ? 'rounded px-1.5 py-0 text-[9px] uppercase tracking-widest'
          : 'rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wide',
        className
      )}
    >
      {SYNTHA_DEMO_BADGE_LABEL}
    </Badge>
  );
}
