import {
  bumpPlatformCoreCommsInbox,
  subscribePlatformCoreCommsInbox,
} from '@/lib/server/platform-core-comms-inbox-hub';

jest.mock('@/lib/server/workshop2-redis-pubsub', () => ({
  isWorkshop2RedisConfigured: jest.fn(() => false),
  publishWorkshop2RedisEvent: jest.fn(),
  subscribeWorkshop2RedisRoom: jest.fn(),
}));

describe('platform-core-comms-inbox-hub', () => {
  it('уведомляет локальных подписчиков при bump', () => {
    const listener = jest.fn();
    const unsubscribe = subscribePlatformCoreCommsInbox(listener);
    bumpPlatformCoreCommsInbox('contextual_message');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    bumpPlatformCoreCommsInbox('contextual_message');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
