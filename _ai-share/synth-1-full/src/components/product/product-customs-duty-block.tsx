'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, Globe, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateCustomsDuty } from '@/lib/fashion/customs-duty-calc';

export const ProductCustomsDutyBlock: React.FC<{ product: Product }> = ({ product }) => {
  const duty = calculateCustomsDuty(product);

  return (
    <Card className="border-border-subtle bg-bg-surface2/20 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-12 p-2 opacity-5">
        <Scale className="text-text-muted h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-600" />
          <h4 className="text-text-primary text-xs font-bold uppercase tracking-tight">
            Customs Duty Estimator (Import)
          </h4>
        </div>
        {duty.isAboveThreshold ? (
          <Badge className="h-4 border-none bg-orange-500 text-[9px] font-black uppercase text-white">
            Above Threshold
          </Badge>
        ) : (
          <Badge className="h-4 border-none bg-green-500 text-[9px] font-black uppercase text-white">
            Duty Free
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
            Total Duty Payable
          </div>
          <div className="text-text-primary text-2xl font-black tracking-tight">
            {duty.totalDutyRub.toLocaleString()} ₽
          </div>
        </div>
        <div className="flex flex-col items-end justify-center text-right">
          <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
            Exchange EUR/RUB: 100.0
          </div>
          <div className="text-text-muted text-[10px] font-black uppercase leading-none">
            Net Value: €{duty.priceEur}
          </div>
        </div>
      </div>

      <div className="border-border-subtle mt-4 flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm">
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase leading-none">
          <span>Broker Fee (incl.)</span>
          <span>{duty.brokerFee} ₽</span>
        </div>
        <div className="text-text-secondary flex items-center justify-between text-[10px] font-black uppercase leading-none">
          <span>Customs Rate (Excess)</span>
          <span>15%</span>
        </div>
      </div>

      <div className="border-border-subtle text-text-muted mt-4 flex items-center gap-1.5 border-t pt-3 text-[9px] font-bold uppercase italic">
        <Info className="h-3 w-3" /> EAEU Cross-border Regulations 2026. Threshold: €200.
      </div>
    </Card>
  );
};
