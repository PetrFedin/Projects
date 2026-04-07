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
  ChevronRight
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
  onFilterChange?: (filter: { user?: string; entity?: string; dateFrom?: string; dateTo?: string }) => void;
  onExport?: (format: 'csv' | 'json') => void;
  poAmendments?: Array<{ poId: string; version: number; date: string; user: string; reason: string }>;
  bomVersions?: Array<{ skuId: string; version: string; date: string; changes: string }>;
}

export function ExtendedAuditPanel({
  entries,
  collectionIds,
  onFilterChange,
  onExport,
  poAmendments = [],
  bomVersions = []
}: ExtendedAuditPanelProps) {
  const [filter, setFilter] = useState<'all' | 'bom' | 'sample' | 'po' | 'status'>('all');
  const [userFilter, setUserFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'log' | 'bom_history' | 'po_amendments'>('log');

  const filteredEntries = useMemo(() => {
    let list = entries.filter((a) => collectionIds.length === 0 || collectionIds.includes(a.collection));
    if (filter !== 'all') list = list.filter((a) => a.action === filter);
    if (userFilter.trim()) list = list.filter((a) => a.user.toLowerCase().includes(userFilter.toLowerCase()));
    if (entityFilter.trim()) list = list.filter((a) => a.entity.toLowerCase().includes(entityFilter.toLowerCase()));
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
      ip: a.ip
    }));
    exportToCSV(
      rows,
      [
        { key: 'action', label: 'Действие' },
        { key: 'entity', label: 'Сущность' },
        { key: 'collection', label: 'Коллекция' },
        { key: 'detail', label: 'Детали' },
        { key: 'user', label: 'Пользователь' },
        { key: 'time', label: 'Время' }
      ],
      'audit-extended'
    );
    onExport?.(format);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['log', 'bom_history', 'po_amendments'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all',
                  viewMode === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {v === 'log' ? 'Лог' : v === 'bom_history' ? 'BOM версии' : 'PO amendments'}
              </button>
            ))}
          </div>
          {viewMode === 'log' && (
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['all', 'bom', 'sample', 'po', 'status'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={cn(
                    'px-2 py-1 rounded-lg text-[8px] font-bold uppercase transition-all',
                    filter === v ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {v === 'all' ? 'Все' : v === 'bom' ? 'BOM' : v === 'sample' ? 'Сэмплы' : v === 'po' ? 'PO' : 'Статусы'}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase gap-1" onClick={() => handleExport('csv')}>
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      {viewMode === 'log' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Input
              placeholder="Пользователь"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="h-8 text-[9px] rounded-lg"
            />
            <Input
              placeholder="Сущность (TP-xxx, PO-xxx)"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-8 text-[9px] rounded-lg"
            />
            <Input
              type="date"
              placeholder="Дата от"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-[9px] rounded-lg"
            />
            <Input
              type="date"
              placeholder="Дата до"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-[9px] rounded-lg"
            />
          </div>

          <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="relative border-l-2 border-slate-100 ml-4 pl-6 py-4 space-y-0">
              {filteredEntries.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl mx-4">
                  <History className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Нет записей</p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="relative pl-4 pb-6 last:pb-0">
                    <div className="absolute -left-[21px] top-0 h-4 w-4 rounded-full bg-white border-2 border-indigo-500 shadow-sm z-10" />
                    <div
                      className={cn(
                        'flex flex-col sm:flex-row sm:items-start gap-2 p-3.5 rounded-xl border transition-colors cursor-pointer',
                        expandedId === entry.id ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
                      )}
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={cn(
                            'text-[8px] font-black uppercase px-2 h-5 border-none',
                            entry.action === 'bom' ? 'bg-indigo-50 text-indigo-600' : entry.action === 'sample' ? 'bg-emerald-50 text-emerald-600' : entry.action === 'po' ? 'bg-amber-50 text-amber-600' : 'bg-slate-200 text-slate-600'
                          )}
                        >
                          {entry.actionLabel}
                        </Badge>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{entry.entity}</span>
                        <Badge variant="outline" className="text-[8px] border-slate-200">{entry.collection}</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-900">{entry.detail}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 flex items-center gap-1.5">
                          <User className="w-3 h-3" /> {entry.user} • <Clock className="w-3 h-3" /> {entry.time}
                          {entry.ip && ` • IP: ${entry.ip}`}
                        </p>
                        {expandedId === entry.id && entry.diff && entry.diff.length > 0 && (
                          <div className="mt-3 p-3 bg-slate-100 rounded-lg border border-slate-200 space-y-1">
                            <p className="text-[9px] font-black uppercase text-slate-500 mb-2">Diff</p>
                            {entry.diff.map((d, i) => (
                              <div key={i} className="text-[9px] font-mono flex gap-2">
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
                        <ChevronRight className={cn('w-4 h-4 text-slate-400 transition-transform', expandedId === entry.id && 'rotate-90')} />
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
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            {bomVersions.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <FileText className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">История BOM — выбор артикула</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bomVersions.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[8px]">{v.skuId}</Badge>
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
        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            {poAmendments.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <Package className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">История amendments по PO</p>
              </div>
            ) : (
              <div className="space-y-2">
                {poAmendments.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700 text-[8px]">{a.poId}</Badge>
                      <span className="text-[10px] font-bold">v{a.version}</span>
                      <span className="text-[9px] text-slate-400">{a.date} • {a.user}</span>
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
