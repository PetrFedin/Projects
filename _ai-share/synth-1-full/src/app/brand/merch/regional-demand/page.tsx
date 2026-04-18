'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, TrendingUp, Info, Zap, Globe, Users } from 'lucide-react';
import { getRegionalDemandData, getRegionRecommendation } from '@/lib/fashion/regional-demand';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function RegionalDemandPage() {
  const demandData = getRegionalDemandData();

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-12">
        <div className="mb-2 flex items-center gap-3">
          <div className="bg-accent-primary/15 rounded-lg p-2 shadow-sm">
            <Map className="text-accent-primary h-6 w-6" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tight tracking-tighter">
            Regional Demand Heatmap (RF)
          </h1>
        </div>
        <p className="max-w-2xl font-medium text-muted-foreground">
          Анализ потребительского спроса по федеральным округам РФ. Используется для оптимизации
          распределения стока и планирования региональных маркетинговых кампаний.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {demandData.map((item) => (
            <Card
              key={item.region}
              className="border-border-subtle hover:border-accent-primary/20 border-2 p-6 shadow-md transition-all"
            >
              <div className="flex flex-col justify-between gap-6 md:flex-row">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="text-text-primary text-xl font-black uppercase tracking-tight">
                      {item.region}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] font-black uppercase',
                        item.growthRate > 15
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                          : 'bg-bg-surface2 text-text-secondary border-border-subtle'
                      )}
                    >
                      +{item.growthRate}% Growth
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-text-muted flex justify-between text-[10px] font-black uppercase">
                        <span>Market Demand Score</span>
                        <span>{item.demandScore}/100</span>
                      </div>
                      <Progress
                        value={item.demandScore}
                        className="bg-bg-surface2 fill-accent-primary h-2"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.topCategories.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="bg-bg-surface2 text-text-secondary border-none text-[9px] font-black uppercase"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3 pt-2 md:w-64">
                  <div className="bg-accent-primary/10 border-accent-primary/20 rounded-xl border p-3">
                    <div className="text-accent-primary mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase">
                      <Zap className="h-3 w-3" /> AI Strategy
                    </div>
                    <p className="text-accent-primary text-[11px] font-bold leading-tight">
                      {getRegionRecommendation(item.region)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-1 text-[10px] font-black uppercase">
                    <span className="text-text-muted">Saturation</span>
                    <span
                      className={cn(
                        item.competitorSaturation === 'high' ? 'text-rose-500' : 'text-emerald-500'
                      )}
                    >
                      {item.competitorSaturation}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="bg-text-primary relative overflow-hidden p-6 text-white shadow-xl">
            <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
              <Globe className="h-32 w-32" />
            </div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black uppercase tracking-tight">
              <Users className="text-accent-primary h-5 w-5" /> National Overview
            </h3>
            <div className="relative z-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-text-muted mb-1 text-[9px] font-black uppercase">
                    Total Demand
                  </div>
                  <div className="text-2xl font-black">76%</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-text-muted mb-1 text-[9px] font-black uppercase">
                    Avg Growth
                  </div>
                  <div className="text-2xl font-black text-emerald-400">+11.4%</div>
                </div>
              </div>
              <div className="bg-accent-primary rounded-xl p-4 shadow-lg">
                <h4 className="mb-2 text-[10px] font-black uppercase">Primary Trend (RF)</h4>
                <p className="text-sm font-bold leading-tight">
                  Усиление спроса на "Quiet Luxury" в мегаполисах и запрос на технологичную верхнюю
                  одежду в северных регионах.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-border-subtle border-2 bg-white p-6 shadow-md">
            <h3 className="text-text-primary mb-6 text-sm font-black uppercase">
              Regional Sync Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-text-secondary text-xs font-bold uppercase">
                  WB/Ozon API: Operational
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-text-secondary text-xs font-bold uppercase">
                  Internal POS: Synced
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-text-secondary text-xs font-bold uppercase">
                  Logistics Data: 4h Lag
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
