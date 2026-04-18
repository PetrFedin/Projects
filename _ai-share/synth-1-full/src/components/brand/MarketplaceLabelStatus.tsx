'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronRight,
  ArrowRight,
  Download,
  Barcode,
  ArrowRightLeft,
  Truck,
  Package,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function MarketplaceLabelStatus() {
  const MARKETPLACES = [
    {
      name: 'Wildberries',
      status: 'Ready',
      count: '1,240 КМ',
      icon: ShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      name: 'Ozon',
      status: 'In Review',
      count: '850 КМ',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      name: 'Lamoda',
      status: 'Pending',
      count: '0 КМ',
      icon: ShoppingBag,
      color: 'text-slate-900',
      bg: 'bg-slate-50',
      border: 'border-slate-100',
    },
  ];

  return (
    <Card className="group h-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-indigo-50/20 p-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <Barcode className="h-4 w-4 text-indigo-600" />
            Этикетки Маркетплейсов (WB/Ozon/LMD)
          </CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
            Генерация штрих-кодов и стикеров для маркетплейсов.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-slate-100 text-slate-400 shadow-sm hover:bg-white hover:text-indigo-600"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          {MARKETPLACES.map((mp, i) => (
            <div
              key={i}
              className={cn(
                'group/mp flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all',
                mp.bg,
                mp.border
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shadow-sm',
                    mp.color,
                    'border border-slate-100 bg-white'
                  )}
                >
                  <mp.icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                    {mp.name}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    {mp.count}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  className={cn(
                    'h-3.5 border-none px-1 text-[7px] font-black uppercase',
                    mp.status === 'Ready'
                      ? 'bg-emerald-500 text-white'
                      : mp.status === 'In Review'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                  )}
                >
                  {mp.status}
                </Badge>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover/mp:text-indigo-600" />
              </div>
            </div>
          ))}
        </div>

        <div className="group/dark relative space-y-3 overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl transition-all group-hover/dark:bg-indigo-500/10"></div>
          <div className="relative z-10 flex items-center gap-2">
            <Zap className="h-4 w-4 animate-pulse fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Auto-Aggregation AI
            </span>
          </div>
          <p className="relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-300">
            Генерация коробов и паллетных листов с привязкой КИЗ Честного Знака.
          </p>
          <Button className="h-8 w-full rounded-lg border-none bg-indigo-600 text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-indigo-500">
            Сформировать поставку <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
          <ShieldCheck className="h-3 w-3 text-indigo-500" /> Интегрировано с ГИС МТ и API
          Маркетплейсов
        </div>
      </CardContent>
    </Card>
  );
}
