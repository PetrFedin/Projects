/**
 * Phase 1B UX — heuristic risk gate + unified dossier persist label contract.
 */
import {
  isWorkshop2ShowHeuristicRiskEnabled,
  isWorkshop2ShowVendorBiddingEnabled,
} from '@/lib/production/workshop2-show-heuristic-risk';
import { W2_DOSSIER_PERSIST_LABEL } from '@/components/brand/production/Workshop2DossierPersistButton';

describe('workshop2 ux phase1b — heuristic risk gate', () => {
  it('isWorkshop2ShowHeuristicRiskEnabled defaults to false', () => {
    expect(isWorkshop2ShowHeuristicRiskEnabled({})).toBe(false);
  });

  it('isWorkshop2ShowHeuristicRiskEnabled respects server env flag', () => {
    expect(isWorkshop2ShowHeuristicRiskEnabled({ WORKSHOP2_SHOW_HEURISTIC_RISK: 'true' })).toBe(
      true
    );
    expect(isWorkshop2ShowHeuristicRiskEnabled({ WORKSHOP2_SHOW_HEURISTIC_RISK: '1' })).toBe(true);
  });

  it('isWorkshop2ShowHeuristicRiskEnabled respects public env flag', () => {
    expect(
      isWorkshop2ShowHeuristicRiskEnabled({
        NEXT_PUBLIC_WORKSHOP2_SHOW_HEURISTIC_RISK: 'true',
      })
    ).toBe(true);
  });

  it('isWorkshop2ShowVendorBiddingEnabled defaults to false', () => {
    expect(isWorkshop2ShowVendorBiddingEnabled({})).toBe(false);
  });

  it('isWorkshop2ShowVendorBiddingEnabled respects env flag', () => {
    expect(isWorkshop2ShowVendorBiddingEnabled({ WORKSHOP2_SHOW_VENDOR_BIDDING: 'true' })).toBe(
      true
    );
  });
});

describe('workshop2 ux phase1b — dossier persist label', () => {
  it('W2_DOSSIER_PERSIST_LABEL is stable Russian copy', () => {
    expect(W2_DOSSIER_PERSIST_LABEL).toBe('Сохранить в досье');
  });
});
