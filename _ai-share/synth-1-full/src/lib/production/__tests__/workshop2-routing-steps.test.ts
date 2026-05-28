import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  buildWorkshop2RoutingStepsFromDossier,
  syncWorkshop2RoutingStepsOnDossier,
} from '@/lib/production/workshop2-routing-steps';

describe('workshop2-routing-steps', () => {
  it('builds routingSteps from smartRoutingSequence', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [
        { id: '1', category: 'Монтаж', name: 'Стачать боковые', equipment: 'Оверлок', sash: 3 },
      ],
      sewingPlan: { partnerLabel: 'Фабрика А' },
    };
    const steps = buildWorkshop2RoutingStepsFromDossier(dossier);
    expect(steps).toHaveLength(1);
    expect(steps[0]?.source).toBe('smart_routing');
    expect(steps[0]?.partnerLabel).toBe('Фабрика А');
    expect(steps[0]?.sashMin).toBe(3);
  });

  it('syncWorkshop2RoutingStepsOnDossier writes routingSteps for TZ export', () => {
    const base = emptyWorkshop2DossierPhase1();
    const synced = syncWorkshop2RoutingStepsOnDossier({
      ...base,
      smartRoutingSequence: [
        { id: 'a', category: 'Отделка', name: 'ВТО', equipment: 'Стол', sash: 2 },
        { id: 'b', category: 'Отделка', name: 'Упаковка', equipment: 'Стол', sash: 1 },
      ],
    });
    expect(synced.routingSteps).toHaveLength(2);
    expect(synced.routingSteps?.[1]?.stepNo).toBe(2);
  });

  it('clears routingSteps when sequence emptied', () => {
    const synced = syncWorkshop2RoutingStepsOnDossier({
      ...emptyWorkshop2DossierPhase1(),
      smartRoutingSequence: [],
    });
    expect(synced.routingSteps).toBeUndefined();
  });
});
