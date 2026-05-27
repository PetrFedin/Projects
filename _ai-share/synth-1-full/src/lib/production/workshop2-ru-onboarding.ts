/**
 * Wave 10 RU: onboarding hub (5 шагов, dismissible, localStorage).
 */
export const WORKSHOP2_RU_ONBOARDING_LS_KEY = 'w2-ru-onboarding-dismissed';

export type Workshop2RuOnboardingStep = {
  id: string;
  titleRu: string;
  bodyRu: string;
  w2pane?: string;
};

export const WORKSHOP2_RU_ONBOARDING_STEPS: Workshop2RuOnboardingStep[] = [
  {
    id: 'tz',
    titleRu: 'Техническое задание',
    bodyRu: 'Заполните паспорт, BOM и визуал — ₽ costing синхронизируется автоматически.',
    w2pane: 'tz',
  },
  {
    id: 'sample',
    titleRu: 'Образец',
    bodyRu: 'Sample order и Gold Sample на вкладке «Посадка» — без лишних переходов.',
    w2pane: 'fit',
  },
  {
    id: 'edo',
    titleRu: 'ЭДО',
    bodyRu: 'Mock/staging: подпись разблокирует handoff; Контур/СБИС — только при URL.',
    w2pane: 'fit',
  },
  {
    id: 'marking',
    titleRu: 'Маркировка',
    bodyRu: 'Честный ЗНАК: журнал + CSV в ЛК; без fake ACK от ЦРПТ.',
    w2pane: 'tz',
  },
  {
    id: 'b2b',
    titleRu: 'B2B в ₽',
    bodyRu: 'Опт, MOQ из досье, счёт-оферта и территории с кредитным лимитом в рублях.',
    w2pane: 'plan',
  },
];

export function isWorkshop2RuOnboardingDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(WORKSHOP2_RU_ONBOARDING_LS_KEY) === '1';
  } catch {
    return true;
  }
}

export function dismissWorkshop2RuOnboarding(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WORKSHOP2_RU_ONBOARDING_LS_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function shouldShowWorkshop2RuOnboardingBanner(
  market: 'ru' | 'global' | undefined
): boolean {
  if (market !== 'ru') return false;
  return !isWorkshop2RuOnboardingDismissed();
}
