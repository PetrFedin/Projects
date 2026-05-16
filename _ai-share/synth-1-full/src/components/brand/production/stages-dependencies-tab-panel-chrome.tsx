'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronDown, Filter, Pin } from 'lucide-react';

/** Пульсирующая цветная иконка: активен контекстный фильтр (внутренние табы этапов или родительский триггер). */
export function StagesContextFilterPulseIcon() {
  return (
    <span
      className="pointer-events-none relative inline-flex h-4 w-4 shrink-0 items-center justify-center"
      title="Активен фильтр среза / перечня / узла схемы"
    >
      <span
        className="bg-accent-primary/15 pointer-events-none absolute inline-flex h-3 w-3 animate-ping rounded-full motion-reduce:hidden"
        aria-hidden
      />
      <Filter
        className="text-accent-primary pointer-events-none relative h-3.5 w-3.5 animate-pulse drop-shadow-[0_0_5px_rgba(139,92,246,0.5)] motion-reduce:animate-none motion-reduce:opacity-100"
        strokeWidth={2.5}
        aria-hidden
      />
      <span className="sr-only">Активен фильтр контекста</span>
    </span>
  );
}

/** Шеврон сворачивания + «гвоздик»: закреплён — всегда развёрнуто; без закрепления — шеврон сворачивает. */
export function StagesCollapsePinBar({
  pinned,
  onPinnedChange,
  open,
  onOpenChange,
  collapseAriaLabel,
}: {
  pinned: boolean;
  onPinnedChange: (v: boolean) => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  collapseAriaLabel: string;
}) {
  return (
    <div className="border-border-default/80 ml-1 flex shrink-0 items-center gap-0.5 border-l pl-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 p-0"
            disabled={pinned}
            aria-expanded={pinned ? true : open}
            aria-label={collapseAriaLabel}
            onClick={() => !pinned && onOpenChange(!open)}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                pinned ? 'text-text-muted' : 'text-text-secondary',
                (pinned || open) && 'rotate-180'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
          {pinned
            ? 'Снимите закрепление (гвоздик), чтобы сворачивать блок'
            : open
              ? 'Свернуть'
              : 'Развернуть'}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 shrink-0 p-0',
              pinned ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            )}
            aria-pressed={pinned}
            aria-label={pinned ? 'Снять закрепление блока' : 'Закрепить блок развёрнутым'}
            onClick={() => {
              if (pinned) onPinnedChange(false);
              else {
                onPinnedChange(true);
                onOpenChange(true);
              }
            }}
          >
            <Pin
              className={cn('h-3.5 w-3.5', pinned && 'fill-accent-primary/40')}
              strokeWidth={2.25}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
          {pinned
            ? 'Снять закрепление — затем можно сворачивать шевроном'
            : 'Закрепить: блок всегда развёрнут, шеврон отключён'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
