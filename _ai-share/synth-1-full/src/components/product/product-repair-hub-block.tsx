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
    received: 'bg-accent-primary/15 text-accent-primary',
    in_repair: 'bg-amber-100 text-amber-700',
    ready_for_pickup: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Repair Hub & Atelier (Last-Mile Care)
          </h4>
        </div>
        <Badge
          className={`${statusColors[repair.status]} border-none text-[8px] font-black uppercase tracking-widest`}
        >
          {repair.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="border-border-subtle mb-4 rounded-xl border bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-text-primary text-[11px] font-black uppercase tracking-tighter">
            Request {repair.requestId}
          </div>
          <div className="text-[10px] font-black italic text-emerald-600">
            {repair.estimatedCost.toLocaleString()} ₽
          </div>
        </div>
        <div className="text-text-secondary flex items-center gap-2 text-[10px] font-bold">
          <Hammer className="text-accent-primary h-3.5 w-3.5" /> Issue:{' '}
          <span className="text-text-primary font-black">{repair.issueType.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="bg-accent-primary/10 border-accent-primary/20 mb-4 flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="text-text-secondary flex items-center gap-2.5 text-[9px] font-bold">
          <Briefcase className="text-accent-primary h-3.5 w-3.5" />{' '}
          <span className="cursor-pointer underline">{repair.atelierId}</span>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">
          Est. Completion: 2-3 Days
        </div>
      </div>

      <div className="flex gap-2">
        <button className="bg-text-primary hover:bg-text-primary/90 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-all active:scale-95">
          <Plus className="h-3.5 w-3.5" /> Log Repair
        </button>
        <button className="border-border-subtle text-text-secondary hover:bg-bg-surface2 flex h-9 flex-1 items-center justify-center gap-2 rounded-xl border bg-white text-[9px] font-black uppercase transition-all">
          <History className="h-3.5 w-3.5" /> Care History
        </button>
      </div>
    </Card>
  );
}
