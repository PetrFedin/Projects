/**
 * @jest-environment node
 */
import {
  W2_SECTION_SIGNOFF_PCT_THRESHOLD,
  W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF,
} from '@/components/brand/production/Workshop2TzSectionTabIndicator';

describe('workshop2 tz signoff thresholds', () => {
  it('keeps per-section gates in 0..100', () => {
    for (const v of Object.values(W2_SECTION_SIGNOFF_PCT_THRESHOLD)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('documents four-tab average gate separately from per-section map', () => {
    expect(W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF).toBeGreaterThanOrEqual(0);
    expect(W2_TZ_FOUR_TABS_AVG_FILL_PCT_MIN_FOR_DIGITAL_SIGNOFF).toBeLessThanOrEqual(100);
  });
});
