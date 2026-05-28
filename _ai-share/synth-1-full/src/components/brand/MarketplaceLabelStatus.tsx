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
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/10',
      border: 'border-accent-primary/20',
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
      color: 'text-text-primary',
      bg: 'bg-bg-surface2',
      border: 'border-border-subtle',
    },
  ];

  return (
    <Card className="border-border-subtle group h-full overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardHeader className="border-border-subtle bg-accent-primary/10 flex flex-row items-center justify-between border-b p-4">
        <div className="space-y-0.5">
          <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Barcode className="text-accent-primary h-4 w-4" />
            Этикетки Маркетплейсов (WB/Ozon/LMD)
          </CardTitle>
          <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
            Генерация штрих-кодов и стикеров для маркетплейсов.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-muted hover:text-accent-primary border-border-subtle h-7 w-7 rounded-lg border shadow-sm hover:bg-white"
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
                    'border-border-subtle border bg-white'
                  )}
                >
                  <mp.icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-text-primary text-[10px] font-black uppercase tracking-tight">
                    {mp.name}
                  </p>
                  <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
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
                        : 'bg-border-subtle text-text-muted'
                  )}
                >
                  {mp.status}
                </Badge>
                <ChevronRight className="text-text-muted group-hover/mp:text-accent-primary h-3.5 w-3.5 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-text-primary group/dark relative space-y-3 overflow-hidden rounded-2xl p-4 text-white shadow-md shadow-xl">
          <div className="group-hover/dark:bg-accent-primary/10 absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/5 blur-2xl transition-all"></div>
          <div className="relative z-10 flex items-center gap-2">
            <Zap className="h-4 w-4 animate-pulse fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Auto-Aggregation AI
            </span>
          </div>
          <p className="text-text-muted relative z-10 text-[9px] font-bold uppercase leading-relaxed tracking-tight">
            Генерация коробов и паллетных листов с привязкой КИЗ Честного Знака.
          </p>
          <Button className="bg-accent-primary hover:bg-accent-primary h-8 w-full rounded-lg border-none text-[8px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all">
            Сформировать поставку <ArrowRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-text-muted flex items-center justify-center gap-2 text-[8px] font-bold uppercase tracking-widest">
          <ShieldCheck className="text-accent-primary h-3 w-3" /> Интегрировано с ГИС МТ и API
          Маркетплейсов
        </div>
      </CardContent>
    </Card>
  );
}
