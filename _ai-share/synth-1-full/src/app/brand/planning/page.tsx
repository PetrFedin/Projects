'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Target,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Plus,
  Zap,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { PlannedSKU, SKUDemandForecast } from '@/lib/types/analytics';
import { skuSimulationClient } from '@/lib/ai-client/api';
import { cn } from '@/lib/utils';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

/**
 * Smart Range Planner UI
 * Инструмент планирования ассортиментной матрицы с AI-симуляцией спроса.
 */

export default function SmartPlanningPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [plannedItems, setPlannedItems] = useState<PlannedSKU[]>([
    {
      id: '1',
      name: 'Oversized Wool Coat',
      category: 'Outerwear',
      type: 'trend',
      plannedQty: 200,
      estimatedCost: 85,
      targetRetailPrice: 350,
      estimatedMargin: 75,
      aiRiskScore: 0.2,
    },
    {
      id: '2',
      name: 'Essential White Shirt',
      category: 'Tops',
      type: 'core',
      plannedQty: 1000,
      estimatedCost: 15,
      targetRetailPrice: 65,
      estimatedMargin: 76,
      aiRiskScore: 0.1,
    },
    {
      id: '3',
      name: 'Vegan Leather Pants',
      category: 'Bottoms',
      type: 'novelty',
      plannedQty: 150,
      estimatedCost: 45,
      targetRetailPrice: 180,
      estimatedMargin: 75,
      aiRiskScore: 0.4,
    },
  ]);
  const [forecasts, setForecasts] = useState<SKUDemandForecast[] | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const results = await skuSimulationClient({
        brandId: 'brand-123',
        plannedItems,
      });
      setForecasts(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
      <SectionInfoCard
        title="Smart Range Matrix"
        description="Планирование ассортимента с AI-симуляцией спроса. Связи: Products (PIM), Production, Analytics, Finance — Landed Cost и P&L."
        icon={Target}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              AI Planner
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.products}>
                <Calculator className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.analytics}>
                <BarChart3 className="mr-1 h-3 w-3" /> Analytics
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.finance}>Finance</Link>
            </Button>
          </>
        }
      />
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Target className="text-accent-primary h-3 w-3" />
            <span className="hover:text-accent-primary cursor-pointer transition-colors">
              Range Planner
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
              Smart Range Matrix 2.0
            </h1>
            <Badge
              variant="outline"
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold tracking-widest shadow-sm transition-all"
            >
              <BrainCircuit className="h-2.5 w-2.5" /> AI ENABLED
            </Badge>
          </div>
        </div>
        <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
          <Button
            variant="ghost"
            className="text-text-secondary hover:bg-bg-surface2 border-border-default h-7 gap-1.5 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
          >
            <Plus className="text-text-muted h-3 w-3" /> Add SKU
          </Button>
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
            className="bg-text-primary hover:bg-accent-primary h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all"
          >
            {isSimulating ? (
              <Zap className="h-3 w-3 animate-spin" />
            ) : (
              <Zap className="text-accent-primary h-3 w-3" />
            )}
            {isSimulating ? 'Simulating...' : 'Run Analysis'}
          </Button>
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: 'TARGET BUDGET',
            value: '$145,000',
            icon: Calculator,
            color: 'text-text-primary',
            bg: 'bg-bg-surface2/80',
            border: 'border-border-subtle',
          },
          {
            label: 'TARGET MARGIN',
            value: '74.5%',
            icon: BarChart3,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-100/50',
          },
          {
            label: 'SELL-THROUGH',
            value: forecasts ? '78%' : '--',
            icon: TrendingUp,
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
            border: 'border-accent-primary/20',
          },
          {
            label: 'RISK LEVEL',
            value: forecasts ? 'Low' : '--',
            icon: AlertTriangle,
            color: forecasts ? 'text-emerald-600' : 'text-text-muted',
            bg: 'bg-bg-surface2/80',
            border: 'border-border-subtle',
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className={cn(
              'hover:border-accent-primary/20 group flex items-center gap-3.5 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md',
              kpi.border
            )}
          >
            <div
              className={cn(
                'shrink-0 rounded-lg border p-1.5 shadow-inner transition-transform group-hover:scale-105',
                kpi.bg,
                kpi.color,
                kpi.border
              )}
            >
              <kpi.icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
                {kpi.label}
              </p>
              <p
                className={cn(
                  'mt-1 text-sm font-bold uppercase leading-none tracking-tight',
                  kpi.color
                )}
              >
                {kpi.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-3.5">
              <div className="space-y-0.5">
                <CardTitle className="text-text-primary text-[11px] font-bold uppercase tracking-widest">
                  Ассортиментная матрица
                </CardTitle>
                <CardDescription className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
                  Планируемые артикулы и объемы пошива.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="border-border-default text-text-secondary hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
              >
                Экспорт
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface2/80">
                  <TableRow className="h-9 border-none">
                    <TableHead className="text-text-muted h-9 pl-4 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Наименование
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Тип
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                      План
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                      Cost/Retail
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                      Маржа
                    </TableHead>
                    <TableHead className="text-text-muted h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      AI Прогноз
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plannedItems.map((item) => {
                    const forecast = forecasts?.find((f) => f.productId === item.id);
                    return (
                      <TableRow
                        key={item.id}
                        className="border-border-subtle hover:bg-accent-primary/10 group h-11 transition-colors"
                      >
                        <TableCell className="py-2 pl-4">
                          <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-tight tracking-tight transition-colors">
                            {item.name}
                          </p>
                          <p className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
                            {item.category}
                          </p>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'h-3.5 border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                              item.type === 'core'
                                ? 'bg-bg-surface2 text-text-secondary border-border-default'
                                : item.type === 'trend'
                                  ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                                  : 'border-amber-100 bg-amber-50 text-amber-600'
                            )}
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-primary py-2 text-center font-mono text-[11px] font-bold">
                          {item.plannedQty}
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
                            <span className="text-text-muted">${item.estimatedCost}</span>
                            <span className="text-text-muted">/</span>
                            <span className="text-text-primary">${item.targetRetailPrice}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-center text-[11px] font-bold uppercase tracking-tighter text-emerald-600">
                          {item.estimatedMargin}%
                        </TableCell>
                        <TableCell className="py-2 pr-4 text-right">
                          {forecast ? (
                            <div className="space-y-0.5">
                              <p className="text-accent-primary text-[11px] font-bold uppercase leading-none tracking-tighter">
                                {Math.round(forecast.predictedDemand)} ед.
                              </p>
                              <div className="mt-1 flex items-center justify-end gap-1">
                                <div
                                  className={cn(
                                    'h-1 w-1 rounded-full shadow-sm',
                                    forecast.confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'
                                  )}
                                />
                                <span className="text-text-muted text-[7px] font-bold uppercase tracking-widest opacity-70">
                                  Conf. {Math.round(forecast.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-50">
                              Pending...
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-accent-primary shadow-accent-primary/10 bg-text-primary hover:bg-text-primary/90 group relative overflow-hidden rounded-xl border p-4 text-white shadow-xl transition-colors">
            <div className="bg-accent-primary/10 absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="group-hover:bg-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 shadow-inner transition-colors">
                  <BrainCircuit className="text-accent-primary h-4 w-4 group-hover:text-white" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[11px] font-bold uppercase leading-none tracking-widest">
                    AI Strategic Insights
                  </h3>
                  <p className="text-accent-primary mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] opacity-70">
                    Predictive Analysis
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {forecasts ? (
                  <>
                    <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-3 shadow-inner transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <p className="text-[8px] font-bold uppercase tracking-widest">
                          Optimized Matrix
                        </p>
                      </div>
                      <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-white/80">
                        Ваша коллекция сбалансирована. "Essential Shirt" имеет потенциал.
                      </p>
                    </div>
                    <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-3 shadow-inner transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        <p className="text-[8px] font-bold uppercase tracking-widest">
                          Risk Warning
                        </p>
                      </div>
                      <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-white/80">
                        "Leather Pants" показывают риск оверстока. Тренд падает.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 rounded-2xl border border-dashed border-white/10 bg-white/5 py-4 text-center">
                    <Zap className="text-accent-primary/30 mx-auto h-8 w-8 animate-pulse" />
                    <p className="px-4 text-[8px] font-bold uppercase leading-tight tracking-[0.2em] text-white/40">
                      Запустите симуляцию для инсайтов
                    </p>
                  </div>
                )}
              </div>
              <Button className="text-text-primary hover:bg-accent-primary/10 shadow-accent-primary/40 h-8 w-full rounded-lg border-none bg-white text-[9px] font-bold uppercase tracking-widest shadow-xl transition-all">
                Открыть отчет
              </Button>
            </div>
          </Card>

          <Card className="border-border-subtle group space-y-4 rounded-xl border p-4 shadow-sm transition-all hover:border-emerald-100">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                  Market Trends
                </h3>
              </div>
              <Badge
                variant="outline"
                className="bg-bg-surface2 text-text-muted border-border-subtle h-3.5 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
              >
                LIVE
              </Badge>
            </div>
            <div className="space-y-1.5">
              {[
                {
                  label: 'Metallic Textures',
                  trend: '+22%',
                  direction: 'up',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50/50',
                  border: 'border-emerald-100/50',
                },
                {
                  label: 'Ethical Linen',
                  trend: '+15%',
                  direction: 'up',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50/50',
                  border: 'border-emerald-100/50',
                },
                {
                  label: 'Oversized silhouettes',
                  trend: 'Stable',
                  direction: 'stable',
                  color: 'text-text-muted',
                  bg: 'bg-bg-surface2/80',
                  border: 'border-border-subtle/50',
                },
              ].map((trend, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2/30 group/item flex cursor-default items-center justify-between rounded-xl border border-transparent p-2.5 shadow-inner transition-all hover:border-emerald-100 hover:bg-white"
                >
                  <span className="text-text-secondary group-hover/item:text-text-primary text-[9px] font-bold uppercase tracking-tight transition-colors">
                    {trend.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        'h-4 border px-1.5 text-[8px] font-bold tracking-widest shadow-sm',
                        trend.color,
                        trend.bg,
                        trend.border
                      )}
                    >
                      {trend.trend}
                    </Badge>
                    {trend.direction === 'up' && (
                      <ChevronRight className="h-3 w-3 -rotate-90 text-emerald-500 transition-transform group-hover/item:translate-y-[-1px]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="text-accent-primary hover:bg-accent-primary/10 h-7 w-full rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
            >
              Trend Intelligence
            </Button>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
