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
    <Card className="p-4 border-2 border-amber-50 bg-amber-50/10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 -rotate-12">
        <Trophy className="w-16 h-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h4 className="font-bold text-xs uppercase text-amber-700 tracking-tight">Миссии и Квесты</h4>
        </div>
        <div className="text-[10px] font-black text-amber-600 uppercase flex items-center gap-1">
          Бонусы за покупки
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((q) => (
          <div key={q.id} className={`p-3 rounded-lg border transition-all ${q.status === 'in_progress' ? 'bg-white border-amber-200 shadow-md' : 'bg-amber-50/50 border-amber-100 opacity-80'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                {q.title}
                {q.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
              </div>
              <div className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                 <Star className="w-2.5 h-2.5 fill-amber-500" /> +{q.rewardPoints}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 leading-tight mb-3">
               {q.description}
            </div>
            
            <Button variant="outline" size="sm" className="w-full h-7 text-[9px] uppercase font-black border-amber-200 text-amber-700 hover:bg-amber-50">
               {q.status === 'in_progress' ? 'Продолжить миссию' : 'Начать квест'} <ChevronRight className="w-2.5 h-2.5 ml-1" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-amber-100 text-[9px] text-slate-400 font-bold uppercase flex justify-between items-center italic">
        <span>Программа лояльности v3.0</span>
        <span className="text-amber-600">Gamification Enabled</span>
      </div>
    </Card>
  );
};
