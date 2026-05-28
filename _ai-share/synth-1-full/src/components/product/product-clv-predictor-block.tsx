'use client';

import React from 'react';
import type { UserProfile } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, UserCheck, Timer, Zap } from 'lucide-react';
import { predictFashionClv } from '@/lib/fashion/clv-predictor';

export const ProductClvPredictorBlock: React.FC<{ user: UserProfile }> = ({ user }) => {
  const clv = predictFashionClv(user);

  return (
    <Card className="border-dashed bg-blue-50/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            CLV Intelligence
          </h4>
        </div>
        <Badge
          variant="outline"
          className="h-4 border-blue-100 bg-blue-50 text-[9px] text-blue-600"
        >
          VIP PREDICT
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-black text-blue-700">
            ${clv.predictedLtv.toLocaleString()}
          </div>
          <div className="text-text-muted text-[10px] font-black uppercase">Predicted LTV</div>
        </div>
        <div>
          <div className="text-text-primary text-2xl font-black">{clv.propensityToChurn}%</div>
          <div className="text-text-muted text-[10px] font-black uppercase">Churn Risk</div>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {clv.categoryAffinity.map((cat, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="border-border-subtle whitespace-nowrap border bg-white text-[9px]"
          >
            <Zap className="mr-1 h-2.5 w-2.5 text-yellow-500" /> {cat} Affinity
          </Badge>
        ))}
      </div>

      <div className="text-text-muted mt-3 flex items-center justify-between border-t pt-3 text-[9px] font-bold uppercase">
        <span className="flex items-center gap-1">
          <Timer className="h-2.5 w-2.5" /> Last Activity: {clv.lastPurchaseDate}
        </span>
        <TrendingUp className="h-3 w-3 text-green-500" />
      </div>
    </Card>
  );
};
