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
    <Card className="p-4 border-dashed bg-blue-50/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">CLV Intelligence</h4>
        </div>
        <Badge variant="outline" className="text-[9px] h-4 bg-blue-50 text-blue-600 border-blue-100">
          VIP PREDICT
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-black text-blue-700">${clv.predictedLtv.toLocaleString()}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase">Predicted LTV</div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-700">{clv.propensityToChurn}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase">Churn Risk</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {clv.categoryAffinity.map((cat, idx) => (
          <Badge key={idx} variant="secondary" className="text-[9px] whitespace-nowrap bg-white border border-slate-100">
            <Zap className="w-2.5 h-2.5 mr-1 text-yellow-500" /> {cat} Affinity
          </Badge>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase">
        <span className="flex items-center gap-1">
          <Timer className="w-2.5 h-2.5" /> Last Activity: {clv.lastPurchaseDate}
        </span>
        <TrendingUp className="w-3 h-3 text-green-500" />
      </div>
    </Card>
  );
};
