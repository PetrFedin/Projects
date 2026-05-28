'use client';

import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayEntryCtaProps {
  /** Показывать только когда активна стандартная галерея. */
  visible: boolean;
  onOpenRunway: () => void;
  className?: string;
  /** banner — полный блок; link — одна строка-ссылка (minimal layout). */
  variant?: 'banner' | 'link';
}

/**
 * CTA над галереей PDP — призыв перейти в Runway для scroll-video товаров.
 */
export function RunwayEntryCta({
  visible,
  onOpenRunway,
  className,
  variant = 'banner',
}: RunwayEntryCtaProps) {
  if (!visible) return null;

  if (variant === 'link') {
    return (
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline',
          className
        )}
        onClick={onOpenRunway}
        data-runway-entry-cta
        data-runway-entry-variant="link"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {t('runway.entry.open')}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 shadow-sm',
        className
      )}
      role="region"
      aria-label={t('runway.aria.entryCta')}
      data-runway-entry-cta
      data-runway-entry-variant="banner"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="animate-runway-play-pulse h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{t('runway.entry.title')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('runway.entry.subtitle')}</p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="group shrink-0 rounded-full px-5"
          onClick={onOpenRunway}
        >
          {t('runway.entry.open')}
          <ChevronDown
            className="animate-runway-cta-arrow ml-1.5 h-4 w-4 transition-transform group-hover:translate-y-0.5"
            aria-hidden
          />
        </Button>
      </div>
    </div>
  );
}
