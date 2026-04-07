'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Ruler, Info, Box, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { getB2BTechPack } from '@/lib/fashion/tech-pack-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ProductB2BTechPackBlock({ product }: { product: Product }) {
  const techPack = getB2BTechPack(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Scissors className="w-16 h-16 text-slate-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Scissors className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">B2B Production Tech-Pack</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-slate-300 text-slate-500 uppercase">Spec-V1.2 Ready</Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-4">
            <div>
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1.5 tracking-widest flex items-center gap-2">
                  <Box className="w-3 h-3" /> Material & Construction
               </div>
               <p className="text-[10px] font-bold text-slate-700 leading-tight">
                  {techPack.fabricComposition}
               </p>
               <div className="text-[9px] text-slate-500 mt-1 italic">{techPack.constructionType}</div>
            </div>

            <div className="space-y-2">
               <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Size Specs (CM)</div>
               <div className="space-y-1">
                  {Object.entries(techPack.sizeSpecsCm).map(([label, val]) => (
                    <div key={label} className="flex justify-between items-center text-[9px] font-bold">
                       <span className="text-slate-500">{label}</span>
                       <span className="text-slate-800">{val} cm</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-3">
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-emerald-500" /> Trim & Hardware
            </div>
            <div className="space-y-2">
               {techPack.trims.map((trim, i) => (
                 <div key={i} className="p-2 bg-white/80 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[9px] font-black text-slate-800 uppercase leading-none">{trim.name}</div>
                    <div className="text-[7px] text-slate-500 uppercase mt-1">Source: {trim.source}</div>
                 </div>
               ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2">
               {techPack.careSymbols.map(sym => (
                 <Badge key={sym} variant="secondary" className="bg-slate-100 text-[7px] h-4 font-black uppercase text-slate-500">{sym}</Badge>
               ))}
            </div>
         </div>
      </div>

      <Button variant="ghost" className="w-full mt-4 h-8 text-[8px] font-black uppercase text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2 border border-slate-200">
         <Download className="w-3 h-3" /> Download PDF Production Spec <ChevronRight className="w-3 h-3" />
      </Button>
    </Card>
  );
}
