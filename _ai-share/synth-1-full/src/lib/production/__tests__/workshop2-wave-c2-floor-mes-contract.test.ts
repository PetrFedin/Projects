/**
 * Block C — floor MES GET poll + reverse sync fail-closed (#58).
 */
import {
  buildWorkshop2FloorMesPollRequestUrl,
  evaluateWorkshop2FloorMesReverseSyncBlocked,
  isWorkshop2FloorMesConfigured,
  isWorkshop2FloorMesReverseSyncAllowed,
  parseWorkshop2FloorMesPollPayload,
  resolveWorkshop2FloorMesPollToOrderStatus,
  summarizeWorkshop2FloorMesChip,
} from '@/lib/production/workshop2-floor-mes';
import { buildWorkshop2FloorBridgeMirror } from '@/lib/production/workshop2-floor-bridge-dossier-persist';

describe('workshop2 wave-c2 — floor MES contract', () => {
  const prev = process.env.WORKSHOP2_FLOOR_MES_URL;

  afterEach(() => {
    if (prev === undefined) delete process.env.WORKSHOP2_FLOOR_MES_URL;
    else process.env.WORKSHOP2_FLOOR_MES_URL = prev;
  });

  it('fail-closed without WORKSHOP2_FLOOR_MES_URL', () => {
    delete process.env.WORKSHOP2_FLOOR_MES_URL;
    expect(isWorkshop2FloorMesConfigured()).toBe(false);
    expect(isWorkshop2FloorMesReverseSyncAllowed()).toBe(false);
    expect(evaluateWorkshop2FloorMesReverseSyncBlocked().blocked).toBe(true);
    const mirror = buildWorkshop2FloorBridgeMirror({
      orderStatus: 'in_progress',
      syncedAt: '2026-05-21T12:00:00.000Z',
      source: 'floor_api',
      floorTab: 'operations',
    });
    expect(mirror.reverseSyncEnabled).toBe(false);
    expect(mirror.floorMesPollState).toBe('fail_closed');
  });

  it('reverse sync enabled when URL set', () => {
    process.env.WORKSHOP2_FLOOR_MES_URL = 'https://mes.partner.test';
    const mirror = buildWorkshop2FloorBridgeMirror({
      orderStatus: 'approved',
      syncedAt: '2026-05-21T12:00:00.000Z',
      source: 'floor_api',
      floorTab: 'gold-sample',
    });
    expect(mirror.reverseSyncEnabled).toBe(true);
    expect(mirror.floorMesConfigured).toBe(true);
  });

  it('parses GET poll payload and maps floor tab', () => {
    const payload = parseWorkshop2FloorMesPollPayload({
      ok: true,
      floorTab: 'quality',
      syncedAt: '2026-05-21T12:00:00.000Z',
      idempotencyKey: 'k-1',
    });
    expect(payload?.floorTab).toBe('quality');
    expect(resolveWorkshop2FloorMesPollToOrderStatus(payload!)).toBe('received');
  });

  it('builds poll URL with query params', () => {
    process.env.WORKSHOP2_FLOOR_MES_URL = 'https://mes.example.test/';
    const url = buildWorkshop2FloorMesPollRequestUrl({
      collectionId: 'SS27',
      articleId: 'a1',
      orderId: 'ord-9',
    });
    expect(url).toContain('sample-status');
    expect(url).toContain('collectionId=SS27');
    expect(url).toContain('orderId=ord-9');
  });

  it('summarize floor chip states', () => {
    expect(
      summarizeWorkshop2FloorMesChip({ configured: false, pollState: 'fail_closed' }).labelRu
    ).toMatch(/fail-closed/i);
    expect(summarizeWorkshop2FloorMesChip({ configured: true, pollState: 'synced' }).tone).toBe(
      'emerald'
    );
  });
});
