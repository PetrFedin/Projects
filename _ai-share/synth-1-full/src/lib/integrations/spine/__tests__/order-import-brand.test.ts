import { resolveSpineImportBrandName } from '../order-import.service';
import { WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID } from '@/lib/production/workshop2-tz-signatory-options';

describe('resolveSpineImportBrandName', () => {
  it('uses payload brand when demo-canonical', () => {
    expect(
      resolveSpineImportBrandName({
        organizationId: WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID,
        brandFromPayload: 'Nordic Wool',
      })
    ).toBe('Nordic Wool');
  });

  it('resolves from organizationId not hardcoded DEMO_BRAND', () => {
    const name = resolveSpineImportBrandName({
      organizationId: WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID,
    });
    expect(name).toBe('Syntha Lab');
  });
});
