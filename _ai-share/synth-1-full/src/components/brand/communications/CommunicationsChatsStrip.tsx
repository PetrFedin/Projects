'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { RECENT_CHATS_PREVIEW } from '@/lib/data/communications-data';
import { ROUTES } from '@/lib/routes';

export function CommunicationsChatsStrip() {
  return (
<<<<<<< HEAD
    <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
    <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 overflow-x-auto rounded-xl border px-4 py-2.5">
      <span className="text-text-muted flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
        <MessageSquare className="h-3.5 w-3.5" />
        Чаты:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {RECENT_CHATS_PREVIEW.slice(0, 4).map((c) => (
          <div key={c.id} className="flex shrink-0 items-center gap-1">
            <Link
              href={c.href}
<<<<<<< HEAD
              className="flex min-w-0 max-w-[200px] items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-1.5 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[10px] font-bold text-slate-800">{c.title}</span>
                  {c.unread && (
                    <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 px-1 text-[8px] font-bold text-white">
=======
              className="border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 flex min-w-0 max-w-[200px] items-center gap-2 rounded-lg border bg-white px-3 py-1.5 transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary truncate text-[10px] font-bold">
                    {c.title}
                  </span>
                  {c.unread && (
                    <span className="bg-accent-primary flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white">
>>>>>>> recover/cabinet-wip-from-stash
                      {c.unread}
                    </span>
                  )}
                </div>
<<<<<<< HEAD
                <span className="block truncate text-[9px] text-slate-500">{c.preview}</span>
=======
                <span className="text-text-secondary block truncate text-[9px]">{c.preview}</span>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </Link>
            {c.calendarHref && (
              <Link
                href={c.calendarHref}
<<<<<<< HEAD
                className="rounded-lg border border-slate-100 bg-white p-1.5 text-slate-400 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600"
=======
                className="border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary rounded-lg border bg-white p-1.5 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                title={`Календарь: ${c.title}`}
              >
                <Calendar className="h-3 w-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
      <Link
<<<<<<< HEAD
        href="/brand/messages"
        className="flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
=======
        href={ROUTES.brand.messages}
        className="text-accent-primary hover:text-accent-primary flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
      >
        Сообщения <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
