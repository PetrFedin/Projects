import { formatShopB2bTrackingReserveLabelRu } from '@/lib/platform-core-tracking-reserve-label';

describe('formatShopB2bTrackingReserveLabelRu', () => {
  it('показывает количество при активном резерве', () => {
    const r = formatShopB2bTrackingReserveLabelRu({
      status: 'allocated',
      handedOff: true,
      inventoryReserved: true,
      inventoryReservedQty: 120,
    });
    expect(r.text).toContain('120');
    expect(r.tone).toBe('ok');
  });

  it('честно про WMS off', () => {
    const r = formatShopB2bTrackingReserveLabelRu({
      status: 'confirmed',
      handedOff: true,
      inventoryReserved: false,
      inventoryReserveReason: 'internal_wms_disabled',
    });
    expect(r.text).toContain('WMS');
    expect(r.tone).toBe('muted');
  });
});
