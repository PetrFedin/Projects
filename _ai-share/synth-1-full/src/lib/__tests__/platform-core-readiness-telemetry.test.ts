import { buildReadinessTelemetrySnapshot } from '@/lib/platform-core-readiness-telemetry';

describe('platform-core-readiness-telemetry', () => {
  it('строит строку из chain-overview без изменения оценок', () => {
    const snap = buildReadinessTelemetrySnapshot({
      pillars: [
        { id: 'development', done: true },
        { id: 'sample_collection', done: true },
        { id: 'collection_order', done: false },
        { id: 'order_production', done: false },
        { id: 'comms', done: true },
      ],
      commsThreadCount: 4,
    });
    expect(snap?.pillarsDone).toBe(3);
    expect(snap?.pillarsTotal).toBe(5);
    expect(snap?.lineRu).toContain('3/5');
    expect(snap?.lineRu).toContain('ручной аудит');
    expect(snap?.lineRu).not.toMatch(/9\.|9\/10/);
  });

  it('null при пустом overview', () => {
    expect(buildReadinessTelemetrySnapshot(null)).toBeNull();
  });
});
