'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { StickyNote, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
<<<<<<< HEAD
    <div className="shrink-0 border-t border-slate-100 bg-slate-50/50">
=======
    <div className="border-border-subtle bg-bg-surface2/80 shrink-0 border-t">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Quick links */}
      <div className="flex items-center gap-0.5 p-1.5">
        <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
<<<<<<< HEAD
              className="h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600"
=======
              className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider"
>>>>>>> recover/cabinet-wip-from-stash
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
              className="min-h-[200px] resize-none text-sm"
            />
          </SheetContent>
        </Sheet>
        <Link href={ROUTES.brand.messages}>
          <Button
            variant="ghost"
            size="sm"
<<<<<<< HEAD
            className="h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600"
=======
            className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <MessageSquare className="h-3 w-3 shrink-0" />
            Чат
          </Button>
        </Link>
        <Link href={ROUTES.brand.calendar}>
          <Button
            variant="ghost"
            size="sm"
<<<<<<< HEAD
            className="h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600"
=======
            className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 h-7 flex-1 justify-start gap-1 px-2 text-[9px] font-bold uppercase tracking-wider"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          className="mx-1 mb-1 w-full truncate rounded px-2 py-1.5 text-left text-[10px] text-slate-600 transition-colors hover:bg-slate-100/80"
=======
          className="text-text-secondary hover:bg-bg-surface2/80 mx-1 mb-1 w-full truncate rounded px-2 py-1.5 text-left text-[10px] transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          title="Открыть заметки"
        >
          {preview}
        </button>
      )}

      {/* Upcoming tasks */}
      <div className="px-2 pb-2">
<<<<<<< HEAD
        <p className="mb-1 px-0.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
        <p className="text-text-muted mb-1 px-0.5 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          Ближайшее
        </p>
        <ScrollArea className="h-[72px]">
          <div className="space-y-0.5 pr-1">
            {upcoming.length === 0 ? (
<<<<<<< HEAD
              <p className="py-1 text-[9px] italic text-slate-400">Нет событий</p>
=======
              <p className="text-text-muted py-1 text-[9px] italic">Нет событий</p>
>>>>>>> recover/cabinet-wip-from-stash
            ) : (
              upcoming.map((item) => (
                <Link
                  key={item.id}
                  href={item.href ?? ROUTES.brand.calendar}
                  className={cn(
                    'group flex items-center gap-1.5 rounded px-1.5 py-1 text-[9px] transition-colors',
                    item.needsAttention
                      ? 'border border-amber-200/50 bg-amber-50/80'
<<<<<<< HEAD
                      : 'hover:bg-slate-100'
=======
                      : 'hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  {item.needsAttention && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-amber-500"
                      title="Требует внимания"
                    />
                  )}
<<<<<<< HEAD
                  <span className="flex-1 truncate text-slate-700 group-hover:text-indigo-600">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[8px] text-slate-400">
=======
                  <span className="text-text-primary group-hover:text-accent-primary flex-1 truncate">
                    {item.title}
                  </span>
                  <span className="text-text-muted shrink-0 text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                    {isToday(parseISO(item.startAt))
                      ? format(parseISO(item.startAt), 'HH:mm')
                      : isTomorrow(parseISO(item.startAt))
                        ? 'завтра'
                        : format(parseISO(item.startAt), 'd.MM')}
                  </span>
<<<<<<< HEAD
                  <ChevronRight className="h-2.5 w-2.5 shrink-0 text-slate-300 group-hover:text-indigo-500" />
=======
                  <ChevronRight className="text-text-muted group-hover:text-accent-primary h-2.5 w-2.5 shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
