'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3 } from 'lucide-react';
import { AnalyticsCard, DashboardGrid, HistogramCard, MetricCard } from '@/components/design-system';
import { exportAnalyticsToCSV, type AnalyticsKpi, type AnalyticsDrillDown } from '@/lib/production/analytics';

interface Props {
  collectionIds: string[];
}

export function ProductionAnalyticsPanel({ collectionIds }: Props) {
  const [kpis, setKpis] = useState<AnalyticsKpi | null>(null);
  const [drillDown, setDrillDown] = useState<AnalyticsDrillDown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const q = collectionIds.length ? `?collections=${collectionIds.join(',')}` : '';
    fetch(`/api/production/analytics${q}`)
      .then((r) => {
        if (!r.ok) throw new Error(`analytics ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (mounted) {
          setKpis(d.kpis);
          setDrillDown(d.drillDown ?? []);
        }
      })
      .catch(() => {
        if (mounted) {
          setKpis(null);
          setDrillDown([]);
        }
      })
      .finally(() => mounted && (setLoading(false), undefined));
    return () => {
      mounted = false;
    };
  }, [collectionIds.join(',')]);

  if (loading || !kpis) return null;

  const handleExport = () => {
    exportAnalyticsToCSV(kpis, drillDown);
  };

  const histData = drillDown.map((d) => ({ label: d.collectionName, value: d.onTimePct }));

  return (
    <AnalyticsCard
      title="Расширенная аналитика"
      description="On-time, план/факт, бюджет и качество по фабрикам. Экспорт в CSV."
      action={
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1 text-[10px]">
          <Download className="h-3.5 w-3.5" /> Экспорт
        </Button>
      }
    >
      <DashboardGrid cols={4} dense className="md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="On-time delivery"
          value={`${kpis.onTimeDeliveryPct}%`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <MetricCard
          label="Сэмплы план / факт"
          value={`${kpis.planVsFact.samples.fact} / ${kpis.planVsFact.samples.plan}`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <MetricCard
          label="Бюджет план / факт"
          value={`${(kpis.planVsFact.budget.plan / 1000).toFixed(0)}k / ${(kpis.planVsFact.budget.fact / 1000).toFixed(0)}k ₽`}
        />
        <MetricCard
          label="Фабрики (дефект %)"
          value={kpis.qualityByFactory.length ? `${kpis.qualityByFactory.length}` : '—'}
        />
      </DashboardGrid>

      {kpis.qualityByFactory.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {kpis.qualityByFactory.map((f) => (
            <Badge key={f.factoryId} variant="outline" className="text-[8px] font-medium">
              {f.factoryName}: {f.defectRate}%
            </Badge>
          ))}
        </div>
      ) : null}

      {histData.length > 0 ? (
        <div className="mt-4">
          <HistogramCard
            title="On-time по коллекциям"
            description="Доля в срок по сэмплам, %"
            data={histData}
          />
        </div>
      ) : null}

    </AnalyticsCard>
  );
}
