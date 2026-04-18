'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  FileText,
  Globe,
  Truck,
  CheckCircle2,
  History,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { getEaeuDigitalPassport } from '@/lib/fashion/eaeu-digital-passport';
import type { Product } from '@/lib/types';

export function ProductEaeuPassportBlock({ product }: { product: Product }) {
  const passport = getEaeuDigitalPassport(product.sku);

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-slate-900 bg-slate-900 p-4 text-white shadow-2xl">
=======
    <Card className="border-text-primary bg-text-primary relative my-4 overflow-hidden border-2 p-4 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10">
        <ShieldCheck className="h-16 w-16 text-white" />
      </div>

      <div className="mb-4 flex items-center justify-between">
<<<<<<< HEAD
        <div className="flex items-center gap-2 text-indigo-400">
=======
        <div className="text-accent-primary flex items-center gap-2">
>>>>>>> recover/cabinet-wip-from-stash
          <ShieldCheck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-white">
            EAEU Digital Passport 2.0
          </h4>
        </div>
<<<<<<< HEAD
        <Badge className="h-5 border-none bg-indigo-500 px-2 text-[8px] font-black uppercase tracking-widest text-white">
=======
        <Badge className="bg-accent-primary h-5 border-none px-2 text-[8px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
          {passport.certificationType} Certified
        </Badge>
      </div>

      <div className="relative z-10 mb-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2.5">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-tighter text-indigo-400">
=======
            <div className="bg-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="text-accent-primary h-4 w-4" />
            </div>
            <div>
              <div className="text-accent-primary text-[11px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                Honest Mark (Честный Знак)
              </div>
              <div className="font-mono text-[10px] text-white/80">{passport.honestMarkId}</div>
            </div>
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
              EDO (ЭДО) Status
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  passport.edoStatus === 'signed'
                    ? 'h-4 border-none bg-emerald-500/20 px-1.5 text-[8px] font-black uppercase text-emerald-400'
                    : 'h-4 border-none bg-amber-500/20 px-1.5 text-[8px] font-black uppercase text-amber-400'
                }
              >
                {passport.edoStatus}
              </Badge>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
              Origin Country
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter">
<<<<<<< HEAD
              <Globe className="h-3.5 w-3.5 text-indigo-400" /> {passport.originCountry}
=======
              <Globe className="text-accent-primary h-3.5 w-3.5" /> {passport.originCountry}
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-white p-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <FileText className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <div className="text-[10px] font-black leading-tight text-slate-800">
              Customs Declaration (ГТД)
            </div>
            <div className="font-mono text-[8px] text-slate-400">
=======
      <div className="border-text-primary/25 flex items-center justify-between rounded-xl border bg-white p-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="text-text-secondary h-4 w-4" />
          </div>
          <div>
            <div className="text-text-primary text-[10px] font-black leading-tight">
              Customs Declaration (ГТД)
            </div>
            <div className="text-text-muted font-mono text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
              {passport.customsDeclarationNum || 'PENDING'}
            </div>
          </div>
        </div>
<<<<<<< HEAD
        <button className="text-[8px] font-black uppercase text-indigo-600 hover:underline">
=======
        <button className="text-accent-primary text-[8px] font-black uppercase hover:underline">
>>>>>>> recover/cabinet-wip-from-stash
          Download Cert
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-center text-[8px] font-black uppercase tracking-widest text-white/30">
        <ShieldCheck className="h-3 w-3" /> RU Regulation Compliance Verified (March 2026)
      </div>
    </Card>
  );
}
