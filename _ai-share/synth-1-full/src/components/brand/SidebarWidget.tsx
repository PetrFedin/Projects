'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { StickyNote, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { getCalendarEvents } from '@/lib/collaboration/calendar-store';
import { getAllCalendarEvents } from '@/lib/live-process/calendar-sync';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';

const NOTES_KEY = 'syntha_sidebar_notes_v1';

function loadNotes(userId: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(`${NOTES_KEY}_${userId}`) ?? '';
  } catch {
    return '';
  }
}

function saveNotes(userId: string, text: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${NOTES_KEY}_${userId}`, text);
}

interface UpcomingItem {
  id: string;
  title: string;
  startAt: string;
  endAt?: string;
  type: 'event' | 'task' | 'meeting';
  href?: string;
  needsAttention?: boolean;
}

export function SidebarWidget() {
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest';
  const [notes, setNotes] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const onFocus = () => setRefreshKey((k) => k + 1);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    setNotes(loadNotes(userId));
  }, [userId]);

  const saveNotesDebounced = React.useCallback(() => {
    saveNotes(userId, notes);
  }, [userId, notes]);

  useEffect(() => {
    const t = setTimeout(saveNotesDebounced, 500);
    return () => clearTimeout(t);
  }, [notes, saveNotesDebounced]);

  const upcoming = useMemo((): UpcomingItem[] => {
    const items: UpcomingItem[] = [];
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 86400000);

    // Collaboration calendar events
    const collabEvents = getCalendarEvents(userId);
    for (const e of collabEvents) {
      const start = new Date(e.startAt);
      if (start < in3Days && start >= new Date(now.getTime() - 86400000)) {
        const p = e.participants?.find((x) => x.uid === userId);
        items.push({
          id: e.id,
          title: e.title,
          startAt: e.startAt,
          endAt: e.endAt,
          type: 'event',
          href: ROUTES.brand.calendar,
          needsAttention: p?.status === 'pending' || isToday(start),
        });
      }
    }

    // LIVE process events
    const liveEvents = getAllCalendarEvents();
    for (const e of liveEvents) {
      const start = new Date(e.startAt);
      if (start < in3Days && start >= new Date(now.getTime() - 86400000)) {
        items.push({
          id: e.id,
          title: e.title,
          startAt: e.startAt,
          endAt: e.endAt,
          type: 'task',
          href: `/brand/process/${e.processId}/live?context=${e.contextId}`,
          needsAttention: isToday(start),
        });
      }
    }

    items.sort((a, b) => a.startAt.localeCompare(b.startAt));
    return items.slice(0, 5);
  }, [userId, refreshKey]);

  const preview = notes.slice(0, 80) + (notes.length > 80 ? '…' : '');

  return (
    <div className="border-t border-slate-100 bg-slate-50/50 shrink-0">
      {/* Quick links */}
      <div className="flex items-center gap-0.5 p-1.5">
        <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 flex-1 justify-start gap-1"
            >
              <StickyNote className="h-3 w-3 shrink-0" />
              Заметки
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4">
            <SheetHeader className="pb-3">
              <SheetTitle className="text-sm">Мои заметки</SheetTitle>
            </SheetHeader>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Записывайте идеи, напоминания..."
              className="min-h-[200px] text-sm resize-none"
            />
          </SheetContent>
        </Sheet>
        <Link href={ROUTES.brand.messages}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 flex-1 justify-start gap-1"
          >
            <MessageSquare className="h-3 w-3 shrink-0" />
            Чат
          </Button>
        </Link>
        <Link href={ROUTES.brand.calendar}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 flex-1 justify-start gap-1"
          >
            <Calendar className="h-3 w-3 shrink-0" />
            Календарь
          </Button>
        </Link>
      </div>

      {/* Notes preview */}
      {preview && (
        <button
          type="button"
          onClick={() => setNotesOpen(true)}
          className="w-full px-2 py-1.5 text-left text-[10px] text-slate-600 truncate hover:bg-slate-100/80 rounded mx-1 mb-1 transition-colors"
          title="Открыть заметки"
        >
          {preview}
        </button>
      )}

      {/* Upcoming tasks */}
      <div className="px-2 pb-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1 px-0.5">
          Ближайшее
        </p>
        <ScrollArea className="h-[72px]">
          <div className="space-y-0.5 pr-1">
            {upcoming.length === 0 ? (
              <p className="text-[9px] text-slate-400 italic py-1">Нет событий</p>
            ) : (
              upcoming.map((item) => (
                <Link
                  key={item.id}
                  href={item.href ?? ROUTES.brand.calendar}
                  className={cn(
                    'flex items-center gap-1.5 px-1.5 py-1 rounded text-[9px] transition-colors group',
                    item.needsAttention
                      ? 'bg-amber-50/80 border border-amber-200/50'
                      : 'hover:bg-slate-100'
                  )}
                >
                  {item.needsAttention && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" title="Требует внимания" />
                  )}
                  <span className="truncate flex-1 text-slate-700 group-hover:text-indigo-600">
                    {item.title}
                  </span>
                  <span className="text-[8px] text-slate-400 shrink-0">
                    {isToday(parseISO(item.startAt))
                      ? format(parseISO(item.startAt), 'HH:mm')
                      : isTomorrow(parseISO(item.startAt))
                        ? 'завтра'
                        : format(parseISO(item.startAt), 'd.MM')}
                  </span>
                  <ChevronRight className="h-2.5 w-2.5 text-slate-300 group-hover:text-indigo-500 shrink-0" />
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
