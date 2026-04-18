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
import { ROUTES } from '@/lib/routes';

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
        return ROUTES.admin.calendar;
      case 'brand':
        return ROUTES.brand.calendar;
      case 'manufacturer':
      case 'supplier':
        return ROUTES.factory.productionCalendar;
      case 'distributor':
        return ROUTES.distributor.calendar;
      case 'shop':
        return ROUTES.shop.b2bCalendar;
      default:
        return ROUTES.brand.calendar;
    }
  };

  return (
    <Dialog onOpenChange={setIsCalendarOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-border-default text-text-muted hover:text-text-primary group h-9 w-9 rounded-xl bg-white shadow-sm transition-all"
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-[800px]">
        <div className="bg-text-primary relative overflow-hidden p-4 text-white">
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
                className="text-text-primary hover:bg-bg-surface2 h-6 rounded-lg bg-white px-3 text-[8px] font-black uppercase tracking-widest shadow-xl transition-all"
              >
                <Link href={getFullCalendarLink()}>
                  Полная версия
                  <ArrowUpRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </DialogHeader>
        </div>

        <div className="bg-bg-surface2/80 p-4">
          <StyleCalendar
            variant="compact"
            initialRole={role}
            externalDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between border-t p-4">
          <div className="text-text-muted font-mono text-[8px] uppercase tracking-widest">
            SYN_RADAR_v2.0_0xFC
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-text-muted text-[7px] font-bold uppercase">Buying</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span className="text-text-muted text-[7px] font-bold uppercase">Drops</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="text-text-muted text-[7px] font-bold uppercase">Production</span>
              </div>
            </div>
            <div className="bg-border-subtle h-4 w-[1px]" />
            <div className="flex gap-1.5">
              <div className="bg-border-default h-1 w-1 rounded-full" />
              <div className="bg-text-primary h-1 w-4 rounded-full" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
