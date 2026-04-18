'use client';

import Link from 'next/link';
import { MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { RECENT_CHATS_PREVIEW } from '@/lib/data/communications-data';
import { ROUTES } from '@/lib/routes';

export function CommunicationsChatsStrip() {
  return (
    <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 overflow-x-auto rounded-xl border px-4 py-2.5">
      <span className="text-text-muted flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
        <MessageSquare className="h-3.5 w-3.5" />
        Чаты:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {RECENT_CHATS_PREVIEW.slice(0, 4).map((c) => (
          <div key={c.id} className="flex shrink-0 items-center gap-1">
            <Link
              href={c.href}
              className="border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 flex min-w-0 max-w-[200px] items-center gap-2 rounded-lg border bg-white px-3 py-1.5 transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary truncate text-[10px] font-bold">
                    {c.title}
                  </span>
                  {c.unread && (
                    <span className="bg-accent-primary flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
                <span className="text-text-secondary block truncate text-[9px]">{c.preview}</span>
              </div>
            </Link>
            {c.calendarHref && (
              <Link
                href={c.calendarHref}
                className="border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary rounded-lg border bg-white p-1.5 transition-all"
                title={`Календарь: ${c.title}`}
              >
                <Calendar className="h-3 w-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
      <Link
        href={ROUTES.brand.messages}
        className="text-accent-primary hover:text-accent-primary flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
      >
        Сообщения <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
