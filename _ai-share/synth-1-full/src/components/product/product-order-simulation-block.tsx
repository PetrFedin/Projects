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
    <Card className="p-4 border-2 border-indigo-600 bg-indigo-600 text-white shadow-2xl my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <Sparkles className="w-16 h-16 text-white" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-200">
          <BarChart3 className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">B2B Order KPI Simulator</h4>
        </div>
        <Badge className="bg-white/20 text-white border-none uppercase text-[8px] font-black">AI Projection</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
         <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <div className="text-[8px] font-black text-indigo-200 uppercase mb-1">Proj. Sell-Through</div>
            <div className="text-[20px] font-black leading-none">{sim.projectedSellThrough}%</div>
         </div>
         <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <div className="text-[8px] font-black text-indigo-200 uppercase mb-1">Proj. Margin</div>
            <div className="text-[20px] font-black leading-none">{sim.projectedMargin}%</div>
         </div>
      </div>

      <div className="space-y-4 mb-4">
         <div>
            <div className="flex justify-between items-end mb-1 text-[9px] font-black uppercase tracking-widest">
               <span className="text-indigo-200">Inventory Turnover</span>
               <span>{sim.inventoryTurnoverWeeks} Weeks</span>
            </div>
            <Progress value={(sim.inventoryTurnoverWeeks / 12) * 100} className="h-1 bg-white/10 fill-emerald-400" />
         </div>
      </div>

      <div className="p-3 bg-white rounded-xl border border-white/20 text-slate-900 flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
               <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-tighter">Markdown Risk</div>
               <div className="text-[14px] font-black text-indigo-600">{sim.markdownRiskScore}%</div>
            </div>
         </div>
         <button className="bg-indigo-600 text-white px-3 h-7 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-2.5 h-2.5" /> Re-Simulate
         </button>
      </div>
    </Card>
  );
}
