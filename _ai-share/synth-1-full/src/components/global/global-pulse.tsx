'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Zap,
  MessageSquare,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';

const PULSE_EVENTS = [
  {
    id: 1,
    role: 'Фабрика',
    action: 'запустила пошив партии',
    target: 'Urban Tech Parka',
    type: 'success',
  },
  { id: 2, role: 'Магазин', action: 'оформил дозаказ', target: 'Graphite Trousers', type: 'info' },
  { id: 3, role: 'AI', action: 'обнаружил риск задержки', target: 'Ткань: Nylon', type: 'warning' },
  {
    id: 4,
    role: 'Бренд',
    action: 'утвердил новый BOM',
    target: 'Cyber Wool Coat',
    type: 'success',
  },
  { id: 5, role: 'Клиент', action: 'примерил в AR', target: 'Tech Parka v2', type: 'info' },
];

export function GlobalPulse() {
  const { pulseMode } = useUIState();
  const [activeEvents, setActiveEvents] = useState<typeof PULSE_EVENTS>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = PULSE_EVENTS[Math.floor(Math.random() * PULSE_EVENTS.length)];
      const id = Date.now();
      setActiveEvents((prev) => [{ ...randomEvent, id }, ...prev].slice(0, 5));

      // For floating mode, we auto-remove after 5s.
      // For ticker, we keep them for the scrolling cycle.
      if (pulseMode === 'floating') {
        setTimeout(() => {
          setActiveEvents((prev) => prev.filter((e) => e.id !== id));
        }, 5000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [pulseMode]);

  if (pulseMode === 'ticker') {
    return (
<<<<<<< HEAD
      <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[200] flex h-10 items-center overflow-hidden border-t border-white/10 bg-slate-900">
        <Link
          href="/"
          className="group/pulse z-10 flex h-full shrink-0 cursor-pointer items-center gap-2 bg-indigo-600 px-6 shadow-[10px_0_20px_rgba(0,0,0,0.5)] transition-colors hover:bg-indigo-700"
=======
      <div className="bg-text-primary pointer-events-auto fixed bottom-0 left-0 right-0 z-[200] flex h-10 items-center overflow-hidden border-t border-white/10">
        <Link
          href="/"
          className="bg-accent-primary hover:bg-accent-primary group/pulse z-10 flex h-full shrink-0 cursor-pointer items-center gap-2 px-6 shadow-[10px_0_20px_rgba(0,0,0,0.5)] transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <Activity className="h-4 w-4 animate-pulse text-white" />
          <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-white transition-transform group-hover/pulse:translate-x-0.5">
            Syntha Live Pulse
          </span>
        </Link>

        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex items-center gap-3 whitespace-nowrap px-12"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...PULSE_EVENTS, ...PULSE_EVENTS].map((event, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    event.type === 'success'
                      ? 'bg-emerald-500'
                      : event.type === 'warning'
                        ? 'bg-amber-500'
<<<<<<< HEAD
                        : 'bg-indigo-500'
=======
                        : 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">
                  {event.role}:
                </span>
                <span className="text-[10px] font-black uppercase tracking-tight text-white">
<<<<<<< HEAD
                  {event.action} <span className="text-indigo-400">{event.target}</span>
                </span>
                <span className="text-[8px] font-medium uppercase text-white/20">
                  / {i + 1}m ago
                </span>
=======
                  {event.action} <span className="text-accent-primary">{event.target}</span>
                </span>
                <span className="text-[8px] font-medium uppercase text-white/20">
                  / {i + 1}m ago
                </span>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            ))}
          </motion.div>

<<<<<<< HEAD
          <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-slate-900 to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-slate-900 to-transparent" />
        </div>

        <div className="flex h-full shrink-0 items-center gap-3 border-l border-white/10 bg-slate-900 px-4">
=======
          <div className="from-text-primary absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent" />
          <div className="from-text-primary absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent" />
        </div>

        <div className="bg-text-primary flex h-full shrink-0 items-center gap-3 border-l border-white/10 px-4">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">
              Nodes Online: 142
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed right-6 top-4 z-[200] flex flex-col items-end gap-3 duration-300 animate-in fade-in slide-in-from-right-4">
      {/* Floating Pulse Trigger */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-all duration-500',
<<<<<<< HEAD
            isExpanded ? 'bg-slate-900' : 'bg-indigo-600'
=======
            isExpanded ? 'bg-text-primary' : 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
          )}
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Activity className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />
          )}
          <div className="absolute inset-0 scale-0 rounded-full bg-white/20 transition-transform duration-700 group-hover:scale-150" />
          {!isExpanded && activeEvents.length > 0 && (
            <span className="absolute right-3 top-3 h-2 w-2 animate-ping rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Events Stack */}
      <div className="w-80 space-y-3">
        <AnimatePresence initial={false}>
          {(isExpanded || activeEvents.length > 0) &&
            activeEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ x: 100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="pointer-events-auto"
              >
                <div
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl transition-all hover:scale-105',
                    event.type === 'success'
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : event.type === 'warning'
                        ? 'border-amber-500/20 bg-amber-500/10'
<<<<<<< HEAD
                        : 'border-indigo-500/20 bg-indigo-500/10'
=======
                        : 'bg-accent-primary/10 border-accent-primary/20'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg',
                      event.type === 'success'
                        ? 'bg-emerald-600'
                        : event.type === 'warning'
                          ? 'bg-amber-600'
<<<<<<< HEAD
                          : 'bg-indigo-600'
=======
                          : 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {event.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : event.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-white" />
                    ) : (
                      <Zap className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {event.role}
                    </p>
                    <p className="text-[11px] font-bold leading-tight text-slate-900">
                      {event.action} <span className="text-indigo-600">{event.target}</span>
                    </p>
                    <p className="text-[8px] font-medium uppercase italic text-slate-400">
                      Только что
                    </p>
=======
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      {event.role}
                    </p>
                    <p className="text-text-primary text-[11px] font-bold leading-tight">
                      {event.action} <span className="text-accent-primary">{event.target}</span>
                    </p>
                    <p className="text-text-muted text-[8px] font-medium uppercase italic">
                      Только что
                    </p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
