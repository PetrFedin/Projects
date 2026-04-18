'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { getFittingRoomQueue } from '@/lib/fashion/fitting-room-queue';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductFittingRoomQueueBlock({ product }: { product: Product }) {
  const queue = getFittingRoomQueue(product.sku);

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Digital Fitting Queue (Instore)
          </h4>
        </div>
        <Badge
          className={
            queue.isRushHour
              ? 'border-none bg-rose-100 text-[8px] uppercase text-rose-700'
              : 'border-none bg-emerald-100 text-[8px] uppercase text-emerald-700'
          }
        >
          {queue.isRushHour ? 'High Traffic' : 'Optimal'}
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
<<<<<<< HEAD
        <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
          <div className="text-[18px] font-black leading-none text-slate-800">
            {queue.estimatedWaitMinutes} min
          </div>
          <div className="mt-1 text-[8px] font-black uppercase text-slate-400">Est. Wait Time</div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
          <div className="text-[18px] font-black leading-none text-slate-800">
            {queue.activeWaitlistCount}
          </div>
          <div className="mt-1 text-[8px] font-black uppercase text-slate-400">Customers Ahead</div>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
        <Users className="h-4 w-4 shrink-0 text-indigo-500" />
        <p className="text-[9px] font-bold leading-tight text-slate-600">
=======
        <div className="border-border-subtle rounded-xl border bg-white p-3 text-center shadow-sm">
          <div className="text-text-primary text-[18px] font-black leading-none">
            {queue.estimatedWaitMinutes} min
          </div>
          <div className="text-text-muted mt-1 text-[8px] font-black uppercase">Est. Wait Time</div>
        </div>
        <div className="border-border-subtle rounded-xl border bg-white p-3 text-center shadow-sm">
          <div className="text-text-primary text-[18px] font-black leading-none">
            {queue.activeWaitlistCount}
          </div>
          <div className="text-text-muted mt-1 text-[8px] font-black uppercase">
            Customers Ahead
          </div>
        </div>
      </div>

      <div className="bg-accent-primary/10 border-accent-primary/20 mb-2 flex items-center gap-3 rounded-lg border p-3">
        <Users className="text-accent-primary h-4 w-4 shrink-0" />
        <p className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
          Available Booths: <b>{queue.availableBooths}</b>. Clients can book a slot via the Store
          App or QR code.
        </p>
      </div>

      <Button
        variant="default"
        size="sm"
<<<<<<< HEAD
        className="mt-2 flex h-9 w-full items-center justify-center gap-2 bg-indigo-600 text-[9px] font-black uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700"
=======
        className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 mt-2 flex h-9 w-full items-center justify-center gap-2 text-[9px] font-black uppercase shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
      >
        Add to Digital Queue <ArrowRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
