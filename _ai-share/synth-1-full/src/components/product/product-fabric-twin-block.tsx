'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Boxes, Zap, ShieldCheck, Droplets, Wind, RefreshCw, Layers, Info } from 'lucide-react';
import { getFabricTwinData } from '@/lib/fashion/fabric-digital-twin';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductFabricTwinBlock({ product }: { product: Product }) {
  const twin = getFabricTwinData(product.sku);

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-white shadow-sm my-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <Layers className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Digital Twin: Fabric Performance</h4>
        </div>
        <Badge className="bg-indigo-50 text-indigo-700 text-[8px] font-black border-none uppercase">
          Technical Spec V1.2
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div className="space-y-1.5">
           <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
              <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Martindale</span>
              <span className="text-slate-700">{twin.martindaleCycles.toLocaleString()}</span>
           </div>
           <Progress value={(twin.martindaleCycles / 50000) * 100} className="h-1 bg-slate-50 fill-indigo-500" />
        </div>

        <div className="space-y-1.5">
           <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
              <span className="flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Color Fastness</span>
              <span className="text-slate-700">{twin.colorFastness}/5</span>
           </div>
           <Progress value={(twin.colorFastness / 5) * 100} className="h-1 bg-slate-50 fill-emerald-500" />
        </div>

        <div className="space-y-1.5">
           <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
              <span className="flex items-center gap-1"><Wind className="w-2.5 h-2.5" /> Breathability</span>
              <span className="text-slate-700">{twin.breathabilityGsm} g/m²</span>
           </div>
           <Progress value={(twin.breathabilityGsm / 300) * 100} className="h-1 bg-slate-50 fill-blue-400" />
        </div>

        <div className="space-y-1.5">
           <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
              <span className="flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5" /> Wash Life</span>
              <span className="text-slate-700">{twin.washDurability} Cycles</span>
           </div>
           <Progress value={(twin.washDurability / 100) * 100} className="h-1 bg-slate-50 fill-rose-400" />
        </div>
      </div>

      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex gap-2 items-start">
         <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-[9px] text-slate-500 font-medium leading-tight">
            <b>Цифровой паспорт материала:</b> Высокая устойчивость к истиранию (Martindale 45k+) и стабильность цвета. Идеально для повседневной эксплуатации в РФ условиях.
         </div>
      </div>
    </Card>
  );
}
