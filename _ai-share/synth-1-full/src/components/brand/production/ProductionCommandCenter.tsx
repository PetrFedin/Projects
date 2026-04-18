'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  LayoutDashboard,
  AlertTriangle,
  Calendar,
  Package,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useProductionData } from '@/hooks/use-production-data';
import { exportToCSV } from '@/lib/production-export-utils';
import { cn } from '@/lib/utils';

interface ProductionCommandCenterProps {
  onNavigate?: (tab: string) => void;
}

export function ProductionCommandCenter({ onNavigate }: ProductionCommandCenterProps) {
  const {
    data: calendar,
    loading: calLoading,
    refetch: refetchCal,
  } = useProductionData<
    Array<{
      due_date: string;
      amount: number;
      currency: string;
      sku_id?: string;
      milestone?: string;
    }>
  >('/plm/finance/calendar', []);

  const {
    data: alerts,
    loading: alertsLoading,
    refetch: refetchAlerts,
  } = useProductionData<
    Array<{
      type: string;
      milestone: string;
      order_id: string;
      deadline: string;
      requires_signoff?: boolean;
    }>
  >('/plm/critical-path/alerts', []);

  const {
    data: inventory,
    loading: invLoading,
    refetch: refetchInv,
  } = useProductionData<{
    finished_goods: Array<{
      sku_id: string;
      on_hand: number;
      allocated: number;
      available: number;
    }>;
    raw_materials: Array<{ material_id: string; current_qty: number; status: string }>;
  }>('/plm/inventory/snapshot', { finished_goods: [], raw_materials: [] });

  const loading = calLoading || alertsLoading || invLoading;

  const handleExport = () => {
    const rows = (calendar as Array<Record<string, unknown>>).map((c: Record<string, unknown>) => ({
      due_date: c.due_date != null ? String(c.due_date) : '',
      amount: c.amount != null ? String(c.amount) : '',
      currency: 'RUB',
      milestone: c.milestone != null ? String(c.milestone) : '',
    }));
    exportToCSV(
      rows,
      [
        { key: 'due_date', label: 'Дата' },
        { key: 'milestone', label: 'Milestone' },
        { key: 'amount', label: 'Сумма' },
        { key: 'currency', label: 'Валюта (RUB)' },
      ],
      'command-center'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
<<<<<<< HEAD
          <LayoutDashboard className="h-4 w-4 text-indigo-600" />
=======
          <LayoutDashboard className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
          Command Center
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchCal();
              refetchAlerts();
              refetchInv();
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[9px] font-bold uppercase"
            onClick={handleExport}
          >
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Критичные алерты */}
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-2xl border border-slate-200">
          <CardHeader className="border-b border-slate-100 p-4 pb-2">
=======
        <Card className="border-border-default overflow-hidden rounded-2xl border">
          <CardHeader className="border-border-subtle border-b p-4 pb-2">
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Алерты (24ч)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {Array.isArray(alerts) && alerts.length > 0 ? (
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {alerts.slice(0, 5).map((a, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-[10px]"
                  >
<<<<<<< HEAD
                    <p className="font-bold text-slate-900">{a.milestone}</p>
                    <p className="text-slate-500">
=======
                    <p className="text-text-primary font-bold">{a.milestone}</p>
                    <p className="text-text-secondary">
>>>>>>> recover/cabinet-wip-from-stash
                      PO: {a.order_id} · {new Date(a.deadline).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-[10px]">Нет срочных алертов</p>
            )}
          </CardContent>
        </Card>

        {/* Финансовый календарь */}
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-2xl border border-slate-200">
          <CardHeader className="border-b border-slate-100 p-4 pb-2">
=======
        <Card className="border-border-default overflow-hidden rounded-2xl border">
          <CardHeader className="border-border-subtle border-b p-4 pb-2">
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
              <Calendar className="h-4 w-4 text-emerald-500" />
              Ближайшие платежи
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {Array.isArray(calendar) && calendar.length > 0 ? (
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {calendar.slice(0, 5).map((c, i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-[10px]"
=======
                    className="bg-bg-surface2 flex items-center justify-between rounded-xl p-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div>
                      <p className="text-text-primary font-bold">{c.milestone || 'Платёж'}</p>
                      <p className="text-text-secondary">
                        {new Date(c.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-black tabular-nums">
                      {c.amount?.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-[10px]">Нет предстоящих платежей</p>
            )}
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-[9px]"
                onClick={() => onNavigate('finance')}
              >
                К финансовому календарю <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Остатки */}
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-2xl border border-slate-200">
          <CardHeader className="border-b border-slate-100 p-4 pb-2">
=======
        <Card className="border-border-default overflow-hidden rounded-2xl border">
          <CardHeader className="border-border-subtle border-b p-4 pb-2">
>>>>>>> recover/cabinet-wip-from-stash
            <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
              <Package className="h-4 w-4 text-blue-500" />
              Остатки
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
<<<<<<< HEAD
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="font-bold text-slate-500">Готовая продукция</p>
                <p className="text-lg font-black text-slate-900">
                  {inventory?.finished_goods?.length ?? 0} SKU
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2">
                <p className="font-bold text-slate-500">Сырьё</p>
                <p className="text-lg font-black text-slate-900">
=======
              <div className="bg-bg-surface2 rounded-xl p-2">
                <p className="text-text-secondary font-bold">Готовая продукция</p>
                <p className="text-text-primary text-lg font-black">
                  {inventory?.finished_goods?.length ?? 0} SKU
                </p>
              </div>
              <div className="bg-bg-surface2 rounded-xl p-2">
                <p className="text-text-secondary font-bold">Сырьё</p>
                <p className="text-text-primary text-lg font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {inventory?.raw_materials?.length ?? 0} лотов
                </p>
              </div>
            </div>
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-[9px]"
                onClick={() => onNavigate('materials')}
              >
                К снабжению <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
