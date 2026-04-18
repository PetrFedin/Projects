'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { getLocalPaymentHub } from '@/lib/fashion/local-payment-hub';

export const ProductLocalPaymentHubBlock: React.FC = () => {
  const methods = getLocalPaymentHub();

  return (
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative overflow-hidden border-2 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-45 p-2 opacity-5">
        <Wallet className="h-12 w-12" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="text-accent-primary h-4 w-4" />
        <h4 className="text-accent-primary text-xs font-bold uppercase tracking-tight">
          Локальные способы оплаты
        </h4>
      </div>

      <div className="space-y-2.5">
        {methods.map((m) => (
          <div
            key={m.method}
            className={`rounded-lg border p-2.5 transition-all ${m.isPreferred ? 'border-accent-primary/20 bg-white shadow-sm' : 'bg-bg-surface2 border-border-subtle'}`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-accent-primary/10 border-accent-primary/20 flex h-7 w-7 items-center justify-center rounded-md border shadow-sm">
                  {m.method === 'SBP' ? (
                    <Zap className="text-accent-primary h-4 w-4" />
                  ) : (
                    <Smartphone className="text-accent-primary h-4 w-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-text-primary text-xs font-black uppercase">{m.method}</span>
                  {m.bonusReward > 0 && (
                    <span className="text-[9px] font-black uppercase text-emerald-600">
                      +{m.bonusReward}% Cashback
                    </span>
                  )}
                </div>
              </div>
              {m.isPreferred && (
                <Badge className="bg-accent-primary h-3.5 border-none px-1.5 text-[8px] font-black uppercase">
                  Fastest
                </Badge>
              )}
            </div>
            <div className="text-text-secondary text-[10px] leading-tight">{m.description}</div>
          </div>
        ))}
      </div>

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-3 text-[9px] font-black uppercase">
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> Safe SSL
        </div>
        <div className="flex items-center gap-1">
          <Smartphone className="h-3 w-3" /> App Pay Ready
        </div>
      </div>
    </Card>
  );
};
