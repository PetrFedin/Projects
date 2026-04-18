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
    <Card className="border-border-subtle bg-bg-surface2/20 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
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
            <span className="text-text-primary text-[14px] font-black">
              {qc.passRate}% Pass Rate
            </span>
            <span className="text-text-muted text-[8px] font-black uppercase tracking-tighter">
              Batch: {qc.batchId}
            </span>
          </div>
          <Progress value={qc.passRate} className="bg-bg-surface2 h-1.5 fill-emerald-500" />
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
              className="text-text-secondary flex items-center gap-2 rounded border border-rose-100 bg-white p-2 text-[10px] font-bold"
            >
              <AlertCircle className="h-3 w-3 text-rose-500" /> {d}
            </div>
          ))}
        </div>
      )}

      <div className="border-border-subtle flex items-center justify-between rounded-lg border bg-white p-3">
        <div className="flex items-center gap-2">
          <FileText className="text-text-muted h-4 w-4" />
          <div className="text-text-primary text-[10px] font-bold leading-tight">
            QC Report by {qc.supplierName}
            <div className="text-text-muted font-mono text-[8px] font-medium italic">
              Validated on {qc.inspectionDate}
            </div>
          </div>
        </div>
        <button className="text-accent-primary text-[8px] font-black uppercase hover:underline">
          Download PDF
        </button>
      </div>
    </Card>
  );
}
