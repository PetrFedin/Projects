import { importWholesaleOrder } from '../order-import.service';
import { importJoorShipmentInbound } from '../joor-shipment-inbound.service';
import { autoPullInboundShipmentTracking } from '../spine-auto-inbound-tracking.service';
import { syncAims360Wip } from '../order-tracking.service';
import { getOrderTracking } from '../order-tracking-persistence.file';
import { workshop2B2bProductionHandoffPoId } from '@/lib/server/workshop2-b2b-production-handoff';

describe('wave-g-ext', () => {
  it('inbound shipment import mirrors tracking via webhook payload', async () => {
    const extId = `joor-inbound-${Date.now()}`;
    const outcome = importWholesaleOrder({
      platform: 'joor',
      externalOrderId: extId,
      raw: {
        id: extId,
        status: 'approved',
        customer_name: 'Inbound Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 3, unit_price: 100 }],
      },
    });

    const result = await importJoorShipmentInbound({
      wholesaleOrderId: outcome.wholesaleOrderId,
      shipment: {
        trackingNumber: 'SYN-JOOR-001',
        carrier: 'Carrier',
        status: 'in_transit',
      },
    });
    expect(result?.source).toBe('webhook');
    expect(result?.shipment.platform).toBe('joor');
    expect(result?.shipment.trackingNumber).toBe('SYN-JOOR-001');
  });

  it('auto-pull without live channel config does not fabricate tracking', async () => {
    const extId = `joor-autopull-${Date.now()}`;
    const outcome = importWholesaleOrder({
      platform: 'joor',
      externalOrderId: extId,
      raw: {
        id: extId,
        status: 'approved',
        customer_name: 'Auto inbound',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 2, unit_price: 100 }],
      },
    });
    const orderId = outcome.wholesaleOrderId;
    const poId = workshop2B2bProductionHandoffPoId(orderId);

    syncAims360Wip({ productionOrderId: poId, b2bOrderId: orderId, poStage: 'shipped' });

    const pull = await autoPullInboundShipmentTracking({
      wholesaleOrderId: orderId,
      trigger: 'wip_shipped',
    });
    expect(pull.pulled).toBe(false);
    expect(pull.platform).toBe('joor');
    expect(getOrderTracking(orderId)?.trackingNumber).toBeUndefined();
  });
});
