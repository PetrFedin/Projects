'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Droplets,
  Wind,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingDown,
  Globe,
  Award,
  BarChart3,
  Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function SustainabilityAudit() {
  const METRICS = [
    {
      label: 'CO2 Footprint',
      value: '4.2 kg',
      target: '3.8 kg',
      trend: 'down',
      status: 'optimal',
      icon: Wind,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
    },
    {
      label: 'Water Usage',
      value: '250 L',
      target: '400 L',
      trend: 'down',
      status: 'excellent',
      icon: Droplets,
<<<<<<< HEAD
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
=======
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
    },
    {
      label: 'Recycled Fiber',
      value: '45%',
      target: '60%',
      trend: 'up',
      status: 'warning',
      icon: Leaf,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Factory Rating',
      value: 'A+',
      target: 'A',
      trend: 'stable',
      status: 'optimal',
      icon: Factory,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
<<<<<<< HEAD
    <Card className="group h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-emerald-50/20 p-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <Leaf className="h-4 w-4 text-emerald-600" />
            Экологический аудит (ESG Score)
          </CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
=======
    <Card className="border-border-subtle group h-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b bg-emerald-50/20 p-4">
        <div className="space-y-0.5">
          <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Leaf className="h-4 w-4 text-emerald-600" />
            Экологический аудит (ESG Score)
          </CardTitle>
          <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Влияние на среду и соответствие стандартам.
          </p>
        </div>
        <Badge className="h-5 border-none bg-emerald-500 px-2 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200">
          B+ GRADE
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5 p-4">
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map((metric, i) => (
            <div
              key={i}
<<<<<<< HEAD
              className="group/metric space-y-2 rounded-xl border border-slate-100/50 bg-slate-50/50 p-3 transition-all hover:border-emerald-100 hover:bg-white hover:shadow-sm"
=======
              className="bg-bg-surface2/80 border-border-subtle/50 group/metric space-y-2 rounded-xl border p-3 transition-all hover:border-emerald-100 hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'rounded-lg p-1.5 shadow-sm transition-transform group-hover/metric:scale-110',
                    metric.bg,
                    metric.color
                  )}
                >
                  <metric.icon className="h-3.5 w-3.5" />
                </div>
                {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-emerald-500" />}
              </div>
              <div>
<<<<<<< HEAD
                <p className="mb-1 text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  {metric.label}
                </p>
                <p className="text-xs font-black tabular-nums text-slate-900">{metric.value}</p>
=======
                <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-widest">
                  {metric.label}
                </p>
                <p className="text-text-primary text-xs font-black tabular-nums">{metric.value}</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        <div className="group/dark relative space-y-3 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
=======
        <div className="bg-text-primary group/dark relative space-y-3 overflow-hidden rounded-2xl p-4 text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl transition-all group-hover/dark:bg-emerald-500/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shadow-lg" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Цифровой паспорт
              </span>
            </div>
<<<<<<< HEAD
            <Zap className="h-3 w-3 animate-pulse fill-indigo-400 text-indigo-400" />
          </div>
          <p className="relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
=======
            <Zap className="text-accent-primary fill-accent-primary h-3 w-3 animate-pulse" />
          </div>
          <p className="text-text-muted relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Данные аудита автоматически синхронизируются с QR-кодом Digital Product Passport для
            конечного покупателя.
          </p>
          <Button
            variant="ghost"
            className="group/btn h-8 w-full gap-2 rounded-lg border border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            Просмотр паспорта{' '}
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
          </Button>
        </div>

<<<<<<< HEAD
        <div className="flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
        <div className="text-text-muted flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Сертифицировано: OEKO-TEX Standard
          100
        </div>
      </CardContent>
    </Card>
  );
}
