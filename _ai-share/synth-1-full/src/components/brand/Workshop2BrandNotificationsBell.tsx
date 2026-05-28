'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Workshop2BrandNotificationsBell({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const [count, setCount] = useState(0);

  const collectionId =
    searchParams?.get('w2col')?.trim() ||
    (typeof window !== 'undefined'
      ? sessionStorage.getItem('workshop2:lastCollectionId')?.trim()
      : '') ||
    'SS27';

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const cid =
        searchParams?.get('w2col')?.trim() ||
        (typeof window !== 'undefined'
          ? sessionStorage.getItem('workshop2:lastCollectionId')?.trim()
          : '') ||
        'SS27';
      void fetch(`/api/brand/notifications/workshop2?collectionId=${encodeURIComponent(cid)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!cancelled) setCount(Number(data?.bellCount ?? data?.totalCount ?? 0));
        })
        .catch(() => {
          if (!cancelled) setCount(0);
        });
    };
    load();
    const t = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [searchParams, collectionId]);

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn('relative h-8 gap-1 px-2', className)}
      data-testid="workshop2-brand-notifications-bell"
    >
      <Link href="/brand/production/workshop2" title="Уведомления Workshop2">
        <Bell className="h-4 w-4" aria-hidden />
        <span className="sr-only">Уведомления Workshop2</span>
        {count > 0 ? (
          <Badge
            variant="destructive"
            className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[9px]"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        ) : null}
      </Link>
    </Button>
  );
}
