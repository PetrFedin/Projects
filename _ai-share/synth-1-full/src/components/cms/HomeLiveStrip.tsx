"use client";

import * as React from "react";
import Link from "next/link";
import type { CmsLive } from "@/data/cms.home.default";
import { PlayCircle, Radio, Users, Eye, Sparkles, Calendar, ArrowRight, Heart, Brain, Signal, ShoppingBag, Clock, Bell, Info, UserCircle2, HeartOff, MoreHorizontal, ShieldCheck, ExternalLink, Video, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUIState } from "@/providers/ui-state";
import { useAuth } from "@/providers/auth-provider";

function formatCountdown(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const d = Math.max(0, t - now);
  const hours = Math.floor(d / (1000 * 60 * 60));
  const mins = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}ч ${mins}м`;
}

function formatStartTime(iso: string) {
  const date = new Date(iso);
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

const aiReels = [
  { 
    id: 'reel-1', 
    title: 'Oversize Wool Coat', 
    brand: 'Syntha Premium', 
    views: '124K',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=400' 
  },
  { 
    id: 'reel-2', 
    title: 'Technical Trousers', 
    brand: 'Syntha Lab', 
    views: '89K',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400' 
  },
  { 
    id: 'reel-3', 
    title: 'Silk Scarf Series', 
    brand: 'Nordic Wool', 
    views: '215K',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400' 
  },
  { 
    id: 'reel-4', 
    title: 'Leather Accessories', 
    brand: 'Syntha Craft', 
    views: '56K',
    imageUrl: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=400' 
  },
];

export function HomeLiveStrip({ live }: { live: CmsLive[] }) {
  const { setActiveLiveStream, addNotification, notifications, removeNotification } = useUIState();
  const auth = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [liveDuration, setLiveDuration] = React.useState("00:42:15");
  const [liked, setLiked] = React.useState<boolean | null>(null);
  const [notifyMinutes, setNotifyMinutes] = React.useState("15");

  // Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const gridX = useTransform(dx, [-300, 300], [10, -10]);
  const gridY = useTransform(dy, [-150, 150], [10, -10]);
  const glowX = useTransform(dx, [-300, 300], [20, -20]);
  const glowY = useTransform(dy, [-150, 150], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleOpenLive = (stream: CmsLive) => {
    setActiveLiveStream(stream);
    // Remove any notifications for this specific stream
    const relatedNotif = notifications.find(n => n.streamId === stream.id);
    if (relatedNotif) {
      removeNotification(relatedNotif.id);
    }
  };

  const handleSaveNotification = (stream: CmsLive) => {
    addNotification({
      title: 'УВЕДОМЛЕНИЕ НАСТРОЕНО',
      message: `Мы напомним вам об эфире "${stream.title}" за ${notifyMinutes} минут до начала.`,
      type: 'success',
      streamId: stream.id,
      persistent: true
    });
  };

  React.useEffect(() => {
    setMounted(true);
    
    // Интервал для обновления счетчика эфира
    const interval = setInterval(() => {
      setLiveDuration(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let totalSeconds = h * 3600 + m * 60 + s + 1;
        
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* --- HEADER NETWORK STATUS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center relative overflow-hidden group">
                <Radio className="h-5 w-5 text-rose-600 relative z-10" />
                <motion.div 
                  className="absolute inset-0 bg-rose-500/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [1, 0.7, 1] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Badge variant="outline" className="text-[11px] border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5">
                    MEDIA_ECOSYSTEM_b2c
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => handleOpenLive(live[0])}
              className="hover:text-indigo-600 transition-colors block text-left"
            >
              <h2 className="text-xl md:text-3xl font-semibold uppercase tracking-tight text-slate-900 leading-none">
                Прямой эфир
              </h2>
            </button>
            <p className="text-slate-400 font-medium text-xs max-w-md">Глобальная медиа-экосистема.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
            <div className="flex flex-col items-end">
              <div className="text-[13px] font-black text-slate-900 uppercase tracking-tighter leading-none flex items-center gap-2">
                2.4K
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">ЗРИТЕЛИ_ОНЛАЙН</span>
            </div>
          </div>
          <Button asChild variant="cta" size="ctaLg">
            <Link href="/live" className="flex items-center gap-2">
              Расписание
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* --- MAIN GRID: LIVE CARDS + ANNOUNCEMENTS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {live.map((l, idx) => (
          <div key={l.id} className="group relative rounded-xl border border-slate-100 p-2 bg-white transition-all hover:border-slate-900 hover:shadow-2xl overflow-hidden flex flex-col shadow-sm">
            <div className="relative w-full aspect-[10/12] overflow-hidden rounded-xl">
              <img src={l.cover} alt={l.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <div className={cn(
                  "backdrop-blur-md text-white text-[7px] font-black px-1.5 py-0.5 rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-2xl border border-white/10",
                  idx === 0 ? "bg-emerald-500/90" : "bg-rose-600/90"
                )}>
                  <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                  {idx === 0 ? "В ЭФИРЕ" : "СКОРО"}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-8 w-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-md cursor-pointer"
                  onClick={() => handleOpenLive(l)}
                >
                  <PlayCircle className="h-6 w-6 text-white shadow-2xl" />
                </motion.div>
              </div>

              <div className="absolute bottom-3 right-3">
                {idx === 0 ? (
                  <div className="bg-emerald-500/20 backdrop-blur-xl text-emerald-400 text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Clock className="h-2.5 w-2.5 animate-pulse" />
                    {liveDuration}
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-xl text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 border border-white/10 shadow-xl">
                    <Calendar className="h-2.5 w-2.5" />
                    {formatStartTime(l.startsAtISO)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-2 space-y-2">
              <div className="space-y-0.5">
                <div className="text-[7px] text-indigo-500 font-black uppercase tracking-[0.2em] flex items-center gap-1">
                  <Signal className="h-1.5 w-1.5" />
                  {l.brand}
                </div>
                <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-tighter leading-tight line-clamp-1">{l.title}</h3>
              </div>
              
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Brain className="h-2.5 w-2.5 text-slate-400" />
                  <span className="text-[7px] font-bold text-slate-400 uppercase">Live AI</span>
                </div>
                {idx === 0 && (
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black text-emerald-600">2.4K</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-4">
          <Card className="bg-slate-900 border-none rounded-xl overflow-hidden shadow-2xl p-4 relative group/ann flex flex-col text-white">
             <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="space-y-1">
                  <Badge className="bg-rose-500 text-white border-none text-[8px] font-black uppercase mb-1">New AI Magic</Badge>
                  <h5 className="text-[11px] font-medium uppercase tracking-[0.15em]">AI Video Lookbooks</h5>
                </div>
                <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Sparkles className="h-4 w-4 text-rose-400" />
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {aiReels.map((item, i) => (
                  <div key={item.id} className="flex flex-col gap-3 group/item cursor-pointer">
                    <div className="aspect-[9/16] rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative shadow-2xl">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/0 transition-all" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <PlayCircle className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Eye className="h-2 w-2 text-white/60" />
                          <span className="text-[7px] font-bold text-white/60 uppercase">{item.views}</span>
                        </div>
                        <Badge className="bg-rose-500/80 text-white border-none text-[6px] font-black h-3 px-1 uppercase">AI_LIVE</Badge>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-tight leading-tight group-hover/item:text-rose-400 transition-colors truncate">{item.title}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase truncate">{item.brand}</p>
                    </div>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>

      {/* Live Studio Partnership Banner - Redesigned as Challenge Banner */}
      <Card className="mt-8 bg-slate-900 border-none rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-2xl group/banner">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
          <img 
            src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2000" 
            alt="Syntha Live Studio Host" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        
        <CardContent className="relative z-10 p-4 space-y-4 max-w-4xl text-white w-full text-left">
          <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }} 
              className="flex items-center gap-3 w-fit"
            >
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Прямые трансляции</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Сториз</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Отметки</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Соцсети</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Блог и Новости</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• События</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">• Видео</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-semibold uppercase tracking-tight leading-[0.85]">
              МЕДИА-ЭКОСИСТЕМА
            </h2>
            <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">
              "Все форматы взаимодействия в едином интерактивном пространстве."
            </p>
            <div className="pt-4 flex">
              <Button asChild variant="cta" size="ctaLg" className="min-w-[200px] w-fit">
                <Link href={auth.user?.roles?.some(r => ['brand', 'shop', 'admin', 'distributor', 'supplier', 'manufacturer'].includes(r)) ? "/brand/media" : "/u/dashboard"} className="flex items-center gap-2">
                  Подключиться
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
