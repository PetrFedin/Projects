'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ================== CONFIG ==================
const WSS_URL = "wss://syntha.example/lottery";
const ENTRIES_API = "/api/lottery/current-entries";
const CHECK_API = "/api/lottery/check";
const RECORD_WIN_API = "/api/lottery/win";

const DEMO_PRIZES = [
  { id: "p1", title: "Подарочная карта 20 000 ₽", icon: Gift },
  { id: "p2", title: "Кроссовки от спонсора", icon: Trophy },
  { id: "p3", title: "Худи лимитированной капсулы", icon: Star },
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
    String(d.getDate()).padStart(2, "0") +
    "." +
    String(d.getMonth() + 1).padStart(2, "0");
  return `${fmt(first)}–${fmt(last)}`;
}

function getMonthNameRu(monthIndex: number) {
  const names = [
    "январь", "февраль", "март", "апрель", "май", "июнь",
    "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",
  ];
  return names[monthIndex] || "";
}

function normalizeEntry(item: any) {
  if (typeof item === "string" || typeof item === "number") {
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

const CountdownBlock = ({ targetDate, livePaused }: { targetDate: Date, livePaused: boolean }) => {
  const { days, hours, minutes, seconds } = useCountdown(targetDate, { paused: livePaused });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        До розыгрыша ({targetDate.toLocaleDateString('ru-RU')} • {targetDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })})
      </div>
      <div className="flex items-center gap-2 font-headline">
        <div className="flex flex-col items-center min-w-[40px]">
          <div className="text-base font-black text-slate-900 tracking-tighter tabular-nums leading-none">{String(days).padStart(2, "0")}</div>
          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">дни</div>
        </div>
        <span className="text-base font-black text-slate-200 -mt-4">:</span>
        <div className="flex flex-col items-center min-w-[40px]">
          <div className="text-base font-black text-slate-900 tracking-tighter tabular-nums leading-none">{String(hours).padStart(2, "0")}</div>
          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">часы</div>
        </div>
        <span className="text-base font-black text-slate-200 -mt-4">:</span>
        <div className="flex flex-col items-center min-w-[40px]">
          <div className="text-base font-black text-slate-900 tracking-tighter tabular-nums leading-none">{String(minutes).padStart(2, "0")}</div>
          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">мин</div>
        </div>
        <span className="text-base font-black text-slate-200 -mt-4">:</span>
        <div className="flex flex-col items-center min-w-[40px]">
          <div className="text-base font-black text-slate-900 tracking-tighter tabular-nums leading-none">{String(seconds).padStart(2, "0")}</div>
          <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">сек</div>
        </div>
      </div>
    </div>
  );
};

