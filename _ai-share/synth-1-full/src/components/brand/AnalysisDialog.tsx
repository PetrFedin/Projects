'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Activity,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  brandId: string;
  viewRole?: string;
}

export function AnalysisDialog({
  isOpen,
  onOpenChange,
  brandName,
  brandId,
  viewRole,
}: AnalysisDialogProps) {
  // Deterministic mock data for analysis
  const getDeterministicValue = (id: string, min: number, max: number, seed: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return min + (Math.abs(hash + seed) % (max - min));
  };

  const matchScore = getDeterministicValue(brandId, 85, 99, 123);
  const growthPotential = getDeterministicValue(brandId, 70, 95, 456);
  const demandScore = getDeterministicValue(brandId, 60, 98, 789);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-xl border-none bg-background p-0 shadow-2xl">
        <div className="p-4">
          <DialogHeader className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-accent-primary shadow-accent-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-base font-black uppercase tracking-tighter">
                  {viewRole === 'client' ? 'Анализ Мэтчинга' : 'Анализ Перспектив'}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  Отчет системы Syntha OS для бренда{' '}
                  <span className="text-accent-primary font-bold">{brandName}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {viewRole === 'client' ? (
            /* B2C Analysis Content */
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-accent-primary text-sm font-black">{matchScore}%</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    Style Match
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-text-primary text-sm font-black">A+</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    Vibe Rank
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-state-success text-sm font-black">High</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    Compatibility
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" /> Почему этот бренд вам подходит:
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    { icon: Heart, label: 'Соответствие вашему стилю', value: '98%' },
                    { icon: Target, label: 'Match по цветовой палитре', value: '92%' },
                    { icon: ShieldCheck, label: 'Предпочтения по материалам', value: '100%' },
                    { icon: Zap, label: 'Актуальность для гардероба', value: 'High' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-accent-primary/5 border-accent-primary/10 flex items-center gap-3 rounded-2xl border p-3"
                    >
                      <div className="text-accent-primary flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-tighter">
                          {item.label}
                        </p>
                        <p className="text-text-primary text-xs font-black">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-text-primary relative overflow-hidden rounded-3xl p-4 text-white">
                <div className="bg-accent-primary/20 absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 blur-3xl" />
                <p className="relative z-10 text-xs font-medium italic leading-relaxed">
                  «Система проанализировала ваши последние покупки и лайки. Эстетика {brandName}{' '}
                  идеально дополняет ваш текущий вектор стиля, особенно в части базовых слоев и
                  аксессуаров.»
                </p>
              </div>
            </div>
          ) : (
            /* B2B Analysis Content */
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-state-success text-sm font-black">{growthPotential}%</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    Growth Potential
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-text-primary text-sm font-black">{demandScore}%</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    Market Demand
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle rounded-3xl border p-4 text-center">
                  <span className="text-accent-primary text-sm font-black">4.8</span>
                  <p className="text-text-muted mt-1 text-center text-[9px] font-black uppercase tracking-widest">
                    BPI Index
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Аналитика для бизнеса:
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    { icon: TrendingUp, label: 'ROI Прогноз', value: '+24% годовых' },
                    { icon: ShieldCheck, label: 'Надежность поставок', value: '99.2%' },
                    { icon: Target, label: 'Региональный дефицит', value: 'Высокий' },
                    { icon: Zap, label: 'Ликвидность стока', value: 'Excellent' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface2 border-border-subtle flex items-center gap-3 rounded-2xl border p-3"
                    >
                      <div className="text-accent-primary border-border-subtle flex h-8 w-8 items-center justify-center rounded-xl border bg-white shadow-sm">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-text-muted mb-1 text-[9px] font-bold uppercase leading-none tracking-tighter">
                          {item.label}
                        </p>
                        <p className="text-text-primary text-xs font-black">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-accent-primary/20 bg-accent-primary/5 rounded-3xl border-2 border-dashed p-4">
                <h5 className="text-accent-primary mb-2 text-[10px] font-black uppercase tracking-widest">
                  Заключение AI-Байера:
                </h5>
                <p className="text-text-secondary text-xs font-medium leading-relaxed">
                  «Бренд демонстрирует устойчивый рост в сегменте Contemporary. В вашем регионе
                  наблюдается неудовлетворенный спрос на позиции данной ценовой категории.
                  Рекомендуется рассмотреть партнерство для закрытия ниши базового трикотажа.»
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-bg-surface2 hover:bg-bg-surface border-border-strong text-text-primary h-10 flex-1 rounded-2xl border font-mono text-[10px] uppercase tracking-widest transition-all"
            >
              Закрыть
            </Button>
            <Button className="button-glimmer button-professional h-10 flex-1 rounded-2xl border-none !bg-black font-mono text-[10px] uppercase tracking-widest shadow-md shadow-xl transition-all hover:!bg-black">
              {viewRole === 'client' ? 'Добавить в избранное' : 'Обсудить условия'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
