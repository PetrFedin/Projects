'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayAttributionNoteProps {
  className?: string;
  /** Показывать только в demo (?demo=1 / autoTour). */
  demoOnly?: boolean;
  visible?: boolean;
  /** footer — одна строка под сценой, без overlay. */
  variant?: 'overlay' | 'footer';
}

/** Подпись CC для демо-ассетов (Wikimedia Commons). */
export function RunwayAttributionNote({
  className,
  demoOnly = false,
  visible = true,
  variant = 'overlay',
}: RunwayAttributionNoteProps) {
  if (demoOnly && !visible) return null;

  return (
    <p
      className={cn(
        variant === 'footer'
          ? 'mt-2 text-center text-[10px] text-muted-foreground/70 md:text-left'
          : 'pointer-events-auto absolute bottom-16 left-3 right-3 z-10 text-center text-[10px] text-muted-foreground/90 md:left-auto md:right-4 md:max-w-xs md:text-right',
        className
      )}
    >
      {t('runway.attribution.video')}{' '}
      <Link
        href="https://commons.wikimedia.org/wiki/Category:Fashion_photographs"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground"
      >
        Wikimedia Commons CC
      </Link>
    </p>
  );
}
