'use client';

import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Target, TrendingUp, Heart, 
  BrainCircuit, Zap, BarChart3, Fingerprint, Search,
  AlertCircle, CheckCircle2, RefreshCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DNA_POINTS = [
  { id: 'consistency', label: 'Целостность философии', score: 88, desc: 'Насколько текущая коллекция соответствует основным ценностям бренда (Минимализм, Устойчивость).' },
  { id: 'audience', label: 'Соответствие аудитории', score: 74, desc: 'Анализ визуальных кодов на предмет попадания в ожидания целевого сегмента Gen-Z.' },
  { id: 'market', label: 'Рыночная уникальность', score: 92, desc: 'Сравнение с конкурентами через AI-парсеры. Высокая степень аутентичности.' },
  { id: 'heritage', label: 'Связь с наследием', score: 65, desc: 'Использование архивных элементов и узнаваемых деталей кроя.' }
];

export function AiDnaAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResults(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <Card className="rounded-xl border-slate-100 shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Advanced Neural Analysis</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">AI Анализатор ДНК Бренда</CardTitle>
            <CardDescription className="text-sm font-medium">
              Анализ коллекций и продуктов на соответствие философии, визуальным кодам и ДНК вашего бренда.
            </CardDescription>
          </div>
          <Button 
            disabled={isAnalyzing}
            onClick={startAnalysis}
            className="bg-black text-white rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
          >
            {isAnalyzing ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2 text-amber-400" />}
            Запустить анализ ДНК
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {!isAnalyzing && !showResults ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Fingerprint className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Идентификация кодов</p>
              <p className="text-[10px] text-slate-500 font-medium">AI распознает силуэты, палитру и детали, которые делают ваш бренд узнаваемым.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Поиск аномалий</p>
              <p className="text-[10px] text-slate-500 font-medium">Выявление моделей, которые «выпадают» из общей концепции и могут размыть ДНК.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <TrendingUp className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Прогноз попадания</p>
              <p className="text-[10px] text-slate-500 font-medium">Оценка вероятности успеха новой капсулы у лояльной аудитории бренда.</p>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-4 py-12 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="h-32 w-32 border-4 border-slate-100 rounded-full flex items-center justify-center">
                <BrainCircuit className="h-12 w-12 text-indigo-600 animate-pulse" />
              </div>
              <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                <circle
                  cx="64" cy="64" r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-indigo-600"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-black uppercase tracking-tighter">Нейронный анализ коллекции...</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Обработка визуальных кодов и метаданных</p>
            </div>
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-2 bg-slate-100" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Scores Grid */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Результаты анализа</h4>
                <div className="space-y-6">
                  {MOCK_DNA_POINTS.map(point => (
                    <div key={point.id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black uppercase text-slate-900">{point.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium leading-tight max-w-[300px]">{point.desc}</p>
                        </div>
                        <span className="text-sm font-black text-indigo-600">{point.score}%</span>
                      </div>
                      <Progress value={point.score} className="h-1.5 bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Column */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Рекомендации AI</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-indigo-900">Слабый акцент на Heritage</p>
                      <p className="text-xs text-indigo-700/80 font-medium mt-1">В новой коллекции SS26 недостаточно цитат из архивов 2022 года. Рекомендуем добавить фирменный шов «Syntha-Stitch» в модели SKU-241.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-emerald-900">Идеальное попадание в аудиторию</p>
                      <p className="text-xs text-emerald-700/80 font-medium mt-1">Использование оверсайз-силуэтов и «диджитал-лаванды» на 100% соответствует текущим трендам вашей аудитории в соцсетях.</p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-amber-900">Риск размытия ДНК</p>
                      <p className="text-xs text-amber-700/80 font-medium mt-1">Модель «Sporty Hoodie Red» выбивается из общей минималистичной палитры. AI рекомендует заменить тон на «Muted Crimson».</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Badge */}
            <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="h-32 w-32" />
              </div>
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-indigo-600 text-white border-none font-black uppercase text-[8px]">Syntha DNA Score</Badge>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Collection SS26 Analysis</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tighter">82.4 / 100</h3>
                <p className="text-xs text-white/60 font-medium">Статус: <span className="text-emerald-400 font-black uppercase">Высокая консистентность</span></p>
              </div>
              <div className="flex gap-3 relative z-10">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl font-black uppercase text-[9px]">
                  Экспорт отчета (PDF)
                </Button>
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl font-black uppercase text-[9px] px-8">
                  Применить правки
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
