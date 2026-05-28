'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProductionData } from '@/hooks/use-production-data';
import { exportToCSV } from '@/lib/production-export-utils';
import { Calendar, Download, Loader2, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export function FinancialCalendarPanel() {
  const {
    data: calendar,
    loading,
    refetch,
  } = useProductionData<
    Array<{
      due_date: string;
      amount: number;
      currency: string;
      sku_id?: string;
      milestone?: string;
      status?: string;
    }>
  >('/plm/finance/calendar', []);

  const handleExport = () => {
    const rows = (Array.isArray(calendar) ? calendar : []).map((c) => ({
      due_date: c.due_date,
      milestone: c.milestone || '—',
      amount: c.amount,
      currency: 'RUB',
    }));
    exportToCSV(
      rows,
      [
        { key: 'due_date', label: 'Дата' },
        { key: 'milestone', label: 'Milestone' },
        { key: 'amount', label: 'Сумма' },
        { key: 'currency', label: '₽' },
      ],
      'financial-calendar'
    );
  };

  const rawItems = Array.isArray(calendar) ? calendar : [];
  const DEMO_ITEMS = [
    {
      due_date: '2026-03-15',
      amount: 350000,
      currency: 'RUB',
      milestone: 'Аванс за пошив',
      sku_id: 'TP-9921',
      status: 'planned',
    },
    {
      due_date: '2026-03-25',
      amount: 180000,
      currency: 'RUB',
      milestone: 'Материалы Silk Satin',
      sku_id: 'SS26',
      status: 'planned',
    },
    {
      due_date: '2026-04-05',
      amount: 250000,
      currency: 'RUB',
      milestone: 'Финальный платёж за пошив',
      sku_id: 'PO-2026-001',
      status: 'invoiced',
    },
  ];
  const items = rawItems.length > 0 ? rawItems : DEMO_ITEMS;
  const isDemo = rawItems.length === 0 && !loading;
  const totalAmount = items.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <Card className="border-border-default overflow-hidden rounded-2xl border">
      <CardHeader className="border-border-subtle flex flex-row items-center justify-between gap-3 border-b p-4">
        <CardTitle className="flex shrink-0 items-center gap-2 text-xs font-black uppercase">
          <Calendar className="text-accent-primary h-4 w-4" />
          Финансовый календарь
        </CardTitle>
        <div className="flex shrink-0 items-center gap-2">
          {loading && <Loader2 className="text-text-muted h-4 w-4 animate-spin" />}
          {isDemo && (
            <Badge variant="outline" className="border-amber-200 text-[8px] text-amber-600">
              Демо
            </Badge>
          )}
          <Badge variant="secondary" className="text-[9px]">
            Всего: {totalAmount.toLocaleString('ru-RU')} ₽
          </Badge>
          <Button variant="outline" size="sm" className="h-7 px-2 text-[8px]" asChild>
            <Link href={`${ROUTES.brand.calendar}?layers=production,finance,orders`}>
              <ArrowUpRight className="mr-1 h-3 w-3" /> Strategic Planner
            </Link>
          </Button>
          <button
            onClick={handleExport}
            className="hover:bg-bg-surface2 rounded-lg p-1.5 transition-colors"
            aria-label="Экспорт"
          >
            <Download className="text-text-secondary h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="min-h-[120px] p-4">
        {items.length === 0 ? (
          <p className="text-text-muted py-8 text-center text-[10px]">
            Нет запланированных платежей
          </p>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {items.map((c, i) => (
              <div
                key={i}
                className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/20 flex items-center justify-between rounded-xl border p-3 transition-all hover:bg-white"
              >
                <div>
                  <p className="text-text-primary text-[10px] font-bold">
                    {c.milestone || 'Платёж'}
                  </p>
                  <p className="text-text-secondary text-[9px]">
                    {new Date(c.due_date).toLocaleDateString('ru-RU')} · {c.sku_id || '—'}
                  </p>
                </div>
                <span className="text-sm font-black tabular-nums">
                  {c.amount?.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
