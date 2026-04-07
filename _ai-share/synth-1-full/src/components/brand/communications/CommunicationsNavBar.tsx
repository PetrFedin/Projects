'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultUpcomingDeadlines } from '@/lib/data/calendar-events';
import { RECENT_CHATS_PREVIEW } from '@/lib/data/communications-data';

const COMM_LINKS = [
  { href: '/brand/messages', label: 'Сообщения', icon: MessageSquare },
  { href: '/brand/calendar', label: 'Календарь', icon: Calendar },
] as const;

function pathMatchesCommHub(pathname: string | null, href: string): boolean {
  const base = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  const target = href.replace(/\/$/, '') || '/';
  return base === target || base.startsWith(`${target}/`);
}

export function CommunicationsNavBar({ currentPath, unreadCount }: { currentPath: string; unreadCount?: number }) {
  const pathname = usePathname();
  const deadlines = getDefaultUpcomingDeadlines({ limit: 20 });
  const overdueCount = deadlines.filter(d => d.isOverdue).length;
  const unread = unreadCount ?? RECENT_UNREAD;

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner w-fit">
      {COMM_LINKS.map(({ href, label, icon: Icon }) => {
        const isActive = pathMatchesCommHub(pathname ?? currentPath, href);
        const badge = href === '/brand/messages' && unread > 0 ? unread : href === '/brand/calendar' && overdueCount > 0 ? overdueCount : null;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all relative',
              isActive
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {badge !== null && (
              <span className={cn(
                "ml-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-black px-1",
                href === '/brand/calendar' && overdueCount > 0 ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
              )}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

const RECENT_UNREAD = RECENT_CHATS_PREVIEW.reduce((s, c) => s + (c.unread ?? 0), 0);
