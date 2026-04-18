'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Scissors,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hammer,
  Briefcase,
  History,
  Plus,
} from 'lucide-react';
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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Scissors className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Repair Hub & Atelier (Last-Mile Care)
          </h4>
        </div>
        <Badge
          className={`${statusColors[repair.status]} border-none text-[8px] font-black uppercase tracking-widest`}
        >
          {repair.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="mb-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-tighter text-slate-800">
            Request {repair.requestId}
          </div>
          <div className="text-[10px] font-black italic text-emerald-600">
            {repair.estimatedCost.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <Hammer className="h-3.5 w-3.5 text-indigo-500" /> Issue:{' '}
          <span className="font-black text-slate-900">{repair.issueType.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/30 p-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-600">
          <Briefcase className="h-3.5 w-3.5 text-indigo-500" />{' '}
          <span className="cursor-pointer underline">{repair.atelierId}</span>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">
          Est. Completion: 2-3 Days
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 text-[9px] font-black uppercase text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95">
          <Plus className="h-3.5 w-3.5" /> Log Repair
        </button>
        <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white text-[9px] font-black uppercase text-slate-600 transition-all hover:bg-slate-50">
          <History className="h-3.5 w-3.5" /> Care History
        </button>
      </div>
    </Card>
  );
}
