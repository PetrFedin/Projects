'use client';

import React, { useState } from 'react';
import {
  Network,
  Store,
  RefreshCcw,
  CheckCircle2,
  Smartphone,
  Database,
  Layout,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Shirt,
  Sparkles,
  Wifi,
  Link2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function OmniChannelBridge() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const startSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="p-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
<<<<<<< HEAD
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
                <Network className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
=======
              <div className="bg-accent-primary flex h-6 w-6 items-center justify-center rounded-lg">
                <Network className="h-4 w-4 text-white" />
              </div>
              <span className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Unified Retail Hub
              </span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">
              Omni-Channel Loyalty Bridge
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              Синхронизация офлайн-покупок с цифровым гардеробом клиента в режиме реального времени.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className="flex items-center gap-1.5 border-none bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase text-emerald-600">
              <Wifi className="h-3 w-3" /> POS Connect: Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-10 p-3 pt-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Visual Bridge */}
          <div className="space-y-4">
<<<<<<< HEAD
            <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4">
=======
            <div className="bg-bg-surface2 border-border-subtle relative flex items-center justify-between overflow-hidden rounded-xl border p-4">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent)]" />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3">
<<<<<<< HEAD
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-xl">
                  <Store className="h-10 w-10 text-slate-900" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-900">
=======
                <div className="border-border-subtle flex h-20 w-20 items-center justify-center rounded-3xl border bg-white shadow-xl">
                  <Store className="text-text-primary h-10 w-10" />
                </div>
                <p className="text-text-primary text-[10px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                  Offline Store
                </p>
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center gap-3 px-6">
                <div className="bg-dashed-gradient relative h-0.5 w-full">
                  <motion.div
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
<<<<<<< HEAD
                    className="absolute -top-1 left-0 h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,1)]"
                  />
                </div>
                <Badge className="border-none bg-indigo-600 px-2 text-[8px] font-black uppercase text-white">
=======
                    className="bg-accent-primary absolute -top-1 left-0 h-2 w-2 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"
                  />
                </div>
                <Badge className="bg-accent-primary border-none px-2 text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  Live Data Feed
                </Badge>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3">
<<<<<<< HEAD
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-200">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-indigo-600">
=======
                <div className="bg-accent-primary shadow-accent-primary/15 flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <p className="text-accent-primary text-[10px] font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                  Digital Wardrobe
                </p>
              </div>
            </div>

            <div className="space-y-4">
<<<<<<< HEAD
              <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Преимущества синхронизации
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <Shirt className="h-4 w-4 text-indigo-600" />
                  <p className="text-[10px] font-black uppercase leading-tight text-slate-900">
                    Авто-наполнение гардероба
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">
                    Вещи из чека мгновенно попадают в AI-стилист.
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <p className="text-[10px] font-black uppercase leading-tight text-slate-900">
                    Персональные офферы
                  </p>
                  <p className="text-[9px] font-medium text-slate-500">
=======
              <h4 className="text-text-muted border-b pb-2 text-[10px] font-black uppercase tracking-widest">
                Преимущества синхронизации
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="bg-bg-surface2 border-border-subtle space-y-2 rounded-2xl border p-4">
                  <Shirt className="text-accent-primary h-4 w-4" />
                  <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                    Авто-наполнение гардероба
                  </p>
                  <p className="text-text-secondary text-[9px] font-medium">
                    Вещи из чека мгновенно попадают в AI-стилист.
                  </p>
                </div>
                <div className="bg-bg-surface2 border-border-subtle space-y-2 rounded-2xl border p-4">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                    Персональные офферы
                  </p>
                  <p className="text-text-secondary text-[9px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                    Скидки в магазине на основе онлайн-покупок.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Status & Controls */}
          <div className="space-y-4">
<<<<<<< HEAD
            <div className="space-y-6 rounded-xl bg-slate-900 p-4 text-white">
=======
            <div className="bg-text-primary space-y-6 rounded-xl p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest">
                  Статус подключения
                </h4>
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Syntha CRM Sync', status: 'Active', icon: Database },
                  { label: 'Retail POS Gateway', status: 'Active', icon: Store },
                  { label: 'Loyalty API Bridge', status: 'Active', icon: Link2 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <item.icon className="h-4 w-4 text-indigo-400" />
=======
                      <item.icon className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white/60">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={startSync}
                disabled={isSyncing}
<<<<<<< HEAD
                className="flex h-10 w-full items-center justify-center gap-3 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-2xl transition-all hover:bg-slate-100"
=======
                className="text-text-primary hover:bg-bg-surface2 flex h-10 w-full items-center justify-center gap-3 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                {isSyncing ? (
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {isSyncing ? `Синхронизация ${syncProgress}%` : 'Запустить принудительный Sync'}
              </Button>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-black uppercase leading-none tracking-tight text-amber-900">
                  Требуется верификация
                </p>
                <p className="text-[10px] font-medium leading-relaxed text-amber-700/80">
                  Обнаружено 3 транзакции в бутике "Syntha Lab Moscow", которые не привязаны к
                  профилю.
                  <button className="ml-2 font-black uppercase text-amber-900 underline">
                    Связать вручную
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
