'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Ticket,
  Trophy,
  Clock,
  History,
  CheckCircle2,
  AlertCircle,
  Search,
  Play,
  Share2,
  Smartphone,
  User,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Activity,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ================== CONFIG ==================
const WSS_URL = 'wss://syntha.example/lottery';
const ENTRIES_API = '/api/lottery/current-entries';
const CHECK_API = '/api/lottery/check';
const RECORD_WIN_API = '/api/lottery/win';

const DEMO_PRIZES = [
  { id: 'p1', title: 'Подарочная карта 20 000 ₽', icon: Gift },
  { id: 'p2', title: 'Кроссовки от спонсора', icon: Trophy },
  { id: 'p3', title: 'Худи лимитированной капсулы', icon: Star },
];

// ================== HELPERS ==================
function getNextDrawDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear = year + 1;
  }
  return new Date(nextYear, nextMonth, 1, 12, 0, 0);
}

function getCurrentPeriod(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const fmt = (d: Date) =>
    String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0');
  return `${fmt(first)}–${fmt(last)}`;
}

function getMonthNameRu(monthIndex: number) {
  const names = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];
  return names[monthIndex] || '';
}

function normalizeEntry(item: any) {
  if (typeof item === 'string' || typeof item === 'number') {
    return {
      receiptNumber: String(item),
      amount: null,
      tickets: 1,
      user: null,
      brands: [],
    };
  }
  const amount = Number(item.amount || 0);
  const ticketsFromAmount = Math.max(1, Math.floor(amount / 5000));
  const tickets = Math.min(1000, ticketsFromAmount * (item.multiplier || 1));
  return {
    receiptNumber: String(item.receiptNumber),
    amount,
    tickets,
    user: item.user || null,
    brands: Array.isArray(item.brands) ? item.brands : [],
  };
}

function pickWeightedWinner(pool: any[]) {
  if (!pool || pool.length === 0) return null;
  const total = pool.reduce((acc, e) => acc + (e.tickets || 1), 0);
  let r = Math.random() * total;
  for (const e of pool) {
    r -= e.tickets || 1;
    if (r <= 0) return e;
  }
  return pool[0];
}

// ================== HOOKS ==================
function useCountdown(targetDate: Date, { paused = false } = {}) {
  const [diffMs, setDiffMs] = useState(Math.max(0, targetDate.getTime() - Date.now()));

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDiffMs(Math.max(0, targetDate.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate, paused]);

  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / (3600 * 24));
  const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds, isZero: diffMs <= 0 };
}

// ================== UI COMPONENTS ==================

const CountdownBlock = ({ targetDate, livePaused }: { targetDate: Date; livePaused: boolean }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate, { paused: livePaused });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-text-muted text-[9px] font-black uppercase tracking-[0.2em]">
        До розыгрыша ({targetDate.toLocaleDateString('ru-RU')} •{' '}
        {targetDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })})
      </div>
      <div className="flex items-center gap-2 font-headline">
        <div className="flex min-w-[40px] flex-col items-center">
          <div className="text-text-primary text-base font-black tabular-nums leading-none tracking-tighter">
            {String(days).padStart(2, '0')}
          </div>
          <div className="text-text-muted mt-1 text-[7px] font-bold uppercase tracking-widest">
            дни
          </div>
        </div>
        <span className="text-text-muted -mt-4 text-base font-black">:</span>
        <div className="flex min-w-[40px] flex-col items-center">
          <div className="text-text-primary text-base font-black tabular-nums leading-none tracking-tighter">
            {String(hours).padStart(2, '0')}
          </div>
          <div className="text-text-muted mt-1 text-[7px] font-bold uppercase tracking-widest">
            часы
          </div>
        </div>
        <span className="text-text-muted -mt-4 text-base font-black">:</span>
        <div className="flex min-w-[40px] flex-col items-center">
          <div className="text-text-primary text-base font-black tabular-nums leading-none tracking-tighter">
            {String(minutes).padStart(2, '0')}
          </div>
          <div className="text-text-muted mt-1 text-[7px] font-bold uppercase tracking-widest">
            мин
          </div>
        </div>
        <span className="text-text-muted -mt-4 text-base font-black">:</span>
        <div className="flex min-w-[40px] flex-col items-center">
          <div className="text-text-primary text-base font-black tabular-nums leading-none tracking-tighter">
            {String(seconds).padStart(2, '0')}
          </div>
          <div className="text-text-muted mt-1 text-[7px] font-bold uppercase tracking-widest">
            сек
          </div>
        </div>
      </div>
    </div>
  );
};

