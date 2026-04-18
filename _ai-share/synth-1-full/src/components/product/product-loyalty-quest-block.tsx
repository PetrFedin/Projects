'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Zap, Trophy, Gift, ArrowRight } from 'lucide-react';
import { getB2BLoyaltyQuests } from '@/lib/fashion/loyalty-quests';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductLoyaltyQuestBlock({ product }: { product: Product }) {
  const quests = getB2BLoyaltyQuests('P-001');

  return (
<<<<<<< HEAD
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Award className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <Award className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            Active B2B Loyalty Quests
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Award className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <Award className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Active B2B Loyalty Quests
          </h4>
        </div>
        <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
          Partner Tier: Gold
        </Badge>
      </div>

      <div className="space-y-4">
        {quests.map((q) => (
<<<<<<< HEAD
          <div key={q.id} className="rounded-xl border border-indigo-100 bg-white/80 p-3 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-800">
                  {q.status === 'completed' ? (
                    <Trophy className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Zap className="h-3 w-3 text-indigo-500" />
                  )}
                  {q.title}
                </div>
                <p className="mt-0.5 text-[8px] font-bold uppercase text-slate-500">
                  {q.description}
                </p>
              </div>
              <div className="text-[10px] font-black text-indigo-600">+{q.rewardPoints} Pts</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${q.progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-slate-400">{q.progressPercent}%</span>
=======
          <div
            key={q.id}
            className="border-accent-primary/20 rounded-xl border bg-white/80 p-3 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="text-text-primary flex items-center gap-1.5 text-[10px] font-black uppercase">
                  {q.status === 'completed' ? (
                    <Trophy className="h-3 w-3 text-amber-500" />
                  ) : (
                    <Zap className="text-accent-primary h-3 w-3" />
                  )}
                  {q.title}
                </div>
                <p className="text-text-secondary mt-0.5 text-[8px] font-bold uppercase">
                  {q.description}
                </p>
              </div>
              <div className="text-accent-primary text-[10px] font-black">
                +{q.rewardPoints} Pts
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-accent-primary h-full transition-all duration-1000"
                  style={{ width: `${q.progressPercent}%` }}
                />
              </div>
              <span className="text-text-muted text-[9px] font-black">{q.progressPercent}%</span>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
<<<<<<< HEAD
        className="mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase text-indigo-500 hover:bg-indigo-50"
=======
        className="text-accent-primary hover:bg-accent-primary/10 mt-3 flex h-8 w-full items-center justify-center gap-2 text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
      >
        View Reward Catalog <ArrowRight className="h-3 w-3" />
      </Button>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Next Reward at 10,000 Pts</span>
        <span className="flex items-center gap-1 text-indigo-600">
=======
      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[8px] font-black uppercase">
        <span>Next Reward at 10,000 Pts</span>
        <span className="text-accent-primary flex items-center gap-1">
>>>>>>> recover/cabinet-wip-from-stash
          <Gift className="h-3 w-3" /> Extra 2% Discount
        </span>
      </div>
    </Card>
  );
}
