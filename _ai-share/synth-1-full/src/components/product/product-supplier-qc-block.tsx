'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertCircle, CheckCircle2, History, Factory, FileText } from 'lucide-react';
import { getSupplierQcReport } from '@/lib/fashion/supplier-qc-hub';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductSupplierQcBlock({ product }: { product: Product }) {
  const qc = getSupplierQcReport(product.sku);

  const statusColors = {
    approved: 'bg-emerald-500 text-white',
    rejected: 'bg-rose-500 text-white',
    rework: 'bg-amber-500 text-white',
  };

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">Supplier QC Hub (ОТК)</h4>
        </div>
        <Badge className={`${statusColors[qc.status]} border-none uppercase text-[8px] font-black`}>
          {qc.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-6">
         <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
               <span className="text-[14px] font-black text-slate-800">{qc.passRate}% Pass Rate</span>
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Batch: {qc.batchId}</span>
            </div>
            <Progress value={qc.passRate} className="h-1.5 bg-slate-100 fill-emerald-500" />
         </div>
      </div>

      {qc.criticalDefects.length > 0 && (
        <div className="mb-4 space-y-1.5">
           <div className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Logged Defects</div>
           {qc.criticalDefects.map((d, i) => (
             <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-white p-2 rounded border border-rose-100">
                <AlertCircle className="w-3 h-3 text-rose-500" /> {d}
             </div>
           ))}
        </div>
      )}

      <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <div className="text-[10px] font-bold text-slate-700 leading-tight">
               QC Report by {qc.supplierName}
               <div className="text-[8px] font-medium text-slate-400 font-mono italic">Validated on {qc.inspectionDate}</div>
            </div>
         </div>
         <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">Download PDF</button>
      </div>
    </Card>
  );
}
