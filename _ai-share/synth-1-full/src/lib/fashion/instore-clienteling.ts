import type { InStoreClientelingV1 } from './types';
import { INSTORE_CLIENTELING_DEMO_FIELDS } from '@/lib/fashion/clienteling-demo-fixtures';

/** Инструменты персонального обслуживания (Clienteling) в магазине. */
export function getClientStyleProfile(clientId: string): InStoreClientelingV1 {
  return { clientId, ...INSTORE_CLIENTELING_DEMO_FIELDS };
}
