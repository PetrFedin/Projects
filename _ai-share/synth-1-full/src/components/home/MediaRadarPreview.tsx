"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Sparkles, 
  Eye, 
  Users, 
  Heart, 
  Maximize2, 
  Radio, 
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Mock Data Pools ---

const DETECTED_ITEMS = [
  { 
    id: "0xFD42", 
    label: "Шерстяное пальто", 
    conf: "98.5%", 
    color: "border-amber-400", 
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    box: { top: "10%", left: "25%", width: "50%", height: "80%" }
  },
  { 
    id: "0xAE12", 
    label: "Спортивный костюм", 
    conf: "99.1%", 
    color: "border-emerald-400", 
    img: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
    box: { top: "25%", left: "32%", width: "36%", height: "65%" }
  },
  { 
    id: "0xBB33", 
    label: "Кожаная куртка", 
    conf: "97.4%", 
    color: "border-indigo-400", 
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    box: { top: "15%", left: "20%", width: "60%", height: "60%" }
  },
  { 
    id: "0xCC88", 
    label: "Шелковое платье", 
    conf: "99.2%", 
    color: "border-rose-400", 
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    box: { top: "10%", left: "35%", width: "30%", height: "80%" }
  }
];

// --- Sub-components ---

const ReactionParticle = ({ id }) => (
  <motion.div
    key={id}
    initial={{ y: 50, x: Math.random() * 60 - 30, opacity: 0, scale: 0 }}
    animate={{ y: -150, x: Math.random() * 100 - 50, opacity: [0, 1, 0], scale: [0, 1.2, 0.8] }}
    transition={{ duration: 2.5, ease: "easeOut" }}
    className="absolute bottom-10 left-1/2 pointer-events-none z-20"
  >
    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
  </motion.div>
);

