import { importWholesaleOrder } from '../order-import.service';
import { processSpineShipmentWebhook } from '../spine-shipment-webhook.service';
import { getOrderTracking } from '../order-tracking-persistence.file';
import { verifyIntegrationsSpineWebhookSecret } from '../spine-webhook-verify';

describe('wave-h-ext', () => {
  it('webhook verify allows dev without secret', () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    delete process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET;
    expect(verifyIntegrationsSpineWebhookSecret({ secretHeader: null }).ok).toBe(true);
    process.env.NODE_ENV = prev;
  });

  it('nuorder shipment webhook resolves INT order and mirrors tracking', async () => {
    const extId = `wh-nu-${Date.now()}`;
    const outcome = importWholesaleOrder({
      platform: 'nuorder',
      externalOrderId: extId,
      raw: {
        id: extId,
        status: 'approved',
        customer_name: 'WH Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 1, unit_price: 100 }],
      },
    });

    const result = await processSpineShipmentWebhook({
      platform: 'nuorder',
      externalOrderId: extId,
      tracking_number: `WH-NU-${Date.now()}`,
      carrier: 'FedEx',
      status: 'shipped',
    });

    expect(result?.wholesaleOrderId).toBe(outcome.wholesaleOrderId);
    expect(result?.source).toBe('webhook');
    expect(getOrderTracking(outcome.wholesaleOrderId)?.trackingNumber).toBeTruthy();
  });

  it('joor shipment webhook resolves INT order', async () => {
    const extId = `wh-joor-${Date.now()}`;
    const outcome = importWholesaleOrder({
      platform: 'joor',
      externalOrderId: extId,
      raw: {
        id: extId,
        status: 'approved',
        customer_name: 'WH JOOR',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 2, unit_price: 100 }],
      },
    });

    const result = await processSpineShipmentWebhook({
      provider: 'joor',
      wholesaleOrderId: outcome.wholesaleOrderId,
      trackingNumber: `WH-JOOR-123`,
      carrier: 'DHL',
    });

    expect(result?.platform).toBe('joor');
    expect(getOrderTracking(outcome.wholesaleOrderId)?.platform).toBe('joor');
  });
});
