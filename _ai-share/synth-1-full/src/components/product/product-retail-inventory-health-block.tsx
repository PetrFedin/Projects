'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  Package,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { getRetailInventoryHealth } from '@/lib/fashion/retail-inventory-health';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductRetailInventoryHealthBlock({ product }: { product: Product }) {
  const health = getRetailInventoryHealth(product.sku, 'Store-Moscow-Central');

  return (
    <Card
      className={cn(
        'relative my-4 overflow-hidden border-2 p-4 shadow-sm',
        health.status === 'critical'
          ? 'border-rose-100 bg-rose-50/10'
          : health.status === 'at_risk'
            ? 'border-amber-100 bg-amber-50/10'
            : 'border-emerald-100 bg-emerald-50/10'
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Activity className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Retail Inventory Health (Local Store)
          </h4>
        </div>
        <Badge
          className={cn(
            'border-none text-[8px] font-black uppercase text-white',
            health.status === 'healthy'
              ? 'bg-emerald-600'
              : health.status === 'excess'
                ? 'bg-blue-600'
                : 'bg-rose-600'
          )}
        >
          {health.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 p-3 shadow-sm">
            <div>
              <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                On Hand Stk.
              </div>
              <div className="text-2xl font-black text-slate-800">
                {health.onHand}{' '}
                <span className="text-xs font-bold uppercase text-slate-400">u.</span>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                Min. Buffer
              </div>
              <div className="text-lg font-black text-slate-500">{health.minBuffer} u.</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
              <TrendingUp className="h-3.5 w-3.5 text-sky-500" /> Stock Runway
            </div>
            <div className="text-[14px] font-black text-slate-800">
              12 Days <span className="text-[8px] uppercase text-slate-400">Estimated</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col justify-center rounded-xl border p-4',
            health.status === 'critical'
              ? 'border-rose-100 bg-rose-600/5'
              : 'border-emerald-100 bg-emerald-600/5'
          )}
        >
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase">
            <Info className="h-3.5 w-3.5" /> AI Action Insight
          </div>
          <p className="text-[10px] font-bold leading-tight text-slate-600">"{health.action}"</p>
          <Button
            className={cn(
              'mt-3 h-8 w-full text-[8px] font-black uppercase tracking-widest shadow-lg',
              health.status === 'healthy'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            )}
          >
            {health.status === 'excess' ? 'Initiate Swap' : 'Restock Store'}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Last Sync with PoS: Today, 14:45</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> RFID Data Verified
        </span>
      </div>
    </Card>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
