'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  brandCalendarB2bOrderContextHref,
  brandMessagesB2bOrderContextHref,
  factoryCalendarB2bOrderContextHref,
  factoryMessagesB2bOrderContextHref,
  factorySupplierCalendarB2bOrderContextHref,
  factorySupplierMessagesB2bOrderContextHref,
  shopCalendarB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
} from '@/lib/routes';

type CalendarUserTaskRow = {
  id: string;
  title: string;
  startAt: string;
  orderId?: string | null;
  targetChatId?: string | null;
};

type Props = {
  collectionId: string;
  orderId?: string;
  ownerRole: 'brand' | 'shop' | 'manufacturer' | 'supplier';
  testIdPrefix: string;
  reloadNonce?: number;
};

function orderChatHref(role: Props['ownerRole'], orderId: string): string {
  if (role === 'shop') return shopMessagesB2bOrderContextHref(orderId);
  if (role === 'brand') return brandMessagesB2bOrderContextHref(orderId);
  if (role === 'supplier') return factorySupplierMessagesB2bOrderContextHref(orderId);
  return factoryMessagesB2bOrderContextHref(orderId, { role: 'manufacturer' });
}

function calendarTaskHref(
  role: Props['ownerRole'],
  collectionId: string,
  orderId: string | null | undefined,
  taskId: string
): string {
  const task = encodeURIComponent(taskId);
  if (orderId?.trim()) {
    if (role === 'brand') {
      return `${brandCalendarB2bOrderContextHref(orderId)}&pcTask=${task}`;
    }
    if (role === 'shop') {
      return `${shopCalendarB2bOrderContextHref(orderId)}&pcTask=${task}`;
    }
    if (role === 'supplier') {
      return `${factorySupplierCalendarB2bOrderContextHref(orderId)}&pcTask=${task}`;
    }
    return `${factoryCalendarB2bOrderContextHref(orderId)}&pcTask=${task}`;
  }
  if (role === 'shop') {
    return `/shop/b2b/calendar?collection=${encodeURIComponent(collectionId)}&pcTask=${task}`;
  }
  return role === 'brand'
    ? `/brand/calendar?collection=${encodeURIComponent(collectionId)}&pcTask=${task}`
    : `/factory/calendar?role=${role}&collection=${encodeURIComponent(collectionId)}&pcTask=${task}`;
}

/** PG user-task list + deep links to order calendar / chat. */
export function PlatformCoreCalendarUserTasksStrip({
  collectionId,
  orderId,
  ownerRole,
  testIdPrefix,
  reloadNonce = 0,
}: Props) {
  const [tasks, setTasks] = useState<CalendarUserTaskRow[]>([]);
  const [storageMode, setStorageMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const qs = new URLSearchParams({ collectionId, limit: '5' });
    if (orderId) qs.set('orderId', orderId);
    setLoading(true);
    void fetch(`/api/workshop2/platform-core/calendar-events/user-task?${qs.toString()}`, {
      cache: 'no-store',
    })
      .then((r) => r.json())
      .then(
        (json: {
          ok?: boolean;
          tasks?: CalendarUserTaskRow[];
          storageMode?: string;
        }) => {
          if (cancelled || json.ok !== true) return;
          setTasks(Array.isArray(json.tasks) ? json.tasks : []);
          setStorageMode(json.storageMode ?? null);
        }
      )
      .catch(() => {
        if (!cancelled) setTasks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionId, orderId, reloadNonce]);

  if (loading) {
    return (
      <p className="text-text-muted text-[10px]" data-testid={`${testIdPrefix}-loading`}>
        Задачи PG…
      </p>
    );
  }

  return (
    <div
      className="border-border-subtle flex flex-wrap items-center gap-2 rounded-md border bg-bg-surface2/50 px-3 py-2 text-xs"
      data-testid={`${testIdPrefix}-strip`}
    >
      <Badge variant="outline" className="text-[9px] uppercase">
        User tasks
      </Badge>
      {storageMode === 'pg' ? (
        <Badge variant="secondary" className="text-[9px]">
          PG
        </Badge>
      ) : null}
      {tasks.length === 0 ? (
        <span className="text-text-muted">Нет сохранённых задач — создайте слот в календаре.</span>
      ) : (
        tasks.map((task) => (
          <span key={task.id} className="inline-flex flex-wrap items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 text-[10px]" asChild>
              <Link
                href={calendarTaskHref(ownerRole, collectionId, task.orderId, task.id)}
                data-testid={`${testIdPrefix}-task-${task.id}`}
              >
                {task.title}
              </Link>
            </Button>
            {task.orderId ? (
              <Button size="sm" variant="ghost" className="h-7 text-[10px]" asChild>
                <Link
                  href={orderChatHref(ownerRole, task.orderId)}
                  data-testid={`${testIdPrefix}-chat-${task.id}`}
                >
                  Чат
                </Link>
              </Button>
            ) : null}
          </span>
        ))
      )}
    </div>
  );
}
