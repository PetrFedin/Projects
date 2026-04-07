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
    <Card className="p-4 border-2 border-rose-50 bg-rose-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <DoorOpen className="w-16 h-16 text-rose-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-rose-600">
          <DoorOpen className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Physical Retail Try-on Analytics</h4>
        </div>
        <Badge className="bg-rose-600 text-white text-[8px] font-black border-none uppercase">Conversion: {feedback.conversionRate}%</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Top Rejection Reasons
               </div>
               <div className="space-y-1.5">
                  {feedback.topReasons.map((r, i) => (
                    <div key={i} className="text-[9px] font-black uppercase text-rose-600 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" /> {r}
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
               <div className="p-2.5 bg-white/50 rounded-xl border border-rose-100">
                  <div className="text-[14px] font-black text-rose-600 leading-none">{feedback.rejectedCount}</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Rejections</div>
               </div>
               <div className="p-2.5 bg-white/50 rounded-xl border border-rose-100">
                  <div className="text-[14px] font-black text-emerald-600 leading-none">{feedback.conversionRate}%</div>
                  <div className="text-[7px] font-black text-slate-400 uppercase mt-1">Try-on Conv.</div>
               </div>
            </div>
         </div>

         <div className="p-4 bg-rose-600/5 rounded-xl border border-rose-100 flex flex-col justify-center">
            <div className="text-[8px] font-black text-rose-600 uppercase mb-2 flex items-center gap-2">
               <Activity className="w-3.5 h-3.5" /> Retail Trend Insight
            </div>
            <p className="text-[9px] font-bold text-slate-600 leading-tight">
               "Customers love the fabric feel in physical stores. Most rejections are due to length mismatch in sizes L-XL."
            </p>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-rose-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Data Aggregated from Flagship Staff App</span>
         <span className="text-rose-600">Sample-based Insights</span>
      </div>
    </Card>
  );
}
