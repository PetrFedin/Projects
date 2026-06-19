'use client';

import { Badge } from '@/components/ui/badge';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';

type Props = {
  /** Подпись источника (по умолчанию «Демо»). */
  label?: string;
  className?: string;
};

/** Маркер экранов на placeholder-data / статичном JSON в Platform Core (не PG SoT). */
export function PlatformCoreDemoDataBadge({ label = 'Демо', className }: Props) {
  if (!isPlatformCoreMode()) return null;
  return (
    <Badge
      variant="outline"
      data-testid="platform-core-demo-data-badge"
      className={
        className ??
        'border-amber-300/80 bg-amber-50/90 text-[9px] font-semibold uppercase tracking-wide text-amber-950'
      }
    >
      {label}
    </Badge>
  );
}
