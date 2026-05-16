import type { B2BClientelingV1 } from './types';
import { B2B_CLIENTELING_DEMO_FIELDS } from '@/lib/fashion/clienteling-demo-fixtures';

/** Хаб персонального взаимодействия с B2B партнерами. */
export function getB2BClientelingData(partnerId: string): B2BClientelingV1 {
  return { partnerId, ...B2B_CLIENTELING_DEMO_FIELDS };
}

export function logInteraction(partnerId: string, notes: string): void {
  console.log(`Log interaction for ${partnerId}: ${notes}`);
}
