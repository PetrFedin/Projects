'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Globe,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Share2,
  PieChart,
  LayoutGrid,
  Zap,
  Map,
  Layers,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

export function ChannelSalesAnalytics() {
  const [activeChannel, setActiveChannel] = useState<
    'all' | 'direct' | 'wholesale' | 'marketplace'
  >('all');

  const channels = [
    { id: 'all', label: 'Все каналы', icon: Globe, sales: '84.2M ₽', change: '+12.4%' },
    { id: 'direct', label: 'Прямые (DTC)', icon: ShoppingBag, sales: '32.1M ₽', change: '+18.2%' },
    { id: 'wholesale', label: 'Оптовые', icon: LayoutGrid, sales: '45.5M ₽', change: '+8.4%' },
    { id: 'marketplace', label: 'Маркетплейсы', icon: BarChart3, sales: '6.6M ₽', change: '-2.1%' },
  ];

  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-3 text-left">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <PieChart className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
            >
              SALES_INTEL_v4.0
            </Badge>
          </div>
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
            Аналитика
            <br />
            Продаж по Каналам
          </h2>
          <p className="max-w-md text-xs font-medium text-slate-400">
            Консолидированные показатели эффективности в реальном времени: DTC, оптовые партнеры и
            маркетплейсы.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-2xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="h-4 w-4" /> Экспорт отчета
          </Button>
          <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
            <Share2 className="h-4 w-4" /> Поделиться
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {channels.map((ch) => (
          <Card
            key={ch.id}
            onClick={() => setActiveChannel(ch.id as any)}
            className={cn(
              'cursor-pointer overflow-hidden rounded-xl border-none shadow-xl transition-all',
              activeChannel === ch.id ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50'
            )}
          >
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    activeChannel === ch.id
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-50 text-slate-400'
                  )}
                >
                  <ch.icon className="h-5 w-5" />
                </div>
                <Badge
                  className={cn(
                    'border-none px-2 py-0.5 text-[8px] font-black',
                    ch.change.startsWith('+')
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  )}
                >
                  {ch.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    'text-[9px] font-black uppercase tracking-widest',
                    activeChannel === ch.id ? 'text-white/40' : 'text-slate-400'
                  )}
                >
                  {ch.label}
                </p>
                <p className="text-sm font-black">{ch.sales}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
              Динамика выручки
            </h4>
            <div className="flex gap-2">
              {['7D', '30D', '90D', 'YTD'].map((p) => (
                <button
                  key={p}
                  className={cn(
                    'rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                    p === '30D' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-80 items-end gap-3 px-4">
            {[30, 45, 35, 60, 55, 80, 75, 90, 85, 100, 95, 110].map((h, i) => (
              <div key={i} className="flex-1 space-y-3">
                <div className="group relative">
                  <div
                    className="w-full rounded-t-lg bg-indigo-600 transition-all duration-1000 group-hover:bg-indigo-400"
                    style={{ height: `${h * 2}px` }}
                  />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[8px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {(h * 100).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <span className="block text-center text-[8px] font-black uppercase text-slate-300">
                  W{i + 1}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Zap className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">
                AI Лидер продаж
              </h5>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                  <img
                    src="https://placehold.co/100x100?text=Top"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase">Cyber Tech Parka v2</p>
                  <p className="text-[10px] font-bold text-emerald-400">Sell-through: 92%</p>
                </div>
              </div>
              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-slate-400">
                Генерирует 24% выручки DTC. Рекомендуем увеличить производство для SS27.
              </p>
            </div>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <h5 className="text-sm font-black uppercase text-slate-900">Географическая карта</h5>
            <div className="space-y-4">
              {[
                { region: 'Москва Хаб', share: '42%', trend: 'up' },
                { region: 'Дубай / ОАЭ', share: '28%', trend: 'up' },
                { region: 'Милан Ритейл', share: '15%', trend: 'down' },
                { region: 'Другие', share: '15%', trend: 'neutral' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold uppercase text-slate-600">
                      {r.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-900">{r.share}</span>
                    {r.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    ) : r.trend === 'down' ? (
                      <ArrowDownRight className="h-3 w-3 text-rose-500" />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="h-10 w-full rounded-xl border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
            >
              Открыть полную карту
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
