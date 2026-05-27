'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Workshop2UxStatusChip } from '@/lib/production/workshop2-ux-phase1-helpers';

const CHIP_TONE_CLASS: Record<Workshop2UxStatusChip['tone'], string> = {
  neutral: 'border-border-subtle bg-bg-surface2/80 text-text-secondary',
  amber: 'border-amber-200/90 bg-amber-50/80 text-amber-950',
  emerald: 'border-emerald-200/90 bg-emerald-50/85 text-emerald-950',
  rose: 'border-rose-200/90 bg-rose-50/80 text-rose-950',
};

export function Workshop2UxStatusChipButton({
  chip,
  expanded,
  onToggle,
}: {
  chip: Workshop2UxStatusChip;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 text-left text-[10px] font-medium leading-snug transition-colors',
        CHIP_TONE_CLASS[chip.tone],
        expanded && 'ring-border-subtle ring-1'
      )}
      title={chip.hintRu}
      onClick={onToggle}
      data-testid={`workshop2-ux-chip-${chip.id}`}
    >
      <span className="truncate">{chip.label}</span>
      {(chip.hintRu || chip.detailRu) && (
        <ChevronDown
          className={cn(
            'h-3 w-3 shrink-0 opacity-70 transition-transform',
            expanded && 'rotate-180'
          )}
          aria-hidden
        />
      )}
    </button>
  );
}

/** Компактная строка chips; клик раскрывает detail под строкой. */
export function Workshop2UxStatusChipsRow({
  chips,
  className,
  'data-testid': testId,
}: {
  chips: Workshop2UxStatusChip[];
  className?: string;
  'data-testid'?: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expanded = chips.find((c) => c.id === expandedId);

  if (!chips.length) return null;

  return (
    <div className={cn('space-y-1.5', className)} data-testid={testId}>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <Workshop2UxStatusChipButton
            key={chip.id}
            chip={chip}
            expanded={expandedId === chip.id}
            onToggle={() => setExpandedId((prev) => (prev === chip.id ? null : chip.id))}
          />
        ))}
      </div>
      {expanded && (expanded.hintRu || expanded.detailRu) ? (
        <p className="text-text-secondary border-border-subtle bg-bg-surface2/50 rounded border px-2 py-1 text-[10px] leading-snug">
          {expanded.detailRu ?? expanded.hintRu}
        </p>
      ) : null}
    </div>
  );
}

/** Collapsible block для workspace status stack (Phase 1A #1). */
export function Workshop2WorkspaceStatusCollapsible({
  chips,
  defaultCollapsed,
  className,
}: {
  chips: Workshop2UxStatusChip[];
  defaultCollapsed: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(!defaultCollapsed);
  const hasAttention = chips.some((c) => c.tone === 'amber' || c.tone === 'rose');

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn('border-border-subtle bg-bg-surface2/40 rounded-lg border', className)}
      data-testid="workshop2-workspace-status-collapsible"
    >
      <CollapsibleTrigger className="hover:bg-bg-surface2/60 flex w-full items-center justify-between gap-2 px-3 py-2 text-left">
        <span className="text-text-primary text-[11px] font-semibold">Статус workspace</span>
        <span className="flex items-center gap-2">
          {hasAttention && !open ? (
            <span className="text-[9px] font-medium text-amber-800">есть замечания</span>
          ) : (
            <span className="text-text-muted text-[9px]">{chips.length} показателей</span>
          )}
          <ChevronDown
            className={cn('text-text-muted h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-border-subtle border-t px-3 pb-3 pt-2">
        <Workshop2UxStatusChipsRow chips={chips} />
      </CollapsibleContent>
    </Collapsible>
  );
}
