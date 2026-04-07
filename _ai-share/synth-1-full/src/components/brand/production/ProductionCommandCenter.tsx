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
  const { data: calendar, loading: calLoading, refetch: refetchCal } = useProductionData<Array<{
    due_date: string;
    amount: number;
    currency: string;
    sku_id?: string;
    milestone?: string;
  }>>('/plm/finance/calendar', []);

  const { data: alerts, loading: alertsLoading, refetch: refetchAlerts } = useProductionData<Array<{
    type: string;
    milestone: string;
    order_id: string;
    deadline: string;
    requires_signoff?: boolean;
  }>>('/plm/critical-path/alerts', []);

  const { data: inventory, loading: invLoading, refetch: refetchInv } = useProductionData<{
    finished_goods: Array<{ sku_id: string; on_hand: number; allocated: number; available: number }>;
    raw_materials: Array<{ material_id: string; current_qty: number; status: string }>;
  }>('/plm/inventory/snapshot', { finished_goods: [], raw_materials: [] });

  const loading = calLoading || alertsLoading || invLoading;

  const handleExport = () => {
    const rows = (calendar as Array<Record<string, unknown>>).map((c: Record<string, unknown>) => ({
      due_date: c.due_date,
      amount: c.amount,
      currency: 'RUB',
      milestone: c.milestone,
    }));
    exportToCSV(rows, [
      { key: 'due_date', label: 'Дата' },
      { key: 'milestone', label: 'Milestone' },
      { key: 'amount', label: 'Сумма' },
      { key: 'currency', label: 'Валюта (RUB)' },
    ], 'command-center');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-indigo-600" />
          Command Center
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { refetchCal(); refetchAlerts(); refetchInv(); }} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" className="text-[9px] font-bold uppercase" onClick={handleExport}>
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Критичные алерты */}
        <Card className="border border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 p-4 border-b border-slate-100">
            <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Алерты (24ч)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {Array.isArray(alerts) && alerts.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {alerts.slice(0, 5).map((a, i) => (
                  <div key={i} className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-[10px]">
                    <p className="font-bold text-slate-900">{a.milestone}</p>
                    <p className="text-slate-500">PO: {a.order_id} · {new Date(a.deadline).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">Нет срочных алертов</p>
            )}
          </CardContent>
        </Card>

        {/* Финансовый календарь */}
        <Card className="border border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 p-4 border-b border-slate-100">
            <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-500" />
              Ближайшие платежи
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {Array.isArray(calendar) && calendar.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {calendar.slice(0, 5).map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 text-[10px]">
                    <div>
                      <p className="font-bold text-slate-900">{c.milestone || 'Платёж'}</p>
                      <p className="text-slate-500">{new Date(c.due_date).toLocaleDateString()}</p>
                    </div>
                    <span className="font-black tabular-nums">{c.amount?.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400">Нет предстоящих платежей</p>
            )}
            {onNavigate && (
              <Button variant="ghost" size="sm" className="w-full mt-2 text-[9px]" onClick={() => onNavigate('finance')}>
                К финансовому календарю <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Остатки */}
        <Card className="border border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2 p-4 border-b border-slate-100">
            <CardTitle className="text-xs font-black uppercase flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Остатки
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-slate-500 font-bold">Готовая продукция</p>
                <p className="text-lg font-black text-slate-900">{(inventory?.finished_goods?.length ?? 0)} SKU</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50">
                <p className="text-slate-500 font-bold">Сырьё</p>
                <p className="text-lg font-black text-slate-900">{(inventory?.raw_materials?.length ?? 0)} лотов</p>
              </div>
            </div>
            {onNavigate && (
              <Button variant="ghost" size="sm" className="w-full mt-2 text-[9px]" onClick={() => onNavigate('materials')}>
                К снабжению <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
