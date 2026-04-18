'use client';

import { TrendingUp, Package, Zap, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { metrics, inventoryStats } from '../_fixtures/finance-data';

export function FinancialOverview() {
  return (
    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-2">
      {/* Valuation & Net Worth Card */}
      <Card className="border-border-subtle shadow-accent-primary/10 bg-text-primary hover:bg-text-primary/90 group relative overflow-hidden rounded-xl border text-white shadow-xl transition-colors">
        <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <TrendingUp className="text-accent-primary h-32 w-32" />
        </div>
        <CardContent className="relative z-10 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-[0.2em]">
                  Estimated Enterprise Value
                </p>
                <h3 className="text-base font-bold uppercase tabular-nums leading-none tracking-tighter text-white">
                  {metrics.estimatedValuation.toLocaleString('ru-RU')} ₽
                </h3>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="h-5 rounded-lg border-white/20 bg-white/10 px-2 text-[8px] font-bold uppercase leading-none tracking-widest text-white"
                >
                  Multiplier: 3.7x
                </Badge>
                <Badge
                  variant="outline"
                  className="h-5 rounded-lg border-emerald-500/30 bg-emerald-500/20 px-2 text-[8px] font-bold uppercase leading-none tracking-widest text-emerald-400"
                >
                  Growth: +22% YoY
                </Badge>
              </div>
              <p className="max-w-sm text-[10px] font-bold uppercase leading-relaxed tracking-tight text-white/40">
                "Оценка сформирована на основе текущей выручки и индекса устойчивости Syntha."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-3.5 shadow-inner transition-colors group-hover:border-white/20">
                <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/40">
                  Капитал
                </p>
                <p className="text-sm font-bold tabular-nums leading-none">
                  {metrics.netWorth.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-3.5 shadow-inner transition-colors group-hover:border-white/20">
                <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/40">
                  Активы
                </p>
                <p className="text-sm font-bold tabular-nums leading-none">
                  {metrics.totalAssets.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="bg-accent-primary/10 border-accent-primary/20 space-y-1.5 rounded-xl border p-3.5 shadow-inner">
                <p className="text-accent-primary text-[8px] font-bold uppercase leading-none tracking-widest">
                  Sustainability
                </p>
                <p className="text-accent-primary text-sm font-bold tabular-nums leading-none">
                  {metrics.sustainabilityIndex}%
                </p>
              </div>
              <div className="space-y-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 shadow-inner">
                <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-rose-300">
                  Liabilities
                </p>
                <p className="text-sm font-bold tabular-nums leading-none text-rose-400">
                  {metrics.totalLiabilities.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-4 rounded-xl border bg-white p-4 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-widest">
                Товарное обеспечение
              </p>
              <h4 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                {metrics.inventoryValue.toLocaleString('ru-RU')} ₽
              </h4>
            </div>
          </div>
          <div className="space-y-2">
            {inventoryStats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold uppercase leading-none tracking-widest">
                  <span className="text-text-muted">{stat.category}</span>
                  <span className="text-text-primary">
                    {Math.round((stat.value / metrics.inventoryValue) * 100)}%
                  </span>
                </div>
                <div className="bg-bg-surface2 h-1 w-full overflow-hidden rounded-full shadow-inner">
                  <div
                    className="bg-accent-primary h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(stat.value / metrics.inventoryValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-4 rounded-xl border bg-white p-4 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 flex h-9 w-9 items-center justify-center rounded-xl border shadow-inner transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-widest">
                Операционный Runway
              </p>
              <h4 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                {metrics.runwayMonths} месяцев
              </h4>
            </div>
          </div>
          <div className="bg-bg-surface2/80 border-border-subtle space-y-1.5 rounded-xl border p-3.5 transition-colors group-hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest">
                Burn Rate (Monthly)
              </span>
              <span className="text-[10px] font-bold tabular-nums text-rose-600">
                -{metrics.monthlyBurn.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <p className="text-text-muted text-[9px] font-bold uppercase leading-relaxed tracking-tight opacity-60">
              Запас до сентября 2026.
            </p>
          </div>
        </Card>

        <Card className="border-border-subtle group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-amber-100">
          <div className="absolute right-0 top-0 p-3 opacity-5 transition-transform group-hover:scale-110">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600 shadow-inner transition-transform group-hover:scale-105">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-widest">
                Налоги и Комплаенс
              </p>
              <h4 className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight">
                1,200,000 ₽
              </h4>
            </div>
          </div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 transition-colors group-hover:bg-emerald-50">
              <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-700">
                НДС (Q1)
              </span>
              <Badge
                variant="outline"
                className="h-3.5 border-none bg-emerald-500 px-1.5 text-[7px] font-bold tracking-widest text-white shadow-sm"
              >
                ОПЛАЧЕНО
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 p-2.5 transition-colors group-hover:bg-amber-50">
              <span className="text-[8px] font-bold uppercase tracking-widest text-amber-700">
                Налог на прибыль
              </span>
              <span className="text-[8px] font-bold tracking-widest text-amber-800">ДО 28.03</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
