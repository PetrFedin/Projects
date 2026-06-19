import { SECTION_AUDIT, EMPTY_SECTION_AUDIT } from '@/lib/platform-core-readiness-sections';
import {
  findCommsSectionAuditViolations,
  isPlatformCoreCommsSectionAuditId,
  looksLikeCommsWorkspaceSectionId,
} from '@/lib/platform-core-comms-canon';

describe('platform-core-comms-canon', () => {
  it('comms section ids use -cm- prefix', () => {
    expect(isPlatformCoreCommsSectionAuditId('brand-cm-order-chat')).toBe(true);
    expect(isPlatformCoreCommsSectionAuditId('shop-co-matrix')).toBe(false);
  });

  it('SECTION_AUDIT: chat/calendar sections only in comms pillar', () => {
    const violations = [
      ...findCommsSectionAuditViolations(SECTION_AUDIT),
      ...findCommsSectionAuditViolations(EMPTY_SECTION_AUDIT),
    ];
    expect(violations).toEqual([]);
  });

  it('detects chat section outside comms', () => {
    const fake = {
      shop: {
        collection_order: [{ id: 'shop-co-illegal-chat' }],
      },
    };
    expect(findCommsSectionAuditViolations(fake)).toHaveLength(1);
    expect(looksLikeCommsWorkspaceSectionId('shop-co-illegal-chat')).toBe(true);
    expect(looksLikeCommsWorkspaceSectionId('shop-sc-comms-peer')).toBe(false);
  });
});
