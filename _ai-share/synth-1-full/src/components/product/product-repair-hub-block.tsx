'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Clock, CheckCircle2, AlertTriangle, Hammer, Briefcase, History, Plus } from 'lucide-react';
import { getRepairHubStatus } from '@/lib/fashion/repair-hub';
import type { Product } from '@/lib/types';

export function ProductRepairHubBlock({ product }: { product: Product }) {
  const repair = getRepairHubStatus(product.sku);

  const statusColors = {
    received: 'bg-indigo-100 text-indigo-700',
    in_repair: 'bg-amber-100 text-amber-700',
    ready_for_pickup: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Scissors className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Repair Hub & Atelier (Last-Mile Care)</h4>
        </div>
        <Badge className={`${statusColors[repair.status]} border-none uppercase text-[8px] font-black tracking-widest`}>
          {repair.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
         <div className="flex justify-between items-center mb-2">
            <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Request {repair.requestId}</div>
            <div className="text-[10px] font-black text-emerald-600 italic">{repair.estimatedCost.toLocaleString()} ₽</div>
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
            <Hammer className="w-3.5 h-3.5 text-indigo-500" /> Issue: <span className="text-slate-900 font-black">{repair.issueType.replace('_', ' ')}</span>
         </div>
      </div>

      <div className="p-3 bg-indigo-50/30 rounded-lg border border-indigo-100 flex items-center justify-between shadow-sm mb-4">
         <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-600">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> <span className="underline cursor-pointer">{repair.atelierId}</span>
         </div>
         <div className="text-[8px] font-black text-slate-400 uppercase">Est. Completion: 2-3 Days</div>
      </div>

      <div className="flex gap-2">
         <button className="flex-1 h-9 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Log Repair
         </button>
         <button className="flex-1 h-9 bg-white border border-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all hover:bg-slate-50">
            <History className="w-3.5 h-3.5" /> Care History
         </button>
      </div>
    </Card>
  );
}
