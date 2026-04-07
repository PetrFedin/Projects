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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Digital Fitting Queue (Instore)</h4>
        </div>
        <Badge className={queue.isRushHour ? "bg-rose-100 text-rose-700 border-none uppercase text-[8px]" : "bg-emerald-100 text-emerald-700 border-none uppercase text-[8px]"}>
          {queue.isRushHour ? 'High Traffic' : 'Optimal'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
         <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="text-[18px] font-black text-slate-800 leading-none">{queue.estimatedWaitMinutes} min</div>
            <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Est. Wait Time</div>
         </div>
         <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="text-[18px] font-black text-slate-800 leading-none">{queue.activeWaitlistCount}</div>
            <div className="text-[8px] font-black text-slate-400 uppercase mt-1">Customers Ahead</div>
         </div>
      </div>

      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 mb-2 flex items-center gap-3">
         <Users className="w-4 h-4 text-indigo-500 shrink-0" />
         <p className="text-[9px] font-bold text-slate-600 leading-tight">
            Available Booths: <b>{queue.availableBooths}</b>. Clients can book a slot via the Store App or QR code.
         </p>
      </div>

      <Button variant="default" size="sm" className="w-full mt-2 h-9 text-[9px] font-black uppercase bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
         Add to Digital Queue <ArrowRight className="w-3 h-3" />
      </Button>
    </Card>
  );
}
