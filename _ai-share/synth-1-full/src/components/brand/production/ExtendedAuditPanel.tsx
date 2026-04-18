'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  History,
  User,
  Clock,
  Download,
  Filter,
  FileText,
  GitCompare,
  Package,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { exportToCSV } from '@/lib/production-export-utils';
import { cn } from '@/lib/utils';

export interface AuditEntry {
  id: number;
  action: string;
  actionLabel: string;
  entity: string;
  collection: string;
  user: string;
  time: string;
  detail: string;
  ip?: string;
  sessionId?: string;
  entityType?: 'bom' | 'sample' | 'po' | 'status';
  diff?: { field: string; from: string; to: string }[];
}

export interface ExtendedAuditPanelProps {
  entries: AuditEntry[];
  collectionIds: string[];
  onFilterChange?: (filter: {
    user?: string;
    entity?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onExport?: (format: 'csv' | 'json') => void;
  poAmendments?: Array<{
    poId: string;
    version: number;
    date: string;
    user: string;
    reason: string;
  }>;
  bomVersions?: Array<{ skuId: string; version: string; date: string; changes: string }>;
}

export function ExtendedAuditPanel({
  entries,
  collectionIds,
  onFilterChange,
  onExport,
  poAmendments = [],
  bomVersions = [],
}: ExtendedAuditPanelProps) {
  const [filter, setFilter] = useState<'all' | 'bom' | 'sample' | 'po' | 'status'>('all');
  const [userFilter, setUserFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'log' | 'bom_history' | 'po_amendments'>('log');

  const filteredEntries = useMemo(() => {
    let list = entries.filter(
      (a) => collectionIds.length === 0 || collectionIds.includes(a.collection)
    );
    if (filter !== 'all') list = list.filter((a) => a.action === filter);
    if (userFilter.trim())
      list = list.filter((a) => a.user.toLowerCase().includes(userFilter.toLowerCase()));
    if (entityFilter.trim())
      list = list.filter((a) => a.entity.toLowerCase().includes(entityFilter.toLowerCase()));
    return list.sort((a, b) => b.id - a.id);
  }, [entries, collectionIds, filter, userFilter, entityFilter]);

  const handleExport = (format: 'csv' | 'json') => {
    const rows = filteredEntries.map((a) => ({
      action: a.actionLabel,
      entity: a.entity,
      collection: a.collection,
      detail: a.detail,
      user: a.user,
      time: a.time,
      ip: a.ip,
    }));
    exportToCSV(
      rows,
      [
        { key: 'action', label: 'Действие' },
        { key: 'entity', label: 'Сущность' },
        { key: 'collection', label: 'Коллекция' },
        { key: 'detail', label: 'Детали' },
        { key: 'user', label: 'Пользователь' },
        { key: 'time', label: 'Время' },
      ],
      'audit-extended'
    );
    onExport?.(format);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {(['log', 'bom_history', 'po_amendments'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                  viewMode === v
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {v === 'log' ? 'Лог' : v === 'bom_history' ? 'BOM версии' : 'PO amendments'}
              </button>
            ))}
          </div>
          {viewMode === 'log' && (
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(['all', 'bom', 'sample', 'po', 'status'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={cn(
                    'rounded-lg px-2 py-1 text-[8px] font-bold uppercase transition-all',
                    filter === v
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {v === 'all'
                    ? 'Все'
                    : v === 'bom'
                      ? 'BOM'
                      : v === 'sample'
                        ? 'Сэмплы'
                        : v === 'po'
                          ? 'PO'
                          : 'Статусы'}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-[9px] font-bold uppercase"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
        </div>
      </div>

      {viewMode === 'log' && (
        <>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
            <Input
              placeholder="Пользователь"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="h-8 rounded-lg text-[9px]"
            />
            <Input
              placeholder="Сущность (TP-xxx, PO-xxx)"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-8 rounded-lg text-[9px]"
            />
            <Input
              type="date"
              placeholder="Дата от"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 rounded-lg text-[9px]"
            />
            <Input
              type="date"
              placeholder="Дата до"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 rounded-lg text-[9px]"
            />
          </div>

          <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative ml-4 space-y-0 border-l-2 border-slate-100 py-4 pl-6">
              {filteredEntries.length === 0 ? (
                <div className="mx-4 rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center">
                  <History className="mx-auto mb-2 h-10 w-10 text-slate-200" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Нет записей
                  </p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="relative pb-6 pl-4 last:pb-0">
                    <div className="absolute -left-[21px] top-0 z-10 h-4 w-4 rounded-full border-2 border-indigo-500 bg-white shadow-sm" />
                    <div
                      className={cn(
                        'flex cursor-pointer flex-col gap-2 rounded-xl border p-3.5 transition-colors sm:flex-row sm:items-start',
                        expandedId === entry.id
                          ? 'border-indigo-200 bg-indigo-50/50'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      )}
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={cn(
                            'h-5 border-none px-2 text-[8px] font-black uppercase',
                            entry.action === 'bom'
                              ? 'bg-indigo-50 text-indigo-600'
                              : entry.action === 'sample'
                                ? 'bg-emerald-50 text-emerald-600'
                                : entry.action === 'po'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-slate-200 text-slate-600'
                          )}
                        >
                          {entry.actionLabel}
                        </Badge>
                        <span className="text-[9px] font-bold uppercase text-slate-400">
                          {entry.entity}
                        </span>
                        <Badge variant="outline" className="border-slate-200 text-[8px]">
                          {entry.collection}
                        </Badge>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-900">{entry.detail}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-400">
                          <User className="h-3 w-3" /> {entry.user} • <Clock className="h-3 w-3" />{' '}
                          {entry.time}
                          {entry.ip && ` • IP: ${entry.ip}`}
                        </p>
                        {expandedId === entry.id && entry.diff && entry.diff.length > 0 && (
                          <div className="mt-3 space-y-1 rounded-lg border border-slate-200 bg-slate-100 p-3">
                            <p className="mb-2 text-[9px] font-black uppercase text-slate-500">
                              Diff
                            </p>
                            {entry.diff.map((d, i) => (
                              <div key={i} className="flex gap-2 font-mono text-[9px]">
                                <span className="text-rose-500">{d.from}</span>
                                <span>→</span>
                                <span className="text-emerald-600">{d.to}</span>
                                <span className="text-slate-400">({d.field})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {entry.diff && entry.diff.length > 0 && (
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-slate-400 transition-transform',
                            expandedId === entry.id && 'rotate-90'
                          )}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}

      {viewMode === 'bom_history' && (
        <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            {bomVersions.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-100 py-12 text-center">
                <FileText className="mx-auto mb-2 h-10 w-10 text-slate-200" />
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  История BOM — выбор артикула
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {bomVersions.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[8px]">
                        {v.skuId}
                      </Badge>
                      <span className="text-[10px] font-bold">{v.version}</span>
                      <span className="text-[9px] text-slate-400">{v.date}</span>
                    </div>
                    <p className="text-[9px] text-slate-600">{v.changes}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'po_amendments' && (
        <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            {poAmendments.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-100 py-12 text-center">
                <Package className="mx-auto mb-2 h-10 w-10 text-slate-200" />
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  История amendments по PO
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {poAmendments.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-[8px] text-amber-700">{a.poId}</Badge>
                      <span className="text-[10px] font-bold">v{a.version}</span>
                      <span className="text-[9px] text-slate-400">
                        {a.date} • {a.user}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-600">{a.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
