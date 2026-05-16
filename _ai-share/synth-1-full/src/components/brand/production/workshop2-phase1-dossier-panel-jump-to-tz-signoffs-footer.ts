import type { Dispatch, SetStateAction } from 'react';
import { isWorkshop2TzSectionTabDoneForUi } from '@/components/brand/production/Workshop2TzSectionTabIndicator';
import type {
  Workshop2DossierPhase1,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';

type SignoffKey = 'general' | 'visuals' | 'material' | 'construction';

/** Прокрутка к блоку цифровых подписей / первой незакрытой секции подписи в футере. */
export function jumpToTzSignoffsAreaFooterAction(p: {
  isPhase1: boolean;
  dossier: Workshop2DossierPhase1;
  sectionReadinessUi: Partial<Record<SignoffKey, { pct?: number }>>;
  setActiveSection: Dispatch<SetStateAction<Workshop2TzSignoffSectionKey>>;
}): void {
  const { isPhase1, dossier, sectionReadinessUi, setActiveSection } = p;

  if (!isPhase1) {
    document
      .getElementById('w2-tz-digital-signoffs')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const order: { signoff: SignoffKey; tab: Workshop2TzSignoffSectionKey }[] = [
    { signoff: 'general', tab: 'general' },
    { signoff: 'visuals', tab: 'construction' },
    { signoff: 'material', tab: 'material' },
    { signoff: 'construction', tab: 'construction' },
  ];
  for (const { signoff, tab } of order) {
    const pct = sectionReadinessUi[signoff]?.pct ?? 0;
    if (!isWorkshop2TzSectionTabDoneForUi(signoff, dossier.sectionSignoffs, pct, dossier)) {
      setActiveSection(tab);
      queueMicrotask(() => {
        document
          .getElementById(`w2-tz-section-signoff-${signoff}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
  }
  setActiveSection('general');
  queueMicrotask(() => {
    document
      .getElementById('w2-tz-section-signoff-general')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
