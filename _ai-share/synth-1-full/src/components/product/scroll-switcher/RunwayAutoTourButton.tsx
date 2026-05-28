'use client';

import { Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayAutoTourButtonProps {
  isRunning: boolean;
  isComplete: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

/** Investor «Автопоказ» — проход по секциям за ~8 секунд. */
export function RunwayAutoTourButton({
  isRunning,
  isComplete,
  onStart,
  onStop,
  className,
}: RunwayAutoTourButtonProps) {
  if (isComplete && !isRunning) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn('h-8 bg-background/90 text-xs backdrop-blur-sm', className)}
        onClick={onStart}
        data-runway-auto-tour-repeat
      >
        <Play className="mr-1.5 h-3.5 w-3.5" />
        {t('runway.autoTour.repeat')}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('h-8 bg-background/90 text-xs backdrop-blur-sm', className)}
      onClick={isRunning ? onStop : onStart}
      aria-pressed={isRunning}
      data-runway-auto-tour
    >
      {isRunning ? (
        <>
          <Square className="mr-1.5 h-3.5 w-3.5 fill-current" />
          {t('runway.autoTour.stop')}
        </>
      ) : (
        <>
          <Play className="mr-1.5 h-3.5 w-3.5" />
          {t('runway.autoTour.start')}
        </>
      )}
    </Button>
  );
}
