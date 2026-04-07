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
  Book
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
    description: 'Men\'s overcoats, raincoats, car coats, capes, cloaks and similar articles, of man-made fibers',
    confidence: '98.4%',
    duty: '12.0%',
    vat: '20.0%',
    restrictions: 'CITES Certification required for Graphene membrane'
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Gavel className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              TRADE_COMPLIANCE_v1.2
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            AI-Помощник по<br/>Таможне и ТН ВЭД
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Мгновенная классификация товаров для международной торговли. Автоматическое определение кодов ТН ВЭД с расчетом пошлин и налогов в реальном времени.
          </p>
        </div>

        <div className="flex gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <Book className="h-4 w-4" /> Глобальная база тарифов
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl bg-white rounded-xl p-3 space-y-4">
            <div className="space-y-4">
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">Движок Классификации</h4>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Опишите товар (напр., Мужская парка, 80% переработанный нейлон)..." 
                  className="pl-16 h-20 rounded-[1.5rem] bg-slate-50 border-none text-sm font-medium focus-visible:ring-indigo-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={!query || isAnalyzing}
                className="w-full h-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl hover:scale-[1.02] transition-all"
              >
                {isAnalyzing ? 'Анализ тех. характеристик...' : 'Определить код ТН ВЭД'} <Zap className={cn("h-4 w-4", isAnalyzing && "animate-pulse")} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Последние классификации</h5>
                <Button variant="ghost" className="text-[10px] font-black uppercase text-indigo-600 p-0 h-auto">Очистить историю</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Neural Cargo Pants', code: '6203.43', country: 'RU → AE' },
                  { name: 'Graphene Base Layer', code: '6109.90', country: 'IT → US' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                        <FileText className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-900">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <code className="text-[10px] font-mono font-bold text-indigo-600">{item.code}</code>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Card className={cn(
            "border-none shadow-2xl transition-all duration-700 rounded-xl overflow-hidden",
            query && !isAnalyzing ? "bg-indigo-600 scale-100" : "bg-slate-200 scale-95 opacity-50 pointer-events-none"
          )}>
            <div className="p-3 space-y-4 text-white">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">Рекомендуемый код ТН ВЭД</p>
                  <h3 className="text-sm font-black tracking-tighter">{mockResult.code}</h3>
                </div>
                <Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[8px] font-black px-3 py-1">ТОЧНОСТЬ: {mockResult.confidence}</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase text-indigo-200">Официальное описание</p>
                <p className="text-xs font-medium leading-relaxed italic opacity-90">{mockResult.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/40 space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Ставка пошлины</p>
                  <p className="text-base font-black">{mockResult.duty}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/40 space-y-1">
                  <p className="text-[10px] font-black uppercase text-indigo-300">Импортный НДС</p>
                  <p className="text-base font-black">{mockResult.vat}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-100 leading-relaxed">
                    {mockResult.restrictions}
                  </p>
                </div>
                <Button className="w-full h-12 bg-white text-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Применить к PIM SKU</Button>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-xl p-4 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Languages className="h-24 w-24" /></div>
            <div className="relative z-10 space-y-4">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">Региональная адаптивность</h5>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                Коды ТН ВЭД автоматически адаптируются для **190+ стран**, включая вариации для зон ЕАЭС, ЕС и NAFTA.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">WCO API: Подключено</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
