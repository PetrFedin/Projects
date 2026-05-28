'use client';

import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Palette,
  Fingerprint,
  Target,
  Globe,
  BookOpen,
  PenTool,
  CheckCircle2,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  Heart,
  Zap,
  Layout,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BrandIncubator() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dnaResult, setDnaResult] = useState<any>(null);

  const generateDNA = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDnaResult({
        philosophy:
          'Cyber-Heritage: Сочетание традиционного портновского мастерства с функциональностью будущего.',
        keywords: ['Адаптивность', 'Минимализм', 'Устойчивость'],
        visualIdentity: {
          palette: ['Indio Ink', 'Digital Lavender', 'Graphite'],
          typography: 'Geometric Sans-Serif',
          vibe: 'High-Tech / Silent Luxury',
        },
        audience: 'Urban Nomads (25-40 лет), ценящие мобильность и качество материалов.',
      });
      setIsGenerating(false);
      setStep(3);
    }, 2500);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-accent-primary p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-white" />
              <span className="text-accent-primary/40 text-[10px] font-black uppercase tracking-widest">
                Brand Birth Module
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              Brand DNA Incubator
            </CardTitle>
            <CardDescription className="text-accent-primary/30 font-medium">
              Разработка философии, ДНК и концепции бренда с нуля при поддержке Syntha AI.
            </CardDescription>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <Fingerprint className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Workflow Steps */}
          <div className="space-y-4 lg:col-span-4">
            <div className="space-y-2">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Прогресс разработки
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-all',
                      step >= i ? 'bg-accent-primary' : 'bg-bg-surface2'
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: 'Концепция и Ценности',
                  icon: BookOpen,
                  desc: 'Определение миссии и духа бренда.',
                },
                {
                  id: 2,
                  title: 'Аудитория и Рынок',
                  icon: Target,
                  desc: 'Поиск идеального покупателя.',
                },
                {
                  id: 3,
                  title: 'Визуальный Код (DNA)',
                  icon: Palette,
                  desc: 'Палитра, силуэты и детали.',
                },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all',
                    step === s.id
                      ? 'border-accent-primary bg-accent-primary/10'
                      : 'border-border-subtle bg-bg-surface2/80 hover:border-border-default'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      step === s.id
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'text-text-muted bg-white'
                    )}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-text-primary text-[11px] font-black uppercase">{s.title}</p>
                    <p className="text-text-secondary text-[9px] font-medium leading-tight">
                      {s.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {step < 3 && (
              <Button className="bg-text-primary h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">
                Продолжить настройку
              </Button>
            )}

            {step === 3 && !dnaResult && (
              <Button
                onClick={generateDNA}
                disabled={isGenerating}
                className="bg-accent-primary h-12 w-full rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-2xl transition-transform hover:scale-105"
              >
                {isGenerating ? (
                  <RefreshCcw className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-3 h-5 w-5 text-amber-400" />
                )}
                Сгенерировать ДНК Бренда
              </Button>
            )}
          </div>

          {/* Result Canvas */}
          <div className="bg-bg-surface2 border-border-subtle relative flex flex-col justify-center overflow-hidden rounded-xl border p-3 lg:col-span-8">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="gen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-6 text-center"
                >
                  <div className="relative">
                    <div className="border-accent-primary/20 border-t-accent-primary h-24 w-24 animate-spin rounded-full border-4" />
                    <BrainCircuit className="text-accent-primary absolute inset-0 m-auto h-10 w-10 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tighter">
                      Идет процесс рождения бренда...
                    </h4>
                    <p className="text-text-muted mt-2 text-[10px] font-bold uppercase tracking-widest">
                      Анализ глобальных трендов и ваших предпочтений
                    </p>
                  </div>
                </motion.div>
              ) : dnaResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <Badge className="bg-accent-primary border-none px-3 py-1 text-[8px] font-black uppercase text-white">
                      Identity Confirmed
                    </Badge>
                    <h3 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter">
                      Философия Бренда
                    </h3>
                    <p className="text-accent-primary text-sm font-medium italic leading-relaxed">
                      «{dnaResult.philosophy}»
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-6">
                      <h5 className="text-text-muted flex items-center gap-2 border-b pb-2 text-[11px] font-black uppercase tracking-widest">
                        <Palette className="text-accent-primary h-4 w-4" /> Визуальный Код
                      </h5>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          {dnaResult.visualIdentity.palette.map((color: string, i: number) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  'h-12 w-12 rounded-xl border border-white shadow-sm',
                                  i === 0
                                    ? 'bg-text-primary'
                                    : i === 1
                                      ? 'bg-accent-primary/25'
                                      : 'bg-text-muted'
                                )}
                              />
                              <span className="text-text-muted text-[8px] font-bold uppercase">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-text-secondary text-[10px] font-medium leading-relaxed">
                          Шрифт:{' '}
                          <span className="text-text-primary font-black">
                            {dnaResult.visualIdentity.typography}
                          </span>
                        </p>
                        <p className="text-text-secondary text-[10px] font-medium leading-relaxed">
                          Вайб:{' '}
                          <span className="text-text-primary font-black uppercase">
                            {dnaResult.visualIdentity.vibe}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h5 className="text-text-muted flex items-center gap-2 border-b pb-2 text-[11px] font-black uppercase tracking-widest">
                        <Target className="text-accent-primary h-4 w-4" /> Целевая Аудитория
                      </h5>
                      <div className="space-y-4">
                        <p className="text-text-primary text-sm font-bold leading-relaxed">
                          {dnaResult.audience}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {dnaResult.keywords.map((k: string, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-accent-primary/20 text-accent-primary text-[8px] font-black uppercase"
                            >
                              {k}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-text-primary flex items-center justify-between rounded-xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent-primary flex h-10 w-10 items-center justify-center rounded-2xl shadow-xl">
                        <PenTool className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-black uppercase tracking-tighter">
                          Начать проектирование коллекции
                        </h4>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Авто-наполнение ассортиментной матрицы на основе ДНК
                        </p>
                      </div>
                    </div>
                    <Button className="text-text-primary hover:bg-bg-surface2 h-12 rounded-xl bg-white px-8 text-[10px] font-black uppercase shadow-2xl">
                      В PLM-Матрицу <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 text-center opacity-30">
                  <div className="bg-border-subtle flex h-20 w-20 items-center justify-center rounded-full">
                    <CheckCircle2 className="text-text-muted h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="text-base font-black uppercase tracking-tighter">
                      Заполните анкету слева
                    </h4>
                    <p className="text-text-muted mx-auto max-w-xs text-xs font-bold uppercase">
                      Чтобы AI мог построить структуру вашего бренда, нам нужно понять ваши базовые
                      идеи.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
