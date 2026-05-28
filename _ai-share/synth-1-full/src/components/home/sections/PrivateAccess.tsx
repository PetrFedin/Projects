'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, ArrowRight, ShieldCheck, Timer, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const EXCLUSIVE_ITEMS = [
  {
    id: 'ex-1',
    title: 'Aura Stealth Jacket',
    brand: 'SYN_LAB_PROTO',
    price_current: 45000,
    price_target: 42000,
    img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80',
    type: 'VIP Prototype',
    stage: 'Phase: Testing',
    current: 12,
    goal: 20,
    timeLeft: '2 дня',
    thresholds: [5, 10, 15],
  },
  {
    id: 'ex-2',
    title: 'Neural Knit One',
    brand: 'KICKSTARTER_ELITE',
    price_current: 22000,
    price_target: 18500,
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    type: 'Elite Drop',
    stage: 'Phase: Prototype',
    current: 18,
    goal: 25,
    timeLeft: '5 часов',
    thresholds: [8, 16, 24],
  },
];

export function PrivateAccess() {
  return (
    <div
      id="private-access-scroll"
      className="custom-scrollbar flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-6"
    >
      {EXCLUSIVE_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[280px] flex-shrink-0 snap-start"
        >
          <div className="border-border-subtle group/kick relative rounded-[1.5rem] border bg-white p-3 shadow-lg">
            <div className="relative mb-3 aspect-square">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <img
                  src={item.img}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/kick:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="absolute left-2.5 top-2.5 z-20 flex flex-col gap-1">
                <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[6px] font-bold uppercase text-white shadow-lg">
                  {item.type}
                </Badge>
                <Badge className="border-none bg-amber-500 px-2 py-0.5 text-[6px] font-bold uppercase text-white shadow-lg">
                  VIP_ACCESS
                </Badge>
              </div>
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md">
                  <Timer className="h-2 w-2 text-amber-400" />
                  <span className="text-[7px] font-bold uppercase text-white">{item.timeLeft}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-text-primary mb-0.5 text-xs font-bold uppercase tracking-tight">
                {item.title}
              </h4>
              <p className="text-text-muted text-[8px] font-bold uppercase tracking-wide">
                {item.brand}
              </p>
              <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted text-[10px] font-bold line-through">
                    {item.price_current.toLocaleString('ru-RU')}₽
                  </span>
                  <ArrowRight className="text-accent-primary h-1.5 w-1.5" />
                  <span className="text-accent-primary text-xs font-bold">
                    {item.price_target.toLocaleString('ru-RU')}₽
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-accent-primary h-1 w-1 animate-pulse rounded-full" />
                  <span className="text-accent-primary text-[7px] font-bold uppercase tracking-wide">
                    {item.stage}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <p className="text-text-primary text-[9px] font-bold uppercase tracking-wide">
                    {item.current} / {item.goal} Slots
                  </p>
                  <p className="text-accent-primary text-[9px] font-bold uppercase tracking-wide">
                    {Math.round((item.current / item.goal) * 100)}%
                  </p>
                </div>
                <div className="bg-bg-surface2 relative h-1 w-full rounded-full">
                  <div
                    className="bg-accent-primary relative z-10 h-full rounded-full"
                    style={{ width: `${(item.current / item.goal) * 100}%` }}
                  />
                  {item.thresholds.map((t) => (
                    <div
                      key={t}
                      className="absolute bottom-0 top-0 z-20 w-px bg-white/40"
                      style={{ left: `${(t / item.goal) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-center pt-1">
                  <Button asChild variant="ctaOutline" size="ctaSm" className="group/btn w-[180px]">
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
