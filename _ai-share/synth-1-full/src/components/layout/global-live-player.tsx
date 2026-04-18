'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIState } from '@/providers/ui-state';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Maximize2,
  Minimize2,
  Radio,
  PlayCircle,
  Clock,
  Heart,
  ShoppingBag,
  Signal,
  UserCircle2,
  ShoppingCart,
  Layers,
  ExternalLink,
  Send,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GlobalLivePlayer() {
<<<<<<< HEAD
  const {
    activeLiveStream,
    setActiveLiveStream,
    isLivePlayerMinimized,
    setIsLivePlayerMinimized,
    liveDuration,
  } = useUIState();
=======
  const { activeLiveStream, setActiveLiveStream, isLivePlayerMinimized, setIsLivePlayerMinimized } =
    useUIState();
  const [liveDuration, setLiveDuration] = useState('00:00:00');

  useEffect(() => {
    if (!activeLiveStream) return;
    const started = Date.now();
    const id = window.setInterval(() => {
      const s = Math.floor((Date.now() - started) / 1000);
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      setLiveDuration(`${h}:${m}:${sec}`);
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeLiveStream]);
>>>>>>> recover/cabinet-wip-from-stash

  if (!activeLiveStream) return null;

  const features = activeLiveStream.features || {
    showProducts: true,
    showChat: true,
    showReactions: true,
    showStats: true,
  };

<<<<<<< HEAD
  const broadcastTypeLabel = {
    product_launch: 'Презентация коллекции',
    interview: 'Интервью / Q&A',
    trend_review: 'Обзор трендов',
    fashion_show: 'Показ моды',
  }[(activeLiveStream.broadcastType as keyof typeof broadcastTypeLabel) || 'product_launch'];

=======
>>>>>>> recover/cabinet-wip-from-stash
  return (
    <AnimatePresence>
      {isLivePlayerMinimized ? (
        <motion.div
          key="minimized"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          drag
          dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
          className="group fixed bottom-24 right-6 z-[100] aspect-video w-[340px] cursor-move overflow-hidden rounded-xl border border-white/10 bg-[#0A0C10] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* OS Background Decor for Minimized */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

          <img
            src={activeLiveStream.cover}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsLivePlayerMinimized(false)}
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
              title="Развернуть"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveLiveStream(null)}
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-500/20 text-rose-500 backdrop-blur-md transition-all hover:bg-rose-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  LIVE_BROADCAST
                </span>
              </div>
              <p className="line-clamp-1 text-[11px] font-black uppercase leading-none tracking-tight text-white">
                {activeLiveStream.title}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[9px] font-black tabular-nums text-white backdrop-blur-xl">
              {liveDuration}
            </div>
          </div>

          {/* Scanner Line Decor for Minimized */}
          <motion.div
<<<<<<< HEAD
            className="absolute inset-x-0 h-px bg-indigo-500/20"
=======
            className="bg-accent-primary/20 absolute inset-x-0 h-px"
>>>>>>> recover/cabinet-wip-from-stash
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-black md:flex-row"
        >
          {/* Left Sidebar: Обсуждение */}
<<<<<<< HEAD
          <div className="flex h-full w-full shrink-0 flex-col border-r border-slate-100 bg-white md:w-[320px]">
            <div className="shrink-0 border-b border-slate-100 p-4">
              <h3 className="mb-4 text-sm font-black uppercase tracking-tighter text-slate-900">
                Обсуждение
              </h3>
              <div className="space-y-1">
                <p className="text-[13px] font-black uppercase leading-none tracking-tight text-slate-900">
                  {activeLiveStream.title}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
=======
          <div className="border-border-subtle flex h-full w-full shrink-0 flex-col border-r bg-white md:w-[320px]">
            <div className="border-border-subtle shrink-0 border-b p-4">
              <h3 className="text-text-primary mb-4 text-sm font-black uppercase tracking-tighter">
                Обсуждение
              </h3>
              <div className="space-y-1">
                <p className="text-text-primary text-[13px] font-black uppercase leading-none tracking-tight">
                  {activeLiveStream.title}
                </p>
                <p className="text-text-muted text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                  Ведущая: София, стилист Syntha
                </p>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-4">
              {[
                { user: 'Елена', text: 'Какая красивая вещь! 😍', avatar: 'E' },
                { user: 'Максим', text: 'Это из новой коллекции?', avatar: 'M' },
                { user: 'Анна', text: 'Очень нравится цвет!', avatar: 'A' },
                { user: 'Иван', text: 'А какой состав ткани?', avatar: 'И' },
                { user: 'София', text: 'Уже хочу это купить!', avatar: 'C' },
                { user: 'Дмитрий', text: 'Идеально для лета!', avatar: 'Д' },
                { user: 'Катерина', text: 'Есть другие цвета?', avatar: 'K' },
                {
                  user: 'Марина',
                  text: 'Подскажите, пожалуйста, замеры для размера S.',
                  avatar: 'M',
                },
                { user: 'Виктор', text: 'Очень стильно!', avatar: 'B' },
                { user: 'Ольга', text: 'Доставка быстрая?', avatar: 'O' },
              ].map((msg, i) => (
                <div key={i} className="group flex items-start gap-3">
<<<<<<< HEAD
                  <Avatar className="h-8 w-8 shrink-0 rounded-full border border-slate-100">
                    <AvatarFallback className="bg-slate-50 text-[10px] font-black text-slate-400">
=======
                  <Avatar className="border-border-subtle h-8 w-8 shrink-0 rounded-full border">
                    <AvatarFallback className="bg-bg-surface2 text-text-muted text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[11px] font-black leading-none text-slate-900">{msg.user}</p>
                    <p className="text-xs font-medium leading-relaxed text-slate-500">{msg.text}</p>
=======
                    <p className="text-text-primary text-[11px] font-black leading-none">
                      {msg.user}
                    </p>
                    <p className="text-text-secondary text-xs font-medium leading-relaxed">
                      {msg.text}
                    </p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
            <div className="shrink-0 border-t border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 flex-1 items-center rounded-xl border border-slate-100 bg-slate-50 px-4">
                  <input
                    type="text"
                    placeholder="Ваш комментарий..."
                    className="w-full border-none bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
                  />
                </div>
                <button className="flex h-10 w-10 items-center justify-center text-slate-400 transition-colors hover:text-slate-900">
                  <Send className="h-5 w-5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center text-slate-400 transition-colors hover:text-rose-500">
=======
            <div className="border-border-subtle shrink-0 border-t p-4">
              <div className="flex items-center gap-3">
                <div className="bg-bg-surface2 border-border-subtle flex h-12 flex-1 items-center rounded-xl border px-4">
                  <input
                    type="text"
                    placeholder="Ваш комментарий..."
                    className="placeholder:text-text-muted w-full border-none bg-transparent text-xs font-medium outline-none"
                  />
                </div>
                <button className="text-text-muted hover:text-text-primary flex h-10 w-10 items-center justify-center transition-colors">
                  <Send className="h-5 w-5" />
                </button>
                <button className="text-text-muted flex h-10 w-10 items-center justify-center transition-colors hover:text-rose-500">
>>>>>>> recover/cabinet-wip-from-stash
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Player Area */}
          <div className="relative flex flex-1 flex-col bg-black">
            {/* Header Overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
              <div className="pointer-events-auto flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-2 pr-6 backdrop-blur-xl">
                  <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                    <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                    <AvatarFallback>С</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black uppercase leading-none tracking-tight text-white">
                      София
                    </p>
                    <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/60">
                      Стилист
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-2xl">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-white" />
                    LIVE
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-black text-white/80 backdrop-blur-xl">
                    <UserCircle2 className="h-3 w-3" />
                    2,458
                  </div>
                </div>
              </div>

              <div className="pointer-events-auto flex gap-2">
                <button
                  onClick={() => setIsLivePlayerMinimized(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition-all hover:bg-black/60"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsLivePlayerMinimized(true)} // Just mimicking for now
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition-all hover:bg-black/60"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="relative flex flex-1 items-center justify-center">
              <img
                src={activeLiveStream.cover}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
<<<<<<< HEAD
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-orange-500 to-indigo-600 opacity-80" />
=======
              <div className="to-accent-primary absolute inset-0 bg-gradient-to-br from-rose-500 via-orange-500 opacity-80" />
>>>>>>> recover/cabinet-wip-from-stash

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md transition-transform hover:scale-110">
                  <PlayCircle className="h-12 w-12 fill-white text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  LIVE
                </span>
              </div>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4">
              <button className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-white backdrop-blur-xl transition-all hover:bg-black/60">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Товары в эфире */}
<<<<<<< HEAD
          <div className="flex h-full w-full shrink-0 flex-col border-l border-slate-100 bg-white md:w-[320px]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-4">
              <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">
=======
          <div className="border-border-subtle flex h-full w-full shrink-0 flex-col border-l bg-white md:w-[320px]">
            <div className="border-border-subtle flex shrink-0 items-center justify-between border-b p-4">
              <h3 className="text-text-primary text-sm font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                Товары в эфире
              </h3>
              <button
                onClick={() => setActiveLiveStream(null)}
<<<<<<< HEAD
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50"
=======
                className="hover:bg-bg-surface2 text-text-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
              {features.showProducts ? (
                [
                  {
                    name: 'Шерстяное пальто Oversize',
                    price: '45,000₽',
                    brand: 'Nordic Wool',
                    img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=200',
                  },
                  {
                    name: 'Свитер из кашемира',
                    price: '28,000₽',
                    brand: 'Nordic Wool',
                    img: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=200',
                  },
                  {
                    name: 'Брюки Wide-leg',
                    price: '18,000₽',
                    brand: 'Syntha Lab',
                    img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=200',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="group/item flex cursor-pointer gap-3 rounded-2xl border border-transparent p-3 transition-all hover:border-slate-100 hover:bg-slate-50"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100">
=======
                    className="hover:bg-bg-surface2 hover:border-border-subtle group/item flex cursor-pointer gap-3 rounded-2xl border border-transparent p-3 transition-all"
                  >
                    <div className="border-border-subtle relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border">
>>>>>>> recover/cabinet-wip-from-stash
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover/item:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-1">
<<<<<<< HEAD
                      <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-indigo-500">
                        {item.brand}
                      </p>
                      <h4 className="mb-2 truncate text-[11px] font-black uppercase leading-none tracking-tight text-slate-900">
                        {item.name}
                      </h4>
                      <span className="text-[12px] font-black tabular-nums text-slate-900">
=======
                      <p className="text-accent-primary mb-0.5 text-[8px] font-black uppercase tracking-widest">
                        {item.brand}
                      </p>
                      <h4 className="text-text-primary mb-2 truncate text-[11px] font-black uppercase leading-none tracking-tight">
                        {item.name}
                      </h4>
                      <span className="text-text-primary text-[12px] font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center p-3 text-center">
<<<<<<< HEAD
                  <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-slate-300">
=======
                  <p className="text-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    В этом эфире товары не представлены
                  </p>
                </div>
              )}
            </div>

<<<<<<< HEAD
            <div className="shrink-0 border-t border-slate-100 p-4">
              <div className="flex aspect-[4/1.5] w-full items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-300">
=======
            <div className="border-border-subtle shrink-0 border-t p-4">
              <div className="bg-bg-surface2 border-border-subtle text-text-muted flex aspect-[4/1.5] w-full items-center justify-center rounded-2xl border text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Рекламный баннер
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
