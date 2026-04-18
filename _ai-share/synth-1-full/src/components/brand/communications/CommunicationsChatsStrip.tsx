'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { RECENT_CHATS_PREVIEW } from '@/lib/data/communications-data';

export function CommunicationsChatsStrip() {
  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        <MessageSquare className="h-3.5 w-3.5" />
        Чаты:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {RECENT_CHATS_PREVIEW.slice(0, 4).map((c) => (
          <div key={c.id} className="flex shrink-0 items-center gap-1">
            <Link
              href={c.href}
              className="flex min-w-0 max-w-[200px] items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-1.5 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[10px] font-bold text-slate-800">{c.title}</span>
                  {c.unread && (
                    <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 px-1 text-[8px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
                <span className="block truncate text-[9px] text-slate-500">{c.preview}</span>
              </div>
            </Link>
            {c.calendarHref && (
              <Link
                href={c.calendarHref}
                className="rounded-lg border border-slate-100 bg-white p-1.5 text-slate-400 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-600"
                title={`Календарь: ${c.title}`}
              >
                <Calendar className="h-3 w-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
      <Link
        href="/brand/messages"
        className="flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
      >
        Сообщения <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
