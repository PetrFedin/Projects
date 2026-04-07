'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, BookOpen, Quote, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { getStaffKnowledgePack } from '@/lib/fashion/staff-knowledge-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffKnowledgeBlock({ product }: { product: Product }) {
  const pack = getStaffKnowledgePack(product);

  return (
    <Card className="p-4 border-2 border-sky-50 bg-sky-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <GraduationCap className="w-16 h-16 text-sky-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sky-600">
          <GraduationCap className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Retail Staff Sales & Tech Guide</h4>
        </div>
        <Badge className="bg-sky-600 text-white text-[8px] font-black border-none uppercase">Staff App Sync</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-4">
            <div className="p-3 bg-white/80 rounded-xl border border-sky-100 shadow-sm">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <Quote className="w-3.5 h-3.5 text-sky-400" /> Sales Pitch Script
               </div>
               <p className="text-[10px] font-bold text-slate-600 leading-tight italic">
                  "{pack.stylingScript}"
               </p>
            </div>
            
            <div className="p-3 bg-white/50 rounded-xl border border-sky-100">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Tech Highlight
               </div>
               <p className="text-[9px] font-black text-slate-800 leading-tight">
                  {pack.technicalEdge}
               </p>
            </div>
         </div>

         <div className="p-4 bg-sky-600/5 rounded-xl border border-sky-100 flex flex-col justify-center">
            <div className="text-[8px] font-black text-sky-600 uppercase mb-2 flex items-center gap-2">
               <Info className="w-3.5 h-3.5" /> Care & Handling (Staff)
            </div>
            <p className="text-[10px] font-bold text-slate-600 leading-tight">
               {pack.careInstructionsForStaff}
            </p>
            <Separator className="my-2 bg-sky-100" />
            <p className="text-[9px] text-slate-500 italic">
               "{pack.materialsDescription}"
            </p>
         </div>
      </div>

      <Button variant="ghost" className="w-full mt-3 h-8 text-[8px] font-black uppercase text-sky-500 hover:bg-sky-50 flex items-center justify-center gap-2">
         Send to Staff Mobile App <ArrowRight className="w-3 h-3" />
      </Button>
    </Card>
  );
}
