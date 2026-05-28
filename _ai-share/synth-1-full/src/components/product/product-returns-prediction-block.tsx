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
    <Card className="bg-bg-surface2/80 border-dashed p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Undo2 className="h-4 w-4 text-blue-500" />
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Return Intelligence
          </h4>
        </div>
        <Badge variant="outline" className={`${status.bg} ${status.color} border-current`}>
          {status.label}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-text-secondary flex items-center justify-between text-xs font-bold uppercase">
          <span>AI Prediction Score</span>
          <span>{risk.riskScore}%</span>
        </div>
        <Progress value={risk.riskScore} className="bg-border-subtle h-1.5" />

        <div className="mt-4 flex items-start gap-2">
          <div className="rounded bg-blue-100 p-1">
            <Sparkles className="h-3 w-3 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
              Top Factor: {risk.topRiskFactor.replace('_', ' ')}
            </div>
            <div className="text-text-primary text-xs leading-tight">{risk.advice}</div>
          </div>
        </div>

        <div className="mt-2 flex gap-2 border-t pt-2">
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-green-600">
            <CheckCircle className="h-2.5 w-2.5" /> High Confidence
          </div>
          <div className="text-text-muted flex items-center gap-1 text-[9px] font-bold uppercase">
            <AlertCircle className="h-2.5 w-2.5" /> Context-Aware
          </div>
        </div>
      </div>
    </Card>
  );
};
