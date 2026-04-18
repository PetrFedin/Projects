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
          className="text-text-primary hover:bg-bg-surface2 relative h-7 w-7 transition-colors"
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
        className="border-border-default w-[360px] rounded-xl border p-0 shadow-xl"
      >
        <div className="border-border-subtle flex items-center justify-between border-b px-4 py-3">
          <span className="text-text-secondary text-xs font-bold uppercase tracking-widest">
            Уведомления
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-accent-primary text-[10px] font-bold uppercase tracking-wider hover:underline"
            >
              Прочитать все
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[320px]">
          {notifications.length === 0 ? (
            <div className="text-text-muted py-8 text-center text-sm">Нет уведомлений</div>
          ) : (
            <ul className="py-1">
              {notifications.slice(0, 20).map((n) => (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => markRead(n.id)}
                      className={cn(
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
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        'border-border-subtle hover:bg-bg-surface2 cursor-pointer border-b px-4 py-3 last:border-0',
                        !n.read && 'bg-accent-primary/10'
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <div className="flex items-start gap-2">
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
