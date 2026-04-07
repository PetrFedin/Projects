'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout, Boxes, ArrowRight, Layers, Info } from 'lucide-react';
import { generateVMPlanogram } from '@/lib/fashion/vm-planogram';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductVMPlanogramBlock({ product }: { product: Product }) {
  const planograms = generateVMPlanogram([product.sku]);
  const vm = planograms[0];

  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Layout className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Layout className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Visual Merchandising Planogram</h4>
        </div>
        <Badge className="bg-indigo-600 text-white text-[8px] font-black border-none uppercase">Priority: {vm.priorityLevel === 1 ? 'High' : 'Normal'}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-indigo-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <Boxes className="w-3 h-3" /> Display Instructions
               </div>
               <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-[10px] font-black uppercase border-indigo-200 text-indigo-600 px-3">{vm.displayType}</Badge>
                  <div className="text-[9px] font-bold text-slate-600 leading-tight">
                     {vm.technicalNotes}
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Suggested Capsule Neighbors
               </div>
               <div className="flex gap-2">
                  {vm.suggestedNeighbors.map(n => (
                    <div key={n} className="w-10 h-12 bg-slate-100 rounded border border-indigo-100 flex items-center justify-center text-[7px] font-black text-slate-400 uppercase">
                       {n}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="p-4 bg-indigo-600/5 rounded-xl border border-indigo-100 flex flex-col justify-center text-center">
            <Info className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-[9px] font-bold text-slate-600 leading-tight">
               "This item is a core driver for SS26 retail floor traffic. Recommended for window mannequin placement."
            </p>
         </div>
      </div>

      <Button variant="ghost" className="w-full mt-3 h-8 text-[8px] font-black uppercase text-indigo-500 hover:bg-indigo-50 flex items-center justify-center gap-2">
         Download Full VM Guide <ArrowRight className="w-3 h-3" />
      </Button>
    </Card>
  );
}
