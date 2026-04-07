'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProductionData } from '@/hooks/use-production-data';
import { exportToCSV } from '@/lib/production-export-utils';
import { Calendar, Download, Loader2, ArrowUpRight } from 'lucide-react';

export function FinancialCalendarPanel() {
  const { data: calendar, loading, refetch } = useProductionData<Array<{
    due_date: string;
    amount: number;
    currency: string;
    sku_id?: string;
    milestone?: string;
    status?: string;
  }>>('/plm/finance/calendar', []);

  const handleExport = () => {
    const rows = (Array.isArray(calendar) ? calendar : []).map((c) => ({
      due_date: c.due_date,
      milestone: c.milestone || '—',
      amount: c.amount,
      currency: 'RUB',
    }));
    exportToCSV(rows, [
      { key: 'due_date', label: 'Дата' },
      { key: 'milestone', label: 'Milestone' },
      { key: 'amount', label: 'Сумма' },
      { key: 'currency', label: '₽' },
    ], 'financial-calendar');
  };

  const rawItems = Array.isArray(calendar) ? calendar : [];
  const DEMO_ITEMS = [
    { due_date: '2026-03-15', amount: 350000, currency: 'RUB', milestone: 'Аванс за пошив', sku_id: 'TP-9921', status: 'planned' },
    { due_date: '2026-03-25', amount: 180000, currency: 'RUB', milestone: 'Материалы Silk Satin', sku_id: 'SS26', status: 'planned' },
    { due_date: '2026-04-05', amount: 250000, currency: 'RUB', milestone: 'Финальный платёж за пошив', sku_id: 'PO-2026-001', status: 'invoiced' },
  ];
  const items = rawItems.length > 0 ? rawItems : DEMO_ITEMS;
  const isDemo = rawItems.length === 0 && !loading;
  const totalAmount = items.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <Card className="border border-slate-200 rounded-2xl overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-xs font-black uppercase flex items-center gap-2 shrink-0">
          <Calendar className="h-4 w-4 text-indigo-600" />
          Финансовый календарь
        </CardTitle>
        <div className="flex gap-2 items-center shrink-0">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          {isDemo && <Badge variant="outline" className="text-[8px] text-amber-600 border-amber-200">Демо</Badge>}
          <Badge variant="secondary" className="text-[9px]">Всего: {totalAmount.toLocaleString('ru-RU')} ₽</Badge>
          <Button variant="outline" size="sm" className="h-7 text-[8px] px-2" asChild>
            <Link href="/brand/calendar?layers=production,finance,orders"><ArrowUpRight className="h-3 w-3 mr-1" /> Strategic Planner</Link>
          </Button>
          <button onClick={handleExport} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Экспорт">
            <Download className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 min-h-[120px]">
        {items.length === 0 ? (
          <p className="text-[10px] text-slate-400 py-8 text-center">Нет запланированных платежей</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {items.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                <div>
                  <p className="text-[10px] font-bold text-slate-900">{c.milestone || 'Платёж'}</p>
                  <p className="text-[9px] text-slate-500">{new Date(c.due_date).toLocaleDateString('ru-RU')} · {c.sku_id || '—'}</p>
                </div>
                <span className="font-black tabular-nums text-sm">{c.amount?.toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
