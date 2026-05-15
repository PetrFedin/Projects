'use client';

import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { WidgetContainer } from '@/components/design-system/widget-container';

interface ScorecardData {
  totalBatches: number;
  passed: number;
  failed: number;
  rework: number;
  passRate: number;
  defectTypes: { name: string; value: number }[];
}

const COLORS = {
  passed: '#10b981', // emerald-500
  failed: '#f43f5e', // rose-500
  rework: '#f59e0b', // amber-500
};

export function SupplierQcScorecard({ supplierId }: { supplierId: string }) {
  const [data, setData] = useState<ScorecardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/brand/workshop2/qc/supplier-scorecard?supplierId=${supplierId}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch scorecard:', err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [supplierId]);

  if (loading) {
    return (
      <WidgetContainer title="Рейтинг производителя" icon={<LucideIcons.BarChart2 className="w-4 h-4 text-text-muted" />}>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">Загрузка рейтинга...</div>
      </WidgetContainer>
    );
  }

  if (!data) {
    return (
      <WidgetContainer title="Рейтинг производителя" icon={<LucideIcons.BarChart2 className="w-4 h-4 text-text-muted" />}>
        <div className="h-48 flex items-center justify-center text-text-secondary text-sm">Данные недоступны</div>
      </WidgetContainer>
    );
  }

  const pieData = [
    { name: 'Принято', value: data.passed, color: COLORS.passed },
    { name: 'Доработка', value: data.rework, color: COLORS.rework },
    { name: 'Брак', value: data.failed, color: COLORS.failed },
  ];

  return (
    <WidgetContainer title="Рейтинг производителя (AQL)" icon={<LucideIcons.BarChart2 className="w-4 h-4 text-accent-primary" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Metric Pass Rate */}
        <div className="flex flex-col justify-center items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-text-secondary text-sm font-medium mb-1">Pass Rate</p>
          <div className="text-4xl font-bold text-text-primary">{data.passRate.toFixed(1)}%</div>
          <p className="text-text-muted text-xs mt-2">{data.totalBatches} партий проверено</p>
        </div>

        {/* Pie Chart */}
        <div className="h-40 flex flex-col items-center">
          <p className="text-text-secondary text-xs font-semibold mb-2">Статус партий</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                itemStyle={{ color: '#0f172a' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Top Defects */}
        <div className="h-40 flex flex-col items-center">
          <p className="text-text-secondary text-xs font-semibold mb-2">Частые дефекты</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.defectTypes} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={60} />
              <Tooltip
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="value" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetContainer>
  );
}
