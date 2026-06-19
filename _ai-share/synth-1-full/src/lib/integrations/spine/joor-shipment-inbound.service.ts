/**
 * Wave C2 · JOOR inbound shipment → spine shop tracking (F-TRACKING IN).
 */
import 'server-only';

import {
  getJoorConfigFromEnv,
  joorFetchOrderShipments,
} from '@/lib/b2b/integrations/archive/joor-api';
import {
  WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
  workshop2B2bOrderContextId,
} from '@/lib/production/workshop2-b2b-order-lifecycle';
import { appendWorkshop2ContextualSystemMessage } from '@/lib/server/workshop2-contextual-messages-repository';
import { findImportedOrderByExternalKey } from './imported-orders-persistence';
import { getIntegrationMetaForOrder } from './integration-meta-persistence.file';
import { upsertExternalRef } from './integration-external-refs-persistence.file';
import { syncJoorTracking } from './order-tracking.service';
import { integrationPlatformLabelRu } from './integration-ui-utils';
import type { OrderTrackingShipment } from './order-tracking-persistence.file';

export type JoorInboundImportInput = {
  wholesaleOrderId?: string;
  externalOrderId?: string;
  shipment?: {
    trackingNumber?: string;
    carrier?: string;
    status?: string;
    shippedAt?: string;
    estimatedDelivery?: string;
  };
  organizationId?: string;
};

export type JoorInboundImportResult = {
  wholesaleOrderId: string;
  shipment: OrderTrackingShipment;
  source: 'webhook' | 'platform_fetch';
};

function resolveWholesaleOrderId(input: JoorInboundImportInput): string | null {
  const direct = input.wholesaleOrderId?.trim();
  if (direct) return direct;
  const ext = input.externalOrderId?.trim();
  if (!ext) return null;
  return findImportedOrderByExternalKey('joor', ext)?.wholesaleOrderId ?? null;
}

export async function importJoorShipmentInbound(
  input: JoorInboundImportInput
): Promise<JoorInboundImportResult | null> {
  const wholesaleOrderId = resolveWholesaleOrderId(input);
  if (!wholesaleOrderId) return null;

  const org = input.organizationId?.trim() || 'org-brand-001';
  const meta = getIntegrationMetaForOrder(wholesaleOrderId);
  const externalOrderId = meta?.externalOrderId ?? input.externalOrderId?.trim();

  let trackingNumber = input.shipment?.trackingNumber;
  let carrier = input.shipment?.carrier;
  let status = input.shipment?.status;
  let shippedAt = input.shipment?.shippedAt;
  let estimatedDelivery = input.shipment?.estimatedDelivery;
  let source: JoorInboundImportResult['source'] = 'webhook';

  if (!trackingNumber && externalOrderId) {
    const config = getJoorConfigFromEnv();
    if (config) {
      const fetched = await joorFetchOrderShipments(externalOrderId, config);
      const hit = fetched.shipments[0];
      if (hit) {
        trackingNumber = hit.trackingNumber;
        carrier = hit.carrier;
        status = hit.status;
        shippedAt = hit.shippedAt;
        estimatedDelivery = hit.estimatedDelivery;
        source = 'platform_fetch';
      }
    }
  }

  if (!trackingNumber?.trim() && !status?.trim()) return null;

  const shipment = syncJoorTracking({
    wholesaleOrderId,
    trackingNumber,
    carrier,
    status: status ?? 'in_transit',
    shippedAt,
    estimatedDelivery,
  });

  if (externalOrderId) {
    upsertExternalRef({
      platform: 'joor',
      externalId: `shipment:${externalOrderId}`,
      synthaEntityType: 'wholesale_order',
      synthaEntityId: wholesaleOrderId,
      lastSyncedAt: new Date().toISOString(),
      syncDirection: 'inbound',
    });
  }

  const channelLabel = integrationPlatformLabelRu('joor');
  await appendWorkshop2ContextualSystemMessage({
    organizationId: org,
    contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
    contextId: workshop2B2bOrderContextId(wholesaleOrderId),
    message: `Inbound отгрузка · ${channelLabel} · ${shipment.trackingNumber ?? 'статус'} · mirror shop.`,
  });

  return { wholesaleOrderId, shipment, source };
}
