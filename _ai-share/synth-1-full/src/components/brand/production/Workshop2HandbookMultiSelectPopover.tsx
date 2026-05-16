'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
  options: { parameterId: string; label: string }[];
  parts: { parameterId: string; displayLabel: string }[];
  onPartsChange: (next: { parameterId: string; displayLabel: string }[]) => void;
  className?: string;
  catalogAttributeId?: string;
  /** Не больше стольких значений (остальные чекбоксы неактивны, пока не снимете выбор). */
  maxSelections?: number;
  resolveDisplayLabel: (attributeId: string | undefined, parameterId: string, stored: string) => string;
};

/** Выпадающий список с чекбоксами (несколько значений справочника). */
export function Workshop2HandbookMultiSelectPopover({
  options,
  parts,
  onPartsChange,
  className,
  catalogAttributeId,
  maxSelections,
  resolveDisplayLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [filterQ, setFilterQ] = useState('');
  const selected = new Set(parts.map((p) => p.parameterId));
  const summary =
    parts.length === 0
      ? '—'
      : parts.length <= 2
        ? parts
            .map((p) => resolveDisplayLabel(catalogAttributeId, p.parameterId, p.displayLabel))
            .join(', ')
        : `${parts.length} выбрано`;

  const needle = filterQ.trim().toLowerCase();
  const filteredOptions =
    needle.length === 0
      ? options
      : options.filter(
          (o) =>
            o.label.toLowerCase().includes(needle) || o.parameterId.toLowerCase().includes(needle)
        );

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setFilterQ('');
  };

  const atCap =
    maxSelections != null &&
    Number.isFinite(maxSelections) &&
    maxSelections >= 0 &&
    selected.size >= maxSelections;

  const toggle = (parameterId: string) => {
    const next = new Set(selected);
    if (next.has(parameterId)) next.delete(parameterId);
    else {
      if (atCap) return;
      next.add(parameterId);
    }
    const ordered = options
      .filter((o) => next.has(o.parameterId))
      .map((o) => ({ parameterId: o.parameterId, displayLabel: o.label }));
    onPartsChange(ordered);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'text-text-primary h-9 w-full justify-between gap-2 px-2.5 text-left text-xs font-normal',
            className
          )}
        >
          <span className="truncate">{summary}</span>
          <LucideIcons.ChevronDown
            className="text-text-secondary h-3.5 w-3.5 shrink-0"
            aria-hidden
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(100vw-2rem,22rem)] p-0" align="start">
        <div className="border-border-subtle border-b p-2">
          <Input
            className="h-8 text-xs"
            placeholder="Поиск в фильтре…"
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div className="max-h-64 space-y-1 overflow-y-auto p-2">
          {maxSelections != null &&
          Number.isFinite(maxSelections) &&
          maxSelections >= 0 &&
          atCap ? (
            <p className="text-text-secondary px-2 py-1.5 text-[10px] leading-snug">
              Уже выбрано максимум размеров ({maxSelections}) по паспорту — снимите лишний, чтобы
              добавить другой.
            </p>
          ) : null}
          {options.length === 0 ? (
            <p className="text-text-secondary px-2 py-2 text-[11px]">Нет значений.</p>
          ) : filteredOptions.length === 0 ? (
            <p className="text-text-secondary px-2 py-2 text-[11px]">
              Ничего не найдено — измените запрос.
            </p>
          ) : (
            filteredOptions.map((o) => {
              const checked = selected.has(o.parameterId);
              const disableAdd = !checked && atCap;
              return (
                <label
                  key={o.parameterId}
                  className={cn(
                    'flex items-start gap-2 rounded-md py-1.5 pl-1 pr-2',
                    disableAdd
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-bg-surface2 cursor-pointer'
                  )}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disableAdd}
                    onCheckedChange={() => toggle(o.parameterId)}
                    className="mt-0.5 shrink-0"
                  />
                  <span className="text-text-primary text-xs leading-snug">{o.label}</span>
                </label>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
