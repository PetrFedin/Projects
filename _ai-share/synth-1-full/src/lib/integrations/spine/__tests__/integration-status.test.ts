import {
  getIntegrationsSpineHubMeta,
  getIntegrationsV1ConnectorStatus,
  getIntegrationsV1StatusPayload,
} from '@/lib/integrations/spine/integration-status.service';

describe('integration-status.service', () => {
  const prevSecret = process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET;
  const prevNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (prevSecret === undefined) delete process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET;
    else process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET = prevSecret;
    process.env.NODE_ENV = prevNodeEnv;
  });

  it('getIntegrationsV1StatusPayload returns connectors and hub meta', () => {
    delete process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET;
    const payload = getIntegrationsV1StatusPayload();
    expect(payload.connectors.length).toBeGreaterThan(0);
    expect(payload.hub.inboundShipmentWebhookPath).toBe('/api/integrations/v1/webhooks/shipment');
    expect(payload.hub.webhookSecretHeader).toBe('x-integrations-spine-secret');
    expect(payload.hub.webhookSecretConfigured).toBe(false);
  });

  it('getIntegrationsSpineHubMeta reflects webhook secret', () => {
    process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET = 'test-secret';
    const connectors = getIntegrationsV1ConnectorStatus();
    const hub = getIntegrationsSpineHubMeta(connectors);
    expect(hub.webhookSecretConfigured).toBe(true);
    expect(hub.configuredConnectorCount).toBe(connectors.filter((c) => c.configured).length);
  });

  it('getIntegrationsSpineHubMeta marks fail-closed in production without secret', () => {
    delete process.env.INTEGRATIONS_SPINE_WEBHOOK_SECRET;
    process.env.NODE_ENV = 'production';
    const hub = getIntegrationsSpineHubMeta([]);
    expect(hub.webhookFailClosedInProduction).toBe(true);
    expect(hub.webhookSecretConfigured).toBe(false);
  });
});
