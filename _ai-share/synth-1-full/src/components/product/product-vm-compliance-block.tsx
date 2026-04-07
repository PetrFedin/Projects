'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, CheckCircle2, AlertCircle, History, ArrowRight } from 'lucide-react';
import { getVmComplianceScore } from '@/lib/fashion/vm-compliance';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductVmComplianceBlock({ product }: { product: Product }) {
  const compliance = getVmComplianceScore(product.sku);

  const statusColors = {
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Camera className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">VM Compliance Hub (Retail)</h4>
        </div>
        <Badge className={`${statusColors[compliance.photoReportStatus]} border-none uppercase text-[8px] font-black`}>
          {compliance.photoReportStatus}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-10">
         <div className="w-16 h-16 bg-white rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center shadow-md">
            <div className="text-[20px] font-black text-slate-800 leading-none">{compliance.planogramMatchScore}%</div>
            <div className="text-[7px] font-black text-slate-400 uppercase mt-1 tracking-widest leading-none">Match Score</div>
         </div>
         <div className="flex-1">
            <div className="text-[11px] font-black text-slate-700 mb-1 leading-tight">Visual Merch Audit: {compliance.storeId}</div>
            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase">
               <History className="w-3 h-3" /> Last Audit: {compliance.lastReportDate}
            </div>
         </div>
      </div>

      <div className="mb-4 space-y-1.5">
         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Compliance Notes</div>
         {compliance.complianceNotes.map((n, i) => (
           <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
              {compliance.photoReportStatus === 'approved' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
              {n}
           </div>
         ))}
      </div>

      <button className="w-full mt-2 h-9 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95">
         Upload Photo Report <ArrowRight className="w-3 h-3" />
      </button>
    </Card>
  );
}
