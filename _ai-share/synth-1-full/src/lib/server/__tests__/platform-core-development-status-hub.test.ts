import {
  bumpPlatformCoreDevelopmentStatus,
  subscribePlatformCoreDevelopmentStatus,
} from '@/lib/server/platform-core-development-status-hub';

jest.mock('@/lib/server/workshop2-redis-pubsub', () => ({
  isWorkshop2RedisConfigured: jest.fn(() => false),
  publishWorkshop2RedisEvent: jest.fn(),
  subscribeWorkshop2RedisRoom: jest.fn(),
}));

describe('platform-core-development-status-hub', () => {
  it('уведомляет локальных подписчиков при bump', () => {
    const listener = jest.fn();
    const unsubscribe = subscribePlatformCoreDevelopmentStatus(listener);
    bumpPlatformCoreDevelopmentStatus(['SS27']);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    bumpPlatformCoreDevelopmentStatus(['SS27']);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
