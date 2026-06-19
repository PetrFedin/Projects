import {
  DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS,
  readPlatformCoreCommsNotificationPrefs,
  writePlatformCoreCommsNotificationPrefs,
} from '@/lib/platform-core-comms-notification-prefs';

describe('platform-core-comms-notification-prefs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults when empty', () => {
    expect(readPlatformCoreCommsNotificationPrefs()).toEqual(
      DEFAULT_PLATFORM_CORE_COMMS_NOTIFICATION_PREFS
    );
  });

  it('round-trips write', () => {
    writePlatformCoreCommsNotificationPrefs({
      orderStatus: false,
      chatMessages: true,
      calendarReminders: false,
    });
    expect(readPlatformCoreCommsNotificationPrefs()).toEqual({
      orderStatus: false,
      chatMessages: true,
      calendarReminders: false,
    });
  });
});
