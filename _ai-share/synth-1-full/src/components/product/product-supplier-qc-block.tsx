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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Factory className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
            Supplier QC Hub (ОТК)
          </h4>
        </div>
        <Badge className={`${statusColors[qc.status]} border-none text-[8px] font-black uppercase`}>
          {qc.status}
        </Badge>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-end justify-between">
            <span className="text-[14px] font-black text-slate-800">{qc.passRate}% Pass Rate</span>
            <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">
              Batch: {qc.batchId}
            </span>
          </div>
          <Progress value={qc.passRate} className="h-1.5 bg-slate-100 fill-emerald-500" />
        </div>
      </div>

      {qc.criticalDefects.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <div className="text-[8px] font-black uppercase tracking-widest text-rose-500">
            Logged Defects
          </div>
          {qc.criticalDefects.map((d, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded border border-rose-100 bg-white p-2 text-[10px] font-bold text-slate-600"
            >
              <AlertCircle className="h-3 w-3 text-rose-500" /> {d}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <div className="text-[10px] font-bold leading-tight text-slate-700">
            QC Report by {qc.supplierName}
            <div className="font-mono text-[8px] font-medium italic text-slate-400">
              Validated on {qc.inspectionDate}
            </div>
          </div>
        </div>
        <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">
          Download PDF
        </button>
      </div>
    </Card>
  );
}
