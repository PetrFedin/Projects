'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoorOpen, ArrowRight, AlertTriangle, CheckCircle2, Info, Activity } from 'lucide-react';
import { getFittingRoomFeedback } from '@/lib/fashion/fitting-room-feedback';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductFittingRoomFeedbackBlock({ product }: { product: Product }) {
  const feedback = getFittingRoomFeedback(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-rose-50 bg-rose-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <DoorOpen className="h-16 w-16 text-rose-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-600">
          <DoorOpen className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Physical Retail Try-on Analytics
          </h4>
        </div>
        <Badge className="border-none bg-rose-600 text-[8px] font-black uppercase text-white">
          Conversion: {feedback.conversionRate}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-100 bg-white/80 p-3 shadow-sm">
<<<<<<< HEAD
            <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Top Rejection Reasons
            </div>
            <div className="space-y-1.5">
              {feedback.topReasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-rose-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-400" /> {r}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-rose-100 bg-white/50 p-2.5">
              <div className="text-[14px] font-black leading-none text-rose-600">
                {feedback.rejectedCount}
              </div>
<<<<<<< HEAD
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">Rejections</div>
=======
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">Rejections</div>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
            <div className="rounded-xl border border-rose-100 bg-white/50 p-2.5">
              <div className="text-[14px] font-black leading-none text-emerald-600">
                {feedback.conversionRate}%
              </div>
<<<<<<< HEAD
              <div className="mt-1 text-[7px] font-black uppercase text-slate-400">
=======
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Try-on Conv.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-rose-100 bg-rose-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-rose-600">
            <Activity className="h-3.5 w-3.5" /> Retail Trend Insight
          </div>
<<<<<<< HEAD
          <p className="text-[9px] font-bold leading-tight text-slate-600">
=======
          <p className="text-text-secondary text-[9px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
            "Customers love the fabric feel in physical stores. Most rejections are due to length
            mismatch in sizes L-XL."
          </p>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-rose-100 pt-4 text-[8px] font-black uppercase text-slate-400">
=======
      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-rose-100 pt-4 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
        <span>Data Aggregated from Flagship Staff App</span>
        <span className="text-rose-600">Sample-based Insights</span>
      </div>
    </Card>
  );
}
