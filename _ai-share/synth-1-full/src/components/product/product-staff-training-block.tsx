'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, Play, Info, ArrowRight } from 'lucide-react';
import { getStaffTrainingPack } from '@/lib/fashion/staff-training-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffTrainingBlock({ product }: { product: Product }) {
  const pack = getStaffTrainingPack(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <BookOpen className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <BookOpen className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Retail Staff Training Pack
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
          Technical Knowledge Base
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {pack.keySellingPointsRu.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-white/80 p-2.5"
            >
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
              <p className="text-[9px] font-bold leading-tight text-slate-600">{point}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-600/5 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-indigo-600">
            <Info className="h-3 w-3" /> Fabric Technical Benefit
          </div>
          <p className="text-[10px] font-bold italic leading-snug text-slate-700">
            "{pack.fabricBenefitRu}"
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-8 flex-1 border-indigo-200 text-[8px] font-black uppercase text-indigo-600"
          >
            View Competitor Matrix
          </Button>
          <Button className="h-8 flex-1 bg-indigo-600 text-[8px] font-black uppercase text-white shadow-sm hover:bg-indigo-700">
            <Play className="mr-1.5 h-3 w-3" /> Launch Video Guide
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Expert sales advice included</span>
        <span className="text-indigo-600">Updated: Today</span>
      </div>
    </Card>
  );
}
