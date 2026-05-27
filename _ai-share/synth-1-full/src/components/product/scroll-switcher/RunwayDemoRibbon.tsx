'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RUNWAY_DEMO_RIBBON_STORAGE_KEY } from '@/lib/scroll-switcher-constants';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayDemoRibbonProps {
  enabled?: boolean;
  className?: string;
}

/** Верхняя лента demo-режима — инвесторы понимают, что смотрят Product Scroll Switcher. */
export function RunwayDemoRibbon({ enabled = true, className }: RunwayDemoRibbonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }
    try {
      setVisible(localStorage.getItem(RUNWAY_DEMO_RIBBON_STORAGE_KEY) !== '1');
    } catch {
      setVisible(true);
    }
  }, [enabled]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(RUNWAY_DEMO_RIBBON_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto absolute inset-x-0 top-0 z-40 flex items-center justify-center gap-2 border-b border-primary/20 bg-primary/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-primary-foreground backdrop-blur-sm',
        className
      )}
      role="status"
    >
      <span>{t('runway.demoRibbon')}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/15"
        onClick={dismiss}
        aria-label={t('runway.aria.closeDemoRibbon')}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
