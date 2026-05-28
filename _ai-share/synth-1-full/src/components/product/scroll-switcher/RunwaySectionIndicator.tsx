'use client';

import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwaySectionIndicatorProps {
  label: string;
  colorHex: string;
  activeSection: number;
  sectionCount: number;
  prefersReducedMotion?: boolean;
  className?: string;
}

/**
 * Крупный индикатор секции на сцене: swatch + название + счётчик «Вариант N из M».
 */
export function RunwaySectionIndicator({
  label,
  colorHex,
  activeSection,
  sectionCount,
  prefersReducedMotion = false,
  className,
}: RunwaySectionIndicatorProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-3 top-3 z-[4] flex flex-col gap-2 md:left-4 md:top-4',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border border-white/30 bg-black/70 px-3 py-2 shadow-lg backdrop-blur-md',
          !prefersReducedMotion && 'animate-runway-section-enter'
        )}
      >
        <span
          className="h-10 w-10 shrink-0 rounded-lg border-2 border-white/50 shadow-inner ring-2 ring-white/25"
          style={{ backgroundColor: colorHex }}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/85">
            {t('runway.mobileVariant', { current: activeSection + 1, total: sectionCount })}
          </p>
          <p className="truncate text-sm font-bold uppercase tracking-wide text-white">{label}</p>
        </div>
      </div>
    </div>
  );
}
