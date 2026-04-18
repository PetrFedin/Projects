'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ArrowUpRight, Clock, Bell, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StyleCalendar from './style-calendar';
import { useUIState } from '@/providers/ui-state';

interface Event {
  id: string;
  title: string;
  time: string;
  category: string;
  color: string;
}

const UPCOMING_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Market Week Milan',
    time: '10:00 - 18:00',
    category: 'Buying',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Запуск коллекции FW26',
    time: '14:00',
    category: 'Drop',
    color: 'bg-emerald-500',
  },
  {
    id: '3',
    title: 'Контроль качества (Брифинг)',
    time: '09:30',
    category: 'Production',
    color: 'bg-orange-500',
  },
];

export function CalendarQuickView({ role = 'brand' }: { role?: string }) {
  const { setIsCalendarOpen } = useUIState();
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date(2026, 1, 10)); // Feb 2026 for demo

  const getFullCalendarLink = () => {
    switch (role) {
      case 'admin':
        return '/admin/calendar';
      case 'brand':
        return '/brand/calendar';
      case 'manufacturer':
      case 'supplier':
        return '/factory/calendar';
      case 'distributor':
        return '/distributor/calendar';
      case 'shop':
        return '/shop/b2b/calendar';
      default:
        return '/brand/calendar';
    }
  };

  return (
    <Dialog onOpenChange={setIsCalendarOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group h-9 w-9 rounded-xl border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:text-slate-900"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-[800px]">
        <div className="relative overflow-hidden bg-slate-900 p-4 text-white">
          <div className="absolute right-0 top-0 rotate-12 scale-150 p-4 opacity-10">
            <CalendarIcon className="h-32 w-32" />
          </div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="mb-2 flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  <Badge
                    variant="outline"
                    className="border-white/20 px-2 py-0 text-[9px] font-black uppercase tracking-widest text-white/60"
                  >
                    CALENDAR_b2b
                  </Badge>
                </div>
                <DialogTitle className="text-sm font-black uppercase tracking-tighter">
                  ОПЕРАЦИОННЫЙ КАЛЕНДАРЬ
                </DialogTitle>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-white/40">
                  {currentDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })} —
                  Единая экосистема
                </p>
              </div>
              <Button
                asChild
                className="h-6 rounded-lg bg-white px-3 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-slate-100"
              >
                <Link href={getFullCalendarLink()}>
                  Полная версия
                  <ArrowUpRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="bg-slate-50/50 p-4">
          <StyleCalendar
            variant="compact"
            initialRole={role}
            externalDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">
          <div className="font-mono text-[8px] uppercase tracking-widest text-slate-400">
            SYN_RADAR_v2.0_0xFC
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-[7px] font-bold uppercase text-slate-400">Buying</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span className="text-[7px] font-bold uppercase text-slate-400">Drops</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="text-[7px] font-bold uppercase text-slate-400">Production</span>
              </div>
            </div>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex gap-1.5">
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <div className="h-1 w-4 rounded-full bg-slate-900" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
