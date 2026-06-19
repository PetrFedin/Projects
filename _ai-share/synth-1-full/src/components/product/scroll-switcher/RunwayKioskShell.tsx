'use client';

import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RUNWAY_KIOSK_TOUR_INTERVAL_MS } from '@/lib/scroll-switcher-constants';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayKioskShellProps {
  /** Активен kiosk-режим. */
  active: boolean;
  sectionCount: number;
  activeSection: number;
  onSectionChange: (index: number) => void;
  onExit: () => void;
  /** Интервал auto-tour (мс); ?autoadvance=N в URL или дефолт 12s. */
  tourIntervalMs?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Retail / trade-show kiosk — fullscreen, auto-tour каждые 12s, крупные thumbs.
 * Выход: Esc или X в углу.
 */
export function RunwayKioskShell({
  active,
  sectionCount,
  activeSection,
  onSectionChange,
  onExit,
  tourIntervalMs = RUNWAY_KIOSK_TOUR_INTERVAL_MS,
  children,
  className,
}: RunwayKioskShellProps) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advanceSection = useCallback(() => {
    if (sectionCount < 2) return;
    const next = (activeSection + 1) % sectionCount;
    onSectionChange(next);
  }, [activeSection, onSectionChange, sectionCount]);

  useEffect(() => {
    if (!active || sectionCount < 2) return;

    timerRef.current = setInterval(advanceSection, tourIntervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, sectionCount, advanceSection, tourIntervalMs]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onExit]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'runway-kiosk-shell fixed inset-0 z-[100] flex flex-col bg-background',
        className
      )}
      data-runway-kiosk
      data-runway-kiosk-tour-ms={String(tourIntervalMs)}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-[110]">
        <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          {t('runway.kioskMode')}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-4 top-4 z-[110] h-11 min-h-[44px] w-11 min-w-[44px] bg-background/90 backdrop-blur-sm"
        onClick={onExit}
        aria-label={t('runway.kioskExit')}
      >
        <X className="h-5 w-5" />
      </Button>
      <div className="flex min-h-0 flex-1 flex-col [&_[data-runway-stage]]:aspect-auto [&_[data-runway-stage]]:max-h-none [&_[data-runway-stage]]:min-h-0 [&_[data-runway-stage]]:flex-1 [&_[data-runway-stage]]:rounded-none">
        {children}
      </div>
    </div>
  );
}
