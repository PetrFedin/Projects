'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, AlertCircle, Clock, ShoppingBag } from 'lucide-react';
import { getLaunchReadiness } from '@/lib/fashion/launch-readiness';

export const ProductLaunchReadinessBlock: React.FC<{ product: Product }> = ({ product }) => {
  const r = getLaunchReadiness(product);

  const statusColors: Record<string, string> = {
    on_track: 'bg-green-50 text-green-700 border-green-200',
    at_risk: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    delayed: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
<<<<<<< HEAD
    <Card className="border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-indigo-700">
=======
    <Card className="border-accent-primary/15 bg-accent-primary/10 border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Season Launch Readiness
          </h4>
        </div>
        <Badge
          variant="outline"
          className={`text-[9px] font-black uppercase ${statusColors[r.launchStatus]}`}
        >
          {r.launchStatus.replace('_', ' ')}
        </Badge>
      </div>

      <div className="mb-4">
<<<<<<< HEAD
        <div className="mb-1.5 text-[10px] font-black uppercase leading-none text-slate-400">
          Target Holiday (RF)
        </div>
        <div className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-800">
          <ShoppingBag className="h-4 w-4 text-indigo-400" /> {r.targetHoliday}
=======
        <div className="text-text-muted mb-1.5 text-[10px] font-black uppercase leading-none">
          Target Holiday (RF)
        </div>
        <div className="text-text-primary flex items-center gap-2 text-lg font-black tracking-tight">
          <ShoppingBag className="text-accent-primary h-4 w-4" /> {r.targetHoliday}
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      <div className="space-y-2.5">
<<<<<<< HEAD
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
          <span>Overall Readiness</span>
          <span className="text-indigo-600">{r.stockReadiness}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-indigo-500 transition-all"
=======
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase">
          <span>Overall Readiness</span>
          <span className="text-accent-primary">{r.stockReadiness}%</span>
        </div>
        <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-accent-primary h-full transition-all"
>>>>>>> recover/cabinet-wip-from-stash
            style={{ width: `${r.stockReadiness}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div
<<<<<<< HEAD
          className={`flex items-center justify-between rounded border p-2 ${r.marketingContentReady ? 'border-green-100 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
        >
          <span className="text-[9px] font-black uppercase text-slate-500">Content</span>
          {r.marketingContentReady ? (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          ) : (
            <Clock className="h-3 w-3 text-slate-300" />
          )}
        </div>
        <div
          className={`flex items-center justify-between rounded border p-2 ${r.honestMarkReady ? 'border-green-100 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
        >
          <span className="text-[9px] font-black uppercase text-slate-500">Honest Mark</span>
          {r.honestMarkReady ? (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          ) : (
            <Clock className="h-3 w-3 text-slate-300" />
=======
          className={`flex items-center justify-between rounded border p-2 ${r.marketingContentReady ? 'border-green-100 bg-white' : 'bg-bg-surface2 border-border-subtle opacity-60'}`}
        >
          <span className="text-text-secondary text-[9px] font-black uppercase">Content</span>
          {r.marketingContentReady ? (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          ) : (
            <Clock className="text-text-muted h-3 w-3" />
          )}
        </div>
        <div
          className={`flex items-center justify-between rounded border p-2 ${r.honestMarkReady ? 'border-green-100 bg-white' : 'bg-bg-surface2 border-border-subtle opacity-60'}`}
        >
          <span className="text-text-secondary text-[9px] font-black uppercase">Honest Mark</span>
          {r.honestMarkReady ? (
            <CheckCircle2 className="h-3 w-3 text-green-500" />
          ) : (
            <Clock className="text-text-muted h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
          )}
        </div>
      </div>
    </Card>
  );
};
