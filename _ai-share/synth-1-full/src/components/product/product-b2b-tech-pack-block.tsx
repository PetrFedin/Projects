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
    <Card className="border-border-subtle bg-bg-surface2/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Scissors className="text-text-secondary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-text-primary flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest">
            B2B Production Tech-Pack
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-border-default text-text-secondary text-[8px] font-black uppercase"
        >
          Spec-V1.2 Ready
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-text-muted mb-1.5 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
              <Box className="h-3 w-3" /> Material & Construction
            </div>
            <p className="text-text-primary text-[10px] font-bold leading-tight">
              {techPack.fabricComposition}
            </p>
            <div className="text-text-secondary mt-1 text-[9px] italic">
              {techPack.constructionType}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
              Size Specs (CM)
            </div>
            <div className="space-y-1">
              {Object.entries(techPack.sizeSpecsCm).map(([label, val]) => (
                <div key={label} className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-text-secondary">{label}</span>
                  <span className="text-text-primary">{val} cm</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-text-muted mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> Trim & Hardware
          </div>
          <div className="space-y-2">
            {techPack.trims.map((trim, i) => (
              <div
                key={i}
                className="border-border-default rounded-lg border bg-white/80 p-2 shadow-sm"
              >
                <div className="text-text-primary text-[9px] font-black uppercase leading-none">
                  {trim.name}
                </div>
                <div className="text-text-secondary mt-1 text-[7px] uppercase">
                  Source: {trim.source}
                </div>
              </div>
            ))}
          </div>

          <div className="border-border-subtle mt-2 flex gap-2 border-t pt-2">
            {techPack.careSymbols.map((sym) => (
              <Badge
                key={sym}
                variant="secondary"
                className="bg-bg-surface2 text-text-secondary h-4 text-[7px] font-black uppercase"
              >
                {sym}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-text-secondary hover:bg-bg-surface2 border-border-default mt-4 flex h-8 w-full items-center justify-center gap-2 border text-[8px] font-black uppercase"
      >
        <Download className="h-3 w-3" /> Download PDF Production Spec{' '}
        <ChevronRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