const SyncBeam = ({ active, color }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
    <AnimatePresence>
      {active && (
        <motion.path
          d="M 50% 50% L 100% 50%"
          fill="none"
          strokeWidth="1"
          className={color}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  </svg>
);

// --- Main Mission Control ---

import { useUIState } from "@/providers/ui-state";

export function MediaRadarPreview() {
  const { setIsMediaRadarOpen } = useUIState();
  // Global States
  const [viewerCount, setViewerCount] = useState(1284);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reactions, setReactions] = useState<{ id: number }[]>([]);
  
  // Per-monitor States
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [currentBoxIdx, setCurrentBoxIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [lastComment, setLastComment] = useState("Качество на высоте ✨");

  const currentImage = DETECTED_ITEMS[currentImageIdx];
  const currentBox = DETECTED_ITEMS[currentBoxIdx];

  useEffect(() => {
    const mainTimer = setInterval(() => {
      // 1. Update Global Metrics
      setViewerCount(prev => prev + (Math.random() > 0.5 ? 2 : -1));
      setCurrentTime(new Date());
      if (Math.random() > 0.6) setReactions(prev => [...prev, { id: Date.now() }].slice(-8));

      // 2. Cycle Detection with HARD Sync Logic
      setIsScanning(true);
      
      // Шаг 1: Через 400мс меняем картинку (пока идет анимация луча)
      setTimeout(() => {
        setCurrentImageIdx(prev => (prev + 1) % DETECTED_ITEMS.length);
      }, 400);

      // Шаг 2: Через 1200мс (когда картинка уже сменилась) обновляем данные рамки
      setTimeout(() => {
        setCurrentBoxIdx(prev => (prev + 1) % DETECTED_ITEMS.length);
      }, 1000);

      // Шаг 3: Еще через полсекунды показываем рамку
      setTimeout(() => {
        setIsScanning(false);
      }, 1600); 

      // 3. Dynamic Comments
      const phrases = [
        "Текстура просто супер! 🔥", 
        "Качество на высоте ✨", 
        "Это коллекция AW26?", 
        "Посмотрите на этот шелк!", 
        "Нужно заказать для UK", 
        "Вайб Парижа 🇫🇷"
      ];
      setLastComment(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 4000);

    return () => clearInterval(mainTimer);
  }, []);

  return (
    <Dialog onOpenChange={setIsMediaRadarOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-slate-200 bg-white text-slate-400 hover:text-indigo-600 shadow-sm transition-all group">
          <Radio className="h-4 w-4 group-hover:animate-pulse" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 bg-slate-950 border-none rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        {/* Futuristic Header */}
        <div className="bg-slate-900/40 backdrop-blur-2xl p-4 border-b border-white/10 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400/50">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge className="bg-emerald-500 text-black border-none text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase">СИСТЕМА: LIVE</Badge>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Активный стрим</span>
              </div>
              <DialogTitle className="text-base font-bold uppercase tracking-tight text-white">MISSION CONTROL</DialogTitle>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-wide">Системное время</span>
              <span className="text-xs font-mono text-white/80 font-bold tabular-nums">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Simplified Layout: DNA and FEED over each other */}
        <div className="p-4 space-y-6 bg-slate-950/50">
          
          {/* Monitor 1: NEURAL_STYLE_DNA */}
          <div className="aspect-video bg-slate-900/40 rounded-xl overflow-hidden relative border border-white/10 group">
            <AnimatePresence>
              <motion.div 
                key={currentImage.img}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <img src={currentImage.img} className="w-full h-full object-cover grayscale" alt="Stream" />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-indigo-950/10" />
            
            {/* AI Scan Line */}
            {isScanning && (
              <motion.div 
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-30"
              />
            )}

            {/* Dynamic AI Box */}
            <AnimatePresence>
              {!isScanning && (
                <motion.div 
                  key={`box-${currentBox.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className={cn("absolute border-2 rounded-sm shadow-2xl z-20 transition-all duration-500", currentBox.color)}
                  style={{
                    top: currentBox.box.top,
                    left: currentBox.box.left,
                    width: currentBox.box.width,
                    height: currentBox.box.height
                  }}
                >
                  <div className={cn("absolute -top-4 left-0 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 whitespace-nowrap", currentBox.color.replace('border-', 'bg-'))}>
                    <Sparkles className="h-2 w-2" />
                    Обнаружено: {currentBox.label} ({currentBox.conf})
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-4 left-4 z-30">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <Eye className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wide text-emerald-400">
                  {isScanning ? "AI-АНАЛИЗ: ПОИСК..." : "AI-АНАЛИЗ: АКТИВНО"}
                </span>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-30">
              <div className="flex flex-col items-end">
                <span className="text-[6px] font-bold text-white/40 uppercase">Статус</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wide">Сканирование...</span>
              </div>
            </div>
          </div>

          {/* Monitor 2: LIVE_FEED */}
          <div className="aspect-video bg-slate-900/40 rounded-xl overflow-hidden relative border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80')] bg-cover bg-center opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <AnimatePresence>
              {reactions.map(r => <ReactionParticle key={r.id} id={r.id} />)}
            </AnimatePresence>

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="bg-rose-600 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide flex items-center gap-2 shadow-xl">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                ПРЯМОЙ ЭФИР
              </div>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <Users className="h-3 w-3 text-white/60" />
              <motion.span 
                key={viewerCount}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[10px] font-bold text-white tabular-nums"
              >
                {viewerCount.toLocaleString('ru-RU')}
              </motion.span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 h-12 flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={lastComment}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/10 w-fit max-w-full"
                >
                  <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-[6px] font-bold text-white shrink-0">@байер</div>
                  <span className="text-[10px] font-medium text-white/90 truncate pr-2">{lastComment}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Footer info strip */}
        <div className="bg-slate-900/60 p-4 border-t border-white/10 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">ЦЕНТР_УПРАВЛЕНИЯ_ПОТОКАМИ</div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Ядро: Стабильно</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Задержка: 12мс</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-wider">Код: 0xSYNTHA_OS</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
