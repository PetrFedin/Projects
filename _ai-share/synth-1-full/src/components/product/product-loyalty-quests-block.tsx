'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { getAvailableQuests } from '@/lib/fashion/loyalty-quests';
import { Button } from '@/components/ui/button';

export const ProductLoyaltyQuestsBlock: React.FC<{ product: Product }> = ({ product }) => {
  const quests = getAvailableQuests(product);

  return (
    <Card className="relative overflow-hidden border-2 border-amber-50 bg-amber-50/10 p-4 shadow-sm">
      <div className="absolute right-0 top-0 -rotate-12 p-2 opacity-5">
        <Trophy className="h-16 w-16" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-amber-700">
            Миссии и Квесты
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600">
          Бонусы за покупки
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`rounded-lg border p-3 transition-all ${q.status === 'in_progress' ? 'border-amber-200 bg-white shadow-md' : 'border-amber-100 bg-amber-50/50 opacity-80'}`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="text-text-primary flex items-center gap-1.5 text-xs font-black uppercase">
                {q.title}
                {q.status === 'completed' && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-1 rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-600">
                <Star className="h-2.5 w-2.5 fill-amber-500" /> +{q.rewardPoints}
              </div>
            </div>
            <div className="text-text-secondary mb-3 text-[10px] leading-tight">
              {q.description}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full border-amber-200 text-[9px] font-black uppercase text-amber-700 hover:bg-amber-50"
            >
              {q.status === 'in_progress' ? 'Продолжить миссию' : 'Начать квест'}{' '}
              <ChevronRight className="ml-1 h-2.5 w-2.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-amber-100 pt-3 text-[9px] font-bold uppercase italic">
        <span>Программа лояльности v3.0</span>
        <span className="text-amber-600">Gamification Enabled</span>
      </div>
    </Card>
  );
};
