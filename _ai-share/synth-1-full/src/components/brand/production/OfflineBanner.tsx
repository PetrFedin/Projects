'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '@/hooks/useOffline';
import { cn } from '@/lib/utils';

export function OfflineBanner() {
  const { isOffline, pendingSyncCount } = useOffline();

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3',
        'bg-amber-500 text-white py-2 px-4 text-[11px] font-bold uppercase tracking-wider',
        'shadow-lg'
      )}
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Офлайн-режим. Изменения будут синхронизированы при восстановлении сети.</span>
      {pendingSyncCount > 0 && (
        <span className="bg-white/20 px-2 py-0.5 rounded">{pendingSyncCount} в очереди</span>
      )}
    </div>
  );
}
