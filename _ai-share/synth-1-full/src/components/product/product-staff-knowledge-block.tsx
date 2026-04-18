'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, BookOpen, Quote, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { getStaffKnowledgePack } from '@/lib/fashion/staff-knowledge-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductStaffKnowledgeBlock({ product }: { product: Product }) {
  const pack = getStaffKnowledgePack(product);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-sky-50 bg-sky-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <GraduationCap className="h-16 w-16 text-sky-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-600">
          <GraduationCap className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Retail Staff Sales & Tech Guide
          </h4>
        </div>
        <Badge className="border-none bg-sky-600 text-[8px] font-black uppercase text-white">
          Staff App Sync
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-sky-100 bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
              <Quote className="h-3.5 w-3.5 text-sky-400" /> Sales Pitch Script
            </div>
            <p className="text-text-secondary text-[10px] font-bold italic leading-tight">
              "{pack.stylingScript}"
            </p>
          </div>

          <div className="rounded-xl border border-sky-100 bg-white/50 p-3">
            <div className="text-text-muted mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Tech Highlight
            </div>
            <p className="text-text-primary text-[9px] font-black leading-tight">
              {pack.technicalEdge}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-sky-100 bg-sky-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-sky-600">
            <Info className="h-3.5 w-3.5" /> Care & Handling (Staff)
          </div>
          <p className="text-text-secondary text-[10px] font-bold leading-tight">
            {pack.careInstructionsForStaff}
          </p>
          <Separator className="my-2 bg-sky-100" />
          <p className="text-text-secondary text-[9px] italic">"{pack.materialsDescription}"</p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase text-sky-500 hover:bg-sky-50"
      >
        Send to Staff Mobile App <ArrowRight className="h-3 w-3" />
      </Button>
    </Card>
  );
}
