'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIState } from '@/providers/ui-state';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Radio, PlayCircle, Clock, Heart, ShoppingBag, Signal, UserCircle2, ShoppingCart, Layers, ExternalLink, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GlobalLivePlayer() {
  const { activeLiveStream, setActiveLiveStream, isLivePlayerMinimized, setIsLivePlayerMinimized, liveDuration } = useUIState();

  if (!activeLiveStream) return null;

  const features = activeLiveStream.features || {
    showProducts: true,
    showChat: true,
    showReactions: true,
    showStats: true
  };

  const broadcastTypeLabel = {
    'product_launch': 'Презентация коллекции',
    'interview': 'Интервью / Q&A',
    'trend_review': 'Обзор трендов',
    'fashion_show': 'Показ моды'
  }[activeLiveStream.broadcastType as keyof typeof broadcastTypeLabel || 'product_launch'];

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
          className="fixed bottom-24 right-6 w-[340px] aspect-video bg-[#0A0C10] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[100] group cursor-move"
        >
          {/* OS Background Decor for Minimized */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <img src={activeLiveStream.cover} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setIsLivePlayerMinimized(false)}
              className="h-7 w-7 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
              title="Развернуть"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setActiveLiveStream(null)}
              className="h-7 w-7 rounded-xl bg-rose-500/20 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black text-emerald-400 uppercase tracking-[0.2em]">LIVE_BROADCAST</span>
              </div>
              <p className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1 leading-none">{activeLiveStream.title}</p>
            </div>
            <div className="text-[9px] font-black text-white bg-white/10 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-xl tabular-nums">
              {liveDuration}
            </div>
          </div>

          {/* Scanner Line Decor for Minimized */}
          <motion.div 
            className="absolute inset-x-0 h-px bg-indigo-500/20"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col md:flex-row overflow-hidden"
        >
          {/* Left Sidebar: Обсуждение */}
          <div className="w-full md:w-[320px] bg-white flex flex-col h-full border-r border-slate-100 shrink-0">
            <div className="p-4 border-b border-slate-100 shrink-0">
              <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900 mb-4">Обсуждение</h3>
              <div className="space-y-1">
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">{activeLiveStream.title}</p>
                <p className="text-[10px] font-medium text-slate-400">Ведущая: София, стилист Syntha</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
              {[
                { user: 'Елена', text: 'Какая красивая вещь! 😍', avatar: 'E' },
                { user: 'Максим', text: 'Это из новой коллекции?', avatar: 'M' },
                { user: 'Анна', text: 'Очень нравится цвет!', avatar: 'A' },
                { user: 'Иван', text: 'А какой состав ткани?', avatar: 'И' },
                { user: 'София', text: 'Уже хочу это купить!', avatar: 'C' },
                { user: 'Дмитрий', text: 'Идеально для лета!', avatar: 'Д' },
                { user: 'Катерина', text: 'Есть другие цвета?', avatar: 'K' },
                { user: 'Марина', text: 'Подскажите, пожалуйста, замеры для размера S.', avatar: 'M' },
                { user: 'Виктор', text: 'Очень стильно!', avatar: 'B' },
                { user: 'Ольга', text: 'Доставка быстрая?', avatar: 'O' },
              ].map((msg, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <Avatar className="h-8 w-8 rounded-full border border-slate-100 shrink-0">
                    <AvatarFallback className="bg-slate-50 text-[10px] font-black text-slate-400">{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-900 leading-none">{msg.user}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center">
                  <input 
                    type="text" 
                    placeholder="Ваш комментарий..." 
                    className="w-full bg-transparent border-none outline-none text-xs font-medium placeholder:text-slate-400"
                  />
                </div>
                <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <Send className="h-5 w-5" />
                </button>
                <button className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Player Area */}
          <div className="flex-1 relative bg-black flex flex-col">
            {/* Header Overlay */}
            <div className="absolute top-0 inset-x-0 p-4 z-20 flex justify-between items-start pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-6">
                  <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                    <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                    <AvatarFallback>С</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none">София</p>
                    <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest leading-none">Стилист</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-rose-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-2xl">
                    <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 text-white/80 text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-2">
                    <UserCircle2 className="h-3 w-3" />
                    2,458
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pointer-events-auto">
                <button 
                  onClick={() => setIsLivePlayerMinimized(true)}
                  className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <Minimize2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsLivePlayerMinimized(true)} // Just mimicking for now
                  className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="flex-1 relative flex items-center justify-center">
              <img src={activeLiveStream.cover} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-orange-500 to-indigo-600 opacity-80" />
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="h-24 w-24 rounded-full bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-md cursor-pointer hover:scale-110 transition-transform">
                  <PlayCircle className="h-12 w-12 text-white fill-white" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">LIVE</span>
              </div>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex justify-between items-end pointer-events-none">
              <button className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all pointer-events-auto">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: Товары в эфире */}
          <div className="w-full md:w-[320px] bg-white flex flex-col h-full border-l border-slate-100 shrink-0">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">Товары в эфире</h3>
              <button 
                onClick={() => setActiveLiveStream(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {features.showProducts ? (
                [
                  { name: 'Шерстяное пальто Oversize', price: '45,000₽', brand: 'Nordic Wool', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=200' },
                  { name: 'Свитер из кашемира', price: '28,000₽', brand: 'Nordic Wool', img: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=200' },
                  { name: 'Брюки Wide-leg', price: '18,000₽', brand: 'Syntha Lab', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=200' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group/item cursor-pointer">
                    <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">{item.brand}</p>
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-2">{item.name}</h4>
                      <span className="text-[12px] font-black text-slate-900 tabular-nums">{item.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-center p-3">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                    В этом эфире товары не представлены
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 shrink-0">
              <div className="aspect-[4/1.5] w-full bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Рекламный баннер
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
