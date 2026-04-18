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
<<<<<<< HEAD
import { simulateCollectionDemand } from '@/ai/flows/sku-planner';
import { cn } from '@/lib/utils';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
=======
import { skuSimulationClient } from '@/lib/ai-client/api';
import { cn } from '@/lib/utils';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash

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
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
=======
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Smart Range Matrix"
        description="Планирование ассортимента с AI-симуляцией спроса. Связи: Products (PIM), Production, Analytics, Finance — Landed Cost и P&L."
        icon={Target}
<<<<<<< HEAD
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
=======
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
>>>>>>> recover/cabinet-wip-from-stash
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              AI Planner
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/products">
=======
              <Link href={ROUTES.brand.products}>
>>>>>>> recover/cabinet-wip-from-stash
                <Calculator className="mr-1 h-3 w-3" /> Products
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/production">Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/analytics">
=======
              <Link href={ROUTES.brand.production}>Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.analytics}>
>>>>>>> recover/cabinet-wip-from-stash
                <BarChart3 className="mr-1 h-3 w-3" /> Analytics
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/finance">Finance</Link>
=======
              <Link href={ROUTES.brand.finance}>Finance</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </>
        }
      />
<<<<<<< HEAD
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Target className="h-3 w-3 text-indigo-500" />
            <span className="cursor-pointer transition-colors hover:text-indigo-600">
=======
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Target className="text-accent-primary h-3 w-3" />
            <span className="hover:text-accent-primary cursor-pointer transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
              Range Planner
            </span>
          </div>
          <div className="flex items-center gap-2.5">
<<<<<<< HEAD
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              Smart Range Matrix 2.0
            </h1>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold tracking-widest text-indigo-600 shadow-sm transition-all"
=======
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <BrainCircuit className="h-2.5 w-2.5" /> AI ENABLED
            </Badge>
          </div>
        </div>
<<<<<<< HEAD
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <Button
            variant="ghost"
            className="h-7 gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
          >
            <Plus className="h-3 w-3 text-slate-400" /> Add SKU
=======
        <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
          <Button
            variant="ghost"
            className="text-text-secondary hover:bg-bg-surface2 border-border-default h-7 gap-1.5 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
          >
            <Plus className="text-text-muted h-3 w-3" /> Add SKU
>>>>>>> recover/cabinet-wip-from-stash
          </Button>
          <Button
            onClick={runSimulation}
            disabled={isSimulating}
<<<<<<< HEAD
            className="h-7 gap-1.5 rounded-lg bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-600"
