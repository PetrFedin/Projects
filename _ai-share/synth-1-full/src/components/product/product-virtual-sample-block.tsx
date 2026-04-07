'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Sparkles, Smartphone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getVirtualSampleData } from '@/lib/fashion/virtual-sample-fitting';
import type { Product } from '@/lib/types';

export function ProductVirtualSampleBlock({ product }: { product: Product }) {
  const vto = getVirtualSampleData(product.sku);

  if (!vto.has3dModel) return null;

  return (
    <Card className="p-4 border-2 border-indigo-100 bg-indigo-50/5 shadow-sm my-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
         <Box className="w-16 h-16 text-indigo-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Showroom Virtual Sample</h4>
        </div>
        <Badge className="bg-indigo-600 text-white border-none text-[8px] h-4 font-black uppercase">3D READY</Badge>
      </div>

      <div className="flex gap-4 mb-4">
         <div className="w-20 h-24 bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
            <User className="w-10 h-10 text-slate-400" />
         </div>
         <div className="flex-1">
            <div className="text-[11px] font-black text-slate-800 mb-1">VTO Digital Fitting</div>
            <p className="text-[9px] text-slate-500 mb-3 leading-tight">View this sample on multiple regional body archetypes.</p>
            <div className="flex flex-wrap gap-1.5">
               {vto.avatarTypes.map(type => (
                 <Badge key={type} variant="secondary" className="text-[7px] font-black h-3.5 uppercase bg-white border-slate-100">{type}</Badge>
               ))}
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-indigo-50 shadow-sm">
         <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-600">Fit Accuracy: {vto.fitAccuracy}%</span>
         </div>
         <button className="h-6 px-3 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase flex items-center gap-1.5 shadow-md">
            Launch VTO <Smartphone className="w-2.5 h-2.5" />
         </button>
      </div>
    </Card>
  );
}
