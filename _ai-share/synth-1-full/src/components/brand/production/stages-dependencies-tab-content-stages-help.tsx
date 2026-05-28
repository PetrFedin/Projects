'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/** Подсказка по наведению: без «заливки» на hover у иконки — текст в панели. */
export function StagesHelpHover({
  trigger,
  title,
  children,
  align = 'start',
  wide,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  wide?: boolean;
}) {
  const alignProp = align === 'end' ? 'end' : align === 'center' ? 'center' : 'start';
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        align={alignProp}
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          'border-border-default text-text-primary z-[500] border bg-white p-0 shadow-lg',
          'max-h-[min(72vh,32rem)] overflow-y-auto overflow-x-hidden',
          wide
            ? 'w-[min(100vw-1.5rem,28rem)] max-w-[min(100vw-1.5rem,28rem)]'
            : 'w-[min(100vw-1.5rem,24rem)] max-w-[min(100vw-1.5rem,24rem)]'
        )}
      >
        <div className="px-3 py-3 sm:px-4 sm:py-3.5">
          <p className="border-border-subtle text-text-primary border-b pb-2 text-sm font-semibold">
            {title}
          </p>
          <div className="text-text-secondary space-y-2.5 pt-2.5 text-[11px] leading-relaxed">
            {children}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/** Иконка «i»: только смена оттенка текста при hover, без цветного фона. */
const STAGES_HELP_ICON_BTN_CLASS =
  'inline-flex h-8 w-8 shrink-0 cursor-help items-center justify-center rounded-md p-0 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-subtle/70';

/** Radix TooltipTrigger asChild прокидывает ref и onPointer* на потомка — без forwardRef подсказка не открывается. */
export const StagesHelpIconTrigger = React.forwardRef<
  HTMLButtonElement,
  { 'aria-label': string; className?: string } & React.ComponentPropsWithoutRef<'button'>
>(function StagesHelpIconTrigger({ 'aria-label': ariaLabel, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className={cn(STAGES_HELP_ICON_BTN_CLASS, 'relative z-20', className)}
      aria-label={ariaLabel}
    >
      <Info className="pointer-events-none h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
    </button>
  );
});
StagesHelpIconTrigger.displayName = 'StagesHelpIconTrigger';

export function StagesHelpWhyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-border-subtle bg-bg-surface2/90 space-y-1 rounded-md border px-2.5 py-2">
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">{title}</p>
      <div className="text-text-secondary space-y-1 text-[10px] leading-snug">{children}</div>
    </div>
  );
}
