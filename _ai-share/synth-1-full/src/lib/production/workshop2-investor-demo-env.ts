/**
 * Wave L — investor demo env bundle (staging contract ≠ prod live).
 * Один «зелёный» ceiling path через localhost mock + PG partnerAck journal.
 */
import {
  WORKSHOP2_STAGING_MOCK_DEFAULT_BASE,
  WORKSHOP2_STAGING_MOCK_DEFAULT_PORT,
} from '@/lib/production/workshop2-staging-contract-mode';

export const WORKSHOP2_INVESTOR_DEMO_NOTE_RU =
  'Staging contract demo: localhost mock ACK → PG journal. Это не prod live ERP/DPP/LCA.';

/** Минимальный env для ONE green ERP ceiling + остальные 5 ceilings wave40. */
export function buildWorkshop2InvestorStagingDemoEnv(
  mockBase = WORKSHOP2_STAGING_MOCK_DEFAULT_BASE
): Record<string, string> {
  return {
    WORKSHOP2_STAGING_CONTRACT_MODE: 'true',
    WORKSHOP2_STAGING_MOCK_BASE_URL: mockBase,
    WORKSHOP2_DPP_REGISTRY_URL: mockBase,
    WORKSHOP2_LCA_API_URL: mockBase,
    WORKSHOP2_VAULT_CAD_INGEST_URL: mockBase,
    WORKSHOP2_NESTING_API_URL: mockBase,
    WORKSHOP2_FACTORY_ERP_BASE_URL: mockBase,
    WORKSHOP2_PLM_WEBHOOK_URL: `${mockBase}/webhook`,
    WORKSHOP2_PLM_PARTNER_ACK_URL: mockBase,
    NEXT_PUBLIC_WORKSHOP2_PG_ONLY: '1',
  };
}

export function formatWorkshop2InvestorDemoSetupMarkdown(): string {
  const base = WORKSHOP2_STAGING_MOCK_DEFAULT_BASE;
  return [
    '## Workshop2 investor demo (Wave L)',
    '',
    WORKSHOP2_INVESTOR_DEMO_NOTE_RU,
    '',
    '```bash',
    '# Terminal 1 — staging mock (6 ceilings + live ERP POST path)',
    'npm run workshop2:staging-mock',
    '',
    '# Terminal 2 — app (.env.local)',
    `WORKSHOP2_STAGING_CONTRACT_MODE=true`,
    `WORKSHOP2_FACTORY_ERP_BASE_URL=${base}`,
    `WORKSHOP2_DPP_REGISTRY_URL=${base}`,
    `WORKSHOP2_NESTING_API_URL=${base}`,
    `NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1`,
    'WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2',
    '',
    'npm run dev',
    '```',
    '',
    `Mock port default: ${WORKSHOP2_STAGING_MOCK_DEFAULT_PORT}`,
  ].join('\n');
}

/** Primary ceiling для investor walkthrough — ERP POST /purchase-orders → erpOrderId. */
export const WORKSHOP2_INVESTOR_DEMO_PRIMARY_CEILING_CATALOG_ID = 66 as const;
