'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';
import type { LiveProcessTeamMember } from '@/lib/live-process/types';

export type ProcessFilterState = {
  statuses: ('not_started' | 'in_progress' | 'done')[];
  assigneeIds: string[];
  dateFrom: string | null;
  dateTo: string | null;
  contextIds: string[];
};

const defaultFilters: ProcessFilterState = {
  statuses: [],
  assigneeIds: [],
  dateFrom: null,
  dateTo: null,
  contextIds: [],
};

interface ProcessFiltersProps {
  team: LiveProcessTeamMember[];
  contextLabels: { id: string; label: string }[];
  filters: ProcessFilterState;
  onChange: (f: ProcessFilterState) => void;
}

export function ProcessFilters({ team, contextLabels, filters, onChange }: ProcessFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.statuses.length ? 1 : 0) +
    (filters.assigneeIds.length ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.contextIds.length ? 1 : 0);

  const toggleStatus = (s: 'not_started' | 'in_progress' | 'done') => {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter((x) => x !== s)
      : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  };

  const toggleAssignee = (id: string) => {
    const next = filters.assigneeIds.includes(id)
      ? filters.assigneeIds.filter((x) => x !== id)
      : [...filters.assigneeIds, id];
    onChange({ ...filters, assigneeIds: next });
  };

  const toggleContext = (id: string) => {
    const next = filters.contextIds.includes(id)
      ? filters.contextIds.filter((x) => x !== id)
      : [...filters.contextIds, id];
    onChange({ ...filters, contextIds: next });
  };

  const clearAll = () => {
    onChange(defaultFilters);
    setOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Фильтры
            {activeCount > 0 && (
              <span className="ml-1.5 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-700">
                {activeCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>По статусу</DropdownMenuLabel>
          {(['not_started', 'in_progress', 'done'] as const).map((s) => (
            <DropdownMenuCheckboxItem
              key={s}
              checked={filters.statuses.includes(s)}
              onCheckedChange={() => toggleStatus(s)}
            >
              {s === 'not_started' ? 'Не начато' : s === 'in_progress' ? 'В работе' : 'Готово'}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>По ответственному</DropdownMenuLabel>
          {team.map((t) => (
            <DropdownMenuCheckboxItem
              key={t.id}
              checked={filters.assigneeIds.includes(t.id)}
              onCheckedChange={() => toggleAssignee(t.id)}
            >
              {t.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>По дате</DropdownMenuLabel>
          <div className="space-y-2 px-2 py-1.5">
            <input
              type="date"
              className="w-full rounded border px-2 py-1 text-sm"
              value={filters.dateFrom ?? ''}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || null })}
              placeholder="С"
            />
            <input
              type="date"
              className="w-full rounded border px-2 py-1 text-sm"
              value={filters.dateTo ?? ''}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value || null })}
              placeholder="По"
            />
          </div>
          {contextLabels.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>По контексту</DropdownMenuLabel>
              {contextLabels.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={filters.contextIds.includes(c.id)}
                  onCheckedChange={() => toggleContext(c.id)}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
          {activeCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={clearAll}>
                <X className="mr-1 h-4 w-4" />
                Сбросить
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
