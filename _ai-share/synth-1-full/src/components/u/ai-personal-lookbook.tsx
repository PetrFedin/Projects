'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Heart,
  Share2,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Camera,
  Palette,
  Smartphone,
  Zap,
  CheckCircle2,
  Star,
  Layout,
  Grid2X2,
  Scissors,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MOCK_LOOKS = [
  {
    id: 'l1',
    name: 'Cyber-Minimalist Spring',
    occasion: 'Работа / Встречи',
    confidence: 94,
    items: [
      {
        name: 'Urban Tech Parka',
        brand: 'Syntha Lab',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      },
      {
        name: 'Graphite Trousers',
        brand: 'Syntha Lab',
        image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=400',
      },
    ],
    bg: 'bg-indigo-50',
  },
  {
    id: 'l2',
    name: 'Neo-Classic Evening',
    occasion: 'Ужин / Мероприятие',
    confidence: 88,
    items: [
      {
        name: 'Silk Oversize Shirt',
        brand: 'Silk Road',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
      },
      {
        name: 'Tech Blazer',
        brand: 'Syntha Lab',
        image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=400',
      },
    ],
    bg: 'bg-rose-50',
  },
];

export function AiPersonalLookbook() {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const activeLook = MOCK_LOOKS[activeLookIndex];

  const generateNewLook = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setActiveLookIndex((prev) => (prev + 1) % MOCK_LOOKS.length);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="p-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                Personal Stylist AI
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              AI Personal Lookbook
            </CardTitle>
          </div>
          <Button
            onClick={generateNewLook}
            disabled={isGenerating}
            className="h-12 rounded-2xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105"
          >
            {isGenerating ? (
              <RefreshCcw className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-400" />
            )}
            Сгенерировать образ
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Main Visualizer */}
          <div className="relative lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLook.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl p-4',
                  activeLook.bg
                )}
              >
                {/* Abstract background elements */}
                <div className="absolute left-0 top-0 h-full w-full opacity-30">
                  <div className="absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-white blur-3xl" />
                  <div className="absolute bottom-[-10%] left-[-10%] h-64 w-64 rounded-full bg-indigo-200 blur-3xl" />
                </div>

                <div className="relative z-10 flex gap-3">
                  {activeLook.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="relative h-80 w-60 overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                        <p className="text-[8px] font-black uppercase text-white/60">
                          {item.brand}
                        </p>
                        <p className="text-[10px] font-black uppercase">{item.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
                  {MOCK_LOOKS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === activeLookIndex ? 'w-8 bg-indigo-600' : 'w-1.5 bg-indigo-200'
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Generation Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 p-4 text-center backdrop-blur-xl"
                >
                  <RefreshCcw className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
                  <h3 className="text-base font-black uppercase tracking-tighter">
                    Стилист подбирает вещи...
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Анализ погоды, календаря и ДНК вашего стиля
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls & Details */}
          <div className="space-y-4 lg:col-span-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="rounded-full border-none bg-indigo-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                  Match Score: {activeLook.confidence}%
                </Badge>
                <Badge className="rounded-full border-none bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  {activeLook.occasion}
                </Badge>
              </div>
              <h3 className="text-sm font-black uppercase leading-none tracking-tighter">
                {activeLook.name}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-500">
                Этот образ создан на основе вашего предпочтения к технологичным тканям и планам на
                вечер в календаре. Все вещи уже есть в вашем гардеробе.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                AI Insights для этого лука
              </h4>
              <div className="space-y-3">
                <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase leading-tight text-emerald-800">
                    Идеально для +12°C и легкого ветра. Водоотталкивающий слой Urban Tech Parka
                    обеспечит комфорт.
                  </p>
                </div>
                <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase leading-tight text-amber-800">
                    Ваш любимый цветовой акцент: Графит + Индиго. Этот контраст подчеркивает статус
                    образа.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                className="h-10 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
              >
                <Share2 className="mr-2 h-4 w-4" /> Поделиться
              </Button>
              <Button className="h-10 rounded-2xl bg-black text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105">
                Запланировать на завтра
              </Button>
            </div>

            {/* Quick Upsell / Loyalty integration */}
            <div className="space-y-4 rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex items-center gap-2 text-indigo-400">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Дополни к образу
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">
                    Smart Glass Accessories
                  </p>
                  <p className="text-[9px] font-bold uppercase text-white/40">
                    Спеццена для Loyalty Gold: 4,200 ₽
                  </p>
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-500"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
