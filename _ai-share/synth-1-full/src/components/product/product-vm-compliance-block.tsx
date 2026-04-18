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
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <Camera className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            VM Compliance Hub (Retail)
          </h4>
        </div>
        <Badge
          className={`${statusColors[compliance.photoReportStatus]} border-none text-[8px] font-black uppercase`}
        >
          {compliance.photoReportStatus}
        </Badge>
      </div>

      <div className="relative z-10 mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 border-slate-100 bg-white shadow-md">
          <div className="text-[20px] font-black leading-none text-slate-800">
            {compliance.planogramMatchScore}%
          </div>
          <div className="mt-1 text-[7px] font-black uppercase leading-none tracking-widest text-slate-400">
            Match Score
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1 text-[11px] font-black leading-tight text-slate-700">
            Visual Merch Audit: {compliance.storeId}
          </div>
          <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-slate-400">
            <History className="h-3 w-3" /> Last Audit: {compliance.lastReportDate}
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-1.5">
        <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
          Compliance Notes
        </div>
        {compliance.complianceNotes.map((n, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 text-[10px] font-bold text-slate-600 shadow-sm"
          >
            {compliance.photoReportStatus === 'approved' ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            )}
            {n}
          </div>
        ))}
      </div>

      <button className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[9px] font-black uppercase text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95">
        Upload Photo Report <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
