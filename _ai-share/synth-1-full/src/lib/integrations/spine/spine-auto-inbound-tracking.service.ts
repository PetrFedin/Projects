/**
 * Wave C2/D2 · auto-pull inbound shipment tracking when WIP ships or on handoff seed.
 */
import 'server-only';

import { getOrderTracking } from './order-tracking-persistence.file';
import {
  ensureSpineOperationalStoreReady,
  SPINE_TRACKING_READ_SCOPES,
} from './spine-operational-store';
import { getIntegrationMetaForOrder } from './integration-meta-persistence.file';
import { patchImportedOrderStatus } from './imported-orders-persistence';
import { importNuOrderShipmentInbound } from './nuorder-shipment-inbound.service';
import { importJoorShipmentInbound } from './joor-shipment-inbound.service';
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';
import type { OrderTrackingShipment } from './order-tracking-persistence.file';

export type AutoPullTrigger = 'handoff' | 'wip_shipped' | 'manual';

export type AutoPullResult = {
  pulled: boolean;
  platform?: string;
  shipment?: OrderTrackingShipment;
  trigger: AutoPullTrigger;
};

export async function autoPullInboundShipmentTracking(input: {
  wholesaleOrderId: string;
  organizationId?: string;
  trigger: AutoPullTrigger;
  force?: boolean;
}): Promise<AutoPullResult> {
  const id = input.wholesaleOrderId.trim();
  if (!isIntegrationImportedWholesaleOrderId(id)) {
    return { pulled: false, trigger: input.trigger };
  }

  await ensureSpineOperationalStoreReady(SPINE_TRACKING_READ_SCOPES);
  const existing = getOrderTracking(id);
  if (existing?.trackingNumber && !input.force) {
    return { pulled: false, trigger: input.trigger, platform: existing.platform };
  }

  const platform = getIntegrationMetaForOrder(id)?.sourcePlatform;
  const org = input.organizationId?.trim() || 'org-brand-001';

  if (platform === 'nuorder' && input.trigger !== 'handoff') {
    const result = await importNuOrderShipmentInbound({
      wholesaleOrderId: id,
      organizationId: org,
    });
    if (result) {
      if (input.trigger === 'wip_shipped') patchImportedOrderStatus(id, 'shipped');
      return {
        pulled: true,
        platform: 'nuorder',
        shipment: result.shipment,
        trigger: input.trigger,
      };
    }
  }

  if (platform === 'joor' && input.trigger !== 'handoff') {
    const result = await importJoorShipmentInbound({
      wholesaleOrderId: id,
      organizationId: org,
    });
    if (result) {
      if (input.trigger === 'wip_shipped') patchImportedOrderStatus(id, 'shipped');
      return {
        pulled: true,
        platform: 'joor',
        shipment: result.shipment,
        trigger: input.trigger,
      };
    }
  }

  if (platform === 'zedonk' && input.trigger === 'wip_shipped') {
    patchImportedOrderStatus(id, 'shipped');
    return { pulled: false, trigger: input.trigger, platform: 'zedonk' };
  }

  return { pulled: false, trigger: input.trigger, platform };
}
