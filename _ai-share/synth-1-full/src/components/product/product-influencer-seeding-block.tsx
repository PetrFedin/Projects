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
    draft: Package,
    shipped: Send,
    mention_received: Zap,
    completed: CheckCircle,
  };

  return (
    <Card className="relative overflow-hidden border-2 border-purple-50 bg-purple-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Camera className="h-16 w-16 text-purple-400" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-600" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-purple-700">
            Influencer Seeding Tracker
          </h4>
        </div>
        <div className="text-[10px] font-black uppercase text-purple-500">
          Active Seeds: {seedings.length}
        </div>
      </div>

      <div className="space-y-3">
        {seedings.map((s, idx) => {
          const Icon = statusIcons[s.status] || Package;
          return (
            <div key={idx} className="rounded-lg border border-purple-100 bg-white p-2.5 shadow-sm">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-xs font-black uppercase leading-none text-slate-800">
                    {s.name}
                  </div>
                  <div className="mt-1 text-[9px] font-black uppercase leading-none text-purple-400">
                    {s.channel}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="h-3.5 border-none bg-purple-50 text-[8px] font-black uppercase text-purple-700"
                >
                  {s.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-purple-50 pt-1">
                <div className="text-[10px] font-semibold text-slate-500">
                  Reach: {s.reach.toLocaleString()}
                </div>
                <Icon className="h-3 w-3 text-purple-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-purple-100 pt-3 text-[9px] font-bold uppercase italic text-slate-400">
        <span>PR Workflow Hub</span>
        <span className="text-purple-600">Syncing mentions...</span>
      </div>
    </Card>
  );
};
