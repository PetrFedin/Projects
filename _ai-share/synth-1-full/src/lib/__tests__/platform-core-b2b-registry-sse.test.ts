import { formatPlatformCoreB2bRegistrySseData } from '@/lib/platform-core-b2b-registry-sse';

describe('platform-core-b2b-registry-sse', () => {
  it('форматирует registry_update для EventSource', () => {
    const chunk = formatPlatformCoreB2bRegistrySseData({
      type: 'registry_update',
      ts: '2026-06-10T12:00:00.000Z',
      reason: 'b2b.order.status_changed',
    });
    expect(chunk).toContain('registry_update');
    expect(chunk.endsWith('\n\n')).toBe(true);
  });
});
