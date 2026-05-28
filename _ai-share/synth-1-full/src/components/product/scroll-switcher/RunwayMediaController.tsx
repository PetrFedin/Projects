'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayMediaControllerProps {
  videoFailed: boolean;
  onRetryVideo: () => void;
}

/** Fallback + retry при сбое видео — overlay на сцене, не пустой stage. */
export function RunwayMediaController({ videoFailed, onRetryVideo }: RunwayMediaControllerProps) {
  if (!videoFailed) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-[5] flex -translate-y-1/2 justify-center px-4"
      data-runway-video-retry
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex max-w-xs flex-col items-center gap-3 rounded-xl border border-border/60 bg-background/95 px-4 py-3 text-center shadow-lg backdrop-blur-md">
        <p className="text-sm font-medium text-foreground">{t('runway.videoErrorTitle')}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t('runway.videoErrorHint')}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 min-h-[44px] px-4 text-xs"
          onClick={onRetryVideo}
        >
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          {t('runway.retryVideo')}
        </Button>
      </div>
    </div>
  );
}
