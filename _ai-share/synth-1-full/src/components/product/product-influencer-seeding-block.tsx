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
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Camera className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-accent-primary h-4 w-4" />
          <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
            Influencer Seeding Tracker
          </h4>
        </div>
        <div className="text-accent-primary text-[10px] font-black uppercase">
          Active Seeds: {seedings.length}
        </div>
      </div>

      <div className="space-y-3">
        {seedings.map((s, idx) => {
          const Icon = statusIcons[s.status] || Package;
          return (
            <div
              key={idx}
              className="border-accent-primary/20 rounded-lg border bg-white p-2.5 shadow-sm"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-text-primary text-xs font-black uppercase leading-none">
                    {s.name}
                  </div>
                  <div className="text-accent-primary mt-1 text-[9px] font-black uppercase leading-none">
                    {s.channel}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-accent-primary/10 text-accent-primary h-3.5 border-none text-[8px] font-black uppercase"
                >
                  {s.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="border-accent-primary/15 mt-1 flex items-center justify-between border-t pt-1">
                <div className="text-text-secondary text-[10px] font-semibold">
                  Reach: {s.reach.toLocaleString()}
                </div>
                <Icon className="text-accent-primary h-3 w-3" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-3 text-[9px] font-bold uppercase italic">
        <span>PR Workflow Hub</span>
        <span className="text-accent-primary">Syncing mentions...</span>
      </div>
    </Card>
  );
};
