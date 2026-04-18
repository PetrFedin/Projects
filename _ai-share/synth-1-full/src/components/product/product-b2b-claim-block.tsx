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
    credit_note_issued: 'bg-accent-primary/15 text-accent-primary',
  };

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-rose-50 bg-rose-50/5 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
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
          <div className="text-text-primary text-[11px] font-black uppercase tracking-tighter">
            {claim.claimId}
          </div>
          <div className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
            {claim.createdAt}
          </div>
        </div>
        <div className="text-text-secondary text-[10px] font-bold">
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
            className="bg-bg-surface2 border-border-default hover:bg-bg-surface2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <ImageIcon className="text-text-muted h-4 w-4" />
          </div>
        ))}
        <div className="text-text-muted text-[8px] font-black uppercase">
          Evidence Files Attached
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600 text-[8px] font-black uppercase text-white shadow-md">
          <MessageSquare className="h-3 w-3" /> Partner Chat
        </button>
        <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white text-[8px] font-black uppercase text-rose-600">
          <FileText className="h-3 w-3" /> View Resolution
        </button>
      </div>
    </Card>
  );
}
