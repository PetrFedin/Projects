'use client';

import type { ReactNode } from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PRODUCTION_FLOOR_STEPS, type ProductionFloorTabId } from '@/lib/production/floor-flow';

type Props = {
  tab: ProductionFloorTabId;
  className?: string;
  children: ReactNode;
  /** Без выбранного артикула на вкладке «Коллекция» — недоступно. */
  disabled?: boolean;
  disabledHint?: string;
};

export function ProductionFloorTabWithHint({
  tab,
  className,
  children,
  disabled,
  disabledHint,
}: Props) {
  const hint = PRODUCTION_FLOOR_STEPS.find((s) => s.id === tab)?.hint ?? '';
  const content = disabled && disabledHint ? disabledHint : hint;
  return (
    <Tooltip delayDuration={280}>
      <TooltipTrigger asChild>
        <span className={disabled ? 'inline-flex cursor-not-allowed' : 'inline-flex'}>
          <TabsTrigger value={tab} className={className} disabled={disabled}>
            {children}
          </TabsTrigger>
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-[min(100vw-2rem,28rem)] border-slate-200 bg-slate-900 text-[11px] leading-snug text-slate-50 shadow-lg"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
