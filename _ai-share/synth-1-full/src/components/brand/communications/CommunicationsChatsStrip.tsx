'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { RECENT_CHATS_PREVIEW } from '@/lib/data/communications-data';

export function CommunicationsChatsStrip() {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl overflow-x-auto">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 shrink-0 flex items-center gap-1.5">
        <MessageSquare className="h-3.5 w-3.5" />
        Чаты:
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {RECENT_CHATS_PREVIEW.slice(0, 4).map((c) => (
          <div key={c.id} className="shrink-0 flex items-center gap-1">
            <Link
              href={c.href}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all min-w-0 max-w-[200px]"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-800 truncate">{c.title}</span>
                  {c.unread && (
                    <span className="shrink-0 h-4 min-w-4 rounded-full bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center px-1">
                      {c.unread}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-500 truncate block">{c.preview}</span>
              </div>
            </Link>
            {c.calendarHref && (
              <Link
                href={c.calendarHref}
                className="p-1.5 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-400 hover:text-indigo-600 transition-all"
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
        className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
      >
        Сообщения <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
