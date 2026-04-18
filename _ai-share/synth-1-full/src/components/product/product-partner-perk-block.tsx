'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, CheckCircle2, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { getPartnerPerks } from '@/lib/fashion/partner-perks';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductPartnerPerkBlock({ product }: { product: Product }) {
  // Demo current order value for this session
  const perks = getPartnerPerks('PARTNER-01', 1250000);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-amber-100 bg-amber-50/5 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Gift className="h-16 w-16 text-amber-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-600">
          <Gift className="h-4 w-4" />
<<<<<<< HEAD
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Partner Perk Eligibility
          </h4>
        </div>
        <div className="text-[8px] font-black uppercase text-slate-400">Showroom Incentives</div>
=======
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Partner Perk Eligibility
          </h4>
        </div>
        <div className="text-text-muted text-[8px] font-black uppercase">Showroom Incentives</div>
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="space-y-4">
        {perks.map((perk) => (
          <div key={perk.perkId} className="group">
            <div className="mb-1.5 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
<<<<<<< HEAD
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${perk.isUnlocked ? 'bg-amber-100' : 'bg-slate-100'}`}
=======
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${perk.isUnlocked ? 'bg-amber-100' : 'bg-bg-surface2'}`}
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {perk.isUnlocked ? (
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
<<<<<<< HEAD
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-black leading-tight text-slate-800">
                    {perk.title}
                  </div>
                  <div className="text-[8px] font-medium text-slate-400">
=======
                    <Lock className="text-text-muted h-3.5 w-3.5" />
                  )}
                </div>
                <div>
                  <div className="text-text-primary text-[10px] font-black leading-tight">
                    {perk.title}
                  </div>
                  <div className="text-text-muted text-[8px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                    {perk.requirementDescription}
                  </div>
                </div>
              </div>
              {perk.isUnlocked && (
                <Badge className="h-4 border-none bg-emerald-500 px-1 text-[7px] font-black uppercase text-white">
                  UNLOCKED
                </Badge>
              )}
            </div>

            {!perk.isUnlocked && (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress
                    value={perk.progressPercent}
<<<<<<< HEAD
                    className="h-1 bg-slate-100 fill-amber-500"
=======
                    className="bg-bg-surface2 h-1 fill-amber-500"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
                <span className="text-[8px] font-black text-amber-600">
                  {perk.progressPercent}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-100 bg-white p-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
<<<<<<< HEAD
          <div className="text-[9px] font-bold text-slate-600">
=======
          <div className="text-text-secondary text-[9px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
            Add <b>750k ₽</b> more to unlock <b>Free Shipping</b>
          </div>
        </div>
      </div>
    </Card>
  );
}
