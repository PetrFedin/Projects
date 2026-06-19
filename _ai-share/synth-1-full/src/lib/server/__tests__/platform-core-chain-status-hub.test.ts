import {
  bumpPlatformCoreChainStatus,
  subscribePlatformCoreChainStatus,
} from '@/lib/server/platform-core-chain-status-hub';

jest.mock('@/lib/server/workshop2-redis-pubsub', () => ({
  isWorkshop2RedisConfigured: jest.fn(() => false),
  publishWorkshop2RedisEvent: jest.fn(),
  subscribeWorkshop2RedisRoom: jest.fn(),
}));

describe('platform-core-chain-status-hub', () => {
  it('уведомляет локальных подписчиков при bump', () => {
    const listener = jest.fn();
    const unsubscribe = subscribePlatformCoreChainStatus(listener);
    bumpPlatformCoreChainStatus(['ORD-1']);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    bumpPlatformCoreChainStatus(['ORD-1']);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