const LotteryTicket = ({ monthName, displayNumber, winnerNumber, onDrawClick, isDrawing }: any) => {
  const digits = displayNumber.split("");

  return (
    <div className={cn(
      "relative group/ticket overflow-hidden transition-all duration-700",
      "bg-slate-900 rounded-xl p-1 shadow-2xl border border-slate-800",
      isDrawing && "animate-pulse"
    )}>
      {/* OS Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white animate-scan-line" />
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[2.25rem] p-4 md:p-3 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">SYNTHA_LOTTERY_SYSTEM_V2.5</div>
            </div>
            <div>
              <h2 className="text-sm md:text-sm font-headline font-black text-white uppercase tracking-tighter leading-none">Лотерея чеков</h2>
              <div className="text-[11px] font-medium text-slate-400 mt-2 uppercase tracking-widest">Период участия: <span className="text-white font-black">{monthName}</span></div>
            </div>
          </div>
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-[9px] font-black uppercase px-3 py-1">
            {isDrawing ? "РОЗЫГРЫШ_LIVE" : "АКТИВНЫЙ_ЦИКЛ"}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-headline font-black text-slate-700 select-none tracking-tighter">№</span>
            <div className="flex gap-2">
              {digits.map((d: string, i: number) => (
                <motion.div 
                  key={i}
                  initial={false}
                  animate={{ y: isDrawing ? [0, -10, 0] : 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05, repeat: isDrawing ? Infinity : 0 }}
                  className="w-12 h-12 md:w-12 md:h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner"
                >
                  <span className="text-base md:text-sm font-headline font-black text-white tabular-nums">{d}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Главный актив месяца</div>
            <div className="text-base md:text-sm font-headline font-black text-indigo-400 uppercase tracking-tight leading-tight">
              Gift Card<br />SYNTHA PREMIUM
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <div className="flex flex-col gap-1">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Результат сканирования</div>
            <div className="text-sm font-headline font-black text-white tracking-widest">
              {winnerNumber ? `ЧЕК № ${winnerNumber}` : "ОЖИДАНИЕ_ЗАПУСКА"}
            </div>
          </div>
          <Button 
            onClick={onDrawClick} 
            disabled={isDrawing}
            className={cn(
              "h-10 px-10 rounded-full font-black uppercase text-[11px] tracking-widest transition-all duration-500",
              isDrawing ? "bg-slate-800 text-slate-500" : "bg-white text-slate-900 hover:bg-indigo-500 hover:text-white shadow-2xl shadow-white/10"
            )}
          >
            {isDrawing ? "СКАНИРОВАНИЕ..." : "Запустить розыгрыш (DEMO)"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const QuestsBlock = () => {
  const quests = [
    { id: "look", title: "LIFESTYLE_LOOK", badge: "+1", desc: "Образ из новой коллекции" },
    { id: "brands", title: "BRAND_FAV", badge: "+1", desc: "Подписка на 5 брендов" },
    { id: "review", title: "VISUAL_REVIEW", badge: "+2", desc: "Отзыв с фото" },
    { id: "lucky", title: "LUCKY_24H", badge: "×10", desc: "Все билеты умножаются" },
    { id: "verify", title: "SECURE_USER", badge: "+1", desc: "Верификация профиля" },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-1">
        {quests.map((q) => (
          <TooltipProvider key={q.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex-shrink-0 group flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 hover:border-indigo-500 hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{q.title}</span>
                    <span className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{q.desc}</span>
                  </div>
                  <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] rounded-lg px-2 h-6 flex items-center justify-center">
                    {q.badge}
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 text-white text-[10px] font-black uppercase border-none px-3 py-2 rounded-lg">Задание на платформе</TooltipContent>
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
  const [displayNumber, setDisplayNumber] = useState("104582");
  const [winnerNumber, setWinnerNumber] = useState("");
  const [checkValue, setCheckValue] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const nextDraw = useMemo(() => getNextDrawDate(), []);
  const period = useMemo(() => getCurrentPeriod(), []);
  const monthName = useMemo(() => getMonthNameRu(new Date().getMonth()), []);

  useEffect(() => {
    const fake = [];
    for (let i = 0; i < 40; i++) {
      fake.push(normalizeEntry({
        receiptNumber: 100000 + Math.floor(Math.random() * 900000),
        amount: 4000 + Math.floor(Math.random() * 40000),
        user: Math.random() < 0.5 ? { id: `u${i}`, nickname: `@user${i}`, avatarUrl: "" } : null,
        tickets: 1 + Math.floor(Math.random() * 5)
      }));
    }
    setEntries(fake);
    setLoading(false);
  }, []);

  const totalTickets = useMemo(() => entries.reduce((acc, e) => acc + (e.tickets || 0), 0), [entries]);

  const handleDemoDraw = async () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setWinners([]);
    setWinnerNumber("");
    
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
          if (count >= 15) { clearInterval(id); resolve(true); }
        }, 100);
      });

      const winner = pickWeightedWinner(pool) || pool[0];
      pool = pool.filter((e) => e.receiptNumber !== winner.receiptNumber);

      setDisplayNumber(winner.receiptNumber);
      setWinnerNumber(winner.receiptNumber);
      setWinners((prev) => [...prev, { receiptNumber: winner.receiptNumber, prizeTitle: prize.title, user: winner.user }]);
      
      await new Promise((r) => setTimeout(r, 1500));
    }

    setIsDrawing(false);
    setWinnersOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column: Info & Entries */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Ticket className="h-4 w-4 text-indigo-600" />
              </div>
              <Badge variant="outline" className="text-[9px] border-indigo-500/20 text-indigo-600 bg-indigo-500/5 uppercase font-black tracking-widest px-2 py-0.5">
                ЕЖЕМЕСЯЧНЫЙ_ИВЕНТ
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-sm md:text-base font-headline font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
                Розыгрыш<br /><span className="text-indigo-600">чеков</span>
              </h1>
              <p className="text-slate-400 font-medium text-base leading-relaxed italic max-w-lg">
                Участвуют все покупки за текущий месяц. Каждый чек от 5 000 ₽ — это шанс выиграть премиальные активы SYNTHA.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Live розыгрыш</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-4 py-2">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Только реальные чеки</span>
              </div>
            </div>
          </div>

          {/* Current Entries List */}
          <Card className="bg-white border-none rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Список участников ({entries.length})</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Период: {period}</div>
              </div>
              
              <div className="h-[240px] overflow-y-auto custom-scrollbar pr-4 -mr-4 flex flex-wrap gap-2 content-start">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-widest">Инициализация данных...</div>
                ) : entries.map((e) => (
                  <div key={e.receiptNumber} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex items-center gap-2 group hover:border-indigo-300 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">№</span>
                    <span className="text-[11px] font-black text-slate-900 tabular-nums">{e.receiptNumber}</span>
                    <span className="text-[9px] font-black text-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity">({e.tickets}×)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Check Form */}
          <div className="space-y-4 p-4 bg-indigo-600 rounded-xl shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Проверка участия</div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Номер чека (напр. 104582)" 
                  value={checkValue}
                  onChange={(e) => setCheckValue(e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 font-bold rounded-xl"
                />
                <Button className="h-12 bg-white text-indigo-600 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest px-6 rounded-xl">Проверить</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Drawing Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <CountdownBlock targetDate={nextDraw} livePaused={false} />
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setArchiveOpen(true)} className="h-10 px-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                Архив <History className="ml-2 h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" onClick={() => setIsMuted(!isMuted)} className="h-10 w-10 p-0 text-slate-400 hover:text-slate-900">
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
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Увеличить шансы: квесты платформы</div>
            <QuestsBlock />
          </div>
        </div>
      </div>

      {/* Winners Modal */}
      <Dialog open={winnersOpen} onOpenChange={setWinnersOpen}>
        <DialogContent className="rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-slate-900 sm:max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Результаты розыгрыша</DialogTitle>
            <DialogDescription>Список победителей текущего цикла</DialogDescription>
          </DialogHeader>
          <div className="p-3 text-white space-y-4">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-sm font-headline font-black uppercase tracking-tighter text-white">Результаты розыгрыша</h2>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">System_Selection_Complete</div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {winners.map((w, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-base">
                      {w.user ? "👤" : "🤍"}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white/40 uppercase tracking-widest">Чек № {w.receiptNumber}</div>
                      <div className="text-sm font-headline font-black text-white">{w.user?.nickname || "Анонимный покупатель"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Выигрыш</div>
                    <div className="text-sm font-bold text-white">{w.prizeTitle}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setWinnersOpen(false)} className="flex-1 h-10 bg-white text-slate-900 hover:bg-slate-100 font-black uppercase text-[11px] tracking-widest rounded-2xl">Понятно</Button>
              <Button variant="outline" className="h-10 w-10 p-0 rounded-2xl border-white/10 text-white hover:bg-white/10"><Share2 className="h-5 w-5" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Luck Widget Floating */}
      <div className="fixed bottom-8 left-8 z-40">
        <Card className="w-64 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Моя удача</span>
              <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-md bg-indigo-600">LVL 4</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500" 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-[11px] font-bold text-white leading-tight">Билетов в цикле: <span className="text-indigo-400 font-black tabular-nums">{totalTickets}</span></div>
            <button className="w-full h-10 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all">Повысить шанс</button>
          </div>
        </Card>
      </div>

      {/* Archive Modal */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="rounded-xl border-none shadow-2xl p-4 bg-white sm:max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-headline font-black uppercase tracking-tighter">Архив розыгрышей</DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">История завершенных циклов лотереи</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6 h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {[
              { date: "01.12.2025", winners: 3, prize: "Apple Vision Pro" },
              { date: "01.11.2025", winners: 5, prize: "iPhone 15 Pro" },
              { date: "01.10.2025", winners: 2, prize: "MacBook Air M3" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="space-y-1">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Цикл от {item.date}</div>
                  <div className="text-sm font-bold text-slate-900 italic">Главный приз: {item.prize}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{item.winners} Победителей</div>
                  <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest mt-1">Протокол <ChevronRight className="ml-1 h-2.5 w-2.5" /></Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setArchiveOpen(false)} className="w-full h-12 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-all">Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
