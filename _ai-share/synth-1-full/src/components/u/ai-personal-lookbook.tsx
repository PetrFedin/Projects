'use client';

import React, { useState } from 'react';
import { 
  Sparkles, BrainCircuit, Heart, Share2, ShoppingBag, 
  ChevronLeft, ChevronRight, RefreshCcw, Camera, 
  Palette, Smartphone, Zap, CheckCircle2, Star,
  Layout, Grid2X2, Scissors
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
      { name: 'Urban Tech Parka', brand: 'Syntha Lab', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
      { name: 'Graphite Trousers', brand: 'Syntha Lab', image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=400' }
    ],
    bg: 'bg-indigo-50'
  },
  {
    id: 'l2',
    name: 'Neo-Classic Evening',
    occasion: 'Ужин / Мероприятие',
    confidence: 88,
    items: [
      { name: 'Silk Oversize Shirt', brand: 'Silk Road', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400' },
      { name: 'Tech Blazer', brand: 'Syntha Lab', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=400' }
    ],
    bg: 'bg-rose-50'
  }
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
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-4 pb-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BrainCircuit className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Personal Stylist AI</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">AI Personal Lookbook</CardTitle>
          </div>
          <Button 
            onClick={generateNewLook}
            disabled={isGenerating}
            className="bg-black text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
          >
            {isGenerating ? <RefreshCcw className="h-3.5 w-3.5 animate-spin mr-2" /> : <Sparkles className="h-3.5 w-3.5 mr-2 text-amber-400" />}
            Сгенерировать образ
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Visualizer */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLook.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className={cn("rounded-xl p-4 aspect-square flex flex-col items-center justify-center relative overflow-hidden", activeLook.bg)}
              >
                {/* Abstract background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                  <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-200 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex gap-3">
                  {activeLook.items.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="relative h-80 w-60 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                    >
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="text-[8px] font-black uppercase text-white/60">{item.brand}</p>
                        <p className="text-[10px] font-black uppercase">{item.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {MOCK_LOOKS.map((_, i) => (
                    <div key={i} className={cn("h-1.5 rounded-full transition-all", i === activeLookIndex ? "w-8 bg-indigo-600" : "w-1.5 bg-indigo-200")} />
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
                  className="absolute inset-0 bg-white/60 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-4 text-center"
                >
                  <RefreshCcw className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                  <h3 className="text-base font-black uppercase tracking-tighter">Стилист подбирает вещи...</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Анализ погоды, календаря и ДНК вашего стиля</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls & Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-600 text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Match Score: {activeLook.confidence}%
                </Badge>
                <Badge className="bg-slate-100 text-slate-500 border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {activeLook.occasion}
                </Badge>
              </div>
              <h3 className="text-sm font-black uppercase tracking-tighter leading-none">{activeLook.name}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Этот образ создан на основе вашего предпочтения к технологичным тканям и планам на вечер в календаре. 
                Все вещи уже есть в вашем гардеробе.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">AI Insights для этого лука</h4>
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] text-emerald-800 font-bold leading-tight uppercase">
                    Идеально для +12°C и легкого ветра. Водоотталкивающий слой Urban Tech Parka обеспечит комфорт.
                  </p>
                </div>
                <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="h-8 w-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] text-amber-800 font-bold leading-tight uppercase">
                    Ваш любимый цветовой акцент: Графит + Индиго. Этот контраст подчеркивает статус образа.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" className="h-10 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50">
                <Share2 className="h-4 w-4 mr-2" /> Поделиться
              </Button>
              <Button className="h-10 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
                Запланировать на завтра
              </Button>
            </div>
            
            {/* Quick Upsell / Loyalty integration */}
            <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4">
               <div className="flex items-center gap-2 text-indigo-400">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Дополни к образу</span>
               </div>
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Smart Glass Accessories</p>
                    <p className="text-[9px] text-white/40 font-bold uppercase">Спеццена для Loyalty Gold: 4,200 ₽</p>
                  </div>
                  <Button size="icon" className="h-10 w-10 bg-indigo-600 rounded-xl hover:bg-indigo-500">
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
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}
