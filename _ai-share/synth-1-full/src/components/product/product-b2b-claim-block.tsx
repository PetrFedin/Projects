'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  History,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';
import { getB2BQualityClaim } from '@/lib/fashion/b2b-claims';
import type { Product } from '@/lib/types';

export function ProductB2BClaimBlock({ product }: { product: Product }) {
  const claim = getB2BQualityClaim(product.sku);

  const statusColors = {
    open: 'bg-rose-100 text-rose-700',
    under_review: 'bg-amber-100 text-amber-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    credit_note_issued: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-rose-50 bg-rose-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Active Quality Claim (B2B)
          </h4>
        </div>
        <Badge
          className={`${statusColors[claim.status]} border-none text-[8px] font-black uppercase`}
        >
          {claim.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="mb-4 rounded-xl border border-rose-100 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-start justify-between">
          <div className="text-[11px] font-black uppercase tracking-tighter text-slate-800">
            {claim.claimId}
          </div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
            {claim.createdAt}
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-600">
          Reason:{' '}
          <span className="font-black uppercase text-rose-600">
            {claim.reason.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {claim.evidenceUrls.map((url, i) => (
          <div
            key={i}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 transition-colors hover:bg-slate-200"
          >
            <ImageIcon className="h-4 w-4 text-slate-400" />
          </div>
        ))}
        <div className="text-[8px] font-black uppercase text-slate-400">
          Evidence Files Attached
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600 text-[8px] font-black uppercase text-white shadow-md">
          <MessageSquare className="h-3 w-3" /> Partner Chat
        </button>
        <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white text-[8px] font-black uppercase text-rose-600">
          <FileText className="h-3 w-3" /> Решение по претензии
        </button>
      </div>
    </Card>
  );
}
