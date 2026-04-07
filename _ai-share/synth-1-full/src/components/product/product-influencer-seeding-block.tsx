'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Users, Zap, CheckCircle, Package, Send } from 'lucide-react';
import { getInfluencerSeedings } from '@/lib/fashion/influencer-seeding';

export const ProductInfluencerSeedingBlock: React.FC<{ product: Product }> = ({ product }) => {
  const seedings = getInfluencerSeedings(product);
  
  const statusIcons: Record<string, any> = {
    'draft': Package,
    'shipped': Send,
    'mention_received': Zap,
    'completed': CheckCircle,
  };

  return (
    <Card className="p-4 border-2 border-purple-50 bg-purple-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12">
        <Camera className="w-16 h-16 text-purple-400" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600" />
          <h4 className="font-bold text-xs uppercase text-purple-700 tracking-tight">Influencer Seeding Tracker</h4>
        </div>
        <div className="text-[10px] font-black text-purple-500 uppercase">
          Active Seeds: {seedings.length}
        </div>
      </div>

      <div className="space-y-3">
        {seedings.map((s, idx) => {
          const Icon = statusIcons[s.status] || Package;
          return (
            <div key={idx} className="p-2.5 rounded-lg border bg-white border-purple-100 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex flex-col">
                   <div className="text-xs font-black text-slate-800 uppercase leading-none">{s.name}</div>
                   <div className="text-[9px] font-black text-purple-400 uppercase leading-none mt-1">{s.channel}</div>
                </div>
                <Badge variant="outline" className="text-[8px] h-3.5 bg-purple-50 text-purple-700 font-black uppercase border-none">
                  {s.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-purple-50 mt-1">
                 <div className="text-[10px] font-semibold text-slate-500">
                    Reach: {s.reach.toLocaleString()}
                 </div>
                 <Icon className="w-3 h-3 text-purple-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-purple-100 text-[9px] text-slate-400 font-bold uppercase flex justify-between items-center italic">
        <span>PR Workflow Hub</span>
        <span className="text-purple-600">Syncing mentions...</span>
      </div>
    </Card>
  );
};
