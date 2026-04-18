'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Wallet, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { simulateOrderImpact } from '@/lib/fashion/showroom-order-simulation';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductOrderSimulationBlock({ product }: { product: Product }) {
  const sim = simulateOrderImpact('SH-2026-01');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-600 bg-indigo-600 p-4 text-white shadow-2xl">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
        <Sparkles className="h-16 w-16 text-white" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-200">
          <BarChart3 className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
            B2B Order KPI Simulator
          </h4>
        </div>
        <Badge className="border-none bg-white/20 text-[8px] font-black uppercase text-white">
          AI Projection
        </Badge>
      </div>

      <div className="relative z-10 mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="mb-1 text-[8px] font-black uppercase text-indigo-200">
            Proj. Sell-Through
          </div>
          <div className="text-[20px] font-black leading-none">{sim.projectedSellThrough}%</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/10 p-3">
          <div className="mb-1 text-[8px] font-black uppercase text-indigo-200">Proj. Margin</div>
          <div className="text-[20px] font-black leading-none">{sim.projectedMargin}%</div>
        </div>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <div className="mb-1 flex items-end justify-between text-[9px] font-black uppercase tracking-widest">
            <span className="text-indigo-200">Inventory Turnover</span>
            <span>{sim.inventoryTurnoverWeeks} Weeks</span>
          </div>
          <Progress
            value={(sim.inventoryTurnoverWeeks / 12) * 100}
            className="h-1 bg-white/10 fill-emerald-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white p-3 text-slate-900 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-tighter">Markdown Risk</div>
            <div className="text-[14px] font-black text-indigo-600">{sim.markdownRiskScore}%</div>
          </div>
        </div>
        <button className="flex h-7 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[8px] font-black uppercase tracking-widest text-white transition-colors hover:bg-indigo-700">
          <RefreshCw className="h-2.5 w-2.5" /> Re-Simulate
        </button>
      </div>
    </Card>
  );
}
