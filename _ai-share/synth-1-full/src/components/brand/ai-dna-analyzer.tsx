'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Target,
  TrendingUp,
  Heart,
  BrainCircuit,
  Zap,
  BarChart3,
  Fingerprint,
  Search,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DNA_POINTS = [
  {
    id: 'consistency',
    label: 'Целостность философии',
    score: 88,
    desc: 'Насколько текущая коллекция соответствует основным ценностям бренда (Минимализм, Устойчивость).',
  },
  {
    id: 'audience',
    label: 'Соответствие аудитории',
    score: 74,
    desc: 'Анализ визуальных кодов на предмет попадания в ожидания целевого сегмента Gen-Z.',
  },
  {
    id: 'market',
    label: 'Рыночная уникальность',
    score: 92,
    desc: 'Сравнение с конкурентами через AI-парсеры. Высокая степень аутентичности.',
  },
  {
    id: 'heritage',
    label: 'Связь с наследием',
    score: 65,
    desc: 'Использование архивных элементов и узнаваемых деталей кроя.',
  },
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
      setProgress((prev) => {
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
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-2xl">
      <CardHeader className="border-b border-slate-50 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
    <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-2xl">
      <CardHeader className="border-border-subtle border-b p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="bg-accent-primary flex h-6 w-6 items-center justify-center rounded-lg">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Advanced Neural Analysis
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              AI Анализатор ДНК Бренда
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Анализ коллекций и продуктов на соответствие философии, визуальным кодам и ДНК вашего
              бренда.
            </CardDescription>
          </div>
          <Button
            disabled={isAnalyzing}
            onClick={startAnalysis}
            className="h-12 rounded-2xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
          >
            {isAnalyzing ? (
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-amber-400" />
            )}
            Запустить анализ ДНК
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {!isAnalyzing && !showResults ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Fingerprint className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Идентификация кодов</p>
              <p className="text-[10px] font-medium text-slate-500">
                AI распознает силуэты, палитру и детали, которые делают ваш бренд узнаваемым.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Поиск аномалий</p>
              <p className="text-[10px] font-medium text-slate-500">
                Выявление моделей, которые «выпадают» из общей концепции и могут размыть ДНК.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <TrendingUp className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-900">Прогноз попадания</p>
              <p className="text-[10px] font-medium text-slate-500">
=======
            <div className="bg-bg-surface2 border-border-subtle flex flex-col items-center gap-3 rounded-xl border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Fingerprint className="text-text-muted h-6 w-6" />
              </div>
              <p className="text-text-primary text-[11px] font-black uppercase">
                Идентификация кодов
              </p>
              <p className="text-text-secondary text-[10px] font-medium">
                AI распознает силуэты, палитру и детали, которые делают ваш бренд узнаваемым.
              </p>
            </div>
            <div className="bg-bg-surface2 border-border-subtle flex flex-col items-center gap-3 rounded-xl border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Search className="text-text-muted h-6 w-6" />
              </div>
              <p className="text-text-primary text-[11px] font-black uppercase">Поиск аномалий</p>
              <p className="text-text-secondary text-[10px] font-medium">
                Выявление моделей, которые «выпадают» из общей концепции и могут размыть ДНК.
              </p>
            </div>
            <div className="bg-bg-surface2 border-border-subtle flex flex-col items-center gap-3 rounded-xl border p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <TrendingUp className="text-text-muted h-6 w-6" />
              </div>
              <p className="text-text-primary text-[11px] font-black uppercase">
                Прогноз попадания
              </p>
              <p className="text-text-secondary text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                Оценка вероятности успеха новой капсулы у лояльной аудитории бренда.
              </p>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="relative">
<<<<<<< HEAD
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-100">
                <BrainCircuit className="h-12 w-12 animate-pulse text-indigo-600" />
=======
              <div className="border-border-subtle flex h-32 w-32 items-center justify-center rounded-full border-4">
                <BrainCircuit className="text-accent-primary h-12 w-12 animate-pulse" />
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <svg className="absolute left-0 top-0 h-32 w-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-accent-primary"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-base font-black uppercase tracking-tighter">
                Нейронный анализ коллекции...
              </h3>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
=======
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Обработка визуальных кодов и метаданных
              </p>
            </div>
            <div className="w-full max-w-md">
              <Progress value={progress} className="bg-bg-surface2 h-2" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Scores Grid */}
              <div className="space-y-6">
<<<<<<< HEAD
                <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                <h4 className="text-text-muted border-b pb-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Результаты анализа
                </h4>
                <div className="space-y-6">
                  {MOCK_DNA_POINTS.map((point) => (
                    <div key={point.id} className="space-y-2">
                      <div className="flex items-end justify-between">
                        <div className="space-y-0.5">
<<<<<<< HEAD
                          <p className="text-xs font-black uppercase text-slate-900">
                            {point.label}
                          </p>
                          <p className="max-w-[300px] text-[10px] font-medium leading-tight text-slate-500">
=======
                          <p className="text-text-primary text-xs font-black uppercase">
                            {point.label}
                          </p>
                          <p className="text-text-secondary max-w-[300px] text-[10px] font-medium leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {point.desc}
                          </p>
                        </div>
                        <span className="text-accent-primary text-sm font-black">
                          {point.score}%
                        </span>
                      </div>
                      <Progress value={point.score} className="bg-bg-surface2 h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Column */}
              <div className="space-y-6">
<<<<<<< HEAD
                <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Рекомендации AI
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-indigo-900">
                        Слабый акцент на Heritage
                      </p>
                      <p className="mt-1 text-xs font-medium text-indigo-700/80">
=======
                <h4 className="text-text-muted border-b pb-2 text-[10px] font-black uppercase tracking-widest">
                  Рекомендации AI
                </h4>
                <div className="space-y-4">
                  <div className="bg-accent-primary/10 border-accent-primary/20 flex gap-3 rounded-xl border p-4">
                    <div className="bg-accent-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-accent-primary text-[11px] font-black uppercase">
                        Слабый акцент на Heritage
                      </p>
                      <p className="text-accent-primary/80 mt-1 text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                        В новой коллекции SS26 недостаточно цитат из архивов 2022 года. Рекомендуем
                        добавить фирменный шов «Syntha-Stitch» в модели SKU-241.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-emerald-900">
                        Идеальное попадание в аудиторию
                      </p>
                      <p className="mt-1 text-xs font-medium text-emerald-700/80">
                        Использование оверсайз-силуэтов и «диджитал-лаванды» на 100% соответствует
                        текущим трендам вашей аудитории в соцсетях.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-amber-900">
                        Риск размытия ДНК
                      </p>
                      <p className="mt-1 text-xs font-medium text-amber-700/80">
                        Модель «Sporty Hoodie Red» выбивается из общей минималистичной палитры. AI
                        рекомендует заменить тон на «Muted Crimson».
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Badge */}
<<<<<<< HEAD
            <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
=======
            <div className="bg-text-primary relative flex items-center justify-between overflow-hidden rounded-xl p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <BrainCircuit className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-1">
                <div className="mb-2 flex items-center gap-2">
<<<<<<< HEAD
                  <Badge className="border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
=======
                  <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                    Syntha DNA Score
                  </Badge>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Collection SS26 Analysis
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tighter">82.4 / 100</h3>
                <p className="text-xs font-medium text-white/60">
                  Статус:{' '}
                  <span className="font-black uppercase text-emerald-400">
                    Высокая консистентность
                  </span>
                </p>
              </div>
              <div className="relative z-10 flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-white/20 text-[9px] font-black uppercase text-white hover:bg-white/10"
                >
                  Экспорт отчета (PDF)
                </Button>
<<<<<<< HEAD
                <Button className="rounded-xl bg-indigo-600 px-8 text-[9px] font-black uppercase text-white hover:bg-indigo-500">
=======
                <Button className="bg-accent-primary hover:bg-accent-primary rounded-xl px-8 text-[9px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
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
