'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const EXCLUSIVE_ITEMS = [
  {
    id: "ex-1",
    title: "Aura Stealth Jacket",
    brand: "SYN_LAB_PROTO",
    price_current: 45000,
    price_target: 42000,
    img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    type: "VIP Prototype",
    stage: "Phase: Testing",
    current: 12,
    goal: 20,
    timeLeft: "2 дня",
    thresholds: [5, 10, 15]
  },
  {
    id: "ex-2",
    title: "Neural Knit One",
    brand: "KICKSTARTER_ELITE",
    price_current: 22000,
    price_target: 18500,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    type: "Elite Drop",
    stage: "Phase: Prototype",
    current: 18,
    goal: 25,
    timeLeft: "5 часов",
    thresholds: [8, 16, 24]
  }
];

export function PrivateAccess() {
  return (
    <div id="private-access-scroll" className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth w-full px-4">
      {EXCLUSIVE_ITEMS.map((item) => (
        <motion.div 
          key={item.id} 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="flex-shrink-0 w-[280px] snap-start"
        >
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-3 shadow-lg group/kick relative">
            <div className="relative aspect-square mb-3">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/kick:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
                <Badge className="bg-indigo-600 text-white border-none font-bold text-[6px] uppercase px-2 py-0.5 shadow-lg">{item.type}</Badge>
                <Badge className="bg-amber-500 text-white border-none font-bold text-[6px] uppercase px-2 py-0.5 shadow-lg">VIP_ACCESS</Badge>
              </div>
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                  <Timer className="h-2 w-2 text-amber-400" />
                  <span className="text-[7px] font-bold text-white uppercase">{item.timeLeft}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-900 tracking-tight mb-0.5">{item.title}</h4>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{item.brand}</p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 line-through">{item.price_current.toLocaleString('ru-RU')}₽</span>
                  <ArrowRight className="h-1.5 w-1.5 text-indigo-500" />
                  <span className="text-xs font-bold text-indigo-600">{item.price_target.toLocaleString('ru-RU')}₽</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[7px] font-bold text-indigo-600 uppercase tracking-wide">{item.stage}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wide">{item.current} / {item.goal} Slots</p>
                  <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide">{Math.round((item.current / item.goal) * 100)}%</p>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full relative">
                  <div className="h-full bg-indigo-600 rounded-full relative z-10" style={{ width: `${(item.current / item.goal) * 100}%` }} />
                  {item.thresholds.map((t) => (
                    <div 
                      key={t}
                      className="absolute top-0 bottom-0 w-px bg-white/40 z-20"
                      style={{ left: `${(t / item.goal) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-center pt-1">
                  <Button 
                    asChild
                    variant="ctaOutline"
                    size="ctaSm"
                    className="w-[180px] group/btn"
                  >
                    <Link href={`/exclusive/${item.id}`}>
                      Забронировать
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

    </div>
  );
}
