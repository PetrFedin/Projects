'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Play, Info, ArrowRight } from 'lucide-react';
import { getStaffTrainingPack } from '@/lib/fashion/staff-training-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffTrainingBlock({ product }: { product: Product }) {
  const pack = getStaffTrainingPack(product.sku);

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <BookOpen className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Retail Staff Training Pack</h4>
        </div>
        <Badge className="bg-indigo-600 text-white text-[8px] font-black border-none uppercase">Technical Knowledge Base</Badge>
      </div>

      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-3">
            {pack.keySellingPointsRu.map((point, idx) => (
              <div key={idx} className="p-2.5 bg-white/80 rounded-xl border border-indigo-100 flex items-start gap-2">
                 <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                 <p className="text-[9px] font-bold text-slate-600 leading-tight">{point}</p>
              </div>
            ))}
         </div>

         <div className="p-3 bg-indigo-600/5 rounded-xl border border-indigo-100">
            <div className="text-[8px] font-black text-indigo-600 uppercase mb-1 tracking-widest flex items-center gap-1.5">
               <Info className="w-3 h-3" /> Fabric Technical Benefit
            </div>
            <p className="text-[10px] font-bold text-slate-700 leading-snug italic">
               "{pack.fabricBenefitRu}"
            </p>
         </div>

         <div className="flex gap-2">
            <Button variant="outline" className="h-8 flex-1 text-[8px] font-black uppercase border-indigo-200 text-indigo-600">
               View Competitor Matrix
            </Button>
            <Button className="h-8 flex-1 bg-indigo-600 text-white hover:bg-indigo-700 text-[8px] font-black uppercase shadow-sm">
               <Play className="w-3 h-3 mr-1.5" /> Launch Video Guide
            </Button>
         </div>
      </div>

      <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Expert sales advice included</span>
         <span className="text-indigo-600">Updated: Today</span>
      </div>
    </Card>
  );
}
