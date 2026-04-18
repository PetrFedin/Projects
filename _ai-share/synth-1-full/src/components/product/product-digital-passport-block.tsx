'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileText, QrCode, Globe, Info } from 'lucide-react';
import { getEaeuPassport } from '@/lib/fashion/digital-passport-eaeu';

export const ProductDigitalPassportBlock: React.FC<{ product: Product }> = ({ product }) => {
  const p = getEaeuPassport(product);

  return (
    <Card className="border-2 border-emerald-50 bg-emerald-50/10 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-emerald-700">
            Digital Product Passport (EAEU)
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500">
          <Globe className="h-3 w-3" /> Compliance OK
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded border border-emerald-100 bg-white p-2 shadow-sm">
            <QrCode className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
              Declaration No.
            </div>
            <div className="truncate text-[11px] font-bold text-slate-700">
              {p.declarationNumber}
            </div>
            <div className="mt-1 flex gap-1.5">
              <Badge
                variant="outline"
                className="h-3.5 border-emerald-100 bg-emerald-50 text-[8px] font-black text-emerald-700"
              >
                {p.standard}
              </Badge>
              <span className="mt-0.5 text-[8px] font-bold uppercase text-slate-400">
                Until: {p.validUntil}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-emerald-50 bg-white/60 p-2.5 text-[10px]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" /> Testing Lab
            </span>
            <span className="font-bold">{p.testingLab}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="h-3 w-3" /> EAEU-Standard Declaration
            </span>
            <span className="cursor-pointer font-bold text-emerald-600 underline">View PDF</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[9px] font-bold uppercase italic text-slate-400">
        Certified for RF, BY, KZ, AM, KG Markets • Digital Safety Passport v1.2
      </div>
    </Card>
  );
};
