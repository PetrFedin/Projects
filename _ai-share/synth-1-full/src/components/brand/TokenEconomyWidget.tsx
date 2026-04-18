'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Zap,
  ShieldCheck,
  ArrowUpRight,
  Cpu,
  BarChart3,
  Info,
  Layers,
  Activity,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TokenEconomyWidget() {
  const [isEconomyMode, setIsEconomyMode] = useState(true);
  const [tokenUsage, setTokenUsage] = useState(64); // %

  return (
<<<<<<< HEAD
    <Card className="group relative h-full overflow-hidden rounded-xl border border-none border-white/5 bg-slate-900 p-4 text-white shadow-2xl">
      <div className="absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
        <Cpu className="h-32 w-32 text-indigo-400" />
=======
    <Card className="bg-text-primary group relative h-full overflow-hidden rounded-xl border border-none border-white/5 p-4 text-white shadow-2xl">
      <div className="absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
        <Cpu className="text-accent-primary h-32 w-32" />
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      <div className="relative z-10 flex h-full flex-col space-y-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
<<<<<<< HEAD
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/20 p-1.5 text-indigo-400">
=======
              <div className="bg-accent-primary/20 border-accent-primary/30 text-accent-primary rounded-lg border p-1.5">
>>>>>>> recover/cabinet-wip-from-stash
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">AI Token Economy</h3>
            </div>
<<<<<<< HEAD
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Resource Allocation & Audit
            </p>
          </div>
          <Badge
            className={cn(
              'h-4 border-none px-1.5 text-[7px] font-black uppercase tracking-widest shadow-lg',
<<<<<<< HEAD
              isEconomyMode ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
=======
              isEconomyMode ? 'bg-emerald-500 text-white' : 'bg-accent-primary text-white'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            {isEconomyMode ? 'Economy Active' : 'Performance Mode'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
<<<<<<< HEAD
              <span className="text-slate-400">Daily Quota Utilization</span>
              <span
                className={cn(
                  'tabular-nums',
                  tokenUsage > 80 ? 'text-rose-400' : 'text-indigo-400'
=======
              <span className="text-text-muted">Daily Quota Utilization</span>
              <span
                className={cn(
                  'tabular-nums',
                  tokenUsage > 80 ? 'text-rose-400' : 'text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                {tokenUsage}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/5 bg-white/5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${tokenUsage}%` }}
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  tokenUsage > 80
                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
<<<<<<< HEAD
                    : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
=======
                    : 'bg-accent-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-2.5">
<<<<<<< HEAD
              <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-500">
=======
              <p className="text-text-secondary text-[7px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Cost Avoided (AI)
              </p>
              <p className="text-xs font-black tracking-tight text-emerald-400">$142.50</p>
            </div>
            <div className="space-y-1 rounded-xl border border-white/5 bg-white/5 p-2.5">
<<<<<<< HEAD
              <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-500">
                Tokens Saved
              </p>
              <p className="text-xs font-black tracking-tight text-indigo-400">1.2M</p>
=======
              <p className="text-text-secondary text-[7px] font-bold uppercase leading-none tracking-widest">
                Tokens Saved
              </p>
              <p className="text-accent-primary text-xs font-black tracking-tight">1.2M</p>
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/5 pt-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black uppercase leading-none tracking-tight text-white">
                Smart Optimization
              </p>
<<<<<<< HEAD
              <p className="text-[7px] font-medium uppercase tracking-widest text-slate-400">
=======
              <p className="text-text-muted text-[7px] font-medium uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Horizontal connection to Analytics
              </p>
            </div>
            <button
              onClick={() => setIsEconomyMode(!isEconomyMode)}
              className="transition-all hover:scale-110 focus:outline-none"
            >
              {isEconomyMode ? (
                <ToggleRight className="h-6 w-6 text-emerald-500" />
              ) : (
                <ToggleLeft className="text-text-secondary h-6 w-6" />
              )}
            </button>
          </div>

          <Button
            variant="ghost"
            className="group/btn h-8 w-full gap-2 rounded-lg border border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            Configure Quotas{' '}
            <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
