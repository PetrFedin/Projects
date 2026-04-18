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
    <Card className="border-accent-primary/15 bg-accent-primary/10 relative my-4 overflow-hidden border-2 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <UserCheck className="text-accent-primary h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="text-accent-primary flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            B2B Clienteling Hub
          </h4>
        </div>
        <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
          Buyer: Fashion Dist RU
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="border-accent-primary/20 rounded-xl border bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Lifetime Value
            </div>
            <div className="text-text-primary text-xl font-black">
              {clientData.totalLifetimeValue.toLocaleString()} ₽
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase text-emerald-600">+15% YoY</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
              Unlocked Perks
            </div>
            <div className="space-y-1">
              {clientData.unlockedPerks.map((p, i) => (
                <div
                  key={i}
                  className="text-accent-primary flex items-center gap-1.5 text-[9px] font-bold"
                >
                  <Star className="fill-accent-primary/20 h-3 w-3" /> {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-accent-primary/5 border-accent-primary/20 flex flex-col justify-center rounded-xl border p-4">
          <div className="text-accent-primary mb-2 flex items-center gap-2 text-[8px] font-black uppercase">
            <Calendar className="h-3.5 w-3.5" /> Next Strategic Review
          </div>
          <div className="text-text-primary mb-1 text-lg font-black leading-none">
            {clientData.nextSuggestedMeeting}
          </div>
          <p className="text-text-secondary text-[9px] font-bold uppercase leading-tight">
            Agenda: SS26 Assortment Finalization & Credit Extension
          </p>
          <Button
            variant="outline"
            className="border-accent-primary/30 text-accent-primary mt-3 h-8 w-full text-[8px] font-black uppercase"
          >
            Schedule via Telegram
          </Button>
        </div>
      </div>

      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[8px] font-black uppercase">
        <span>Last Direct Interaction: {clientData.lastInteractionDate}</span>
        <span className="text-accent-primary flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> View Comm. History
        </span>
      </div>
    </Card>
  );
}
