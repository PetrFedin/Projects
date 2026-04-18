'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserCheck,
  Calendar,
  Star,
  TrendingUp,
  Gift,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { getB2BClientelingData } from '@/lib/fashion/clienteling-hub';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductClientelingBlock({ product }: { product: Product }) {
  const clientData = getB2BClientelingData('P-001');

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-indigo-50 bg-indigo-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <UserCheck className="h-16 w-16 text-indigo-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600">
          <UserCheck className="h-4 w-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
            B2B Clienteling Hub
          </h4>
        </div>
        <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
          Buyer: Fashion Dist RU
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-100 bg-white/80 p-3 shadow-sm">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Lifetime Value
            </div>
            <div className="text-xl font-black text-slate-800">
              {clientData.totalLifetimeValue.toLocaleString()} ₽
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase text-emerald-600">+15% YoY</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              Unlocked Perks
            </div>
            <div className="space-y-1">
              {clientData.unlockedPerks.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600"
                >
                  <Star className="h-3 w-3 fill-indigo-100" /> {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-indigo-600">
            <Calendar className="h-3.5 w-3.5" /> Next Strategic Review
          </div>
          <div className="mb-1 text-lg font-black leading-none text-slate-800">
            {clientData.nextSuggestedMeeting}
          </div>
          <p className="text-[9px] font-bold uppercase leading-tight text-slate-500">
            Agenda: SS26 Assortment Finalization & Credit Extension
          </p>
          <Button
            variant="outline"
            className="mt-3 h-8 w-full border-indigo-200 text-[8px] font-black uppercase text-indigo-600"
          >
            Schedule via Telegram
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Last Direct Interaction: {clientData.lastInteractionDate}</span>
        <span className="flex items-center gap-1 text-indigo-600">
          <MessageSquare className="h-3 w-3" /> View Comm. History
        </span>
      </div>
    </Card>
  );
}
