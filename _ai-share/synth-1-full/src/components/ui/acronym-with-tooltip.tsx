'use client';

import { Info } from 'lucide-react';
import { ABBREVIATIONS_RU, type AbbreviationKey } from '@/lib/i18n/abbreviations-ru';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AcronymWithTooltipProps = {
  abbr: AbbreviationKey;
  className?: string;
  tooltipClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showInfoIcon?: boolean;
};

export function AcronymWithTooltip({
  abbr,
  className,
  tooltipClassName,
  side = 'top',
  showInfoIcon = false,
}: AcronymWithTooltipProps) {
  const entry = ABBREVIATIONS_RU[abbr];
  const tooltipText = entry.descriptionRu
    ? `${entry.titleRu} (${entry.descriptionRu})`
    : entry.titleRu;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex cursor-help items-center gap-1 underline decoration-dotted underline-offset-2',
              className
            )}
          >
            {abbr}
            {showInfoIcon ? <Info className="size-3.5 shrink-0" aria-hidden /> : null}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className={cn('max-w-72 text-xs', tooltipClassName)}>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
