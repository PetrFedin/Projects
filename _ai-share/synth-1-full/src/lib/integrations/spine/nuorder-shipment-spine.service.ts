/**
 * Wave C2 · NuOrder shipment outbound + spine tracking mirror (F-TRACKING).
 */
import 'server-only';

import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerSendShipment } from '@/lib/b2b/integrations/archive/nuorder-server';
import {
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { findImportedOrderByExternalKey } from './imported-orders-persistence';
import { getIntegrationMetaForOrder } from './integration-meta-persistence.file';
import { syncNuOrderTracking } from './order-tracking.service';
import type { OrderTrackingShipment } from './order-tracking-persistence.file';

export type NuOrderShipmentSpineInput = {
  wholesaleOrderId?: string;
  externalOrderId?: string;
  trackingNumber?: string;
  carrier?: string;
  status?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  organizationId?: string;
};

export type NuOrderShipmentSpineResult = {
  wholesaleOrderId: string;
  shipment: OrderTrackingShipment;
  nuorderOutbound?: { success: boolean; error?: string };
};

function resolveWholesaleOrderId(input: NuOrderShipmentSpineInput): string | null {
  const direct = input.wholesaleOrderId?.trim();
  if (direct) return direct;
  const ext = input.externalOrderId?.trim();
  if (!ext) return null;
  return findImportedOrderByExternalKey('nuorder', ext)?.wholesaleOrderId ?? null;
}

export async function pushNuOrderShipmentSpine(
  input: NuOrderShipmentSpineInput
): Promise<NuOrderShipmentSpineResult | null> {
  const wholesaleOrderId = resolveWholesaleOrderId(input);
  if (!wholesaleOrderId) return null;

  const org = input.organizationId?.trim() || 'org-brand-001';
  const meta = getIntegrationMetaForOrder(wholesaleOrderId);
  const externalOrderId = meta?.externalOrderId ?? input.externalOrderId?.trim();

  const shipment = syncNuOrderTracking({
    wholesaleOrderId,
    trackingNumber: input.trackingNumber,
    carrier: input.carrier,
    status: input.status,
    shippedAt: input.shippedAt,
    estimatedDelivery: input.estimatedDelivery,
  });

  let nuorderOutbound: NuOrderShipmentSpineResult['nuorderOutbound'];
  const config = getNuOrderConfigFromEnv();
  if (config && externalOrderId) {
    const outbound = await nuorderServerSendShipment(config, {
      order_id: externalOrderId,
      tracking_number: input.trackingNumber,
      carrier: input.carrier,
      status: input.status ?? 'shipped',
      shipped_at: input.shippedAt,
    });
    nuorderOutbound = { success: outbound.success, error: outbound.error };
  }

  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
    contextId: workshop2B2bOrderContextId(wholesaleOrderId),
    message: `NuOrder shipment · ${shipment.trackingNumber ?? 'tracking'} · shop mirror обновлён.`,
  });

  return { wholesaleOrderId, shipment, nuorderOutbound };
}
