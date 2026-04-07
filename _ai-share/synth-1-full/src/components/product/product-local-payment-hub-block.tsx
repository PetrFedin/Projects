'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Wallet, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { getLocalPaymentHub } from '@/lib/fashion/local-payment-hub';

export const ProductLocalPaymentHubBlock: React.FC = () => {
  const methods = getLocalPaymentHub();
  
  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 rotate-45">
        <Wallet className="w-12 h-12" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-4 h-4 text-indigo-500" />
        <h4 className="font-bold text-xs uppercase text-indigo-700 tracking-tight">Локальные способы оплаты</h4>
      </div>

      <div className="space-y-2.5">
        {methods.map((m) => (
          <div key={m.method} className={`p-2.5 rounded-lg border transition-all ${m.isPreferred ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-50 rounded-md flex items-center justify-center border border-indigo-100 shadow-sm">
                   {m.method === 'SBP' ? <Zap className="w-4 h-4 text-indigo-600" /> : <Smartphone className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800 uppercase">{m.method}</span>
                  {m.bonusReward > 0 && (
                    <span className="text-[9px] font-black text-emerald-600 uppercase">+{m.bonusReward}% Cashback</span>
                  )}
                </div>
              </div>
              {m.isPreferred && (
                <Badge className="bg-indigo-600 text-[8px] h-3.5 px-1.5 uppercase font-black border-none">Fastest</Badge>
              )}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
               {m.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-indigo-100 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Safe SSL
        </div>
        <div className="flex items-center gap-1">
          <Smartphone className="w-3 h-3" /> App Pay Ready
        </div>
      </div>
    </Card>
  );
};
