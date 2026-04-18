'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, AlertTriangle, BarChart3, Copy, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CollectionFiltersAndRiskProps {
  collections: Array<{
    id: string;
    name: string;
    status?: string;
    priority?: string;
    responsible?: string;
    type?: string;
  }>;
  selectedIds: string[];
  onFilter: (filter: {
    search?: string;
    status?: string;
    priority?: string;
    responsible?: string;
  }) => void;
  onCompare: (ids: string[]) => void;
  onTemplateFrom?: (id: string) => void;
  riskForecast?: { collectionId: string; risk: 'low' | 'medium' | 'high'; message: string }[];
}

export function CollectionFiltersAndRisk({
  collections,
  selectedIds,
  onFilter,
  onCompare,
  onTemplateFrom,
  riskForecast = [],
}: CollectionFiltersAndRiskProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const statuses = Array.from(new Set(collections.map((c) => c.status).filter(Boolean)));
  const priorities = Array.from(new Set(collections.map((c) => c.priority).filter(Boolean)));
  const responsibles = Array.from(new Set(collections.map((c) => c.responsible).filter(Boolean)));

  const apply = () => {
    onFilter({
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    });
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const runCompare = () => {
    if (compareIds.length >= 2) onCompare(compareIds);
  };

  const risks =
    riskForecast.length > 0
      ? riskForecast
      : collections.slice(0, 3).map((c) => ({
          collectionId: c.id,
          risk: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
          message:
            c.status === 'Development' ? 'Риск срыва дедлайна: материалов нет' : 'Сроки в норме',
        }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[160px] max-w-xs flex-1">
          <Input
            placeholder="Поиск коллекций..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            className="h-8 pl-9 text-[10px]"
          />
          <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            onFilter({ status: v !== 'all' ? v : undefined });
          }}
        >
          <SelectTrigger className="h-8 w-[120px] text-[10px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">
              Все статусы
            </SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s!} className="text-[10px]">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={(v) => {
            setPriorityFilter(v);
            onFilter({ priority: v !== 'all' ? v : undefined });
          }}
        >
          <SelectTrigger className="h-8 w-[110px] text-[10px]">
            <SelectValue placeholder="Приоритет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-[10px]">
              Все
            </SelectItem>
            {priorities.map((p) => (
              <SelectItem key={p} value={p!} className="text-[10px]">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="h-8 text-[9px]" onClick={apply}>
          Применить
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-[9px]"
          onClick={() => setExpanded(!expanded)}
        >
          <BarChart3 className="mr-1 h-3.5 w-3.5" /> Сравнить
        </Button>
      </div>

      {expanded && (
        <Card className="rounded-xl border border-slate-100 shadow-sm">
          <CardHeader className="px-4 py-2">
            <CardTitle className="text-[10px] font-black uppercase">
              Сравнение коллекций (выберите 2–3)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="mb-2 flex flex-wrap gap-2">
              {collections.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCompare(c.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                    compareIds.includes(c.id)
                      ? 'border-indigo-300 bg-indigo-100 text-indigo-700'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              className="h-7 text-[9px]"
              onClick={runCompare}
              disabled={compareIds.length < 2}
            >
              <BarChart3 className="mr-1 h-3 w-3" /> Сравнить
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {risks.slice(0, 5).map((r) => {
          const coll = collections.find((c) => c.id === r.collectionId);
          return (
            <div
              key={r.collectionId}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-[10px]',
                r.risk === 'high'
                  ? 'border-rose-200 bg-rose-50'
                  : r.risk === 'medium'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-emerald-200 bg-emerald-50'
              )}
            >
              <AlertTriangle
                className={cn(
                  'h-4 w-4 shrink-0',
                  r.risk === 'high'
                    ? 'text-rose-500'
                    : r.risk === 'medium'
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                )}
              />
              <span className="font-bold">{coll?.name || r.collectionId}</span>
              <span className="text-slate-600">{r.message}</span>
              {onTemplateFrom && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-6 text-[8px]"
                  onClick={() => onTemplateFrom(r.collectionId)}
                >
                  <Copy className="mr-0.5 h-3 w-3" /> Шаблон
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
