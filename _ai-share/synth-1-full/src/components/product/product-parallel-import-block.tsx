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
    <Card className="relative overflow-hidden border-2 border-slate-100 bg-slate-50/20 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <ShieldCheck className="h-16 w-16 text-slate-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-700">
            Parallel Import Compliance
          </h4>
        </div>
        <Badge
          variant="outline"
          className="h-4 border-green-200 bg-white text-[9px] font-black uppercase text-green-700 shadow-sm"
        >
          Verified Chain
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <div className="text-[9px] font-black uppercase leading-none text-slate-400">
            Origin Chain
          </div>
          <div className="flex items-center gap-2">
            {pi.originChain.map((node, idx) => (
              <React.Fragment key={node}>
                <div className="max-w-[80px] truncate text-[10px] font-bold text-slate-600">
                  {node}
                </div>
                {idx < pi.originChain.length - 1 && (
                  <LinkIcon className="h-2.5 w-2.5 text-slate-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2.5">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold uppercase text-slate-500">
              Declaration of Origin
            </span>
          </div>
          <Badge
            variant="outline"
            className="h-3.5 cursor-pointer bg-slate-50 text-[8px] font-black text-slate-400 hover:bg-slate-100"
          >
            View Doc
          </Badge>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 text-[9px] font-bold uppercase italic leading-none text-slate-400">
        RF MinIndustry List Compliant • Documentation Vault v1.2
      </div>
    </Card>
  );
};
