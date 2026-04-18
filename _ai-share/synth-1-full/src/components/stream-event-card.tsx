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
  Mic,
} from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface StreamEventCardProps {
  event: ImagePlaceholder;
  onPlay: () => void;
  isLive: boolean;
  isArchive?: boolean;
  mediaType?: 'video' | 'audio';
}

export default function StreamEventCard({
  event,
  onPlay,
  isLive,
  isArchive,
  mediaType,
}: StreamEventCardProps) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [liveDuration, setLiveDuration] = useState('00:42:54');

  useEffect(() => {
    setMounted(true);

    if (isLive) {
      const interval = setInterval(() => {
        setLiveDuration((prev) => {
          const [h, m, s] = prev.split(':').map(Number);
          let totalSeconds = h * 3600 + m * 60 + s + 1;
          const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, '0');
          const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
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
      title: 'Спонсоры трансляции',
      description: 'Список официальных партнеров Syntha OS для этого события.',
    });
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: 'Информация о событии',
      description: event.description || 'Детальное описание трансляции и программа эфира.',
    });
  };

  const handleNotifyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isArchive) return;
    toast({
      title: 'Уведомление настроено',
      description: `Мы напомним вам о начале "${event.description}" за 15 минут.`,
    });
  };

  const formattedDate = event.date
    ? format(new Date(event.date), 'd MMM, HH:mm', { locale: ru })
    : '';

  return (
<<<<<<< HEAD
    <div className="border-border-default hover:border-accent-primary/30 group w-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
=======
    <div className="border-border-default bg-bg-surface hover:border-accent-primary/30 group w-full overflow-hidden rounded-xl border shadow-sm transition-all duration-500 hover:shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Top Section: Media */}
      <div className="p-3">
        <div className="bg-bg-surface2 group/media relative aspect-[21/10] w-full overflow-hidden rounded-xl shadow-inner">
          <Image
            src={event.imageUrl}
            alt={event.description}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-30" />

          {/* Status Badge */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <div
              className={cn(
                'flex w-fit items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md',
                isLive
                  ? 'bg-state-success/80 animate-pulse text-white'
                  : isArchive
<<<<<<< HEAD
                    ? 'bg-slate-500/80 text-white'
=======
                    ? 'bg-text-secondary/80 text-text-inverse'
>>>>>>> recover/cabinet-wip-from-stash
                    : 'bg-state-error/80 text-white'
              )}
            >
              <div className={cn('h-1.5 w-1.5 rounded-full bg-white')} />
              {isLive ? 'В ЭФИРЕ' : isArchive ? 'АРХИВ' : 'СКОРО'}
            </div>

            {mediaType && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-8 w-8 cursor-help items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 shadow-lg backdrop-blur-md">
                      {mediaType === 'video' ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="border-white/10 bg-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
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
                  title: 'Эфир еще не начался',
                  description: `Трансляция "${event.description}" будет доступна в указанное время.`,
                });
                return;
              }
              onPlay();
            }}
            className={cn(
              'group/play absolute inset-0 flex items-center justify-center',
              !isLive && !isArchive ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-500',
                isLive || isArchive
                  ? 'border-white/30 bg-white/20 opacity-100 group-hover/play:scale-110 group-hover/play:bg-white/40'
                  : 'border-white/5 bg-black/40 opacity-40 grayscale'
              )}
            >
              <PlayCircle
                className={cn(
                  'h-8 w-8 text-white',
                  isLive || isArchive ? 'fill-white/10' : 'opacity-20'
                )}
              />
            </div>
          </div>

          {/* Time Badge */}
          <div className="absolute bottom-4 right-4">
            {isLive ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-2 text-[10px] font-black text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl">
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                <span className="tabular-nums tracking-widest">{liveDuration}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
                <Calendar className="h-3.5 w-3.5 text-white/80" />
                <span className="uppercase">{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Info */}
      <div className="space-y-4 px-8 pb-8 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent-primary h-3 w-1 rounded-full" />
            <span className="text-accent-primary text-[10px] font-black uppercase tracking-[0.15em]">
              SYNTHA {event.category?.toUpperCase() === 'SPORT' ? 'SPORT' : 'STUDIO'} OFFICIAL
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
<<<<<<< HEAD
                  className="border-border-default text-text-muted hover:text-text-primary hover:border-border-strong h-9 rounded-xl bg-white/50 px-4 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm transition-all"
=======
                  className="border-border-default bg-bg-surface/50 text-text-muted hover:border-border-strong hover:text-text-primary h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShieldCheck className="text-text-muted/70 mr-2 h-3.5 w-3.5" /> Спонсоры
                </Button>
              </DialogTrigger>
<<<<<<< HEAD
              <DialogContent className="rounded-xl border-none bg-white shadow-2xl sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-base font-black uppercase tracking-tighter">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />
=======
              <DialogContent className="bg-bg-surface rounded-xl border-none shadow-2xl sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-base font-black uppercase tracking-tighter">
                    <div className="bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                      <ShieldCheck className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    Партнеры трансляции
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-6">
                  {[
                    {
                      name: 'SberPay',
                      logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=200',
                      type: 'Технологический партнер',
                      url: 'https://sberpay.ru',
                    },
                    {
                      name: 'Fashion Week',
                      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200',
                      type: 'Официальная площадка',
                      url: 'https://fashionweek.ru',
                    },
                    {
                      name: 'Media Group',
                      logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200',
                      type: 'Информационная поддержка',
                      url: 'https://mediagroup.com',
                    },
                    {
                      name: 'Global Logistics',
                      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=200',
                      type: 'Логистический партнер',
                      url: 'https://globallogistics.com',
                    },
                  ].map((sponsor, i) => (
                    <a
                      key={i}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
<<<<<<< HEAD
                      className="group/sp relative block rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-indigo-500/30"
                    >
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg border border-slate-100 bg-white">
=======
                      className="group/sp border-border-subtle bg-bg-surface2/80 hover:border-accent-primary/30 relative block rounded-2xl border p-4 transition-all"
                    >
                      <div className="border-border-subtle bg-bg-surface relative mb-3 aspect-video overflow-hidden rounded-lg border">
>>>>>>> recover/cabinet-wip-from-stash
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover/sp:grayscale-0"
                        />
                      </div>
                      <div className="space-y-0.5">
<<<<<<< HEAD
                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                          {sponsor.name}
                        </p>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-slate-400">
                          {sponsor.type}
                        </p>
                      </div>
                      <ExternalLink className="absolute right-4 top-4 h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover/sp:opacity-100" />
=======
                        <p className="text-text-primary text-[10px] font-black uppercase tracking-tight">
                          {sponsor.name}
                        </p>
                        <p className="text-text-muted text-[7px] font-bold uppercase tracking-widest">
                          {sponsor.type}
                        </p>
                      </div>
                      <ExternalLink className="text-text-muted absolute right-4 top-4 h-3 w-3 opacity-0 transition-opacity group-hover/sp:opacity-100" />
>>>>>>> recover/cabinet-wip-from-stash
                    </a>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
<<<<<<< HEAD
                  className="border-border-default text-text-muted hover:text-text-primary hover:border-border-strong h-9 rounded-xl bg-white/50 px-4 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm transition-all"
=======
                  className="border-border-default bg-bg-surface/50 text-text-muted hover:border-border-strong hover:text-text-primary h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="text-text-muted/70 mr-2 h-3.5 w-3.5" /> Инфо
                </Button>
              </DialogTrigger>
<<<<<<< HEAD
              <DialogContent className="rounded-xl border-none bg-white shadow-2xl sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-sm font-black uppercase tracking-tighter">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                      <Info className="h-5 w-5 text-indigo-600" />
=======
              <DialogContent className="bg-bg-surface rounded-xl border-none shadow-2xl sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-sm font-black uppercase tracking-tighter">
                    <div className="bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                      <Info className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    О трансляции
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
<<<<<<< HEAD
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-slate-100">
                    <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <Badge className="mb-2 border-none bg-indigo-500 text-[8px] font-black">
=======
                  <div className="border-border-subtle relative aspect-[21/9] overflow-hidden rounded-2xl border">
                    <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <Badge className="bg-accent-primary text-text-inverse mb-2 border-none text-[8px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        LIVE_STREAM_v2.4
                      </Badge>
                      <h4 className="text-sm font-black uppercase leading-none tracking-tight text-white">
                        {event.description}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
<<<<<<< HEAD
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Описание программы
                    </h5>
                    <p className="text-xs font-medium leading-relaxed text-slate-500">
=======
                    <h5 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Описание программы
                    </h5>
                    <p className="text-text-secondary text-xs font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      {isLive
                        ? 'Эксклюзивная презентация новой коллекции FW26. Мы разберем ключевые дропы, обсудим материалы и покажем, как стилизовать подиумные образы для реальной жизни. В конце эфира — возможность раннего выкупа для участников сообщества.'
                        : 'Глубокое погружение в макро-тренды сезона. Наш ведущий аналитик моды разберет самые актуальные направления, цвета и силуэты, которые будут определять стиль в ближайшие месяцы. Подготовьте ваши вопросы для Q&A сессии.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
<<<<<<< HEAD
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Участники эфира
                      </h5>
                      <div className="flex items-center gap-3 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                        <Users className="h-3 w-3 text-indigo-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
=======
                      <h5 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        Участники эфира
                      </h5>
                      <div className="border-accent-primary/20 bg-accent-primary/10 flex items-center gap-3 rounded-full border px-3 py-1">
                        <Users className="text-accent-primary h-3 w-3" />
                        <span className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          LIVE Analytics v4.0
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          name: isLive ? 'Александр Васильев' : 'Марина Иванова',
                          role: isLive ? 'Ведущий эфира' : 'Старший аналитик',
                          sub: isLive ? 'Fashion эксперт' : 'SYNTHA Intelligence',
                          img: `https://i.pravatar.cc/150?img=${isLive ? 11 : 21}`,
                          stats: '14.2K',
                        },
                        {
                          name: isLive ? 'Елена Белова' : 'Петр Соколов',
                          role: isLive ? 'Креативный директор' : 'Топ-стилист',
                          sub: isLive ? 'Brand Name' : 'Freelance',
                          img: `https://i.pravatar.cc/150?img=${isLive ? 32 : 12}`,
                          stats: '9.8K',
                        },
                      ].map((person, i) => (
                        <div
                          key={i}
<<<<<<< HEAD
                          className="group/p relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-all hover:bg-white hover:shadow-lg"
                        >
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
=======
                          className="group/p border-border-subtle bg-bg-surface2 hover:bg-bg-surface relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all hover:shadow-lg"
                        >
                          <div className="via-accent-primary/10 absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent" />
>>>>>>> recover/cabinet-wip-from-stash

                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-sm">
                            <img
                              src={person.img}
                              alt={person.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/p:scale-110"
                            />
                          </div>
                          <div className="flex-1 space-y-0.5 overflow-hidden">
                            <div className="flex items-center justify-between">
<<<<<<< HEAD
                              <p className="truncate text-[11px] font-black text-slate-900">
=======
                              <p className="text-text-primary truncate text-[11px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                                {person.name}
                              </p>
                            </div>
                            <div className="flex flex-col">
<<<<<<< HEAD
                              <span className="text-[8px] font-bold uppercase leading-none tracking-widest text-indigo-600">
=======
                              <span className="text-accent-primary text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                {person.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {(isLive || isArchive) && (
<<<<<<< HEAD
                      <div className="relative space-y-4 overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-4">
=======
                      <div className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl border border-white/5 p-4">
>>>>>>> recover/cabinet-wip-from-stash
                        <div className="absolute right-0 top-0 p-3">
                          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
                              Live Dynamics (min/min)
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-black tabular-nums tracking-tighter text-white">
                                2,482
                              </span>
                              <span className="text-[9px] font-bold text-emerald-400">UP 12%</span>
                            </div>
                          </div>
                          <div className="flex h-8 items-end gap-1">
                            {[40, 70, 45, 90, 65, 80, 55, 100].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
<<<<<<< HEAD
                                className="w-1.5 rounded-t-sm bg-indigo-500/40"
=======
                                className="bg-accent-primary/40 w-1.5 rounded-t-sm"
>>>>>>> recover/cabinet-wip-from-stash
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

        <h3 className="text-text-primary group-hover:text-accent-primary line-clamp-2 font-headline text-sm font-black uppercase leading-tight tracking-tight transition-colors">
          {isLive ? `LIVE: ${event.description}` : event.description}
        </h3>

        {/* Footer Section */}
        <div className="border-border-subtle mt-6 flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-bg-surface2 border-border-subtle flex h-8 w-8 items-center justify-center rounded-lg border">
              <Brain className="text-text-muted h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[8px] font-black uppercase tracking-[0.2em]">
                ТЕГ:
              </span>
              <span className="text-text-secondary text-[10px] font-bold uppercase tracking-tight">
                {event.hashtags?.[0] || 'FW26_ДРОП'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLive ? (
              <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
                <div className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black leading-none text-emerald-600">
                    2,482
                  </span>
                  <span className="mt-0.5 text-[7px] font-black uppercase tracking-widest text-emerald-600/60">
                    ЗРИТЕЛЕЙ
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className={cn(
                    'group/bell h-11 rounded-2xl border-[1.5px] px-8 text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300',
                    isArchive
                      ? 'border-border-strong text-text-muted cursor-not-allowed opacity-50'
                      : 'border-accent-primary text-accent-primary hover:bg-accent-primary shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:text-white'
                  )}
                  onClick={handleNotifyClick}
                  disabled={isArchive}
                >
                  <Bell
                    className={cn(
                      'mr-2.5 h-4 w-4',
                      !isArchive && 'group-hover/bell:animate-bounce'
                    )}
                  />
                  {isArchive ? 'Завершено' : 'Уведомить'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
