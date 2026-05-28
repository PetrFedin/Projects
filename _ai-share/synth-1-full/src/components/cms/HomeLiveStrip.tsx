'use client';

import * as React from 'react';
import Link from 'next/link';
import type { CmsLive } from '@/data/cms.home.default';
import {
  PlayCircle,
  Radio,
  Users,
  Eye,
  Sparkles,
  Calendar,
  ArrowRight,
  Heart,
  Brain,
  Signal,
  ShoppingBag,
  Clock,
  Bell,
  Info,
  UserCircle2,
  HeartOff,
  MoreHorizontal,
  ShieldCheck,
  ExternalLink,
  Video,
  Mic,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';

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
  const months = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

const aiReels = [
  {
    id: 'reel-1',
    title: 'Oversize Wool Coat',
    brand: 'Syntha Premium',
    views: '124K',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=400',
  },
  {
    id: 'reel-2',
    title: 'Technical Trousers',
    brand: 'Syntha Lab',
    views: '89K',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400',
  },
  {
    id: 'reel-3',
    title: 'Silk Scarf Series',
    brand: 'Nordic Wool',
    views: '215K',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400',
  },
  {
    id: 'reel-4',
    title: 'Leather Accessories',
    brand: 'Syntha Craft',
    views: '56K',
    imageUrl: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?q=80&w=400',
  },
];

export function HomeLiveStrip({ live }: { live: CmsLive[] }) {
  const { setActiveLiveStream } = useUIState();
  type LiveStripNotif = {
    id: string;
    streamId?: string;
    title: string;
    message: string;
    type?: string;
    persistent?: boolean;
  };
  const [notifications, setNotifications] = React.useState<LiveStripNotif[]>([]);
  const addNotification = React.useCallback((n: Omit<LiveStripNotif, 'id'>) => {
    setNotifications((prev) => [...prev, { ...n, id: `n-${Date.now()}` }]);
  }, []);
  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id));
  }, []);
  const auth = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [liveDuration, setLiveDuration] = React.useState('00:42:15');
  const [liked, setLiked] = React.useState<boolean | null>(null);
  const [notifyMinutes, setNotifyMinutes] = React.useState('15');

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
    const relatedNotif = notifications.find((n) => n.streamId === stream.id);
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
      persistent: true,
    });
  };

  React.useEffect(() => {
    setMounted(true);

    // Интервал для обновления счетчика эфира
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
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* --- HEADER NETWORK STATUS --- */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-rose-500/10">
                <Radio className="relative z-10 h-5 w-5 text-rose-600" />
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
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Badge
                    variant="outline"
                    className="border-border-default text-text-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-normal"
                  >
                    MEDIA_ECOSYSTEM_b2c
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleOpenLive(live[0])}
              className="hover:text-accent-primary block text-left transition-colors"
            >
              <h2 className="text-text-primary text-xl font-semibold uppercase leading-none tracking-tight md:text-3xl">
                Прямой эфир
              </h2>
            </button>
            <p className="text-text-muted max-w-md text-xs font-medium">
              Глобальная медиа-экосистема.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-bg-surface2/80 border-border-subtle flex items-center gap-3 rounded-xl border px-4 py-2.5">
            <div className="flex flex-col items-end">
              <div className="text-text-primary flex items-center gap-2 text-[13px] font-black uppercase leading-none tracking-tighter">
                2.4K
                <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
              <span className="text-text-muted mt-1 text-[7px] font-black uppercase tracking-[0.2em]">
                ЗРИТЕЛИ_ОНЛАЙН
              </span>
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
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {live.map((l, idx) => (
          <div
            key={l.id}
            className="border-border-subtle hover:border-text-primary group relative flex flex-col overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-all hover:shadow-2xl"
          >
            <div className="relative aspect-[10/12] w-full overflow-hidden rounded-xl">
              <img
                src={l.cover}
                alt={l.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute left-3 top-3 flex flex-col gap-2">
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-lg border border-white/10 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-md',
                    idx === 0 ? 'bg-emerald-500/90' : 'bg-rose-600/90'
                  )}
                >
                  <div className="h-1 w-1 animate-pulse rounded-full bg-white" />
                  {idx === 0 ? 'В ЭФИРЕ' : 'СКОРО'}
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md"
                  onClick={() => handleOpenLive(l)}
                >
                  <PlayCircle className="h-6 w-6 text-white shadow-2xl" />
                </motion.div>
              </div>

              <div className="absolute bottom-3 right-3">
                {idx === 0 ? (
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl">
                    <Clock className="h-2.5 w-2.5 animate-pulse" />
                    {liveDuration}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-xl">
                    <Calendar className="h-2.5 w-2.5" />
                    {formatStartTime(l.startsAtISO)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 p-2">
              <div className="space-y-0.5">
                <div className="text-accent-primary flex items-center gap-1 text-[7px] font-black uppercase tracking-[0.2em]">
                  <Signal className="h-1.5 w-1.5" />
                  {l.brand}
                </div>
                <h3 className="text-text-primary line-clamp-1 text-[10px] font-black uppercase leading-tight tracking-tighter">
                  {l.title}
                </h3>
              </div>

              <div className="border-border-subtle flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-1">
                  <Brain className="text-text-muted h-2.5 w-2.5" />
                  <span className="text-text-muted text-[7px] font-bold uppercase">Live AI</span>
                </div>
                {idx === 0 && (
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[7px] font-black text-emerald-600">2.4K</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="lg:col-span-4">
          <Card className="bg-text-primary group/ann relative flex flex-col overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl">
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <Badge className="mb-1 border-none bg-rose-500 text-[8px] font-black uppercase text-white">
                  New AI Magic
                </Badge>
                <h5 className="text-[11px] font-medium uppercase tracking-[0.15em]">
                  AI Video Lookbooks
                </h5>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Sparkles className="h-4 w-4 text-rose-400" />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {aiReels.map((item, i) => (
                <div key={item.id} className="group/item flex cursor-pointer flex-col gap-3">
                  <div className="relative aspect-[9/16] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-all group-hover/item:bg-black/0" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/item:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Eye className="h-2 w-2 text-white/60" />
                        <span className="text-[7px] font-bold uppercase text-white/60">
                          {item.views}
                        </span>
                      </div>
                      <Badge className="h-3 border-none bg-rose-500/80 px-1 text-[6px] font-black uppercase text-white">
                        AI_LIVE
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="truncate text-[10px] font-black uppercase leading-tight tracking-tight transition-colors group-hover/item:text-rose-400">
                      {item.title}
                    </p>
                    <p className="text-text-secondary truncate text-[8px] font-bold uppercase">
                      {item.brand}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Live Studio Partnership Banner - Redesigned as Challenge Banner */}
      <Card className="bg-text-primary group/banner relative mt-8 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
        <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
          <img
            src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2000"
            alt="Syntha Live Studio Host"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />

        <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-left text-white">
          <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
              className="flex w-fit items-center gap-3"
            >
              {[1, 2].map((i) => (
                <div key={i} className="flex shrink-0 items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Прямые трансляции
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Сториз
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Отметки
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Соцсети
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Блог и Новости
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • События
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                    • Видео
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold uppercase leading-[0.85] tracking-tight md:text-3xl">
              МЕДИА-ЭКОСИСТЕМА
            </h2>
            <p className="text-text-muted border-accent-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
              "Все форматы взаимодействия в едином интерактивном пространстве."
            </p>
            <div className="flex pt-4">
              <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
                <Link
                  href={
                    auth.user?.roles?.some((r) =>
                      [
                        'brand',
                        'shop',
                        'admin',
                        'distributor',
                        'supplier',
                        'manufacturer',
                      ].includes(r)
                    )
                      ? '/brand/media'
                      : '/client/me'
                  }
                  className="flex items-center gap-2"
                >
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
