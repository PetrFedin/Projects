'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';

/** Заглушка Push-уведомлений. Для масштабирования: backend, API, event sourcing. */
export function PushNotificationBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-sm">
      <Bell className="h-4 w-4 text-amber-600 shrink-0" />
      <span className="text-amber-800 truncate hidden sm:inline">
        {subscribed ? 'Уведомления включены (демо)' : 'Push на телефон — включить?'}
      </span>
      {!subscribed ? (
        <Button
          variant="outline"
          size="sm"
          className="border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0"
          onClick={() => setSubscribed(true)}
        >
          Включить
        </Button>
      ) : null}
      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setDismissed(true)}>
        <X className="h-3.5 w-3" />
      </Button>
    </div>
  );
}