=======
            className="bg-text-primary hover:bg-accent-primary h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            {isSimulating ? (
              <Zap className="h-3 w-3 animate-spin" />
            ) : (
<<<<<<< HEAD
              <Zap className="h-3 w-3 text-indigo-400" />
=======
              <Zap className="text-accent-primary h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            color: 'text-slate-900',
            bg: 'bg-slate-50/50',
            border: 'border-slate-100',
=======
            color: 'text-text-primary',
            bg: 'bg-bg-surface2/80',
            border: 'border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50',
            border: 'border-indigo-100/50',
=======
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
            border: 'border-accent-primary/20',
>>>>>>> recover/cabinet-wip-from-stash
          },
          {
            label: 'RISK LEVEL',
            value: forecasts ? 'Low' : '--',
            icon: AlertTriangle,
<<<<<<< HEAD
            color: forecasts ? 'text-emerald-600' : 'text-slate-300',
            bg: 'bg-slate-50/50',
            border: 'border-slate-100',
=======
            color: forecasts ? 'text-emerald-600' : 'text-text-muted',
            bg: 'bg-bg-surface2/80',
            border: 'border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
          },
        ].map((kpi, i) => (
          <Card
            key={i}
            className={cn(
<<<<<<< HEAD
              'group flex items-center gap-3.5 rounded-xl border bg-white p-3 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md',
=======
              'hover:border-accent-primary/20 group flex items-center gap-3.5 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <p className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
=======
              <p className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all hover:border-indigo-100/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-3.5">
              <div className="space-y-0.5">
                <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                  Ассортиментная матрица
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase tracking-tight text-slate-400">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-3.5">
              <div className="space-y-0.5">
                <CardTitle className="text-text-primary text-[11px] font-bold uppercase tracking-widest">
                  Ассортиментная матрица
                </CardTitle>
                <CardDescription className="text-text-muted text-[9px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                  Планируемые артикулы и объемы пошива.
                </CardDescription>
              </div>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
=======
                className="border-border-default text-text-secondary hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Экспорт
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
<<<<<<< HEAD
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-9 border-none">
                    <TableHead className="h-9 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Наименование
                    </TableHead>
                    <TableHead className="h-9 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Тип
                    </TableHead>
                    <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      План
                    </TableHead>
                    <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Cost/Retail
                    </TableHead>
                    <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Маржа
                    </TableHead>
                    <TableHead className="h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
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
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        className="group h-11 border-slate-50 transition-colors hover:bg-indigo-50/20"
                      >
                        <TableCell className="py-2 pl-4">
                          <p className="text-[11px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                        className="border-border-subtle hover:bg-accent-primary/10 group h-11 transition-colors"
                      >
                        <TableCell className="py-2 pl-4">
                          <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-tight tracking-tight transition-colors">
                            {item.name}
                          </p>
                          <p className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            {item.category}
                          </p>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              'h-3.5 border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                              item.type === 'core'
<<<<<<< HEAD
                                ? 'border-slate-200 bg-slate-50 text-slate-500'
                                : item.type === 'trend'
                                  ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
=======
                                ? 'bg-bg-surface2 text-text-secondary border-border-default'
                                : item.type === 'trend'
                                  ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
>>>>>>> recover/cabinet-wip-from-stash
                                  : 'border-amber-100 bg-amber-50 text-amber-600'
                            )}
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
<<<<<<< HEAD
                        <TableCell className="py-2 text-center font-mono text-[11px] font-bold text-slate-700">
=======
                        <TableCell className="text-text-primary py-2 text-center font-mono text-[11px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          {item.plannedQty}
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[10px] font-bold">
<<<<<<< HEAD
                            <span className="text-slate-400">${item.estimatedCost}</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-slate-900">${item.targetRetailPrice}</span>
=======
                            <span className="text-text-muted">${item.estimatedCost}</span>
                            <span className="text-text-muted">/</span>
                            <span className="text-text-primary">${item.targetRetailPrice}</span>
>>>>>>> recover/cabinet-wip-from-stash
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-center text-[11px] font-bold uppercase tracking-tighter text-emerald-600">
                          {item.estimatedMargin}%
                        </TableCell>
                        <TableCell className="py-2 pr-4 text-right">
                          {forecast ? (
                            <div className="space-y-0.5">
<<<<<<< HEAD
                              <p className="text-[11px] font-bold uppercase leading-none tracking-tighter text-indigo-600">
=======
                              <p className="text-accent-primary text-[11px] font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                                {Math.round(forecast.predictedDemand)} ед.
                              </p>
                              <div className="mt-1 flex items-center justify-end gap-1">
                                <div
                                  className={cn(
                                    'h-1 w-1 rounded-full shadow-sm',
                                    forecast.confidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'
                                  )}
                                />
<<<<<<< HEAD
                                <span className="text-[7px] font-bold uppercase tracking-widest text-slate-400 opacity-70">
=======
                                <span className="text-text-muted text-[7px] font-bold uppercase tracking-widest opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
                                  Conf. {Math.round(forecast.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          ) : (
<<<<<<< HEAD
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 opacity-50">
=======
                            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-50">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <Card className="group relative overflow-hidden rounded-xl border border-indigo-500 bg-slate-900 p-4 text-white shadow-xl shadow-indigo-100/30 transition-colors hover:bg-slate-800">
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-indigo-500/10 blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 shadow-inner transition-colors group-hover:bg-indigo-500">
                  <BrainCircuit className="h-4 w-4 text-indigo-400 group-hover:text-white" />
=======
          <Card className="border-accent-primary shadow-accent-primary/10 bg-text-primary hover:bg-text-primary/90 group relative overflow-hidden rounded-xl border p-4 text-white shadow-xl transition-colors">
            <div className="bg-accent-primary/10 absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-110"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="group-hover:bg-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 shadow-inner transition-colors">
                  <BrainCircuit className="text-accent-primary h-4 w-4 group-hover:text-white" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[11px] font-bold uppercase leading-none tracking-widest">
                    AI Strategic Insights
                  </h3>
<<<<<<< HEAD
                  <p className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300 opacity-70">
=======
                  <p className="text-accent-primary mt-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] opacity-70">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    <Zap className="mx-auto h-8 w-8 animate-pulse text-indigo-500/30" />
=======
                    <Zap className="text-accent-primary/30 mx-auto h-8 w-8 animate-pulse" />
>>>>>>> recover/cabinet-wip-from-stash
                    <p className="px-4 text-[8px] font-bold uppercase leading-tight tracking-[0.2em] text-white/40">
                      Запустите симуляцию для инсайтов
                    </p>
                  </div>
                )}
              </div>
<<<<<<< HEAD
              <Button className="h-8 w-full rounded-lg border-none bg-white text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xl shadow-indigo-900/40 transition-all hover:bg-indigo-50">
=======
              <Button className="text-text-primary hover:bg-accent-primary/10 shadow-accent-primary/40 h-8 w-full rounded-lg border-none bg-white text-[9px] font-bold uppercase tracking-widest shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                Открыть отчет
              </Button>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="group space-y-4 rounded-xl border border-slate-100 p-4 shadow-sm transition-all hover:border-emerald-100">
=======
          <Card className="border-border-subtle group space-y-4 rounded-xl border p-4 shadow-sm transition-all hover:border-emerald-100">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-1.5 text-emerald-600 shadow-inner transition-transform group-hover:scale-105">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
<<<<<<< HEAD
                <h3 className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
=======
                <h3 className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Market Trends
                </h3>
              </div>
              <Badge
                variant="outline"
<<<<<<< HEAD
                className="h-3.5 border-slate-100 bg-slate-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-400 shadow-sm"
=======
                className="bg-bg-surface2 text-text-muted border-border-subtle h-3.5 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  color: 'text-slate-400',
                  bg: 'bg-slate-50/50',
                  border: 'border-slate-100/50',
=======
                  color: 'text-text-muted',
                  bg: 'bg-bg-surface2/80',
                  border: 'border-border-subtle/50',
>>>>>>> recover/cabinet-wip-from-stash
                },
              ].map((trend, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group/item flex cursor-default items-center justify-between rounded-xl border border-transparent bg-slate-50/30 p-2.5 shadow-inner transition-all hover:border-emerald-100 hover:bg-white"
                >
                  <span className="text-[9px] font-bold uppercase tracking-tight text-slate-600 transition-colors group-hover/item:text-slate-900">
=======
                  className="bg-bg-surface2/30 group/item flex cursor-default items-center justify-between rounded-xl border border-transparent p-2.5 shadow-inner transition-all hover:border-emerald-100 hover:bg-white"
                >
                  <span className="text-text-secondary group-hover/item:text-text-primary text-[9px] font-bold uppercase tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              className="h-7 w-full rounded-lg text-[9px] font-bold uppercase tracking-widest text-indigo-600 transition-all hover:bg-indigo-50"
=======
              className="text-accent-primary hover:bg-accent-primary/10 h-7 w-full rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Trend Intelligence
            </Button>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
