'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';
import { checkCapsuleIntegrity } from '@/lib/fashion/assortment-capsule';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductCapsuleIntegrityBlock({ product }: { product: Product }) {
  // Demo current session SKUs
  const capsule = checkCapsuleIntegrity(product.sku, ['SKU-101-TOP', 'SKU-101-ACC']);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <LayoutGrid className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">B2B Capsule Integrity</h4>
        </div>
        <Badge variant="outline" className="text-[8px] h-4 font-black uppercase bg-white border-slate-200">{capsule.capsuleId}</Badge>
      </div>

      <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm mb-4">
         <div className="flex justify-between items-center mb-2">
            <div className="text-[10px] font-black text-slate-800 uppercase">Capsule Health</div>
            <div className="text-[11px] font-black text-indigo-600">{capsule.integrityScore}%</div>
         </div>
         <Progress value={capsule.integrityScore} className="h-1 bg-slate-50 fill-indigo-600" />
      </div>

      <div className="space-y-3 mb-4">
         <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Components</div>
         {capsule.requiredSkus.map((req, i) => (
           <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100/50">
              <div className="flex items-center gap-2">
                 {capsule.missingSkus.includes(req) ? (
                   <div className="w-3.5 h-3.5 bg-amber-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-2 h-2 text-amber-600" />
                   </div>
                 ) : (
                   <div className="w-3.5 h-3.5 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                   </div>
                 )}
                 <div className={`text-[10px] font-bold ${capsule.missingSkus.includes(req) ? 'text-slate-400' : 'text-slate-800'}`}>{req}</div>
              </div>
              {capsule.missingSkus.includes(req) && (
                <button className="text-[8px] font-black text-indigo-600 uppercase tracking-tighter flex items-center gap-1 hover:underline">
                   Add <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
           </div>
         ))}
      </div>

      <div className="p-3 bg-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-indigo-100 relative overflow-hidden group/btn cursor-pointer">
         <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/btn:scale-125 transition-transform">
            <Sparkles className="w-12 h-12 text-white" />
         </div>
         <div className="text-[10px] font-black uppercase tracking-widest relative z-10">Optimize Capsule Mix</div>
         <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
}
