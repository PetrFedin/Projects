'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { getLocalPaymentHub } from '@/lib/fashion/local-payment-hub';

export const ProductLocalPaymentHubBlock: React.FC = () => {
  const methods = getLocalPaymentHub();

  return (
    <Card className="relative overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 rotate-45 p-2 opacity-5">
        <Wallet className="h-12 w-12" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-indigo-500" />
        <h4 className="text-xs font-bold uppercase tracking-tight text-indigo-700">
          Локальные способы оплаты
        </h4>
      </div>

      <div className="space-y-2.5">
        {methods.map((m) => (
          <div
            key={m.method}
            className={`rounded-lg border p-2.5 transition-all ${m.isPreferred ? 'border-indigo-100 bg-white shadow-sm' : 'border-slate-100 bg-slate-50'}`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-100 bg-indigo-50 shadow-sm">
                  {m.method === 'SBP' ? (
                    <Zap className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-slate-800">{m.method}</span>
                  {m.bonusReward > 0 && (
                    <span className="text-[9px] font-black uppercase text-emerald-600">
                      +{m.bonusReward}% Cashback
                    </span>
                  )}
                </div>
              </div>
              {m.isPreferred && (
                <Badge className="h-3.5 border-none bg-indigo-600 px-1.5 text-[8px] font-black uppercase">
                  Fastest
                </Badge>
              )}
            </div>
            <div className="text-[10px] leading-tight text-slate-500">{m.description}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-3 text-[9px] font-black uppercase text-slate-400">
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
