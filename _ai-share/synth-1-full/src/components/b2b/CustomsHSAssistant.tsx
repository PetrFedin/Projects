'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Globe,
  Search,
  Zap,
  ShieldCheck,
  ArrowRight,
  Gavel,
  Calculator,
  Languages,
  Book,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

export function CustomsHSAssistant() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockResult = {
    code: '6201.40.10',
    description:
      "Men's overcoats, raincoats, car coats, capes, cloaks and similar articles, of man-made fibers",
    confidence: '98.4%',
    duty: '12.0%',
    vat: '20.0%',
    restrictions: 'CITES Certification required for Graphene membrane',
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen space-y-4 bg-slate-50 p-3 text-left">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
              <Gavel className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
            >
              TRADE_COMPLIANCE_v1.2
            </Badge>
          </div>
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
            AI-Помощник по
            <br />
            Таможне и ТН ВЭД
          </h2>
          <p className="max-w-md text-xs font-medium text-slate-400">
            Мгновенная классификация товаров для международной торговли. Автоматическое определение
            кодов ТН ВЭД с расчетом пошлин и налогов в реальном времени.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-2xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Book className="h-4 w-4" /> Глобальная база тарифов
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl">
            <div className="space-y-4">
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
                Движок Классификации
              </h4>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Опишите товар (напр., Мужская парка, 80% переработанный нейлон)..."
                  className="h-20 rounded-[1.5rem] border-none bg-slate-50 pl-16 text-sm font-medium focus-visible:ring-indigo-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!query || isAnalyzing}
                className="h-10 w-full gap-2 rounded-2xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02]"
              >
                {isAnalyzing ? 'Анализ тех. характеристик...' : 'Определить код ТН ВЭД'}{' '}
                <Zap className={cn('h-4 w-4', isAnalyzing && 'animate-pulse')} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Последние классификации
                </h5>
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-[10px] font-black uppercase text-indigo-600"
                >
                  Очистить историю
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Neural Cargo Pants', code: '6203.43', country: 'RU → AE' },
                  { name: 'Graphene Base Layer', code: '6109.90', country: 'IT → US' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-900">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-[10px] font-bold text-indigo-600">
                        {item.code}
                      </code>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                        {item.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <Card
            className={cn(
              'overflow-hidden rounded-xl border-none shadow-2xl transition-all duration-700',
              query && !isAnalyzing
                ? 'scale-100 bg-indigo-600'
                : 'pointer-events-none scale-95 bg-slate-200 opacity-50'
            )}
          >
            <div className="space-y-4 p-3 text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                    Рекомендуемый код ТН ВЭД
                  </p>
                  <h3 className="text-sm font-black tracking-tighter">{mockResult.code}</h3>
                </div>
                <Badge className="border-none bg-white/20 px-3 py-1 text-[8px] font-black text-white backdrop-blur-md">
                  ТОЧНОСТЬ: {mockResult.confidence}
                </Badge>
              </div>

              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] font-black uppercase text-indigo-200">
                  Официальное описание
                </p>
                <p className="text-xs font-medium italic leading-relaxed opacity-90">
                  {mockResult.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 rounded-2xl bg-slate-900/40 p-4">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Ставка пошлины</p>
                  <p className="text-base font-black">{mockResult.duty}</p>
                </div>
                <div className="space-y-1 rounded-2xl bg-slate-900/40 p-4">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Импортный НДС</p>
                  <p className="text-base font-black">{mockResult.vat}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-indigo-100">
                    {mockResult.restrictions}
                  </p>
                </div>
                <Button className="h-12 w-full rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-xl">
                  Применить к PIM SKU
                </Button>
              </div>
            </div>
          </Card>

          <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Languages className="h-24 w-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">
                Региональная адаптивность
              </h5>
              <p className="text-[10px] font-medium uppercase leading-relaxed tracking-widest text-slate-400">
                Коды ТН ВЭД автоматически адаптируются для **190+ стран**, включая вариации для зон
                ЕАЭС, ЕС и NAFTA.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">
                  WCO API: Подключено
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
