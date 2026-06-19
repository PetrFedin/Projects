/**
 * Wave C2 · JOOR shipment outbound + spine tracking mirror (F-TRACKING OUT).
 */
import 'server-only';

import {
  getJoorConfigFromEnv,
  joorPushOrderShipment,
} from '@/lib/b2b/integrations/archive/joor-api';
import {
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { findImportedOrderByExternalKey } from './imported-orders-persistence';
import { getIntegrationMetaForOrder } from './integration-meta-persistence.file';
import { syncJoorTracking } from './order-tracking.service';
import type { OrderTrackingShipment } from './order-tracking-persistence.file';

export type JoorShipmentSpineInput = {
  wholesaleOrderId?: string;
  externalOrderId?: string;
  trackingNumber?: string;
  carrier?: string;
  status?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  organizationId?: string;
};

export type JoorShipmentSpineResult = {
  wholesaleOrderId: string;
  shipment: OrderTrackingShipment;
  joorOutbound?: { success: boolean; error?: string };
};

function resolveWholesaleOrderId(input: JoorShipmentSpineInput): string | null {
  const direct = input.wholesaleOrderId?.trim();
  if (direct) return direct;
  const ext = input.externalOrderId?.trim();
  if (!ext) return null;
  return findImportedOrderByExternalKey('joor', ext)?.wholesaleOrderId ?? null;
}

export async function pushJoorShipmentSpine(
  input: JoorShipmentSpineInput
): Promise<JoorShipmentSpineResult | null> {
  const wholesaleOrderId = resolveWholesaleOrderId(input);
  if (!wholesaleOrderId) return null;

  const org = input.organizationId?.trim() || 'org-brand-001';
  const meta = getIntegrationMetaForOrder(wholesaleOrderId);
  const externalOrderId = meta?.externalOrderId ?? input.externalOrderId?.trim();

  const shipment = syncJoorTracking({
    wholesaleOrderId,
    trackingNumber: input.trackingNumber,
    carrier: input.carrier,
    status: input.status,
    shippedAt: input.shippedAt,
    estimatedDelivery: input.estimatedDelivery,
  });

  let joorOutbound: JoorShipmentSpineResult['joorOutbound'];
  if (externalOrderId) {
    const outbound = await joorPushOrderShipment(
      externalOrderId,
      {
        trackingNumber: input.trackingNumber,
        carrier: input.carrier,
        status: input.status ?? 'shipped',
        shippedAt: input.shippedAt,
      },
      getJoorConfigFromEnv()
    );
    joorOutbound = { success: outbound.success, error: outbound.error };
  }

  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
    contextId: workshop2B2bOrderContextId(wholesaleOrderId),
    message: `JOOR shipment · ${shipment.trackingNumber ?? 'tracking'} · shop mirror обновлён.`,
  });

  return { wholesaleOrderId, shipment, joorOutbound };
}
