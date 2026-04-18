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
<<<<<<< HEAD
          className="relative h-7 w-7 text-slate-900 transition-colors hover:bg-slate-50"
=======
          className="text-text-primary hover:bg-bg-surface2 relative h-7 w-7 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Уведомления</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
<<<<<<< HEAD
        className="w-[360px] rounded-xl border border-slate-200 p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
=======
        className="border-border-default w-[360px] rounded-xl border p-0 shadow-xl"
      >
        <div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
          <span className="text-text-secondary text-xs font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Уведомления
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
<<<<<<< HEAD
              className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:underline"
=======
              className="text-accent-primary text-[10px] font-bold uppercase tracking-wider hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Прочитать все
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[320px]">
          {notifications.length === 0 ? (
<<<<<<< HEAD
            <div className="py-8 text-center text-sm text-slate-400">Нет уведомлений</div>
=======
            <div className="text-text-muted py-8 text-center text-sm">Нет уведомлений</div>
>>>>>>> recover/cabinet-wip-from-stash
          ) : (
            <ul className="py-1">
              {notifications.slice(0, 20).map((n) => (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className={cn(
<<<<<<< HEAD
                        'block border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50',
                        !n.read && 'bg-indigo-50/50'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-[10px] font-bold uppercase text-slate-400">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight text-slate-900">
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="mt-0.5 truncate text-xs text-slate-500">{n.body}</p>
                          )}
                        </div>
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
=======
                        'hover:bg-bg-surface2 border-border-subtle block border-b px-4 py-3 transition-colors last:border-0',
                        !n.read && 'bg-accent-primary/10'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-text-muted shrink-0 text-[10px] font-bold uppercase">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary text-sm font-medium leading-tight">
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="text-text-secondary mt-0.5 truncate text-xs">{n.body}</p>
                          )}
                        </div>
                        {!n.read && (
                          <span className="bg-accent-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={cn(
<<<<<<< HEAD
                        'cursor-pointer border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50',
                        !n.read && 'bg-indigo-50/50'
=======
                        'border-border-subtle hover:bg-bg-surface2 cursor-pointer border-b px-4 py-3 last:border-0',
                        !n.read && 'bg-accent-primary/10'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <div className="flex items-start gap-2">
<<<<<<< HEAD
                        <span className="shrink-0 text-[10px] font-bold uppercase text-slate-400">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight text-slate-900">
                            {n.title}
                          </p>
                          {n.body && <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>}
                        </div>
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
=======
                        <span className="text-text-muted shrink-0 text-[10px] font-bold uppercase">
                          {typeLabels[n.type] || n.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary text-sm font-medium leading-tight">
                            {n.title}
                          </p>
                          {n.body && <p className="text-text-secondary mt-0.5 text-xs">{n.body}</p>}
                        </div>
                        {!n.read && (
                          <span className="bg-accent-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                        )}
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
