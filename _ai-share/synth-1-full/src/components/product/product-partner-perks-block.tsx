'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Lock, CheckCircle2, ChevronRight } from 'lucide-react';
import { getPartnerPerks } from '@/lib/fashion/partner-perks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ProductPartnerPerksBlock() {
  const perks = getPartnerPerks('P-001', 0);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-amber-50 bg-amber-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Star className="h-16 w-16 text-amber-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-amber-600" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Partner Perks & Benefits
          </h4>
        </div>
        <Badge className="border-none bg-amber-100 text-[8px] font-black uppercase text-amber-700">
          Loyalty Status
        </Badge>
      </div>

      <div className="space-y-3">
        {perks.map((perk) => (
          <div key={perk.perkId} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded',
                  perk.isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-bg-surface2 text-text-muted'
                )}
              >
                {perk.isUnlocked ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
              </div>
              <div>
                <div
                  className={cn(
                    'text-[10px] font-black uppercase leading-none tracking-tight',
                    !perk.isUnlocked ? 'text-text-muted' : 'text-text-primary'
                  )}
                >
                  {perk.title}
                </div>
                {perk.requirementDescription && (
                  <div className="text-text-muted mt-1 text-[7px] font-bold uppercase">
                    {perk.requirementDescription}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="text-text-muted h-3 w-3 transition-colors group-hover:text-amber-500" />
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-4 h-8 w-full text-[8px] font-black uppercase text-amber-700 hover:bg-amber-50"
      >
        View All Rewards Hub
      </Button>
    </Card>
  );
}
