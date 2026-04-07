'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Bell, CheckCircle2, AlertTriangle, Zap, MessageSquare, TrendingUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';

const PULSE_EVENTS = [
  { id: 1, role: 'Фабрика', action: 'запустила пошив партии', target: 'Urban Tech Parka', type: 'success' },
  { id: 2, role: 'Магазин', action: 'оформил дозаказ', target: 'Graphite Trousers', type: 'info' },
  { id: 3, role: 'AI', action: 'обнаружил риск задержки', target: 'Ткань: Nylon', type: 'warning' },
  { id: 4, role: 'Бренд', action: 'утвердил новый BOM', target: 'Cyber Wool Coat', type: 'success' },
  { id: 5, role: 'Клиент', action: 'примерил в AR', target: 'Tech Parka v2', type: 'info' }
];

export function GlobalPulse() {
  const { pulseMode } = useUIState();
  const [activeEvents, setActiveEvents] = useState<typeof PULSE_EVENTS>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = PULSE_EVENTS[Math.floor(Math.random() * PULSE_EVENTS.length)];
      const id = Date.now();
      setActiveEvents(prev => [{ ...randomEvent, id }, ...prev].slice(0, 5));
      
      // For floating mode, we auto-remove after 5s. 
      // For ticker, we keep them for the scrolling cycle.
      if (pulseMode === 'floating') {
        setTimeout(() => {
          setActiveEvents(prev => prev.filter(e => e.id !== id));
        }, 5000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [pulseMode]);

  if (pulseMode === 'ticker') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-slate-900 border-t border-white/10 h-10 flex items-center overflow-hidden pointer-events-auto">
        <Link href="/" className="bg-indigo-600 h-full px-6 flex items-center gap-2 shrink-0 z-10 shadow-[10px_0_20px_rgba(0,0,0,0.5)] hover:bg-indigo-700 transition-colors cursor-pointer group/pulse">
          <Activity className="h-4 w-4 text-white animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap group-hover/pulse:translate-x-0.5 transition-transform">Syntha Live Pulse</span>
        </Link>
        
        <div className="flex-1 overflow-hidden relative">
          <motion.div 
            className="flex items-center gap-3 whitespace-nowrap px-12"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...PULSE_EVENTS, ...PULSE_EVENTS].map((event, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  event.type === 'success' ? "bg-emerald-500" :
                  event.type === 'warning' ? "bg-amber-500" : "bg-indigo-500"
                )} />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{event.role}:</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tight">
                  {event.action} <span className="text-indigo-400">{event.target}</span>
                </span>
                <span className="text-[8px] font-medium text-white/20 uppercase">/ {i+1}m ago</span>
              </div>
            ))}
          </motion.div>
          
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />
        </div>

        <div className="px-4 border-l border-white/10 flex items-center gap-3 bg-slate-900 shrink-0 h-full">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Nodes Online: 142</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Floating Pulse Trigger */}
      <div className="pointer-events-auto">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden group",
            isExpanded ? "bg-slate-900" : "bg-indigo-600"
          )}
        >
          {isExpanded ? <X className="h-6 w-6 text-white" /> : <Activity className="h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110" />}
          <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
          {!isExpanded && activeEvents.length > 0 && (
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>

      {/* Events Stack */}
      <div className="w-80 space-y-3">
        <AnimatePresence initial={false}>
          {(isExpanded || activeEvents.length > 0) && (
            activeEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ x: 100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="pointer-events-auto"
              >
                <div className={cn(
                  "p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all hover:scale-105",
                  event.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20" :
                  event.type === 'warning' ? "bg-amber-500/10 border-amber-500/20" :
                  "bg-indigo-500/10 border-indigo-500/20"
                )}>
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    event.type === 'success' ? "bg-emerald-600" :
                    event.type === 'warning' ? "bg-amber-600" :
                    "bg-indigo-600"
                  )}>
                    {event.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-white" /> :
                     event.type === 'warning' ? <AlertTriangle className="h-5 w-5 text-white" /> :
                     <Zap className="h-5 w-5 text-white" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{event.role}</p>
                    <p className="text-[11px] font-bold text-slate-900 leading-tight">
                      {event.action} <span className="text-indigo-600">{event.target}</span>
                    </p>
                    <p className="text-[8px] font-medium text-slate-400 uppercase italic">Только что</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
