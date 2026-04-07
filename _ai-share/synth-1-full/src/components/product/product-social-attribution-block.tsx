'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Megaphone, Users, Zap, TrendingUp, CheckCircle } from 'lucide-react';
import { getSocialAttribution } from '@/lib/fashion/social-attribution';

export const ProductSocialAttributionBlock: React.FC<{ product: Product }> = ({ product }) => {
  const social = getSocialAttribution(product);
  
  return (
    <Card className="p-4 border-2 border-fuchsia-50 bg-fuchsia-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12">
        <Megaphone className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-fuchsia-600" />
          <h4 className="font-bold text-xs uppercase text-fuchsia-700 tracking-tight">Social Attribution (RF Channels)</h4>
        </div>
        <div className="text-[10px] font-black text-fuchsia-500 uppercase flex items-center gap-1">
          Active Campaigns: {social.filter(s => s.activeStatus).length}
        </div>
      </div>

      <div className="space-y-3">
        {social.map((s, idx) => (
          <div key={idx} className={`p-2.5 rounded-lg border transition-all ${s.activeStatus ? 'bg-white border-fuchsia-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60 grayscale'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                {s.channel === 'Telegram' ? 'TG' : s.channel === 'Bloggers' ? 'Blog' : s.channel}
                {s.activeStatus && <CheckCircle className="w-3 h-3 text-green-500" />}
              </div>
              <div className="text-[10px] font-black text-fuchsia-600 bg-fuchsia-50 px-1.5 py-0.5 rounded">
                CR: {(s.conversionRate * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-slate-400">
                <Users className="w-2.5 h-2.5 inline mr-1" /> Reach: {s.reach.toLocaleString()}
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 border px-1.5 rounded">
                <Zap className="w-2.5 h-2.5 inline mr-1 text-yellow-500" /> {s.promoCode}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-fuchsia-100 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic">
        Tracking: Last-Click Attribution • RF Market Attribution Model v2.4
      </div>
    </Card>
  );
};
