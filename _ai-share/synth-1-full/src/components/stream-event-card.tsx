'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
    PlayCircle, 
    Clock, 
    Calendar, 
    ShieldCheck, 
    Info, 
    Brain, 
    Heart, 
    Bell,
    Share2,
    Users,
    ExternalLink,
    Eye,
    Sparkles,
    Video,
    Mic
} from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
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

import { useToast } from '@/hooks/use-toast';
import { motion } from "framer-motion";

interface StreamEventCardProps {
    event: ImagePlaceholder;
    onPlay: () => void;
    isLive: boolean;
    isArchive?: boolean;
    mediaType?: 'video' | 'audio';
}

export default function StreamEventCard({ event, onPlay, isLive, isArchive, mediaType }: StreamEventCardProps) {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [liveDuration, setLiveDuration] = useState("00:42:54");

    useEffect(() => {
        setMounted(true);

        if (isLive) {
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
        }
    }, [isLive]);

    const handleSponsorsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast({
            title: "Спонсоры трансляции",
            description: "Список официальных партнеров Syntha OS для этого события.",
        });
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast({
            title: "Информация о событии",
            description: event.description || "Детальное описание трансляции и программа эфира.",
        });
    };

    const handleNotifyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isArchive) return;
        toast({
            title: "Уведомление настроено",
            description: `Мы напомним вам о начале "${event.description}" за 15 минут.`,
        });
    };

    const formattedDate = event.date ? format(new Date(event.date), 'd MMM, HH:mm', { locale: ru }) : '';

    return (
        <div className="w-full bg-white rounded-xl border border-border-default overflow-hidden group hover:border-accent-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl">
            {/* Top Section: Media */}
            <div className="p-3">
                <div className="relative aspect-[21/10] w-full overflow-hidden rounded-xl bg-bg-surface2 shadow-inner group/media">
                    <Image
                        src={event.imageUrl}
                        alt={event.description}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg w-fit",
                            isLive 
                                ? "bg-state-success/80 text-white animate-pulse" 
                                : isArchive
                                    ? "bg-slate-500/80 text-white"
                                    : "bg-state-error/80 text-white"
                        )}>
                            <div className={cn("h-1.5 w-1.5 rounded-full bg-white")} />
                            {isLive ? "В ЭФИРЕ" : isArchive ? "АРХИВ" : "СКОРО"}
                        </div>

                        {mediaType && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full backdrop-blur-md border border-white/10 bg-black/40 text-white/90 shadow-lg cursor-help">
                                            {mediaType === 'video' ? <Video className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-black text-white border-white/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
                                        {mediaType === 'video' ? 'Видео трансляция' : 'Аудио трансляция'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {/* Play Button Overlay */}
                    <div 
                        onClick={(e) => {
                            if (!isLive && !isArchive) {
                                e.stopPropagation();
                                toast({
                                    title: "Эфир еще не начался",
                                    description: `Трансляция "${event.description}" будет доступна в указанное время.`,
                                });
                                return;
                            }
                            onPlay();
                        }}
                        className={cn(
                            "absolute inset-0 flex items-center justify-center group/play",
                            (!isLive && !isArchive) ? "cursor-not-allowed" : "cursor-pointer"
                        )}
                    >
                        <div className={cn(
                            "h-12 w-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-all duration-500",
                            (isLive || isArchive) 
                                ? "bg-white/20 border-white/30 opacity-100 group-hover/play:scale-110 group-hover/play:bg-white/40"
                                : "bg-black/40 border-white/5 opacity-40 grayscale"
                        )}>
                            <PlayCircle className={cn("h-8 w-8 text-white", (isLive || isArchive) ? "fill-white/10" : "opacity-20")} />
                        </div>
                    </div>

                    {/* Time Badge */}
                    <div className="absolute bottom-4 right-4">
                        {isLive ? (
                            <div className="bg-emerald-500/20 backdrop-blur-xl text-emerald-400 text-[10px] font-black px-4 py-2 rounded-2xl border border-emerald-500/30 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <Clock className="h-3.5 w-3.5 animate-pulse" />
                                <span className="tabular-nums tracking-widest">{liveDuration}</span>
                            </div>
                        ) : (
                            <div className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-lg">
                                <Calendar className="h-3.5 w-3.5 text-white/80" />
                                <span className="uppercase">{formattedDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle Section: Info */}
            <div className="px-8 pb-8 pt-2 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-3 bg-accent-primary rounded-full" />
                        <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.15em]">
                            SYNTHA {event.category?.toUpperCase() === 'SPORT' ? 'SPORT' : 'STUDIO'} OFFICIAL
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="h-9 px-4 rounded-xl border-border-default text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:border-border-strong bg-white/50 backdrop-blur-sm transition-all shadow-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ShieldCheck className="h-3.5 w-3.5 mr-2 text-text-muted/70" /> Спонсоры
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-xl border-none shadow-2xl sm:max-w-[450px]">
                                <DialogHeader>
                                    <DialogTitle className="text-base font-black uppercase tracking-tighter flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        Партнеры трансляции
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-3 py-6">
                                    {[
                                        { name: 'SberPay', logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=200', type: 'Технологический партнер', url: 'https://sberpay.ru' },
                                        { name: 'Fashion Week', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200', type: 'Официальная площадка', url: 'https://fashionweek.ru' },
                                        { name: 'Media Group', logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200', type: 'Информационная поддержка', url: 'https://mediagroup.com' },
                                        { name: 'Global Logistics', logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200', type: 'Логистический партнер', url: 'https://globallogistics.com' }
                                    ].map((sponsor, i) => (
                                        <a 
                                            key={i} 
                                            href={sponsor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/sp relative rounded-2xl border border-slate-100 p-4 hover:border-indigo-500/30 transition-all bg-slate-50/50 block"
                                        >
                                            <div className="aspect-video relative rounded-lg overflow-hidden mb-3 bg-white border border-slate-100">
                                                <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover grayscale group-hover/sp:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">{sponsor.name}</p>
                                                <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{sponsor.type}</p>
                                            </div>
                                            <ExternalLink className="absolute top-4 right-4 h-3 w-3 text-slate-300 opacity-0 group-hover/sp:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="h-9 px-4 rounded-xl border-border-default text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:border-border-strong bg-white/50 backdrop-blur-sm transition-all shadow-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Info className="h-3.5 w-3.5 mr-2 text-text-muted/70" /> Инфо
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white rounded-xl border-none shadow-2xl sm:max-w-[550px]">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <Info className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        О трансляции
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-100">
                                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-6">
                                            <Badge className="bg-indigo-500 text-[8px] font-black mb-2 border-none">LIVE_STREAM_v2.4</Badge>
                                            <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none">{event.description}</h4>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Описание программы</h5>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {isLive 
                                                ? "Эксклюзивная презентация новой коллекции FW26. Мы разберем ключевые дропы, обсудим материалы и покажем, как стилизовать подиумные образы для реальной жизни. В конце эфира — возможность раннего выкупа для участников сообщества."
                                                : "Глубокое погружение в макро-тренды сезона. Наш ведущий аналитик моды разберет самые актуальные направления, цвета и силуэты, которые будут определять стиль в ближайшие месяцы. Подготовьте ваши вопросы для Q&A сессии."
                                            }
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Участники эфира</h5>
                                            <div className="flex items-center gap-3 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                                                <Users className="h-3 w-3 text-indigo-600" />
                                                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">LIVE Analytics v4.0</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { name: isLive ? "Александр Васильев" : "Марина Иванова", role: isLive ? "Ведущий эфира" : "Старший аналитик", sub: isLive ? "Fashion эксперт" : "SYNTHA Intelligence", img: `https://i.pravatar.cc/150?img=${isLive ? 11 : 21}`, stats: "14.2K" },
                                                { name: isLive ? "Елена Белова" : "Петр Соколов", role: isLive ? "Креативный директор" : "Топ-стилист", sub: isLive ? "Brand Name" : "Freelance", img: `https://i.pravatar.cc/150?img=${isLive ? 32 : 12}`, stats: "9.8K" }
                                            ].map((person, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg group/p relative overflow-hidden">
                                                    <div className="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
                                                    
                                                    <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0 relative">
                                                        <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover/p:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="space-y-0.5 overflow-hidden flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-[11px] font-black text-slate-900 truncate">{person.name}</p>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest leading-none">{person.role}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {(isLive || isArchive) && (
                                            <div className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-4 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Live Dynamics (min/min)</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-sm font-black text-white tracking-tighter tabular-nums">2,482</span>
                                                            <span className="text-[9px] font-bold text-emerald-400">UP 12%</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 h-8 items-end">
                                                        {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                                                            <motion.div 
                                                                key={i}
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${h}%` }}
                                                                className="w-1.5 bg-indigo-500/40 rounded-t-sm"
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <h3 className="font-headline font-black text-sm uppercase tracking-tight text-text-primary leading-tight group-hover:text-accent-primary transition-colors line-clamp-2">
                    {isLive ? `LIVE: ${event.description}` : event.description}
                </h3>

                {/* Footer Section */}
                <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-bg-surface2 border border-border-subtle flex items-center justify-center">
                            <Brain className="h-4 w-4 text-text-muted" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">ТЕГ:</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">
                                {event.hashtags?.[0] || 'FW26_ДРОП'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isLive ? (
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-emerald-600 leading-none">2,482</span>
                                    <span className="text-[7px] font-black text-emerald-600/60 uppercase tracking-widest mt-0.5">ЗРИТЕЛЕЙ</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    className={cn(
                                        "h-11 px-8 rounded-2xl border-[1.5px] text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 group/bell",
                                        isArchive 
                                            ? "border-border-strong text-text-muted cursor-not-allowed opacity-50" 
                                            : "border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white shadow-[0_4px_12px_rgba(37,99,235,0.15)]"
                                    )}
                                    onClick={handleNotifyClick}
                                    disabled={isArchive}
                                >
                                    <Bell className={cn("h-4 w-4 mr-2.5", !isArchive && "group-hover/bell:animate-bounce")} /> 
                                    {isArchive ? "Завершено" : "Уведомить"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
