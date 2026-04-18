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
<<<<<<< HEAD
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
=======
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
>>>>>>> recover/cabinet-wip-from-stash
          Buyer: Fashion Dist RU
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
<<<<<<< HEAD
          <div className="rounded-xl border border-indigo-100 bg-white/80 p-3 shadow-sm">
            <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
              Lifetime Value
            </div>
            <div className="text-xl font-black text-slate-800">
=======
          <div className="border-accent-primary/20 rounded-xl border bg-white/80 p-3 shadow-sm">
            <div className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
              Lifetime Value
            </div>
            <div className="text-text-primary text-xl font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {clientData.totalLifetimeValue.toLocaleString()} ₽
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-[8px] font-black uppercase text-emerald-600">+15% YoY</span>
            </div>
          </div>

          <div className="space-y-2">
<<<<<<< HEAD
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Unlocked Perks
            </div>
            <div className="space-y-1">
              {clientData.unlockedPerks.map((p, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600"
                >
                  <Star className="h-3 w-3 fill-indigo-100" /> {p}
=======
                  className="text-accent-primary flex items-center gap-1.5 text-[9px] font-bold"
                >
                  <Star className="fill-accent-primary/20 h-3 w-3" /> {p}
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex flex-col justify-center rounded-xl border border-indigo-100 bg-indigo-600/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase text-indigo-600">
            <Calendar className="h-3.5 w-3.5" /> Next Strategic Review
          </div>
          <div className="mb-1 text-lg font-black leading-none text-slate-800">
            {clientData.nextSuggestedMeeting}
          </div>
          <p className="text-[9px] font-bold uppercase leading-tight text-slate-500">
=======
        <div className="bg-accent-primary/5 border-accent-primary/20 flex flex-col justify-center rounded-xl border p-4">
          <div className="text-accent-primary mb-2 flex items-center gap-2 text-[8px] font-black uppercase">
            <Calendar className="h-3.5 w-3.5" /> Next Strategic Review
          </div>
          <div className="text-text-primary mb-1 text-lg font-black leading-none">
            {clientData.nextSuggestedMeeting}
          </div>
          <p className="text-text-secondary text-[9px] font-bold uppercase leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Agenda: SS26 Assortment Finalization & Credit Extension
          </p>
          <Button
            variant="outline"
<<<<<<< HEAD
            className="mt-3 h-8 w-full border-indigo-200 text-[8px] font-black uppercase text-indigo-600"
=======
            className="border-accent-primary/30 text-accent-primary mt-3 h-8 w-full text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
          >
            Schedule via Telegram
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="mt-4 flex items-center justify-between border-t border-indigo-100 pt-4 text-[8px] font-black uppercase text-slate-400">
        <span>Last Direct Interaction: {clientData.lastInteractionDate}</span>
        <span className="flex items-center gap-1 text-indigo-600">
=======
      <div className="border-accent-primary/20 text-text-muted mt-4 flex items-center justify-between border-t pt-4 text-[8px] font-black uppercase">
        <span>Last Direct Interaction: {clientData.lastInteractionDate}</span>
        <span className="text-accent-primary flex items-center gap-1">
>>>>>>> recover/cabinet-wip-from-stash
          <MessageSquare className="h-3 w-3" /> View Comm. History
        </span>
      </div>
    </Card>
  );
}
