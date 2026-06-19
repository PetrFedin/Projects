'use client';

import { PlatformCoreDemoDataBadge } from '@/components/platform/PlatformCoreDemoDataBadge';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { matchPlatformCorePlaceholderSurface } from '@/lib/platform-core-placeholder-surfaces';

type Props = {
  route: string;
  className?: string;
};

/** Дисклеймер «Демо» для экранов из `PLATFORM_CORE_PLACEHOLDER_SURFACES` (только Platform Core). */
export function PlatformCorePlaceholderSurfaceDisclaimer({ route, className }: Props) {
  if (!isPlatformCoreMode()) return null;
  const surface = matchPlatformCorePlaceholderSurface(route);
  if (!surface) return null;

  const testId = `platform-core-placeholder${route.replace(/\//g, '-')}`;

  return (
    <p
      className={
        className ??
        'text-text-muted border-border-default bg-bg-surface2/80 rounded-md border px-3 py-2 text-xs leading-snug'
      }
      data-testid={testId}
    >
      <span className="text-text-primary inline-flex items-center gap-2 font-semibold">
        Демо.
        <PlatformCoreDemoDataBadge label={surface.source} />
      </span>{' '}
      {surface.noteRu}. Данные вне PG spine golden path.
    </p>
  );
}
