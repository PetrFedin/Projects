'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Workshop2CeilingEnvStatusPanel,
  type Workshop2CeilingEnvStatusPanelProps,
} from '@/components/brand/production/Workshop2CeilingEnvStatusPanel';
import {
  WORKSHOP2_LIVE_INTEGRATION_LABELS,
  type Workshop2LiveIntegrationKind,
} from '@/lib/production/workshop2-integration-live-required';

/** Единый collapsible «Integration status» вместо LiveIntegration + Ceiling (Phase 1B). */
export function Workshop2CeilingIntegrationBlock(
  props: Workshop2CeilingEnvStatusPanelProps & { kind: Workshop2LiveIntegrationKind }
) {
  const { kind, ...ceilingProps } = props;
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg border border-amber-200/80 bg-amber-50/50"
      data-testid={`workshop2-ceiling-integration-${ceilingProps.catalogId}`}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-amber-50/80">
        <span className="text-[11px] font-semibold text-amber-950">Статус интеграций</span>
        <span className="flex items-center gap-2">
          <span className="max-w-[12rem] truncate text-[9px] text-amber-800/90 sm:max-w-none">
            {WORKSHOP2_LIVE_INTEGRATION_LABELS[kind]}
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-amber-800 transition-transform',
              open && 'rotate-180'
            )}
            aria-hidden
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-amber-200/60 px-3 pb-3 pt-2">
        <Workshop2CeilingEnvStatusPanel {...ceilingProps} kind={kind} />
      </CollapsibleContent>
    </Collapsible>
  );
}
