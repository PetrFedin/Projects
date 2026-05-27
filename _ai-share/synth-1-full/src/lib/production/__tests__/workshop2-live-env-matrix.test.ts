/**
 * Wave K — документирует required env vars для 7 integration ceilings.
 * Структура probeFlags: { configured, live } — без fake ACK.
 */
import {
  buildWorkshop2IntegrationCeilingProbes,
  buildWorkshop2StructuredIntegrationProbeSummary,
  type Workshop2IntegrationProbeFlags,
} from '@/lib/production/workshop2-live-integration-probes';

/** Матрица env vars — источник правды для /integration-probes и setup UI. */
export const WORKSHOP2_LIVE_ENV_MATRIX: Record<
  'erp' | 'nesting' | 'dpp' | 'showroom' | 'sustainability' | 'fit3d' | 'plmTransport',
  {
    catalogId: number;
    primaryEnvKeys: readonly string[];
    descriptionRu: string;
  }
> = {
  erp: {
    catalogId: 66,
    primaryEnvKeys: ['WORKSHOP2_FACTORY_ERP_BASE_URL'],
    descriptionRu: 'POST /purchase-orders → erpOrderId ACK',
  },
  nesting: {
    catalogId: 63,
    primaryEnvKeys: ['WORKSHOP2_NESTING_API_URL'],
    descriptionRu: 'CAD nesting engine',
  },
  dpp: {
    catalogId: 50,
    primaryEnvKeys: ['WORKSHOP2_DPP_REGISTRY_URL', 'WORKSHOP2_EU_DPP_REGISTRY_URL'],
    descriptionRu: 'EU DPP registry write-back',
  },
  showroom: {
    catalogId: 62,
    primaryEnvKeys: ['WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL', 'WORKSHOP2_B2B_PORTAL_WEBHOOK_URL'],
    descriptionRu: 'B2B showroom publish webhook',
  },
  sustainability: {
    catalogId: 53,
    primaryEnvKeys: [
      'WORKSHOP2_LCA_API_URL',
      'WORKSHOP2_CERTIFIED_LCA_FEED_URL',
      'WORKSHOP2_SUSTAINABILITY_REGISTRY_URL',
    ],
    descriptionRu: 'Certified LCA / sustainability registry',
  },
  fit3d: {
    catalogId: 55,
    primaryEnvKeys: [
      'WORKSHOP2_VAULT_CAD_INGEST_URL',
      'WORKSHOP2_FIT3D_VAULT_PIPELINE_URL',
      'WORKSHOP2_VAULT_GLB_INGEST_URL',
    ],
    descriptionRu: 'Vault CAD → .glb ingest pipeline',
  },
  plmTransport: {
    catalogId: 78,
    primaryEnvKeys: [
      'WORKSHOP2_PLM_WEBHOOK_URL',
      'WORKSHOP2_PLM_PARTNER_ACK_URL',
      'WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT',
      'WORKSHOP2_PLM_LIVE_TRANSPORT_URL',
    ],
    descriptionRu: 'PLM webhook + partner ACK (AUTO_ACK alone ≠ live)',
  },
};

/** Workshop2 core PG — не ceiling, но обязателен для SS27 live UAT. */
export const WORKSHOP2_PG_CORE_ENV_KEYS = [
  'WORKSHOP2_DATABASE_URL',
  'WORKSHOP2_DOSSIER_DATABASE_URL',
  'DATABASE_URL',
] as const;

export const WORKSHOP2_PG_ONLY_CLIENT_ENV = 'NEXT_PUBLIC_WORKSHOP2_PG_ONLY' as const;

function assertProbeShape(flags: Workshop2IntegrationProbeFlags): void {
  expect(typeof flags.configured).toBe('boolean');
  expect(typeof flags.live).toBe('boolean');
  if (!flags.configured) expect(flags.live).toBe(false);
  if (flags.live) expect(flags.configured).toBe(true);
}

