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
    <Card className="border-border-subtle bg-bg-surface2/20 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <ShieldCheck className="text-text-muted h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-primary text-xs font-bold uppercase tracking-tight">
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
          <div className="text-text-muted text-[9px] font-black uppercase leading-none">
            Origin Chain
          </div>
          <div className="flex items-center gap-2">
            {pi.originChain.map((node, idx) => (
              <React.Fragment key={node}>
                <div className="text-text-secondary max-w-[80px] truncate text-[10px] font-bold">
                  {node}
                </div>
                {idx < pi.originChain.length - 1 && (
                  <LinkIcon className="text-text-muted h-2.5 w-2.5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="border-border-subtle flex items-center justify-between rounded-lg border bg-white p-2.5">
          <div className="flex items-center gap-2">
            <FileText className="text-text-muted h-3.5 w-3.5" />
            <span className="text-text-secondary text-[10px] font-bold uppercase">
              Declaration of Origin
            </span>
          </div>
          <Badge
            variant="outline"
            className="bg-bg-surface2 text-text-muted hover:bg-bg-surface2 h-3.5 cursor-pointer text-[8px] font-black"
          >
            View Doc
          </Badge>
        </div>
      </div>

      <div className="border-border-subtle text-text-muted mt-4 border-t pt-3 text-[9px] font-bold uppercase italic leading-none">
        RF MinIndustry List Compliant • Documentation Vault v1.2
      </div>
    </Card>
  );
};
