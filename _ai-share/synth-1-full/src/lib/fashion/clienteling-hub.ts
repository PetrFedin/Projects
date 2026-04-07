import type { B2BClientelingV1 } from './types';

/** Хаб персонального взаимодействия с B2B партнерами. */
export function getB2BClientelingData(partnerId: string): B2BClientelingV1 {
  return {
    partnerId,
    lastInteractionDate: '2026-03-25',
    preferredCategories: ['Outerwear', 'Knitwear'],
    totalLifetimeValue: 12500000,
    unlockedPerks: ['Priority Production Slot', 'Extended Credit Line'],
    nextSuggestedMeeting: '2026-04-15',
  };
}

export function logInteraction(partnerId: string, notes: string): void {
  console.log(`Log interaction for ${partnerId}: ${notes}`);
}
