'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map as MapIcon,
  TrendingUp,
  Users,
  Zap,
  ArrowUpRight,
  Globe,
  Search,
  Filter,
  Layers,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function DemandHeatmap() {
  const [activeLayer, setActiveLayer] = useState<'demand' | 'inventory' | 'partners'>('demand');

  const regions = [
    { name: 'Moscow & Central', demand: 92, inventory: 45, partners: 12, trend: '+14%' },
    { name: 'Dubai / MENA', demand: 85, inventory: 60, partners: 8, trend: '+22%' },
    { name: 'Milan / EU', demand: 78, inventory: 30, partners: 15, trend: '+5%' },
    { name: 'Shanghai / Asia', demand: 64, inventory: 80, partners: 4, trend: '+18%' },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-3 text-left">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-3 text-left">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              <Globe className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              MARKET_INTEL_v2.0
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Global Demand
            <br />
            Heatmap
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            AI-driven market sentiment analysis. Synchronize your production with real-world demand
            clusters.
          </p>
        </div>

<<<<<<< HEAD
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
=======
        <div className="border-border-default flex items-center gap-2 rounded-2xl border bg-white p-1.5 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          {[
            { id: 'demand', label: 'Demand', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory', icon: Layers },
            { id: 'partners', label: 'Partners', icon: Users },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                activeLayer === layer.id
<<<<<<< HEAD
                  ? 'bg-slate-900 text-white shadow-xl'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
=======
                  ? 'bg-text-primary text-white shadow-xl'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              <layer.icon className="h-3.5 w-3.5" />
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-8">
<<<<<<< HEAD
          <Card className="group relative aspect-[16/10] overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
=======
          <Card className="bg-text-primary group relative aspect-[16/10] overflow-hidden rounded-xl border-none shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')] bg-cover bg-center opacity-20 grayscale" />

            {/* Interactive Nodes */}
            <div className="group/node absolute left-[20%] top-[30%]">
<<<<<<< HEAD
              <div className="absolute h-4 w-4 animate-ping rounded-full bg-indigo-500 opacity-75" />
              <div className="relative h-4 w-4 cursor-pointer rounded-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.8)]" />
              <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-32 -translate-x-1/2 rounded-xl bg-white p-3 opacity-0 shadow-2xl transition-all group-hover/node:opacity-100">
                <p className="text-[10px] font-black uppercase text-slate-900">New York</p>
                <p className="text-[8px] font-bold uppercase text-indigo-600">Demand: 94%</p>
=======
              <div className="bg-accent-primary absolute h-4 w-4 animate-ping rounded-full opacity-75" />
              <div className="bg-accent-primary relative h-4 w-4 cursor-pointer rounded-full shadow-[0_0_20px_rgba(79,70,229,0.8)]" />
              <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-32 -translate-x-1/2 rounded-xl bg-white p-3 opacity-0 shadow-2xl transition-all group-hover/node:opacity-100">
                <p className="text-text-primary text-[10px] font-black uppercase">New York</p>
                <p className="text-accent-primary text-[8px] font-bold uppercase">Demand: 94%</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>

            <div className="group/node absolute left-[50%] top-[40%]">
              <div className="absolute h-6 w-6 animate-ping rounded-full bg-emerald-500 opacity-75" />
              <div className="relative h-6 w-6 cursor-pointer rounded-full bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.8)]" />
              <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-32 -translate-x-1/2 rounded-xl bg-white p-3 opacity-0 shadow-2xl transition-all group-hover/node:opacity-100">
<<<<<<< HEAD
                <p className="text-[10px] font-black uppercase text-slate-900">Moscow</p>
=======
                <p className="text-text-primary text-[10px] font-black uppercase">Moscow</p>
>>>>>>> recover/cabinet-wip-from-stash
                <p className="text-[8px] font-bold uppercase text-emerald-600">Demand: 98%</p>
              </div>
            </div>

            <div className="group/node absolute bottom-[30%] right-[20%]">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-amber-500 opacity-75" />
              <div className="relative h-3 w-3 cursor-pointer rounded-full bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </div>

<<<<<<< HEAD
            <div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/80 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
=======
            <div className="bg-text-primary/90 absolute bottom-8 left-8 flex items-center gap-3 rounded-2xl border border-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="bg-accent-primary h-2 w-2 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                  High Potential
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
                  Active Growth
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
<<<<<<< HEAD
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">
=======
            <h4 className="text-text-primary text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Regional Performance
            </h4>
            <div className="space-y-4">
              {regions.map((r, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-900">{r.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold uppercase text-slate-400">
                        Sentiment
                      </span>
                      <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full bg-indigo-600" style={{ width: `${r.demand}%` }} />
=======
                  className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex items-center justify-between rounded-2xl border p-4 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-text-primary text-[10px] font-black uppercase">{r.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-[8px] font-bold uppercase">
                        Sentiment
                      </span>
                      <div className="bg-border-subtle h-1 w-12 overflow-hidden rounded-full">
                        <div
                          className="bg-accent-primary h-full"
                          style={{ width: `${r.demand}%` }}
                        />
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{r.trend}</p>
<<<<<<< HEAD
                    <p className="text-[8px] font-bold uppercase text-slate-400">Growth</p>
=======
                    <p className="text-text-muted text-[8px] font-bold uppercase">Growth</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 w-full rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest"
=======
              className="border-border-subtle h-12 w-full rounded-xl text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Generate Global Strategy
            </Button>
          </Card>

<<<<<<< HEAD
          <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-2xl">
=======
          <Card className="bg-accent-primary relative space-y-4 overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-20">
              <Sparkles className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-4">
<<<<<<< HEAD
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-200">
=======
              <h5 className="text-accent-primary/40 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                AI Market Prediction
              </h5>
              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-white/80">
                Expect a **15% surge** in demand for **Thermal Shells** in Northern Europe due to
                forecasted temperature drops in Q4.
              </p>
<<<<<<< HEAD
              <Button className="h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest text-indigo-600">
=======
              <Button className="text-accent-primary h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Allocate Stock
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
