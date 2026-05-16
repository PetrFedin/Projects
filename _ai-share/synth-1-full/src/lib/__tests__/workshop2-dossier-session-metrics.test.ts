import {
  formatW2DossierMetricsFooterLine,
  getW2DossierPersistStats,
  recordW2DossierPersistFailure,
  recordW2DossierPersistSuccess,
  touchW2DossierSessionOpenedAt,
} from '@/lib/production/workshop2-dossier-session-metrics';

describe('workshop2-dossier-session-metrics persist', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('records failures and preserves them across success', () => {
    touchW2DossierSessionOpenedAt('C', 'A');
    recordW2DossierPersistFailure('C', 'A');
    recordW2DossierPersistFailure('C', 'A');
    recordW2DossierPersistSuccess('C', 'A');
    const st = getW2DossierPersistStats('C', 'A');
    expect(st?.successCount).toBe(1);
    expect(st?.persistFailureCount).toBe(2);
    const line = formatW2DossierMetricsFooterLine('C', 'A');
    expect(line).toMatch(/сбоев записи: 2/);
  });
});
