'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Package,
  Truck,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronRight,
  Factory,
  Calendar,
} from 'lucide-react';
import { exportToCSV } from '@/lib/production-export-utils';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { getMetricValueToneClass } from '@/lib/ui/semantic-data-tones';

export interface ExtendedAnalyticsProps {
  collectionIds: string[];
  productionKpis: Record<string, string>;
  sampleStatuses: Array<{
    skuId: string;
    skuName: string;
    status: string;
    slaOverdue: boolean;
    factory: string;
    collection: string;
  }>;
  productionOrders: Array<{
    id: string;
    status: string;
    qty: number;
    collection: string;
    factory: string;
  }>;
  onDrillDownSku?: (id: string) => void;
  onDrillDownPo?: (id: string) => void;
  onExportExcel?: (format: 'csv' | 'pdf') => void;
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ProductionExtendedAnalytics({
  collectionIds,
  productionKpis,
  sampleStatuses,
  productionOrders,
  onDrillDownSku,
  onDrillDownPo,
  onExportExcel,
}: ExtendedAnalyticsProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [activeKpi, setActiveKpi] = useState<string | null>(null);

  const otifData = [
    { factory: 'Global Textiles', onTime: 94, total: 12, label: '94%' },
    { factory: 'Smart Tailor', onTime: 78, total: 8, label: '78%' },
    { factory: 'Others', onTime: 88, total: 5, label: '88%' },
  ];

  const qualityByFactory = [
    { name: 'Global Textiles', value: 42, score: 98.2, color: COLORS[0] },
    { name: 'Smart Tailor', value: 28, score: 95.1, color: COLORS[1] },
    { name: 'Others', value: 30, score: 96.8, color: COLORS[2] },
  ];

  const planVsFact = [
    { month: 'Янв', plan: 400, fact: 380 },
    { month: 'Фев', plan: 500, fact: 465 },
    { month: 'Мар', plan: 600, fact: 542 },
    { month: 'Апр', plan: 700, fact: 0 },
  ];

  const handleExport = (format: 'csv' | 'pdf') => {
    const rows = [
      { kpi: 'Производство', value: productionKpis.production },
      { kpi: 'В пути', value: productionKpis.cargo },
      { kpi: 'QC', value: productionKpis.qc },
      { kpi: 'Финансы', value: productionKpis.finance },
      { kpi: 'Риск', value: productionKpis.risk },
      { kpi: 'Эффективность', value: productionKpis.efficiency },
    ];
    exportToCSV(
      rows,
      [
        { key: 'kpi', label: 'KPI' },
        { key: 'value', label: 'Значение' },
      ],
      'analytics'
    );
    onExportExcel?.(format);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* cabinetSurface v1 */}
          <div className={cn(cabinetSurface.groupTabList, 'h-auto min-h-9 flex-wrap')}>
            {(['week', 'month', 'quarter'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  cabinetSurface.groupTabButton,
                  'px-4 py-1.5 text-[9px] font-bold uppercase',
                  period === p
                    ? cn(cabinetSurface.groupTabButtonActive, 'text-accent-primary')
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Квартал'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-[9px] font-bold uppercase"
            onClick={() => handleExport('csv')}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel/CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-[9px] font-bold uppercase"
            onClick={() => handleExport('pdf')}
          >
            <FileText className="h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          {
            key: 'production',
            label: 'Производство',
            value: productionKpis.production,
            icon: Package,
            color: 'indigo',
          },
          {
            key: 'cargo',
            label: 'В пути',
            value: productionKpis.cargo,
            icon: Truck,
            color: 'cyan',
          },
          { key: 'qc', label: 'QC', value: productionKpis.qc, icon: ShieldCheck, color: 'emerald' },
          {
            key: 'finance',
            label: 'К оплате',
            value: productionKpis.finance,
            icon: CreditCard,
            color: 'rose',
          },
          {
            key: 'risk',
            label: 'Риск',
            value: productionKpis.risk,
            icon: AlertTriangle,
            color: 'amber',
          },
          {
            key: 'efficiency',
            label: 'Эффективность',
            value: productionKpis.efficiency,
            icon: TrendingUp,
            color: 'green',
          },
        ].map((item) => (
          <Card
            key={item.key}
            className={cn(
              'border-border-subtle hover:border-accent-primary/30 cursor-pointer rounded-xl border shadow-sm transition-all',
              activeKpi === item.key && 'ring-accent-primary ring-2'
            )}
            onClick={() => setActiveKpi(activeKpi === item.key ? null : item.key)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <item.icon className={cn('h-4 w-4', getMetricValueToneClass(item.color))} />
                <ChevronRight className="text-text-muted h-4 w-4" />
              </div>
              <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">{item.label}</p>
              <p className="text-text-primary mt-0.5 text-lg font-black">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
          <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
            <CardTitle className="text-[11px] font-black uppercase">
              On-time delivery по фабрикам
            </CardTitle>
            <CardDescription className="text-[9px]">% вовремя доставленных партий</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={otifData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="factory" type="category" width={75} tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 10 }}
                    formatter={(v: number) => [`${v}%`, 'On-time']}
                  />
                  <Bar dataKey="onTime" fill="#4f46e5" radius={[0, 4, 4, 0]} name="On-time %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
          <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
            <CardTitle className="text-[11px] font-black uppercase">Качество по фабрикам</CardTitle>
            <CardDescription className="text-[9px]">
              Доля артикулов, средний QC score
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityByFactory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, score }) => `${name} ${score}%`}
                  >
                    {qualityByFactory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, n: string, item) => [
                      `${v} арт., score ${(item as { payload?: { score?: number } })?.payload?.score ?? ''}%`,
                      n,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
        <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
          <CardTitle className="text-[11px] font-black uppercase">План vs Факт (единицы)</CardTitle>
          <CardDescription className="text-[9px]">
            Плановый объём против фактического производства
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={planVsFact} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="plan"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="План"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="fact"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Факт"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
