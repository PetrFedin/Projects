'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors, Ruler, Info, Box, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import { getB2BTechPack } from '@/lib/fashion/tech-pack-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ProductB2BTechPackBlock({ product }: { product: Product }) {
  const techPack = getB2BTechPack(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-slate-100 bg-slate-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Scissors className="h-16 w-16 text-slate-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Scissors className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
            B2B Production Tech-Pack
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-slate-300 text-[8px] font-black uppercase text-slate-500"
        >
          Spec-V1.2 Ready
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
              <Box className="h-3 w-3" /> Material & Construction
            </div>
            <p className="text-[10px] font-bold leading-tight text-slate-700">
              {techPack.fabricComposition}
            </p>
            <div className="mt-1 text-[9px] italic text-slate-500">{techPack.constructionType}</div>
          </div>

          <div className="space-y-2">
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              Size Specs (CM)
            </div>
            <div className="space-y-1">
              {Object.entries(techPack.sizeSpecsCm).map(([label, val]) => (
                <div key={label} className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-800">{val} cm</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Trim & Hardware
          </div>
          <div className="space-y-2">
            {techPack.trims.map((trim, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white/80 p-2 shadow-sm">
                <div className="text-[9px] font-black uppercase leading-none text-slate-800">
                  {trim.name}
                </div>
                <div className="mt-1 text-[7px] uppercase text-slate-500">
                  Source: {trim.source}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2">
            {techPack.careSymbols.map((sym) => (
              <Badge
                key={sym}
                variant="secondary"
                className="h-4 bg-slate-100 text-[7px] font-black uppercase text-slate-500"
              >
                {sym}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="mt-4 flex h-8 w-full items-center justify-center gap-2 border border-slate-200 text-[8px] font-black uppercase text-slate-600 hover:bg-slate-100"
      >
        <Download className="h-3 w-3" /> Download PDF Production Spec{' '}
        <ChevronRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
