'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Megaphone, Users, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import { getSocialAttribution } from '@/lib/fashion/social-attribution';

export const ProductSocialAttributionBlock: React.FC<{ product: Product }> = ({ product }) => {
  const social = getSocialAttribution(product);

  return (
    <Card className="relative overflow-hidden border-2 border-fuchsia-50 bg-fuchsia-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Megaphone className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-fuchsia-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-fuchsia-700">
            Social Attribution (RF Channels)
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-fuchsia-500">
          Active Campaigns: {social.filter((s) => s.activeStatus).length}
        </div>
      </div>

      <div className="space-y-3">
        {social.map((s, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-2.5 transition-all ${s.activeStatus ? 'border-fuchsia-100 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 opacity-60 grayscale'}`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-slate-800">
                {s.channel === 'Telegram' ? 'TG' : s.channel === 'Bloggers' ? 'Blog' : s.channel}
                {s.activeStatus && <CheckCircle className="h-3 w-3 text-green-500" />}
              </div>
              <div className="rounded bg-fuchsia-50 px-1.5 py-0.5 text-[10px] font-black text-fuchsia-600">
                CR: {(s.conversionRate * 100).toFixed(1)}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-slate-400">
                <Users className="mr-1 inline h-2.5 w-2.5" /> Reach: {s.reach.toLocaleString()}
              </div>
              <div className="rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-bold text-slate-600">
                <Zap className="mr-1 inline h-2.5 w-2.5 text-yellow-500" /> {s.promoCode}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-fuchsia-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
        Tracking: Last-Click Attribution • RF Market Attribution Model v2.4
      </div>
    </Card>
  );
};
