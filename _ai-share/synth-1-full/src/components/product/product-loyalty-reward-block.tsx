'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { calculateLoyaltyRewards } from '@/lib/fashion/loyalty-logic';
import { Coins, Zap, Heart } from 'lucide-react';

type Props = { product: Product };

export function ProductLoyaltyRewardBlock({ product }: Props) {
  const rewards = calculateLoyaltyRewards(product);

  return (
    <Card className="mt-4 border-amber-500/20 bg-amber-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-600" />
          Syntha Rewards
        </CardTitle>
        <CardDescription className="text-xs">Бонусы за покупку этой модели.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-lg font-bold text-amber-700">+{rewards.pointsToEarn} Б</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Points to earn</p>
          </div>
          <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700 bg-white text-[10px]">
            <Zap className="h-3 w-3" />
            x{rewards.bonusMultiplier} Multiplier
          </Badge>
        </div>

        {rewards.perks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-200/30">
            {rewards.perks.map(p => (
              <span key={p} className="text-[9px] font-medium text-amber-800 flex items-center gap-1">
                <Heart className="h-2.5 w-2.5 fill-amber-500" /> {p}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
