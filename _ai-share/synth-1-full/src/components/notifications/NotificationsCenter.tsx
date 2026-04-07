'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/providers/notifications-provider';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/lib/feature-flags';

const typeLabels: Record<string, string> = {
  order: 'Заказ',
  payment: 'Оплата',
  sla: 'Сроки',
  qc: 'Качество',
  po: 'Закупка',
  edo: 'ЭДО',
  system: 'Система',
};

export function NotificationsCenter() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  if (!isFeatureEnabled('notificationsCenter')) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-7 w-7 text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full px-1 text-[10px] font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Уведомления</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] p-0 rounded-xl border border-slate-200 shadow-xl">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Уведомления</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider"
            >
              Прочитать все
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[320px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Нет уведомлений</div>
          ) : (
            <ul className="py-1">
              {notifications.slice(0, 20).map((n) => (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "block px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                        !n.read && "bg-indigo-50/50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 leading-tight">{n.title}</p>
                          {n.body && <p className="text-xs text-slate-500 mt-0.5 truncate">{n.body}</p>}
                        </div>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50",
                        !n.read && "bg-indigo-50/50"
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 leading-tight">{n.title}</p>
                          {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
                        </div>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