describe('workshop2 live env matrix (Wave K)', () => {
  it('documents 7 ceilings with catalogId + env keys', () => {
    expect(Object.keys(WORKSHOP2_LIVE_ENV_MATRIX)).toHaveLength(7);
    for (const [kind, row] of Object.entries(WORKSHOP2_LIVE_ENV_MATRIX)) {
      expect(row.catalogId).toBeGreaterThan(0);
      expect(row.primaryEnvKeys.length).toBeGreaterThan(0);
      expect(row.descriptionRu.length).toBeGreaterThan(5);
      const ceiling = buildWorkshop2IntegrationCeilingProbes({}).find((c) => c.kind === kind);
      expect(ceiling?.catalogId).toBe(row.catalogId);
      for (const key of row.primaryEnvKeys) {
        expect(ceiling?.envKeys).toContain(key);
      }
    }
  });

  it('empty env → all probeFlags configured=false live=false', () => {
    const flags = buildWorkshop2StructuredIntegrationProbeSummary({});
    for (const kind of Object.keys(WORKSHOP2_LIVE_ENV_MATRIX) as Array<
      keyof typeof WORKSHOP2_LIVE_ENV_MATRIX
    >) {
      assertProbeShape(flags[kind]);
      expect(flags[kind]).toEqual({ configured: false, live: false });
    }
  });

  it('prod URLs → configured=true live=true for nesting/dpp/fit3d', () => {
    const env = {
      WORKSHOP2_NESTING_API_URL: 'https://nesting.partner.example/v1',
      WORKSHOP2_DPP_REGISTRY_URL: 'https://dpp.eu.example/registry',
      WORKSHOP2_VAULT_CAD_INGEST_URL: 'https://vault.partner.example/ingest',
      WORKSHOP2_FACTORY_ERP_BASE_URL: 'https://erp.factory.example',
      WORKSHOP2_PLM_WEBHOOK_URL: 'https://plm.partner.example/hook',
      WORKSHOP2_PLM_PARTNER_ACK_URL: 'https://plm.partner.example/ack',
    };
    const flags = buildWorkshop2StructuredIntegrationProbeSummary(env);
    expect(flags.nesting).toEqual({ configured: true, live: true });
    expect(flags.dpp).toEqual({ configured: true, live: true });
    expect(flags.fit3d).toEqual({ configured: true, live: true });
    expect(flags.erp).toEqual({ configured: true, live: true });
    expect(flags.plmTransport).toEqual({ configured: true, live: true });
  });

  it('staging localhost → configured=true live=false (honest, no fake ACK)', () => {
    const env = {
      WORKSHOP2_NESTING_API_URL: 'http://127.0.0.1:4099/nest',
      WORKSHOP2_DPP_REGISTRY_URL: 'http://localhost:4099/dpp',
      WORKSHOP2_VAULT_CAD_INGEST_URL: 'http://127.0.0.1:4099/vault',
    };
    const flags = buildWorkshop2StructuredIntegrationProbeSummary(env);
    expect(flags.nesting.live).toBe(false);
    expect(flags.dpp.live).toBe(false);
    expect(flags.fit3d.live).toBe(false);
    expect(flags.nesting.configured).toBe(true);
  });

  it('PG core + PG-only client env documented', () => {
    expect(WORKSHOP2_PG_CORE_ENV_KEYS.length).toBeGreaterThan(0);
    expect(WORKSHOP2_PG_ONLY_CLIENT_ENV).toBe('NEXT_PUBLIC_WORKSHOP2_PG_ONLY');
  });

  it('ceilings expose stagingOk + modeLabelRu (Wave K / Wave 9)', () => {
    const stagingEnv = {
      WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
      WORKSHOP2_NESTING_API_URL: 'http://127.0.0.1:4099/nest',
      WORKSHOP2_DPP_REGISTRY_URL: 'http://localhost:4099/dpp',
    };
    const ceilings = buildWorkshop2IntegrationCeilingProbes(stagingEnv);
    for (const c of ceilings) {
      expect(typeof c.stagingOk).toBe('boolean');
      expect(['production', 'staging', 'unconfigured']).toContain(c.modeLabelRu);
    }
    const nesting = ceilings.find((c) => c.kind === 'nesting');
    expect(nesting?.stagingOk).toBe(true);
    expect(nesting?.modeLabelRu).toBe('staging');

    const prodEnv = {
      WORKSHOP2_NESTING_API_URL: 'https://nesting.partner.example/v1',
    };
    const prodNesting = buildWorkshop2IntegrationCeilingProbes(prodEnv).find(
      (c) => c.kind === 'nesting'
    );
    expect(prodNesting?.live).toBe(true);
    expect(prodNesting?.modeLabelRu).toBe('production');
  });
});
