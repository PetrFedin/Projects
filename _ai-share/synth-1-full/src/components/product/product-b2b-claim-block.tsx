'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, History, CheckCircle2, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';
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
    <Card className="p-4 border-2 border-rose-50 bg-rose-50/5 shadow-sm my-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Active Quality Claim (B2B)</h4>
        </div>
        <Badge className={`${statusColors[claim.status]} border-none uppercase text-[8px] font-black`}>
          {claim.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-sm mb-4">
         <div className="flex justify-between items-start mb-2">
            <div className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{claim.claimId}</div>
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{claim.createdAt}</div>
         </div>
         <div className="text-[10px] font-bold text-slate-600">
            Reason: <span className="text-rose-600 font-black uppercase">{claim.reason.replace('_', ' ')}</span>
         </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
         {claim.evidenceUrls.map((url, i) => (
           <div key={i} className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
              <ImageIcon className="w-4 h-4 text-slate-400" />
           </div>
         ))}
         <div className="text-[8px] font-black text-slate-400 uppercase">Evidence Files Attached</div>
      </div>

      <div className="flex gap-2">
         <button className="flex-1 h-8 bg-rose-600 text-white rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-1.5 shadow-md">
            <MessageSquare className="w-3 h-3" /> Partner Chat
         </button>
         <button className="flex-1 h-8 bg-white border border-rose-200 text-rose-600 rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-1.5">
            <FileText className="w-3 h-3" /> View Resolution
         </button>
      </div>
    </Card>
  );
}