const LotteryTicket = ({ monthName, displayNumber, winnerNumber, onDrawClick, isDrawing }: any) => {
  const digits = displayNumber.split('');

  return (
    <div
      className={cn(
        'group/ticket relative overflow-hidden transition-all duration-700',
        'bg-text-primary border-text-primary/30 rounded-xl border p-1 shadow-2xl',
        isDrawing && 'animate-pulse'
      )}
    >
      {/* OS Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="animate-scan-line absolute left-0 top-0 h-[1px] w-full bg-white" />
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="bg-text-primary/50 relative flex flex-col gap-3 rounded-[2.25rem] p-4 backdrop-blur-xl md:p-3">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary h-2 w-2 animate-pulse rounded-full" />
              <div className="text-accent-primary/80 text-[10px] font-black uppercase tracking-[0.3em]">
                SYNTHA_LOTTERY_SYSTEM_V2.5
              </div>
            </div>
            <div>
              <h2 className="font-headline text-sm font-black uppercase leading-none tracking-tighter text-white md:text-sm">
                Лотерея чеков
              </h2>
              <div className="text-text-muted mt-2 text-[11px] font-medium uppercase tracking-widest">
                Период участия: <span className="font-black text-white">{monthName}</span>
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-accent-primary/30 text-accent-primary bg-accent-primary/10 px-3 py-1 text-[9px] font-black uppercase"
          >
            {isDrawing ? 'РОЗЫГРЫШ_LIVE' : 'АКТИВНЫЙ_ЦИКЛ'}
          </Badge>
        </div>

        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="text-text-primary select-none font-headline text-sm font-black tracking-tighter">
              №
            </span>
            <div className="flex gap-2">
              {digits.map((d: string, i: number) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ y: isDrawing ? [0, -10, 0] : 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05, repeat: isDrawing ? Infinity : 0 }}
                  className="bg-text-primary/90 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 shadow-inner md:h-20 md:w-12"
                >
                  <span className="font-headline text-base font-black tabular-nums text-white md:text-sm">
                    {d}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="text-text-secondary text-[9px] font-black uppercase tracking-widest">
              Главный актив месяца
            </div>
            <div className="text-accent-primary font-headline text-base font-black uppercase leading-tight tracking-tight md:text-sm">
              Gift Card
              <br />
              SYNTHA PREMIUM
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 md:flex-row">
          <div className="flex flex-col gap-1">
            <div className="text-text-secondary text-[9px] font-black uppercase tracking-widest">
              Результат сканирования
            </div>
            <div className="font-headline text-sm font-black tracking-widest text-white">
              {winnerNumber ? `ЧЕК № ${winnerNumber}` : 'ОЖИДАНИЕ_ЗАПУСКА'}
            </div>
          </div>
          <Button
            onClick={onDrawClick}
            disabled={isDrawing}
            className={cn(
              'h-10 rounded-full px-10 text-[11px] font-black uppercase tracking-widest transition-all duration-500',
              isDrawing
                ? 'bg-text-primary/90 text-text-secondary'
                : 'text-text-primary hover:bg-accent-primary bg-white shadow-2xl shadow-white/10 hover:text-white'
            )}
          >
            {isDrawing ? 'СКАНИРОВАНИЕ...' : 'Запустить розыгрыш (DEMO)'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const QuestsBlock = () => {
  const quests = [
    { id: 'look', title: 'LIFESTYLE_LOOK', badge: '+1', desc: 'Образ из новой коллекции' },
    { id: 'brands', title: 'BRAND_FAV', badge: '+1', desc: 'Подписка на 5 брендов' },
    { id: 'review', title: 'VISUAL_REVIEW', badge: '+2', desc: 'Отзыв с фото' },
    { id: 'lucky', title: 'LUCKY_24H', badge: '×10', desc: 'Все билеты умножаются' },
    { id: 'verify', title: 'SECURE_USER', badge: '+1', desc: 'Верификация профиля' },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="custom-scrollbar flex gap-3 overflow-x-auto px-1 pb-4">
        {quests.map((q) => (
          <TooltipProvider key={q.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="border-border-subtle hover:border-accent-primary group flex flex-shrink-0 items-center gap-3 rounded-2xl border bg-white px-5 py-3 transition-all duration-500 hover:shadow-xl">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-text-muted text-[8px] font-black uppercase tracking-[0.2em]">
                      {q.title}
                    </span>
                    <span className="text-text-primary whitespace-nowrap text-[11px] font-bold">
                      {q.desc}
                    </span>
                  </div>
                  <Badge className="bg-accent-primary flex h-6 items-center justify-center rounded-lg border-none px-2 text-[9px] font-black text-white">
                    {q.badge}
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-text-primary rounded-lg border-none px-3 py-2 text-[10px] font-black uppercase text-white">
                Задание на платформе
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

// ================== MAIN PAGE ==================

export const SynthaLottery = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winners, setWinners] = useState<any[]>([]);
  const [winnersOpen, setWinnersOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [displayNumber, setDisplayNumber] = useState('104582');
  const [winnerNumber, setWinnerNumber] = useState('');
  const [checkValue, setCheckValue] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  const nextDraw = useMemo(() => getNextDrawDate(), []);
  const period = useMemo(() => getCurrentPeriod(), []);
  const monthName = useMemo(() => getMonthNameRu(new Date().getMonth()), []);

  useEffect(() => {
    const fake = [];
    for (let i = 0; i < 40; i++) {
      fake.push(
        normalizeEntry({
          receiptNumber: 100000 + Math.floor(Math.random() * 900000),
          amount: 4000 + Math.floor(Math.random() * 40000),
          user: Math.random() < 0.5 ? { id: `u${i}`, nickname: `@user${i}`, avatarUrl: '' } : null,
          tickets: 1 + Math.floor(Math.random() * 5),
        })
      );
    }
    setEntries(fake);
    setLoading(false);
  }, []);

  const totalTickets = useMemo(
    () => entries.reduce((acc, e) => acc + (e.tickets || 0), 0),
    [entries]
  );

  const handleDemoDraw = async () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setWinners([]);
    setWinnerNumber('');

    let pool = [...entries];
    if (!pool.length) {
      pool = [normalizeEntry({ receiptNumber: 123456, amount: 9990 })];
    }

    for (const prize of DEMO_PRIZES) {
      await new Promise((resolve) => {
        let count = 0;
        const id = setInterval(() => {
          const rnd = String(Math.floor(100000 + Math.random() * 900000));
          setDisplayNumber(rnd);
          count++;
          if (count >= 15) {
            clearInterval(id);
            resolve(true);
          }
        }, 100);
      });

      const winner = pickWeightedWinner(pool) || pool[0];
      pool = pool.filter((e) => e.receiptNumber !== winner.receiptNumber);

      setDisplayNumber(winner.receiptNumber);
      setWinnerNumber(winner.receiptNumber);
      setWinners((prev) => [
        ...prev,
        { receiptNumber: winner.receiptNumber, prizeTitle: prize.title, user: winner.user },
      ]);

      await new Promise((r) => setTimeout(r, 1500));
    }

    setIsDrawing(false);
    setWinnersOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-12">
        {/* Left Column: Info & Entries */}
        <div className="space-y-10 lg:col-span-5">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
                <Ticket className="text-accent-primary h-4 w-4" />
              </div>
              <Badge
                variant="outline"
                className="border-accent-primary/20 text-accent-primary bg-accent-primary/5 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
              >
                ЕЖЕМЕСЯЧНЫЙ_ИВЕНТ
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-text-primary font-headline text-sm font-black uppercase leading-[0.9] tracking-tighter md:text-base">
                Розыгрыш
                <br />
                <span className="text-accent-primary">чеков</span>
              </h1>
              <p className="text-text-muted max-w-lg text-base font-medium italic leading-relaxed">
                Участвуют все покупки за текущий месяц. Каждый чек от 5 000 ₽ — это шанс выиграть
                премиальные активы SYNTHA.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-full border px-4 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                  Live розыгрыш
                </span>
              </div>
              <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-full border px-4 py-2">
                <div className="bg-accent-primary h-1.5 w-1.5 rounded-full" />
                <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                  Только реальные чеки
                </span>
              </div>
            </div>
          </div>

          {/* Current Entries List */}
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
            <CardContent className="space-y-6 p-4">
              <div className="flex items-center justify-between">
                <div className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Список участников ({entries.length})
                </div>
                <div className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
                  Период: {period}
                </div>
              </div>

              <div className="custom-scrollbar -mr-4 flex h-[240px] flex-wrap content-start gap-2 overflow-y-auto pr-4">
                {loading ? (
                  <div className="text-text-muted flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest">
                    Инициализация данных...
                  </div>
                ) : (
                  entries.map((e) => (
                    <div
                      key={e.receiptNumber}
                      className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors"
                    >
                      <span className="text-text-muted text-[10px] font-bold tracking-tight">
                        №
                      </span>
                      <span className="text-text-primary text-[11px] font-black tabular-nums">
                        {e.receiptNumber}
                      </span>
                      <span className="text-accent-primary text-[9px] font-black opacity-40 transition-opacity group-hover:opacity-100">
                        ({e.tickets}×)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Check Form */}
          <div className="bg-accent-primary shadow-accent-primary/20 relative space-y-4 overflow-hidden rounded-xl p-4 text-white shadow-2xl">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Проверка участия
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Номер чека (напр. 104582)"
                  value={checkValue}
                  onChange={(e) => setCheckValue(e.target.value)}
                  className="h-12 rounded-xl border-white/20 bg-white/10 font-bold text-white placeholder:text-white/40"
                />
                <Button className="text-accent-primary hover:bg-bg-surface2 h-12 rounded-xl bg-white px-6 text-[10px] font-black uppercase tracking-widest">
                  Проверить
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Drawing Console */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between px-2">
            <CountdownBlock targetDate={nextDraw} livePaused={false} />
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setArchiveOpen(true)}
                className="text-text-muted hover:text-text-primary h-10 px-5 text-[10px] font-black uppercase tracking-widest"
              >
                Архив <History className="ml-2 h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-text-muted hover:text-text-primary h-10 w-10 p-0"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <LotteryTicket
            monthName={monthName}
            displayNumber={displayNumber}
            winnerNumber={winnerNumber}
            onDrawClick={handleDemoDraw}
            isDrawing={isDrawing}
          />

          <div className="space-y-6">
            <div className="text-text-muted px-2 text-[10px] font-black uppercase tracking-widest">
              Увеличить шансы: квесты платформы
            </div>
            <QuestsBlock />
          </div>
        </div>
      </div>

      {/* Winners Modal */}
      <Dialog open={winnersOpen} onOpenChange={setWinnersOpen}>
        <DialogContent className="bg-text-primary overflow-hidden rounded-xl border-none p-0 shadow-2xl sm:max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Результаты розыгрыша</DialogTitle>
            <DialogDescription>Список победителей текущего цикла</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-3 text-white">
            <div className="space-y-4 text-center">
              <div className="bg-accent-primary shadow-accent-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-3xl shadow-2xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-headline text-sm font-black uppercase tracking-tighter text-white">
                Результаты розыгрыша
              </h2>
              <div className="text-accent-primary text-[11px] font-black uppercase tracking-[0.3em]">
                System_Selection_Complete
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {winners.map((w, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-base">
                      {w.user ? '👤' : '🤍'}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-white/40">
                        Чек № {w.receiptNumber}
                      </div>
                      <div className="font-headline text-sm font-black text-white">
                        {w.user?.nickname || 'Анонимный покупатель'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-accent-primary mb-1 text-[9px] font-black uppercase tracking-widest">
                      Выигрыш
                    </div>
                    <div className="text-sm font-bold text-white">{w.prizeTitle}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setWinnersOpen(false)}
                className="text-text-primary hover:bg-bg-surface2 h-10 flex-1 rounded-2xl bg-white text-[11px] font-black uppercase tracking-widest"
              >
                Понятно
              </Button>
              <Button
                variant="outline"
                className="h-10 w-10 rounded-2xl border-white/10 p-0 text-white hover:bg-white/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Luck Widget Floating */}
      <div className="fixed bottom-8 left-8 z-40">
        <Card className="bg-text-primary/90 w-64 rounded-2xl border border-white/10 p-3 shadow-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Моя удача
              </span>
              <span className="bg-accent-primary rounded-md px-2 py-0.5 text-[10px] font-black text-white">
                LVL 4
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="bg-accent-primary h-full"
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-[11px] font-bold leading-tight text-white">
              Билетов в цикле:{' '}
              <span className="text-accent-primary font-black tabular-nums">{totalTickets}</span>
            </div>
            <button className="hover:bg-accent-primary hover:border-accent-primary h-10 w-full rounded-xl border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white transition-all">
              Повысить шанс
            </button>
          </div>
        </Card>
      </div>

      {/* Archive Modal */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="overflow-hidden rounded-xl border-none bg-white p-4 shadow-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-sm font-black uppercase tracking-tighter">
              Архив розыгрышей
            </DialogTitle>
            <DialogDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              История завершенных циклов лотереи
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar mt-6 h-[400px] space-y-4 overflow-y-auto pr-2">
            {[
              { date: '01.12.2025', winners: 3, prize: 'Apple Vision Pro' },
              { date: '01.11.2025', winners: 5, prize: 'iPhone 15 Pro' },
              { date: '01.10.2025', winners: 2, prize: 'MacBook Air M3' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex items-center justify-between rounded-[1.5rem] border p-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                    Цикл от {item.date}
                  </div>
                  <div className="text-text-primary text-sm font-bold italic">
                    Главный приз: {item.prize}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
                    {item.winners} Победителей
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 text-[8px] font-black uppercase tracking-widest"
                  >
                    Протокол <ChevronRight className="ml-1 h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setArchiveOpen(false)}
              className="bg-text-primary h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-black"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
