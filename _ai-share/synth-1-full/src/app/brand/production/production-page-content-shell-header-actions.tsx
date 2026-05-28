'use client';

import { Bell, Calendar, MessageSquare, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentShellHeaderActions({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { perms, activeTab, setActiveTab, setIsAutoPOOpen, notificationsList } = px;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div
        className={cn(cabinetSurface.groupTabList, 'h-auto min-h-9 flex-wrap items-center gap-0.5')}
      >
        <Button
          onClick={() => setActiveTab?.('chat')}
          variant="ghost"
          className={cn(
            'h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
            activeTab === 'chat'
              ? 'text-accent-primary border-accent-primary/20 bg-white shadow-sm'
              : 'text-text-secondary hover:bg-white'
          )}
        >
          <MessageSquare className="h-3 w-3" /> Чат
        </Button>
        <Button
          onClick={() => setActiveTab?.('calendar')}
          variant="ghost"
          className={cn(
            'h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
            activeTab === 'calendar'
              ? 'text-text-primary border-border-default bg-white shadow-sm'
              : 'text-text-secondary hover:bg-white'
          )}
        >
          <Calendar className="text-text-muted h-3 w-3" /> Календарь
        </Button>
      </div>
      {perms?.canCreatePO && (
        <Button
          onClick={() => setIsAutoPOOpen?.(true)}
          className="bg-text-primary h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-black"
        >
          <Package className="text-accent-primary h-3 w-3" />
          <span>Новый PO</span>
        </Button>
      )}
      <div
        className={cn(cabinetSurface.groupTabList, 'h-auto min-h-9 flex-wrap items-center gap-0.5')}
      >
        <Button
          onClick={() => setActiveTab?.('notifications')}
          variant="ghost"
          className={cn(
            'relative h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
            activeTab === 'notifications'
              ? 'text-accent-primary bg-white shadow-sm'
              : 'text-text-secondary hover:bg-white'
          )}
        >
          <Bell className="h-3 w-3" />
          {(notificationsList || []).filter((n: any) => !n.read).length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
              {(notificationsList || []).filter((n: any) => !n.read).length}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
