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
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-secondary flex items-center gap-2">
          <Camera className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
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
        <div className="border-border-subtle flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 bg-white shadow-md">
          <div className="text-text-primary text-[20px] font-black leading-none">
            {compliance.planogramMatchScore}%
          </div>
          <div className="text-text-muted mt-1 text-[7px] font-black uppercase leading-none tracking-widest">
            Match Score
          </div>
        </div>
        <div className="flex-1">
          <div className="text-text-primary mb-1 text-[11px] font-black leading-tight">
            Visual Merch Audit: {compliance.storeId}
          </div>
          <div className="text-text-muted flex items-center gap-1 text-[8px] font-bold uppercase">
            <History className="h-3 w-3" /> Last Audit: {compliance.lastReportDate}
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-1.5">
        <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
          Compliance Notes
        </div>
        {compliance.complianceNotes.map((n, i) => (
          <div
            key={i}
            className="text-text-secondary border-border-subtle flex items-center gap-2 rounded-lg border bg-white p-2 text-[10px] font-bold shadow-sm"
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

      <button className="bg-text-primary hover:bg-text-primary/90 mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[9px] font-black uppercase text-white shadow-lg transition-all active:scale-95">
        Upload Photo Report <ArrowRight className="h-3 w-3" />
      </button>
    </Card>
  );
}
