'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { useToast } from '@/hooks/use-toast';

/** Wave 28: ручная синхронизация domain-events outbox (setup only). */
export function Workshop2DomainEventsSyncButton() {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const sync = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/workshop2/domain-events/process', {
        method: 'POST',
        headers: buildWorkshop2ApiRequestHeaders(),
      });
      const json = (await res.json()) as { messageRu?: string; processed?: number; ok?: boolean };
      const description =
        json.messageRu ??
        (res.ok
          ? `Обработано событий: ${json.processed ?? 0}`
          : 'Не удалось синхронизировать outbox');
      toast({
        title: res.ok ? 'События синхронизированы' : 'Ошибка синхронизации',
        description,
        variant: res.ok ? 'default' : 'destructive',
      });
    } catch {
      toast({
        title: 'Сеть недоступна',
        description: 'POST /api/workshop2/domain-events/process не ответил.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={busy}
      onClick={() => void sync()}
      data-testid="workshop2-domain-events-sync-button"
    >
      {busy ? 'Синхронизация…' : 'Синхронизировать события'}
    </Button>
  );
}
