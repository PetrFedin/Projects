/**
 * Wave C7/D4 · Zedonk agent consolidated → multiple INT-* spine orders.
 */
import 'server-only';

import { importWholesaleOrder } from './order-import.service';
import { upsertExternalRef } from './integration-external-refs-persistence.file';

export type ZedonkConsolidatedImportResult = {
  consolidatedId: string;
  imported: Array<{ brandId: string; externalOrderId: string; wholesaleOrderId: string }>;
};

export function importZedonkConsolidatedOrder(payload: {
  consolidatedId: string;
  brandOrders: Array<{ brandId: string; orderId: string; total?: number; source?: string }>;
}): ZedonkConsolidatedImportResult {
  const consolidatedId = payload.consolidatedId.trim();
  const imported: ZedonkConsolidatedImportResult['imported'] = [];

  for (const child of payload.brandOrders) {
    const externalOrderId = child.orderId.trim();
    const sourceTag = child.source ?? 'zedonk';
    const outcome = importWholesaleOrder({
      platform: 'zedonk',
      externalOrderId,
      raw: {
        id: externalOrderId,
        status: 'approved',
        customer_name: `Agent · ${child.brandId}`,
        total: child.total,
        source: sourceTag,
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 4, unit_price: 42000 }],
      },
    });
    imported.push({
      brandId: child.brandId,
      externalOrderId,
      wholesaleOrderId: outcome.wholesaleOrderId,
    });
  }

  upsertExternalRef({
    platform: 'zedonk',
    externalId: consolidatedId,
    synthaEntityType: 'wholesale_order',
    synthaEntityId: consolidatedId,
    lastSyncedAt: new Date().toISOString(),
    syncDirection: 'inbound',
  });

  return { consolidatedId, imported };
}
