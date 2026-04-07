'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Link as LinkIcon, FileText, Globe } from 'lucide-react';
import { verifyParallelImport } from '@/lib/fashion/parallel-import';

export const ProductParallelImportBlock: React.FC<{ product: Product }> = ({ product }) => {
  const pi = verifyParallelImport(product);
  
  if (pi.declarationStatus === 'missing') return null;

  return (
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/20 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
        <ShieldCheck className="w-16 h-16 text-slate-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-600" />
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-tight">Parallel Import Compliance</h4>
        </div>
        <Badge variant="outline" className="text-[9px] h-4 bg-white border-green-200 text-green-700 font-black uppercase shadow-sm">
          Verified Chain
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
           <div className="text-[9px] font-black text-slate-400 uppercase leading-none">Origin Chain</div>
           <div className="flex items-center gap-2">
              {pi.originChain.map((node, idx) => (
                <React.Fragment key={node}>
                  <div className="text-[10px] font-bold text-slate-600 truncate max-w-[80px]">{node}</div>
                  {idx < pi.originChain.length - 1 && <LinkIcon className="w-2.5 h-2.5 text-slate-300" />}
                </React.Fragment>
              ))}
           </div>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Declaration of Origin</span>
           </div>
           <Badge variant="outline" className="text-[8px] h-3.5 bg-slate-50 text-slate-400 font-black cursor-pointer hover:bg-slate-100">
              View Doc
           </Badge>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-bold uppercase italic leading-none">
         RF MinIndustry List Compliant • Documentation Vault v1.2
      </div>
    </Card>
  );
};
