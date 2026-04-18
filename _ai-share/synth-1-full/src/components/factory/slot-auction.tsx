'use client';

import React, { useState } from 'react';
import {
  Factory,
  Gavel,
  Clock,
  Zap,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCcw,
  Info,
  Activity,
  Calendar,
  Layout,
  Grid2X2,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SLOTS = [
  {
    id: 's1',
    factory: 'Syntha Moscow 01',
    line: 'Line A (Outerwear)',
    capacity: '500 ед.',
    date: '12 фев - 18 фев',
    currentBid: '42,000 ₽',
    timeLeft: '02:45:12',
    bids: 12,
  },
  {
    id: 's2',
    factory: 'Textile Hub Spb',
    line: 'Line B (Knitwear)',
    capacity: '1,200 ед.',
    date: '05 мар - 15 мар',
    currentBid: '125,000 ₽',
    timeLeft: '14:20:00',
    bids: 8,
  },
  {
    id: 's3',
    factory: 'Denim Lab 04',
    line: 'Line D (Denim)',
    capacity: '300 ед.',
    date: '18 фев - 22 фев',
    currentBid: '28,500 ₽',
    timeLeft: '00:15:42',
    bids: 24,
  },
];

export function SlotAuction() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="p-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-200">
                <Gavel className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                Predictive Production Hub
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              Аукцион производственных слотов
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Выкупайте «горящие окна» на фабриках со скидкой до 30% или торгуйтесь за приоритетное
              производство.
            </CardDescription>
          </div>
<<<<<<< HEAD
          <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
=======
          <div className="bg-bg-surface2 border-border-default flex rounded-2xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
            <button
              onClick={() => setActiveTab('live')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all',
<<<<<<< HEAD
                activeTab === 'live' ? 'bg-white text-black shadow-sm' : 'text-slate-400'
=======
                activeTab === 'live' ? 'bg-white text-black shadow-sm' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              Live Торги
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-black uppercase transition-all',
<<<<<<< HEAD
                activeTab === 'upcoming' ? 'bg-white text-black shadow-sm' : 'text-slate-400'
=======
                activeTab === 'upcoming' ? 'bg-white text-black shadow-sm' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              Анонсы слотов
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-10 p-3 pt-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {MOCK_SLOTS.map((slot) => (
            <motion.div
              key={slot.id}
              whileHover={{ y: -10 }}
<<<<<<< HEAD
              className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Factory className="h-6 w-6 text-slate-400 transition-colors group-hover:text-amber-500" />
=======
              className="bg-bg-surface2 border-border-subtle group relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Factory className="text-text-muted h-6 w-6 transition-colors group-hover:text-amber-500" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <Badge className="animate-pulse border-none bg-rose-500 px-2 py-1 text-[8px] font-black uppercase text-white">
                  Live Auction
                </Badge>
              </div>

              <div className="mb-8 space-y-4">
                <div>
<<<<<<< HEAD
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {slot.factory}
                  </p>
                  <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">
=======
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    {slot.factory}
                  </p>
                  <h4 className="text-text-primary text-base font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    {slot.line}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[8px] font-black uppercase text-slate-400">Мощность</p>
                    <p className="text-xs font-black text-slate-900">{slot.capacity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-slate-400">Даты окна</p>
                    <p className="text-xs font-black text-indigo-600">{slot.date}</p>
=======
                    <p className="text-text-muted text-[8px] font-black uppercase">Мощность</p>
                    <p className="text-text-primary text-xs font-black">{slot.capacity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-text-muted text-[8px] font-black uppercase">Даты окна</p>
                    <p className="text-accent-primary text-xs font-black">{slot.date}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-[8px] font-black uppercase text-slate-400">
                      Текущая ставка (слот)
                    </p>
                    <p className="text-sm font-black tabular-nums text-slate-900">
=======
              <div className="border-border-subtle space-y-4 rounded-3xl border bg-white p-4 shadow-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-text-muted mb-1 text-[8px] font-black uppercase">
                      Текущая ставка (слот)
                    </p>
                    <p className="text-text-primary text-sm font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                      {slot.currentBid}
                    </p>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <p className="mb-1 text-[8px] font-black uppercase text-slate-400">Ставок</p>
                    <p className="text-sm font-black tabular-nums text-indigo-600">{slot.bids}</p>
=======
                    <p className="text-text-muted mb-1 text-[8px] font-black uppercase">Ставок</p>
                    <p className="text-accent-primary text-sm font-black tabular-nums">
                      {slot.bids}
                    </p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                  <Clock className="h-3 w-3" />
                  До конца: {slot.timeLeft}
                </div>
              </div>

              <Button className="mt-6 h-10 w-full rounded-[1.5rem] bg-black text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:bg-amber-500">
                Сделать ставку +5,000 ₽
              </Button>

              {/* Background pattern */}
              <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
                <Gavel className="h-32 w-32" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive Insight */}
<<<<<<< HEAD
        <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
=======
        <div className="bg-text-primary relative flex items-center justify-between overflow-hidden rounded-xl p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Zap className="h-32 w-32" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl">
=======
            <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-3xl shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              <RefreshCcw className="animate-spin-slow h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-tighter">
                AI Production Predictor
              </h4>
              <p className="text-sm font-medium text-white/60">
                Система прогнозирует высвобождение мощностей на 3-х фабриках через 48 часов. Будьте
                готовы к торгам.
              </p>
            </div>
          </div>
          <div className="relative z-10 flex gap-3">
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-white/20 px-6 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10"
            >
              Настроить алерты
            </Button>
<<<<<<< HEAD
            <Button className="h-12 rounded-2xl bg-white px-8 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-2xl hover:bg-slate-100">
=======
            <Button className="text-text-primary hover:bg-bg-surface2 h-12 rounded-2xl bg-white px-8 text-[9px] font-black uppercase tracking-widest shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              Анализ мощностей
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
