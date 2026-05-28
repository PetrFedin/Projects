'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  FileText,
  Globe,
  Droplets,
  Wind,
  RefreshCw,
  Layers,
  CheckCircle2,
  History,
  AlertCircle,
  Sparkles,
  Leaf,
} from 'lucide-react';
import { getSustainabilityLedger } from '@/lib/fashion/sustainability-ledger';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductSustainabilityLedgerBlock({ product }: { product: Product }) {
  const ledger = getSustainabilityLedger(product.sku);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-emerald-900 bg-emerald-900 p-4 text-white shadow-2xl">
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
        <Leaf className="h-16 w-16 text-white" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400">
          <Leaf className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
            Sustainability Traceability Ledger
          </h4>
        </div>
        <Badge className="h-5 border-none bg-emerald-500 px-2 text-[8px] font-black uppercase tracking-widest text-white">
          Verified EAEU ESG
        </Badge>
      </div>

      <div className="relative z-10 mb-6 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
              <Globe className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-tighter text-emerald-400">
                Material Origin
              </div>
              <div className="font-mono text-[10px] text-white/80">{ledger.materialOrigin}</div>
            </div>
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
              CO2 Impact
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
              <Wind className="h-3.5 w-3.5 text-emerald-400" /> {ledger.carbonFootprintKg} kg
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
              Water Usage
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-white">
              <Droplets className="h-3.5 w-3.5 text-emerald-400" /> {ledger.waterUsageLiters} L
            </div>
          </div>
        </div>
      </div>

      <div className="border-text-primary/25 flex items-center justify-between rounded-xl border bg-white p-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="text-text-secondary h-4 w-4" />
          </div>
          <div>
            <div className="text-text-primary text-[10px] font-black leading-tight">
              ESG Certifications
            </div>
            <div className="text-text-muted font-mono text-[8px]">
              {ledger.certificates.join(', ')}
            </div>
          </div>
        </div>
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[8px] font-black uppercase tracking-widest text-white/30">
        <ShieldCheck className="h-3 w-3" /> RU Regulation Compliance Verified (March 2026)
      </div>
    </Card>
  );
}
