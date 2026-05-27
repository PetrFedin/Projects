'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/runway/runway-i18n';

interface RunwayKeyboardLegendProps {
  className?: string;
  /** Встроенный список без floating-кнопки (options panel). */
  embedded?: boolean;
}

const SHORTCUT_KEYS = [
  { keys: '↑ ↓ ← →', labelKey: 'runway.keyboard.nextVariant' as const },
  { keys: '1 2 3', labelKey: 'runway.keyboard.jumpSection' as const },
  { keys: 'Shift+1/2/3', labelKey: 'runway.keyboard.quickCompare' as const },
  { keysKey: 'runway.keyboard.wheelKey' as const, labelKey: 'runway.keyboard.wheel' as const },
  { keysKey: 'runway.keyboard.swipeKey' as const, labelKey: 'runway.keyboard.swipe' as const },
];

/** Компактная легенда горячих клавиш runway (?). */
export function RunwayKeyboardLegend({ className, embedded = false }: RunwayKeyboardLegendProps) {
  const [open, setOpen] = useState(false);

  const legendList = (
    <ul className="space-y-2">
      {SHORTCUT_KEYS.map((item) => (
        <li
          key={item.labelKey + ('keys' in item ? item.keys : item.keysKey)}
          className="flex items-start justify-between gap-2 text-xs"
        >
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            {'keys' in item ? item.keys : t(item.keysKey)}
          </span>
          <span className="text-right text-muted-foreground">{t(item.labelKey)}</span>
        </li>
      ))}
    </ul>
  );

  if (embedded) {
    return (
      <div
        className={cn('space-y-2 border-t border-border pt-3', className)}
        data-runway-keyboard-legend
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('runway.keyboard.title')}
        </p>
        {legendList}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} data-runway-keyboard-legend>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 bg-background/90 backdrop-blur-sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('runway.aria.hotkeys')}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label={t('runway.aria.close')}
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-background p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('runway.keyboard.title')}
            </p>
            {legendList}
          </div>
        </>
      ) : null}
    </div>
  );
}
