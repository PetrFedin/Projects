'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Undo2, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { predictReturnRisk } from '@/lib/fashion/returns-prediction';
import { Progress } from '@/components/ui/progress';

export const ProductReturnsPredictionBlock: React.FC<{ product: Product }> = ({ product }) => {
  const risk = predictReturnRisk(product);
  
  const getRiskLabel = (score: number) => {
    if (score < 30) return { label: 'LOW RISK', color: 'text-green-600', bg: 'bg-green-50' };
    if (score < 60) return { label: 'MODERATE', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'HIGH RISK', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const status = getRiskLabel(risk.riskScore);

  return (
    <Card className="p-4 border-dashed bg-slate-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Undo2 className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Return Intelligence</h4>
        </div>
        <Badge variant="outline" className={`${status.bg} ${status.color} border-current`}>
          {status.label}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
          <span>AI Prediction Score</span>
          <span>{risk.riskScore}%</span>
        </div>
        <Progress value={risk.riskScore} className="h-1.5 bg-slate-200" />

        <div className="flex gap-2 items-start mt-4">
          <div className="p-1 rounded bg-blue-100">
            <Sparkles className="w-3 h-3 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Top Factor: {risk.topRiskFactor.replace('_', ' ')}</div>
            <div className="text-xs text-slate-700 leading-tight">{risk.advice}</div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t flex gap-2">
          <div className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase">
            <CheckCircle className="w-2.5 h-2.5" /> High Confidence
          </div>
          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
            <AlertCircle className="w-2.5 h-2.5" /> Context-Aware
          </div>
        </div>
      </div>
    </Card>
  );
};
