'use client';

import { useEffect, useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import {
  DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS,
  readPlatformCoreCommsNotificationPrefs,
  writePlatformCoreCommsNotificationPrefs,
  type PlatformCoreCommsNotificationPrefs,
} from '@/lib/platform-core-comms-notification-prefs';

type Props = {
  compact?: boolean;
};

/** Shop comms: локальные prefs до PG API (честный stub). */
export function PlatformCoreShopCommsNotificationPrefsStrip({ compact = false }: Props) {
  const [prefs, setPrefs] = useState<PlatformCoreCommsNotificationPrefs>(
    DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS
  );

  useEffect(() => {
    setPrefs(readPlatformCoreCommsNotificationPrefs());
  }, []);

  if (!isPlatformCoreMode()) return null;

  const update = (patch: Partial<PlatformCoreCommsNotificationPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      writePlatformCoreCommsNotificationPrefs(next);
      return next;
    });
  };

  if (compact) {
    return (
      <details
        className="text-text-muted text-[10px]"
        data-testid="shop-cm-notification-prefs-compact"
      >
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 hover:underline [&::-webkit-details-marker]:hidden">
          <Settings2 className="h-3 w-3" aria-hidden />
          Настройки
        </summary>
        <div className="border-border-subtle mt-1 space-y-1 rounded border bg-white/80 p-2">
          <p className="text-text-muted text-[9px] leading-snug">
            Локально до PG prefs API — не влияет на push/SSE.
          </p>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={prefs.orderStatus}
              onCheckedChange={(v) => update({ orderStatus: v === true })}
              data-testid="shop-cm-notification-pref-order-status"
            />
            <span>Статус заказа</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={prefs.chatMessages}
              onCheckedChange={(v) => update({ chatMessages: v === true })}
              data-testid="shop-cm-notification-pref-chat"
            />
            <span>Сообщения чата</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={prefs.calendarReminders}
              onCheckedChange={(v) => update({ calendarReminders: v === true })}
              data-testid="shop-cm-notification-pref-calendar"
            />
            <span>Календарь</span>
          </label>
        </div>
      </details>
    );
  }

  return (
    <div
      className="border-border-subtle space-y-2 rounded-lg border bg-white/90 p-2.5"
      data-testid="shop-cm-notification-prefs"
    >
      <div className="flex items-center gap-2">
        <Settings2 className="text-text-muted h-3.5 w-3.5" aria-hidden />
        <Label className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
          Настройки уведомлений
        </Label>
      </div>
      <p className="text-text-muted text-[10px] leading-snug">
        Сохраняется локально — PG prefs API в roadmap.
      </p>
      <label className="flex items-center gap-2 text-xs">
        <Checkbox
          checked={prefs.orderStatus}
          onCheckedChange={(v) => update({ orderStatus: v === true })}
          data-testid="shop-cm-notification-pref-order-status"
        />
        Статус оптового заказа
      </label>
      <label className="flex items-center gap-2 text-xs">
        <Checkbox
          checked={prefs.chatMessages}
          onCheckedChange={(v) => update({ chatMessages: v === true })}
          data-testid="shop-cm-notification-pref-chat"
        />
        Новые сообщения в чате
      </label>
      <label className="flex items-center gap-2 text-xs">
        <Checkbox
          checked={prefs.calendarReminders}
          onCheckedChange={(v) => update({ calendarReminders: v === true })}
          data-testid="shop-cm-notification-pref-calendar"
        />
        Напоминания календаря
      </label>
    </div>
  );
}
