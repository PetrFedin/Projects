/** Локальные prefs уведомлений comms (до PG API). Platform Core shop — честный stub. */

export type PlatformCoreCommsNotificationPrefs = {
  orderStatus: boolean;
  chatMessages: boolean;
  calendarReminders: boolean;
};

export const PLATFORM_CORE_SHOP_COMMS_NOTIFICATION_PREFS_KEY =
  'platform-core:shop-comms-notification-prefs';

export const DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS: PlatformCoreCommsNotificationPrefs =
  {
    orderStatus: true,
    chatMessages: true,
    calendarReminders: true,
  };

export function readPlatformCoreCommsNotificationPrefs(): PlatformCoreCommsNotificationPrefs {
  if (typeof window === 'undefined') return DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS;
  try {
    const raw = localStorage.getItem(PLATFORM_CORE_SHOP_COMMS_NOTIFICATION_PREFS_KEY);
    if (!raw) return DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS;
    const parsed = JSON.parse(raw) as Partial<PlatformCoreCommsNotificationPrefs>;
    return {
      orderStatus: parsed.orderStatus !== false,
      chatMessages: parsed.chatMessages !== false,
      calendarReminders: parsed.calendarReminders !== false,
    };
  } catch {
    return DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS;
  }
}

export function writePlatformCoreCommsNotificationPrefs(
  prefs: PlatformCoreCommsNotificationPrefs
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLATFORM_CORE_SHOP_COMMS_NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}
