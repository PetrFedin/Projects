'use client';

import React from 'react';
import { TrendingUp, Zap, Boxes, Calculator } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function OrderAnalyticsTab() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none shadow-xl bg-white p-4 space-y-4 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-900">Sell-Through Forecast</h4>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-slate-900">78.4%</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated by week 12</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[78%]" />
          </div>
        </Card>

        <Card className="border-none shadow-xl bg-white p-4 space-y-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-indigo-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-900">Margin Optimization</h4>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-slate-900">64.2%</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Projected Net Margin</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[64%]" />
          </div>
        </Card>

        <Card className="border-none shadow-xl bg-white p-4 space-y-4 rounded-xl">
          <div className="flex items-center gap-3">
            <Boxes className="h-5 w-5 text-amber-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-900">Stock Balance</h4>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-slate-900">Optimal</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Size curve distribution</p>
          </div>
          <div className="flex gap-1">
            {[40, 70, 90, 60, 30].map((h, i) => (
              <div key={i} className="flex-1 bg-amber-100 rounded-sm" style={{ height: '20px' }}>
                <div className="bg-amber-500 w-full rounded-sm" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-2xl bg-slate-900 text-white p-3 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Calculator className="h-32 w-32" />
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3 text-left">
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-tight">AI Budget Advisor</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Based on your last season sales in **Moscow Hub**, we recommend increasing **Outerwear** allocation by 15% while reducing **Basics** to avoid markdowns.
            </p>
            <Button className="bg-white text-slate-900 rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest">Apply AI Rebalancing</Button>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="space-y-4">
              {[
                { label: 'Projected Revenue', val: '4.2M ₽' },
                { label: 'Projected Profit', val: '2.7M ₽' },
                { label: 'Break-even Point', val: 'Day 42' }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-white/40 uppercase">{s.label}</span>
                  <span className="text-sm font-black">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
