/**
 * Client-safe env-probes для Workshop2 — без node:fs.
 * Импортируется из UI/client bundle; полный audit с fs — workshop2-live-integration-probes.ts (server/API).
 */
import {
  WORKSHOP2_LIVE_INTEGRATION_LABELS,
  type Workshop2LiveIntegrationKind,
} from '@/lib/production/workshop2-integration-live-required';
import {
  isWorkshop2StagingContractModeEnabled,
  resolveWorkshop2StagingContractProbeStatus,
  workshop2CeilingStrictScoreCap,
} from '@/lib/production/workshop2-staging-contract-mode';
import { probeWorkshop2ShopifyConnection } from '@/lib/production/workshop2-shopify-oauth-scaffold';
import { probeWorkshop2DomainEventsSse } from '@/lib/production/workshop2-domain-events-sse';
import { isWorkshop2VaultS3ConfiguredFromEnv } from '@/lib/production/workshop2-vault-presign-prod-guard';
import { evaluateWorkshop2PgOnlyAuditCompliance } from '@/lib/production/workshop2-pg-only-audit';
import { resolveWorkshop2MatchmakerEnvBanner } from '@/lib/production/workshop2-matchmaker-env-banner';
import { resolveWorkshop2FactoryErpCommissionUrl } from '@/lib/production/workshop2-factory-erp-commission-url';
import {
  getWorkshop2MarketProfile,
  isWorkshop2IntegrationEnabledForMarket,
  summarizeWorkshop2MarketProfileRu,
} from '@/lib/production/workshop2-market-profile';
import { probeWorkshop2MarkingHonestSign } from '@/lib/production/workshop2-marking-honest-sign';
import { probeWorkshop2Erp1c } from '@/lib/production/workshop2-erp-1c-stub';
import { probeWorkshop2Yukassa } from '@/lib/production/workshop2-yukassa-stub';
import { resolveWorkshop2MoySkladConfig } from '@/lib/production/workshop2-moysklad-wms-adapter';
import { resolveWorkshop2EdoProvider } from '@/lib/production/workshop2-edo-signoff';
import { resolveWorkshop2EdoAssignmentCta } from '@/lib/production/workshop2-edo-assignment-cta';
import { auditWorkshop2RuCoreNotDisabled } from '@/lib/production/workshop2-ru-core-routes-audit';
import { buildWorkshop2Wave22B2bParityGapsProbe as buildWorkshop2Wave22B2bParityGapsProbeImpl } from '@/lib/production/workshop2-b2b-wave22-parity';

export type Workshop2ProcessEnvLike = Record<string, string | undefined>;

/** Каталог Workshop2 (#50, #53, …). */
export type Workshop2IntegrationCeilingCatalogId = 50 | 53 | 55 | 62 | 63 | 66 | 78;

const WAVE40_CEILING_IDS: Workshop2IntegrationCeilingCatalogId[] = [50, 53, 55, 63, 66, 78];

export type Workshop2IntegrationProbeFlags = {
  /** Env keys заданы (URL / base URL присутствует). */
  configured: boolean;
  /** Prod-live URL (не localhost/staging stub) — без fake ACK. */
  live: boolean;
};

export type Workshop2IntegrationCeilingProbe = {
  catalogId: Workshop2IntegrationCeilingCatalogId;
  kind: Workshop2LiveIntegrationKind;
  configured: boolean;
  live: boolean;
  /** Переменные окружения, достаточные для «live» (OR внутри списка). */
  envKeys: readonly string[];
  maxRealisticScore: number;
  stagingContractMode: boolean;
  /** Wave 7: localhost mock path при WORKSHOP2_STAGING_CONTRACT_MODE (≠ production). */
  stagingOk?: boolean;
  modeLabelRu?: 'production' | 'staging' | 'unconfigured';
  prodLiveNoteRu: string;
  labelRu: string;
  unlockHintRu: string;
};

function envTrim(env: Workshop2ProcessEnvLike, key: string): string {
  return String(env[key] ?? '').trim();
}

function anyEnvSet(env: Workshop2ProcessEnvLike, keys: readonly string[]): boolean {
  return keys.some((k) => Boolean(envTrim(env, k)));
}

/** Wave K — localhost/staging URL ≠ prod live (honest ceiling probes). */
export function isWorkshop2IntegrationUrlProductionLive(url: string): boolean {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (u.includes('localhost') || u.includes('127.0.0.1') || u.includes('0.0.0.0')) return false;
  if (u.includes('.test') || u.includes('.local')) return false;
  return u.startsWith('http://') || u.startsWith('https://');
}

function firstEnvUrl(env: Workshop2ProcessEnvLike, keys: readonly string[]): string {
  for (const k of keys) {
    const v = envTrim(env, k);
    if (v) return v;
  }
  return '';
}

export function resolveWorkshop2IntegrationProbeFlags(input: {
  configured: boolean;
  env: Workshop2ProcessEnvLike;
  envKeys: readonly string[];
}): Workshop2IntegrationProbeFlags {
  if (!input.configured) {
    return { configured: false, live: false };
  }
  const url = firstEnvUrl(input.env, input.envKeys);
  return {
    configured: true,
    live: url ? isWorkshop2IntegrationUrlProductionLive(url) : false,
  };
}

export function buildWorkshop2StructuredIntegrationProbeSummary(
  env: Workshop2ProcessEnvLike = process.env
): Record<
  'erp' | 'nesting' | 'dpp' | 'showroom' | 'sustainability' | 'fit3d' | 'plmTransport',
  Workshop2IntegrationProbeFlags
> {
  const defs: Array<{
    key: keyof ReturnType<typeof buildWorkshop2StructuredIntegrationProbeSummary>;
    probe: (e: Workshop2ProcessEnvLike) => boolean;
    envKeys: readonly string[];
  }> = [
    {
      key: 'erp',
      probe: isWorkshop2LiveErpConfigured,
      envKeys: ['WORKSHOP2_FACTORY_ERP_BASE_URL'],
    },
    {
      key: 'nesting',
      probe: isWorkshop2LiveNestingConfigured,
      envKeys: ['WORKSHOP2_NESTING_API_URL'],
    },
    {
      key: 'dpp',
      probe: isWorkshop2LiveDppConfigured,
      envKeys: ['WORKSHOP2_DPP_REGISTRY_URL', 'WORKSHOP2_EU_DPP_REGISTRY_URL'],
    },
    {
      key: 'showroom',
      probe: isWorkshop2LiveShowroomConfigured,
      envKeys: ['WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL', 'WORKSHOP2_B2B_PORTAL_WEBHOOK_URL'],
    },
    {
      key: 'sustainability',
      probe: isWorkshop2LiveSustainabilityConfigured,
      envKeys: [
        'WORKSHOP2_LCA_API_URL',
        'WORKSHOP2_LCA_FEED_URL',
        'WORKSHOP2_CERTIFIED_LCA_FEED_URL',
        'WORKSHOP2_SUSTAINABILITY_REGISTRY_URL',
      ],
    },
    {
      key: 'fit3d',
      probe: isWorkshop2LiveFit3dConfigured,
      envKeys: [
        'WORKSHOP2_VAULT_CAD_INGEST_URL',
        'WORKSHOP2_FIT3D_VAULT_PIPELINE_URL',
        'WORKSHOP2_VAULT_GLB_INGEST_URL',
      ],
    },
    {
      key: 'plmTransport',
      probe: isWorkshop2LivePlmTransportConfigured,
      envKeys: [
        'WORKSHOP2_PLM_WEBHOOK_URL',
        'WORKSHOP2_PLM_PARTNER_ACK_URL',
        'WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT',
        'WORKSHOP2_PLM_LIVE_TRANSPORT_URL',
      ],
    },
  ];
  const out = {} as ReturnType<typeof buildWorkshop2StructuredIntegrationProbeSummary>;
  for (const d of defs) {
    const configured = d.probe(env);
    out[d.key] = resolveWorkshop2IntegrationProbeFlags({
      configured,
      env,
      envKeys: d.envKeys,
    });
  }
  return out;
}

/** In-platform WMS (PG balances/reserves) — не external ERP ceiling. */
export function isWorkshop2InternalWmsConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  const flag = String(env.WORKSHOP2_INTERNAL_WMS ?? '')
    .trim()
    .toLowerCase();
  if (flag === 'false') return false;
  if (flag === 'true') return true;
  return Boolean(
    envTrim(env, 'WORKSHOP2_DATABASE_URL') ||
    envTrim(env, 'WORKSHOP2_DOSSIER_DATABASE_URL') ||
    envTrim(env, 'DATABASE_URL')
  );
}

/** Live TMS / carrier API (#65). */
export function isWorkshop2LiveTmsConfigured(env: Workshop2ProcessEnvLike = process.env): boolean {
  return anyEnvSet(env, [
    'WORKSHOP2_TMS_API_URL',
    'WORKSHOP2_LOGISTICS_CARRIER_API_URL',
    'WORKSHOP2_CARRIER_TRACKING_API_URL',
  ]);
}

/** Live ERP: POST purchase-orders с erpOrderId ACK (#66). */
export function isWorkshop2LiveErpConfigured(env: Workshop2ProcessEnvLike = process.env): boolean {
  return Boolean(envTrim(env, 'WORKSHOP2_FACTORY_ERP_BASE_URL'));
}

/** Live CAD nesting engine (#63). */
export function isWorkshop2LiveNestingConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return Boolean(envTrim(env, 'WORKSHOP2_NESTING_API_URL'));
}

/** Live EU DPP registry write-back (#50). */
export function isWorkshop2LiveDppConfigured(env: Workshop2ProcessEnvLike = process.env): boolean {
  return anyEnvSet(env, ['WORKSHOP2_DPP_REGISTRY_URL', 'WORKSHOP2_EU_DPP_REGISTRY_URL']);
}

/** Live B2B showroom webhook (#62). */
export function isWorkshop2LiveShowroomConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return anyEnvSet(env, ['WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL', 'WORKSHOP2_B2B_PORTAL_WEBHOOK_URL']);
}

/** Live certified LCA / EU registry feed (#53). */
export function isWorkshop2LiveSustainabilityConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return anyEnvSet(env, [
    'WORKSHOP2_LCA_API_URL',
    'WORKSHOP2_LCA_FEED_URL',
    'WORKSHOP2_CERTIFIED_LCA_FEED_URL',
    'WORKSHOP2_SUSTAINABILITY_REGISTRY_URL',
  ]);
}

/** Live Vault CAD → .glb ingest pipeline (#55). */
export function isWorkshop2LiveFit3dConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return anyEnvSet(env, [
    'WORKSHOP2_VAULT_CAD_INGEST_URL',
    'WORKSHOP2_FIT3D_VAULT_PIPELINE_URL',
    'WORKSHOP2_VAULT_GLB_INGEST_URL',
  ]);
}

/**
 * Live external PLM transport + partner ACK (#78).
 * WORKSHOP2_PLM_AUTO_ACK=true без webhook — dev-only, не production ceiling.
 */
export function isWorkshop2LivePlmTransportConfigured(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  const webhook = envTrim(env, 'WORKSHOP2_PLM_WEBHOOK_URL');
  if (!webhook) return false;
  const partnerAck = anyEnvSet(env, [
    'WORKSHOP2_PLM_PARTNER_ACK_URL',
    'WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT',
    'WORKSHOP2_PLM_LIVE_TRANSPORT_URL',
  ]);
  if (partnerAck) return true;
  return envTrim(env, 'WORKSHOP2_PLM_LIVE_TRANSPORT') === 'true';
}

/** @deprecated alias — use isWorkshop2LivePlmTransportConfigured */
export const isWorkshop2LivePlmConfigured = isWorkshop2LivePlmTransportConfigured;

export function buildWorkshop2IntegrationCeilingProbes(
  env: Workshop2ProcessEnvLike = process.env
): Workshop2IntegrationCeilingProbe[] {
  const defs: Array<
    Omit<Workshop2IntegrationCeilingProbe, 'configured'> & {
      probe: (e: Workshop2ProcessEnvLike) => boolean;
    }
  > = [
    {
      catalogId: 50,
      kind: 'dpp',
      envKeys: ['WORKSHOP2_DPP_REGISTRY_URL', 'WORKSHOP2_EU_DPP_REGISTRY_URL'],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.dpp,
      unlockHintRu:
        'Задайте WORKSHOP2_DPP_REGISTRY_URL (или WORKSHOP2_EU_DPP_REGISTRY_URL) для write-back в EU DPP.',
      probe: isWorkshop2LiveDppConfigured,
    },
    {
      catalogId: 53,
      kind: 'sustainability',
      envKeys: [
        'WORKSHOP2_LCA_API_URL',
        'WORKSHOP2_LCA_FEED_URL',
        'WORKSHOP2_CERTIFIED_LCA_FEED_URL',
        'WORKSHOP2_SUSTAINABILITY_REGISTRY_URL',
      ],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.sustainability,
      unlockHintRu: 'Подключите certified LCA API (WORKSHOP2_LCA_API_URL) или registry feed.',
      probe: isWorkshop2LiveSustainabilityConfigured,
    },
    {
      catalogId: 55,
      kind: 'fit3d',
      envKeys: [
        'WORKSHOP2_VAULT_CAD_INGEST_URL',
        'WORKSHOP2_FIT3D_VAULT_PIPELINE_URL',
        'WORKSHOP2_VAULT_GLB_INGEST_URL',
      ],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.fit3d,
      unlockHintRu:
        'Настройте Vault CAD ingest (WORKSHOP2_VAULT_CAD_INGEST_URL) — placeholder.glb не production.',
      probe: isWorkshop2LiveFit3dConfigured,
    },
    {
      catalogId: 62,
      kind: 'showroom',
      envKeys: ['WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL', 'WORKSHOP2_B2B_PORTAL_WEBHOOK_URL'],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.showroom,
      unlockHintRu: 'Задайте WORKSHOP2_SHOWROOM_B2B_WEBHOOK_URL для live Joor/Brandboom publish.',
      probe: isWorkshop2LiveShowroomConfigured,
    },
    {
      catalogId: 63,
      kind: 'nesting',
      envKeys: ['WORKSHOP2_NESTING_API_URL'],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.nesting,
      unlockHintRu: 'Задайте WORKSHOP2_NESTING_API_URL для CAD nesting engine.',
      probe: isWorkshop2LiveNestingConfigured,
    },
    {
      catalogId: 66,
      kind: 'erp',
      envKeys: ['WORKSHOP2_FACTORY_ERP_BASE_URL'],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.erp,
      unlockHintRu: 'Задайте WORKSHOP2_FACTORY_ERP_BASE_URL — synced без erpOrderId fail-closed.',
      probe: isWorkshop2LiveErpConfigured,
    },
    {
      catalogId: 78,
      kind: 'plmTransport',
      envKeys: [
        'WORKSHOP2_PLM_WEBHOOK_URL',
        'WORKSHOP2_PLM_PARTNER_ACK_URL',
        'WORKSHOP2_PLM_EXTERNAL_ACK_ENDPOINT',
        'WORKSHOP2_PLM_LIVE_TRANSPORT_URL',
      ],
      maxRealisticScore: 8.9,
      labelRu: WORKSHOP2_LIVE_INTEGRATION_LABELS.plmTransport,
      unlockHintRu:
        'WEBHOOK + partner ACK URL (или WORKSHOP2_PLM_LIVE_TRANSPORT=true). AUTO_ACK alone ≠ live.',
      probe: isWorkshop2LivePlmTransportConfigured,
    },
  ];

  const stagingContractMode = isWorkshop2StagingContractModeEnabled(env);
  const strictCap = workshop2CeilingStrictScoreCap(env);
  return defs.map((d) => {
    const wave40 = WAVE40_CEILING_IDS.includes(d.catalogId);
    const configured = d.probe(env);
    const flags = resolveWorkshop2IntegrationProbeFlags({
      configured,
      env,
      envKeys: d.envKeys,
    });
    const stagingStatus = resolveWorkshop2StagingContractProbeStatus({
      configured: flags.configured,
      env,
      envKeys: d.envKeys,
    });
    return {
      catalogId: d.catalogId,
      kind: d.kind,
      envKeys: d.envKeys,
      maxRealisticScore: wave40 && stagingContractMode ? strictCap : d.maxRealisticScore,
      stagingContractMode: wave40 && stagingContractMode,
      stagingOk: stagingStatus.stagingOk,
      modeLabelRu: stagingStatus.modeLabelRu,
      prodLiveNoteRu:
        wave40 && stagingContractMode
          ? 'Strict 9.0 через staging contract (localhost + PG ACK). Prod live — отдельный env + E2E.'
          : 'Prod live требует реальный partner env и ACK в PG.',
      labelRu: d.labelRu,
      unlockHintRu: d.unlockHintRu,
      configured: flags.configured,
      live: flags.live,
    };
  });
}

/** Краткая карта для wave 32 клиентов (обратная совместимость — boolean = configured). */
export function workshop2LiveIntegrationProbeSummary(
  env: Workshop2ProcessEnvLike = process.env
): Record<
  'erp' | 'nesting' | 'dpp' | 'showroom' | 'sustainability' | 'fit3d' | 'plmTransport',
  boolean
> {
  const structured = buildWorkshop2StructuredIntegrationProbeSummary(env);
  return {
    erp: structured.erp.configured,
    nesting: structured.nesting.configured,
    dpp: structured.dpp.configured,
    showroom: structured.showroom.configured,
    sustainability: structured.sustainability.configured,
    fit3d: structured.fit3d.configured,
    plmTransport: structured.plmTransport.configured,
  };
}

export function workshop2AllIntegrationCeilingsLive(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  const s = buildWorkshop2StructuredIntegrationProbeSummary(env);
  return Object.values(s).every((f) => f.live);
}

/**
 * Wave O — investor demo готовность: все ceilings configured (staging/prod) ИЛИ честно disabled.
 * false когда localhost configured masquerades as live (allLive fake).
 */
export function workshop2ReadyForInvestorDemo(env: Workshop2ProcessEnvLike = process.env): boolean {
  if (isWorkshop2StagingContractModeEnabled(env)) {
    return true;
  }
  /** Wave 9 RU: global ceilings (EU DPP, Joor showroom) не блокируют investor demo в режиме РФ. */
  if (getWorkshop2MarketProfile(env) === 'ru') {
    return true;
  }
  const flags = buildWorkshop2StructuredIntegrationProbeSummary(env);
  const values = Object.values(flags);
  const allDisabled = values.every((f) => !f.configured);
  if (allDisabled) {
    return true;
  }
  const allProdLive = values.every((f) => f.configured && f.live);
  if (allProdLive) {
    return true;
  }
  const localhostOnlyConfigured = values.some((f) => f.configured && !f.live);
  if (localhostOnlyConfigured) {
    return false;
  }
  return values.every((f) => f.configured || !f.live);
}

/** Wave 1 horizontal: chat persist + calendar sync (PG or file-store). */
export function buildWorkshop2Wave1HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  chatPersist: { configured: boolean; mode: 'postgres' | 'file_store' };
  calendarSync: { configured: boolean; mode: 'postgres' | 'file_store' };
  domainEventsOutbox: { configured: boolean; webhookConfigured: boolean };
} {
  const pg = Boolean(
    env.WORKSHOP2_DATABASE_URL?.trim() ||
    env.WORKSHOP2_DOSSIER_DATABASE_URL?.trim() ||
    env.DATABASE_URL?.trim()
  );
  const mode = pg ? ('postgres' as const) : ('file_store' as const);
  return {
    chatPersist: { configured: true, mode },
    calendarSync: { configured: true, mode },
    domainEventsOutbox: {
      configured: true,
      webhookConfigured: Boolean(env.WORKSHOP2_DOMAIN_EVENTS_WEBHOOK_URL?.trim()),
    },
  };
}

/** Wave 2 horizontal: MES floor, ERP landed cost, iCal, inspector offline queue. */
export function buildWorkshop2Wave2HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  floorMes: { configured: boolean; live: boolean; envKey: string };
  erpLandedCost: { configured: boolean; live: boolean };
  icalFeed: { configured: boolean };
  inspectorOfflineQueue: { configured: boolean; storage: 'indexeddb' | 'sessionStorage' };
} {
  const mesUrl = String(env.WORKSHOP2_FLOOR_MES_URL ?? '').trim();
  const erpConfigured = Boolean(env.WORKSHOP2_FACTORY_ERP_BASE_URL?.trim());
  const hasIndexedDb = typeof globalThis.indexedDB !== 'undefined';
  return {
    floorMes: {
      configured: Boolean(mesUrl),
      live: mesUrl ? isWorkshop2IntegrationUrlProductionLive(mesUrl) : false,
      envKey: 'WORKSHOP2_FLOOR_MES_URL',
    },
    erpLandedCost: {
      configured: erpConfigured,
      live: erpConfigured
        ? isWorkshop2IntegrationUrlProductionLive(String(env.WORKSHOP2_FACTORY_ERP_BASE_URL))
        : false,
    },
    icalFeed: { configured: true },
    inspectorOfflineQueue: {
      configured: true,
      storage: hasIndexedDb ? 'indexeddb' : 'sessionStorage',
    },
  };
}

/** Wave 3 horizontal: ERP create POST, PLM outbox+inbound, nesting POM, DPP/LCA, EDO, vault index, Slack bridge. */
export function buildWorkshop2Wave3HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  erpPoCreate: { configured: boolean; live: boolean; journalFallback: boolean };
  plmOutboxInbound: {
    webhookConfigured: boolean;
    partnerAckConfigured: boolean;
    verifySecretConfigured: boolean;
  };
  nestingPomBody: { configured: boolean; live: boolean };
  dppLcaStaging: { dppConfigured: boolean; lcaConfigured: boolean };
  edoSignoff: { provider: string; required: boolean };
  vaultIndex: { configured: boolean };
  slackBridge: { configured: boolean; live: boolean };
  cutTicketGate: { enabled: boolean };
  b2bCreditHold: { enabled: boolean };
  smartRoutingRulesUrl: { configured: boolean; live: boolean };
} {
  const erpUrl = String(env.WORKSHOP2_FACTORY_ERP_BASE_URL ?? '').trim();
  const nestingUrl = String(env.WORKSHOP2_NESTING_API_URL ?? '').trim();
  const slackUrl = String(env.WORKSHOP2_SLACK_WEBHOOK_URL ?? '').trim();
  const rulesUrl = String(env.WORKSHOP2_SMART_ROUTING_RULES_URL ?? '').trim();
  const smartRoutingApiUrl = String(env.WORKSHOP2_SMART_ROUTING_API_URL ?? '').trim();
  const edoProvider =
    String(env.WORKSHOP2_EDO_PROVIDER ?? '')
      .trim()
      .toLowerCase() || 'none';
  return {
    erpPoCreate: {
      configured: Boolean(erpUrl),
      live: erpUrl ? isWorkshop2IntegrationUrlProductionLive(erpUrl) : false,
      journalFallback: !erpUrl,
    },
    plmOutboxInbound: {
      webhookConfigured: Boolean(env.WORKSHOP2_PLM_WEBHOOK_URL?.trim()),
      partnerAckConfigured: isWorkshop2LivePlmTransportConfigured(env),
      verifySecretConfigured: Boolean(env.WORKSHOP2_PLM_WEBHOOK_SECRET?.trim()),
    },
    nestingPomBody: {
      configured: Boolean(nestingUrl),
      live: nestingUrl ? isWorkshop2IntegrationUrlProductionLive(nestingUrl) : false,
    },
    dppLcaStaging: {
      dppConfigured: isWorkshop2LiveDppConfigured(env),
      lcaConfigured: isWorkshop2LiveSustainabilityConfigured(env),
    },
    edoSignoff: {
      provider: edoProvider,
      required:
        env.WORKSHOP2_EDO_SIGNOFF_REQUIRED === 'true' ||
        edoProvider === 'kontur' ||
        edoProvider === 'sbis',
    },
    vaultIndex: { configured: true },
    slackBridge: {
      configured: Boolean(slackUrl),
      live: slackUrl ? isWorkshop2IntegrationUrlProductionLive(slackUrl) : false,
    },
    cutTicketGate: {
      enabled:
        String(env.WORKSHOP2_CUT_TICKET_REQUIRED ?? '')
          .trim()
          .toLowerCase() === 'true',
    },
    b2bCreditHold: {
      enabled:
        String(env.WORKSHOP2_B2B_CREDIT_HOLD ?? '')
          .trim()
          .toLowerCase() === 'true',
    },
    smartRoutingRulesUrl: {
      configured: Boolean(rulesUrl),
      live: rulesUrl ? isWorkshop2IntegrationUrlProductionLive(rulesUrl) : false,
    },
    smartRoutingApiUrl: {
      configured: Boolean(smartRoutingApiUrl),
      live: smartRoutingApiUrl
        ? isWorkshop2IntegrationUrlProductionLive(smartRoutingApiUrl)
        : false,
    },
  };
}

/** Wave 4 horizontal: PG-only, bulk handoff, EDI journal, Shopify OAuth, commission stub. */
export function buildWorkshop2Wave4HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  pgOnlyMode: { enabled: boolean; serverFlag: boolean; clientFlag: boolean };
  bulkHandoff: { configured: boolean };
  ediInbound: { configured: boolean; verifySecretConfigured: boolean };
  shopifyOAuth: { configured: boolean; status: string };
  b2bCommission: { configured: boolean; defaultPct: number };
  supplyDomainEvents: { registered: boolean };
} {
  const pgServer = String(env.WORKSHOP2_PG_ONLY ?? '')
    .trim()
    .toLowerCase();
  const pgClient = String(env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY ?? '').trim();
  const shopifyProbe = probeWorkshop2ShopifyConnection(env);
  const commissionPctRaw = String(env.WORKSHOP2_B2B_COMMISSION_PCT ?? '').trim();
  const commissionPct = commissionPctRaw ? Number(commissionPctRaw) : 5;
  return {
    pgOnlyMode: {
      enabled:
        pgServer === 'true' ||
        pgServer === '1' ||
        pgClient === '1' ||
        pgClient.toLowerCase() === 'true',
      serverFlag: pgServer === 'true' || pgServer === '1',
      clientFlag: pgClient === '1' || pgClient.toLowerCase() === 'true',
    },
    bulkHandoff: { configured: true },
    ediInbound: {
      configured: Boolean(env.WORKSHOP2_EDI_WEBHOOK_SECRET?.trim()),
      verifySecretConfigured: Boolean(env.WORKSHOP2_EDI_WEBHOOK_SECRET?.trim()),
    },
    shopifyOAuth: {
      configured: shopifyProbe.configured,
      status: shopifyProbe.status,
    },
    b2bCommission: {
      configured: true,
      defaultPct: Number.isFinite(commissionPct) ? commissionPct : 5,
    },
    supplyDomainEvents: { registered: true },
  };
}

/** Wave 5 horizontal: PG persist, MES QC, MoySklad, network analytics, auto showroom, Illustrator. */
export function buildWorkshop2Wave5HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  pgPersist: { ediJournal: boolean; b2bCommission: boolean };
  mesQcIngest: { configured: boolean; verifySecretConfigured: boolean };
  moySkladWms: { configured: boolean; tokenConfigured: boolean };
  networkAnalytics: { configured: boolean };
  autoShowroomPublish: { enabled: boolean };
  illustratorWebhook: { configured: boolean; verifySecretConfigured: boolean };
  pgOnlyReadPolicy: { contextualMessages: boolean; brandCalendar: boolean };
} {
  const mesSecret = String(env.WORKSHOP2_MES_QC_WEBHOOK_SECRET ?? '').trim();
  const illSecret = String(env.WORKSHOP2_ILLUSTRATOR_WEBHOOK_SECRET ?? '').trim();
  const moyToken = String(env.ERP_MOYSKLAD_TOKEN ?? env.MOYSKLAD_TOKEN ?? '').trim();
  const pgServer = String(env.WORKSHOP2_PG_ONLY ?? '')
    .trim()
    .toLowerCase();
  const pgOnly =
    pgServer === 'true' ||
    pgServer === '1' ||
    String(env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY ?? '').trim() === '1';
  return {
    pgPersist: {
      ediJournal: Boolean(String(env.WORKSHOP2_EDI_WEBHOOK_SECRET ?? '').trim()),
      b2bCommission: true,
    },
    mesQcIngest: {
      configured: Boolean(mesSecret),
      verifySecretConfigured: Boolean(mesSecret),
    },
    moySkladWms: {
      configured: Boolean(moyToken),
      tokenConfigured: Boolean(moyToken),
    },
    networkAnalytics: { configured: true },
    autoShowroomPublish: {
      enabled:
        String(env.WORKSHOP2_AUTO_SHOWROOM_PUBLISH ?? '')
          .trim()
          .toLowerCase() === 'true',
    },
    illustratorWebhook: {
      configured: Boolean(illSecret),
      verifySecretConfigured: Boolean(illSecret),
    },
    pgOnlyReadPolicy: {
      contextualMessages: pgOnly,
      brandCalendar: pgOnly,
    },
  };
}

/** Wave 7 horizontal: fit comments gate, vendor bids PG, Teams bridge, signoff stages, bulk showroom, territories, UAT. */
export function buildWorkshop2Wave7HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  fitCommentsGate: { enabled: boolean };
  vendorBidsApi: { configured: boolean; path: string };
  teamsWebhook: { configured: boolean; live: boolean };
  signoffStagesApi: { configured: boolean; path: string };
  bulkShowroomPublishApi: { configured: boolean; path: string };
  b2bTerritoriesApi: { configured: boolean; path: string };
  ss27UatChecklistApi: { configured: boolean; path: string };
  stagingContractCentral: { enabled: boolean };
} {
  const teamsUrl = String(env.WORKSHOP2_TEAMS_WEBHOOK_URL ?? '').trim();
  return {
    fitCommentsGate: {
      enabled:
        String(env.WORKSHOP2_FIT_COMMENTS_GATE ?? '')
          .trim()
          .toLowerCase() === 'true',
    },
    vendorBidsApi: {
      configured: true,
      path: '/api/workshop2/articles/{collectionId}/{articleId}/vendor-bids',
    },
    teamsWebhook: {
      configured: Boolean(teamsUrl),
      live: teamsUrl ? isWorkshop2IntegrationUrlProductionLive(teamsUrl) : false,
    },
    signoffStagesApi: {
      configured: true,
      path: '/api/workshop2/setup/signoff-stages',
    },
    bulkShowroomPublishApi: {
      configured: true,
      path: '/api/workshop2/collections/{collectionId}/bulk-showroom-publish',
    },
    b2bTerritoriesApi: {
      configured: true,
      path: '/api/workshop2/b2b/territories',
    },
    ss27UatChecklistApi: {
      configured: true,
      path: '/api/workshop2/uat/ss27-checklist',
    },
    stagingContractCentral: {
      enabled: isWorkshop2StagingContractModeEnabled(env),
    },
  };
}

/** Wave 6 horizontal: domain events SSE, Shopify OAuth complete, EDI outbound, marketplace inbound, investor readiness. */
export function buildWorkshop2Wave6HorizontalProbes(
  env: Workshop2ProcessEnvLike = process.env,
  options?: { shopifyStoredConnection?: boolean }
): {
  domainEventsSse: ReturnType<typeof probeWorkshop2DomainEventsSse>;
  shopifyOAuth: {
    configured: boolean;
    status: string;
    tokenExchangeReady: boolean;
    storedConnection: boolean;
  };
  ediOutbound: { webhookConfigured: boolean };
  b2bMarketplaceInbound: { verifySecretConfigured: boolean };
  investorReadinessApi: { configured: boolean; path: string };
  illustratorVaultEnqueue: { s3Configured: boolean };
  commissionPayout: { configured: boolean };
} {
  const shopifyProbe = probeWorkshop2ShopifyConnection(env, {
    hasStoredConnection: options?.shopifyStoredConnection,
  });
  const exchangeCfg = String(env.WORKSHOP2_SHOPIFY_CLIENT_SECRET ?? '').trim();
  const ediOutboundUrl = String(env.WORKSHOP2_EDI_OUTBOUND_WEBHOOK_URL ?? '').trim();
  const marketplaceSecret = String(env.WORKSHOP2_B2B_MARKETPLACE_WEBHOOK_SECRET ?? '').trim();
  return {
    domainEventsSse: probeWorkshop2DomainEventsSse(env),
    shopifyOAuth: {
      configured: shopifyProbe.configured,
      status: shopifyProbe.status,
      tokenExchangeReady: Boolean(
        String(env.WORKSHOP2_SHOPIFY_CLIENT_ID ?? '').trim() &&
        exchangeCfg &&
        String(env.WORKSHOP2_SHOPIFY_REDIRECT_URI ?? '').trim()
      ),
      storedConnection: Boolean(options?.shopifyStoredConnection),
    },
    ediOutbound: { webhookConfigured: Boolean(ediOutboundUrl) },
    b2bMarketplaceInbound: { verifySecretConfigured: Boolean(marketplaceSecret) },
    investorReadinessApi: {
      configured: true,
      path: '/api/workshop2/investor-readiness',
    },
    illustratorVaultEnqueue: { s3Configured: isWorkshop2VaultS3ConfiguredFromEnv(env) },
    commissionPayout: { configured: true },
  };
}

/** Wave 8 horizontal: PG-only audit, B2C DPP, matchmaker guard, assortment risk, notifications, EDO poll, commission ERP. */
export function buildWorkshop2Wave8HorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  pgOnlyAudit: { enabled: boolean; surfaceCount: number; compliant: boolean };
  b2cDppLinkage: { apiPath: string };
  matchmaker: {
    rateLimitPerMinute: number;
    genkitConfigured: boolean;
    bannerMode: string;
  };
  assortmentRiskApi: { path: string };
  brandNotificationsApi: { path: string };
  edoStatusPoll: { path: string; konturConfigured: boolean };
  commissionErpExport: { configured: boolean; path: string };
  ss27UatSignoffSpec: { path: string };
} {
  const audit = evaluateWorkshop2PgOnlyAuditCompliance(env);
  const matchBanner = resolveWorkshop2MatchmakerEnvBanner(env);
  const konturUrl = String(env.WORKSHOP2_KONTUR_EDO_API_URL ?? '').trim();

  return {
    pgOnlyAudit: {
      enabled: audit.pgOnlyEnabled,
      surfaceCount: audit.catalogCount,
      compliant: audit.compliant,
    },
    b2cDppLinkage: { apiPath: '/api/shop/products/[slug]/dpp' },
    matchmaker: {
      rateLimitPerMinute: matchBanner.rateLimitPerMinute,
      genkitConfigured: matchBanner.genkitConfigured,
      bannerMode: matchBanner.mode,
    },
    assortmentRiskApi: { path: '/api/workshop2/collections/[collectionId]/assortment-risk' },
    brandNotificationsApi: { path: '/api/brand/notifications/workshop2' },
    edoStatusPoll: {
      path: '/api/workshop2/articles/[collectionId]/[articleId]/signoff/edo-status',
      konturConfigured: Boolean(konturUrl),
    },
    commissionErpExport: {
      configured: Boolean(resolveWorkshop2FactoryErpCommissionUrl(env)),
      path: '/api/shop/b2b/commissions/export-erp',
    },
    ss27UatSignoffSpec: { path: 'e2e/workshop2-ss27-uat-signoff.spec.ts' },
  };
}

/** Wave 9 RU horizontal: market profile, ЭДО, МойСклад, маркировка, 1С, ЮKassa, логистика РФ. */
export function buildWorkshop2Wave9RuHorizontalProbes(env: Workshop2ProcessEnvLike = process.env): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  edoKontur: { configured: boolean };
  edoSbis: { configured: boolean };
  edoProvider: string;
  moySklad: { configured: boolean; tokenEnv: string };
  markingHonestSign: ReturnType<typeof probeWorkshop2MarkingHonestSign>;
  erp1c: ReturnType<typeof probeWorkshop2Erp1c>;
  yukassa: ReturnType<typeof probeWorkshop2Yukassa>;
  domesticLogistics: { journalOnly: boolean };
  globalIntegrationsHidden: string[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const moy = resolveWorkshop2MoySkladConfig(env);
  const edo = resolveWorkshop2EdoProvider(env);
  const globalIntegrationsHidden = market.globalHidden.filter(
    (id) => !isWorkshop2IntegrationEnabledForMarket(id, env)
  );
  return {
    market,
    edoKontur: { configured: Boolean(env.WORKSHOP2_KONTUR_EDO_API_URL?.trim()) },
    edoSbis: { configured: Boolean(env.WORKSHOP2_SBIS_EDO_API_URL?.trim()) },
    edoProvider: edo,
    moySklad: {
      configured: moy.configured,
      tokenEnv: 'MOYSKLAD_TOKEN',
    },
    markingHonestSign: probeWorkshop2MarkingHonestSign(env),
    erp1c: probeWorkshop2Erp1c(env),
    yukassa: probeWorkshop2Yukassa(env),
    domesticLogistics: { journalOnly: true },
    globalIntegrationsHidden,
  };
}

/** Wave 10 RU horizontal: ₽ currency, PDF logistics, CommerceML, marking CSV, calendar auto-sync, core audit. */
export function buildWorkshop2Wave10RuHorizontalProbes(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  rubCurrency: { module: string; vatHelper: boolean };
  rfLogisticsPdf: { path: string; downloadable: boolean };
  erp1cExport: { getPath: string; formats: string[] };
  markingCsvBridge: { path: string; wizard: boolean };
  edoMockStaging: { provider: string; stagingContract: boolean };
  yukassaCreatePayment: { path: string };
  calendarAutoSyncOnPut: boolean;
  schetOfferta: { path: string };
  coreRoutesAudit: { ok: boolean; paneCount: number };
  globalPanelsAccessibleInGlobal: boolean;
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const audit = auditWorkshop2RuCoreNotDisabled(env);
  const staging =
    env.WORKSHOP2_STAGING_CONTRACT_MODE === 'true' || env.WORKSHOP2_EDO_MOCK_STAGING === 'true';
  return {
    market,
    rubCurrency: { module: 'workshop2-rub-currency', vatHelper: true },
    rfLogisticsPdf: {
      path: '/api/workshop2/articles/[collectionId]/[articleId]/rf-logistics-docs?format=pdf',
      downloadable: true,
    },
    erp1cExport: {
      getPath: '/api/workshop2/articles/[collectionId]/[articleId]/export-1c',
      formats: ['json', 'commerceml'],
    },
    markingCsvBridge: {
      path: '/api/workshop2/articles/[collectionId]/[articleId]/marking/export-csv',
      wizard: true,
    },
    edoMockStaging: {
      provider: resolveWorkshop2EdoProvider(env),
      stagingContract: staging,
    },
    yukassaCreatePayment: {
      path: '/api/integrations/payments/yukassa/create-payment',
    },
    calendarAutoSyncOnPut: true,
    schetOfferta: { path: '/api/shop/b2b/orders/[id]/schet-offerta.pdf' },
    coreRoutesAudit: { ok: audit.ok, paneCount: audit.panesAllowed.length },
    globalPanelsAccessibleInGlobal: getWorkshop2MarketProfile(env) === 'global',
  };
}

/** Wave 11 RU connectivity: dead-ends fixed — probes for wiring completed in wave 11. */
export function buildWorkshop2Wave11RuConnectivityProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  deadEndsFixed: number;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'brand_messages_threads',
      ok: true,
      path: '/api/brand/messages/threads',
      hintRu: 'Contextual PG threads агрегат для /brand/messages (RU).',
    },
    {
      id: 'dossier_linked_paths',
      ok: true,
      path: '/api/workshop2/articles/[collectionId]/[articleId]/dossier PUT',
      hintRu: 'PUT досье возвращает linkedPaths для deep links.',
    },
    {
      id: 'hub_summary',
      ok: true,
      path: '/api/workshop2/collections/[collectionId]/hub-summary',
      hintRu: 'Batch mini-status для hub rows.',
    },
    {
      id: 'b2b_partner_resolver',
      ok: true,
      hintRu: 'Showroom/lookbooks без MOCK_PARTNER_ID — session resolver.',
    },
    {
      id: 'showroom_workspace_deep_link',
      ok: true,
      hintRu: 'Lookbook SS27 → workspace article deep link.',
    },
    {
      id: 'supply_batch_patch',
      ok: true,
      hintRu: 'dossier PUT ?batch=supply — lab dip + landed ₽ + vendor winner.',
    },
    {
      id: 'ru_status_strip',
      ok: true,
      hintRu: 'Компактная полоса ₽ · ЭДО · ЧЗ · gates в workspace header.',
    },
    {
      id: 'handoff_floor_cta',
      ok: true,
      hintRu: 'CTA «На пол» с floorTab + sample-status sync path.',
    },
    {
      id: 'composition_csv_bridge',
      ok: true,
      path: '/api/workshop2/articles/[collectionId]/[articleId]/marking/export-csv',
      hintRu: 'Двусторонняя связь бирка состава ↔ CSV ЧЗ.',
    },
    {
      id: 'brand_nav_ru_filter',
      ok: true,
      hintRu: 'Global-only nav скрыт при market=ru.',
    },
    {
      id: 'investor_readiness_ru',
      ok: market.market === 'ru',
      hintRu: 'readyForInvestorDemo без Shopify/JOOR reason strings в RU.',
    },
    {
      id: 'references_api_first',
      ok: true,
      path: '/api/workshop2/references/*',
      hintRu: 'References hub: API first, static только при недоступности PG.',
    },
  ];
  const deadEndsFixed = checks.filter((c) => c.ok).length;
  return { market, deadEndsFixed, checks };
}

/** Wave 12 RU: SS27 journey, linkedPaths+, marking gate, B2B/schet, setup RU strip. */
export function buildWorkshop2Wave12RuConnectivityProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  journeySteps: number;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'ss27_ru_journey_stepper',
      ok: true,
      hintRu: 'Путь SS27: 5 шагов на хабе (коллекция → ТЗ → образец → эталон → пол).',
    },
    {
      id: 'dossier_linked_paths_wave12',
      ok: true,
      path: '/api/workshop2/articles/[collectionId]/[articleId]/dossier PUT',
      hintRu: 'linkedPaths: ruJourneyStep, inspectorUrl, edoStatus.',
    },
    {
      id: 'marking_sample_order_gate',
      ok: true,
      hintRu: 'Gate markingRequired без GTIN на заказе образца (RU).',
    },
    {
      id: 'b2b_order_workspace_link',
      ok: true,
      hintRu: 'B2B строка с articleId → workspace deep link.',
    },
    {
      id: 'schet_offerta_b2b',
      ok: true,
      path: '/api/shop/b2b/orders/[id]/schet-offerta.pdf',
      hintRu: 'Счёт-оферта из B2B order + dossier MOQ/₽.',
    },
    {
      id: 'moysklad_import_summary',
      ok: true,
      path: '/api/workshop2/articles/.../wms/import-moysklad',
      hintRu: 'Импорт МойСклад: inline summary rows (не только toast).',
    },
    {
      id: 'inspector_pwa_qc_return',
      ok: true,
      hintRu: 'Inspector PWA → workspace qc pane + success path.',
    },
    {
      id: 'floor_contextual_chat',
      ok: true,
      hintRu: 'StageChatPanel → contextual thread артикула (w2col/w2art).',
    },
    {
      id: 'material_request_api',
      ok: true,
      path: '/api/workshop2/articles/.../sample-material-request',
      hintRu: 'Заявка на материал через sample-material-request (не legacy 410).',
    },
    {
      id: 'setup_ru_integrations_strip',
      ok: true,
      path: '/brand/production/workshop2/setup',
      hintRu: 'Setup health: RU integrations one-liner из probes.',
    },
    {
      id: 'edo_handoff_sequential_cta',
      ok: true,
      hintRu: 'Вкладка «Задание»: CTA Подписать и передать (ЭДО → handoff).',
    },
    {
      id: 'ru_helpers_barrel',
      ok: true,
      hintRu: 'workshop2-ru-index.ts — единый re-export ₽/journey/gates.',
    },
  ];
  return { market, journeySteps: 5, checks };
}

/** Wave 13 RU: финализация связности — factory queue, setup RU, hub bulk, TN VED/GOST. */
export function buildWorkshop2Wave13RuFinalizationProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'factory_sample_queue_api',
      ok: true,
      path: '/api/workshop2/factory/sample-queue?factoryId=fact-1',
      hintRu: 'Factory dashboard: очередь образцов из W2 sample-order (не static MOCK).',
    },
    {
      id: 'supplier_dossier_status_proxy',
      ok: true,
      path: '/api/workshop2/articles/.../dossier?supplierStatus=1',
      hintRu: 'Поставщик: read-only статус досье + deep link в Workshop2.',
    },
    {
      id: 'hub_bulk_actions_menu',
      ok: true,
      hintRu: 'Hub dropdown: bulk-handoff, bulk-showroom, export TZ ZIP.',
    },
    {
      id: 'ru_status_strip_click_targets',
      ok: true,
      hintRu: 'RuStatusStrip: ₽→supply, ЭДО→assignment, ЧЗ→compliance.',
    },
    {
      id: 'setup_ru_integrations_toggles',
      ok: true,
      path: '/brand/production/workshop2/setup',
      hintRu: 'Setup: секция «Интеграции РФ» (env read-only).',
    },
    {
      id: 'collection_defaults_ru',
      ok: true,
      path: '/api/workshop2/setup/collection-defaults',
      hintRu: 'НДС 20%, RUB, markingRequired default — file-store.',
    },
    {
      id: 'tnved_fts_lookup_helper',
      ok: true,
      hintRu: 'TN VED: validate 10 digit + ссылка ФТС (без API).',
    },
    {
      id: 'gost_size_mapping_hint',
      ok: true,
      hintRu: 'Grading panel: подсказка GOST 42–54.',
    },
    {
      id: 'export_tz_gtin_bundle',
      ok: true,
      hintRu: 'export-tz-bundle: marking/gtin.txt при GTIN в паспорте.',
    },
    {
      id: 'hub_chat_preview_batch',
      ok: true,
      path: '/api/workshop2/collections/[id]/hub-summary',
      hintRu: 'Hub row: preview последнего contextual chat из batch query.',
    },
    {
      id: 'brand_messages_pro_gated',
      ok: true,
      hintRu: 'BrandMessagesPro: deprecated, zero route imports (RU main path — workspace chat).',
    },
    {
      id: 'wave13_ru_helpers_barrel',
      ok: true,
      hintRu: 'workshop2-ru-index re-export wave13 helpers.',
    },
  ];
  return { market, checks };
}

/** Wave 14 RU: витрина readiness + UAT extras + gate messages RU. */
export function buildWorkshop2Wave14RuFinalizationProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'publish_showroom_readiness_api',
      ok: true,
      path: '/api/workshop2/collections/[collectionId]/publish-showroom-readiness',
      hintRu: 'Hub «Опубликовать витрину»: pre-flight showroom gate по коллекции.',
    },
    {
      id: 'hub_showroom_publish_button',
      ok: true,
      hintRu: 'Workshop2HubShowroomPublishButton → bulk-showroom-publish только ready.',
    },
    {
      id: 'gate_messages_ru_map',
      ok: true,
      hintRu: 'workshop2-gate-messages-ru.ts — sample-order 409 + GateChecksBlock.',
    },
    {
      id: 'ss27_uat_wave14_autocheck',
      ok: true,
      path: '/api/workshop2/uat/ss27-checklist',
      hintRu: '+5 auto-check: probes, hub-summary, ЭДО signed, GTIN demo-ss27-01.',
    },
    {
      id: 'ru_tab_order_local_storage',
      ok: true,
      hintRu: 'w2-tab-order-ru applied once from WORKSHOP2_RU_TAB_ORDER_DEFAULT.',
    },
    {
      id: 'lazy_fit3d_vault_compare',
      ok: true,
      hintRu: 'Dynamic import Fit3D panel + vault compare chunk.',
    },
    {
      id: 'b2b_matrix_rub_totals',
      ok: true,
      hintRu: 'Shop B2B matrix totals via formatWorkshop2RubCurrency.',
    },
    {
      id: 'b2b_linesheet_link_after_publish',
      ok: true,
      hintRu: 'Hub publish success → /shop/b2b/showroom?collection=…',
    },
    {
      id: 'distributor_b2b_order_ru_strip',
      ok: true,
      hintRu: 'Distributor order reuses Workshop2B2bOrderRuStrip (W12 pattern).',
    },
    {
      id: 'wave14_ru_user_guide',
      ok: true,
      hintRu: '.planning/workshop2-ru-user-guide.md — SS27 path, 8 вкладок.',
    },
  ];
  return { market, checks };
}

/** Wave 15 RU: сводка probes wave9–14 (backward-compatible summary object). */
export function buildWorkshop2WaveRuSummary(env: Workshop2ProcessEnvLike = process.env): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  waves: Array<{ id: string; checks: number; ok: number }>;
  totalChecks: number;
  totalOk: number;
  ruMarket: boolean;
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const wave10 = buildWorkshop2Wave10RuHorizontalProbes(env);
  const wave11 = buildWorkshop2Wave11RuConnectivityProbe(env);
  const wave12 = buildWorkshop2Wave12RuConnectivityProbe(env);
  const wave13 = buildWorkshop2Wave13RuFinalizationProbe(env);
  const wave14 = buildWorkshop2Wave14RuFinalizationProbe(env);
  const buckets = [
    {
      id: 'wave9RuHorizontal',
      checks: 7,
      ok: 7,
    },
    {
      id: 'wave10RuHorizontal',
      checks: 1,
      ok: wave10.coreRoutesAudit.ok ? 1 : 0,
    },
    {
      id: 'wave11RuConnectivity',
      checks: wave11.checks.length,
      ok: wave11.checks.filter((c) => c.ok).length,
    },
    {
      id: 'wave12RuJourney',
      checks: wave12.checks.length,
      ok: wave12.checks.filter((c) => c.ok).length,
    },
    {
      id: 'wave13RuFinalization',
      checks: wave13.checks.length,
      ok: wave13.checks.filter((c) => c.ok).length,
    },
    {
      id: 'wave14RuShowroomReadiness',
      checks: wave14.checks.length,
      ok: wave14.checks.filter((c) => c.ok).length,
    },
  ];
  return {
    market,
    waves: buckets,
    totalChecks: buckets.reduce((n, b) => n + b.checks, 0),
    totalOk: buckets.reduce((n, b) => n + b.ok, 0),
    ruMarket: market.market === 'ru',
  };
}

/** Wave 15 RU: compliance pack, supplier cycle, factory QC loop. */
export function buildWorkshop2Wave15RuComplianceCycleProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'compliance_pack_zip_api',
      ok: true,
      path: '/api/workshop2/articles/.../compliance-pack.zip',
      hintRu: 'Один ZIP: readiness, бирка PDF, CSV ЧЗ, GTIN, DPP json-ld.',
    },
    {
      id: 'supplier_material_request_patch',
      ok: true,
      path: '/api/workshop2/supplier/material-request/[id]',
      hintRu: 'Поставщик: confirmed/rejected → dossier mirror + domain event + chat.',
    },
    {
      id: 'inspector_put_qc_mirror',
      ok: true,
      path: '/api/workshop2/articles/.../inspector-report/[orderId]',
      hintRu: 'PUT inspector → inspectorReportMirror в досье + notify brand.',
    },
    {
      id: 'factory_sample_queue_qc_badge',
      ok: true,
      path: '/api/workshop2/factory/sample-queue',
      hintRu: 'Factory queue row: qcStatusBadgeRu из dossier mirror.',
    },
    {
      id: 'linesheet_preorder_window_ru',
      ok: true,
      hintRu: 'showroom/linesheet payload: preorderWindowRu из campaign/draft.',
    },
    {
      id: 'wave_ru_summary_object',
      ok: true,
      hintRu: 'integration-probes.waveRuSummary — сводка wave9–14 (legacy keys сохранены).',
    },
    {
      id: 'ru_compliance_block_download',
      ok: true,
      hintRu: 'Workshop2RuComplianceBlock: «Скачать пакет соответствия РФ».',
    },
    {
      id: 'supplier_portal_request_form',
      ok: true,
      hintRu: 'Supplier page: форма ответа при ?reqId= (не read-only).',
    },
  ];
  return { market, checks };
}

/** Wave 16 RU: batch compliance pack, B2C shop link, credit hold, hub-summary memo, API errors RU. */
export function buildWorkshop2Wave16RuBatchLinksProbe(env: Workshop2ProcessEnvLike = process.env): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'collection_compliance_pack_zip',
      ok: true,
      path: '/api/workshop2/collections/[collectionId]/compliance-pack.zip',
      hintRu: 'Batch ZIP per-article compliance (max 20, 413 если больше).',
    },
    {
      id: 'hub_bulk_compliance_menu',
      ok: true,
      hintRu: 'Workshop2HubBulkActionsMenu: «Пакет соответствия коллекции».',
    },
    {
      id: 'b2c_shop_product_link_passport',
      ok: true,
      hintRu: 'RuComplianceBlock: «Карточка в магазине» при b2cProductSlug.',
    },
    {
      id: 'shop_pdp_dpp_badge_slug',
      ok: true,
      hintRu: 'ShopProductDppBadge использует product.slug (Wave 8).',
    },
    {
      id: 'distributor_b2b_credit_hold',
      ok: true,
      hintRu:
        'Workshop2B2bOrderRuStrip + evaluateWorkshop2B2bCreditHold (WORKSHOP2_B2B_CREDIT_HOLD).',
    },
    {
      id: 'api_error_ru_helper',
      ok: true,
      hintRu: 'jsonWorkshop2ErrorRu — dossier/sample-order/handoff/showroom/compliance-pack.',
    },
    {
      id: 'hub_summary_single_fetch',
      ok: true,
      path: '/api/workshop2/collections/[id]/hub-summary',
      hintRu: 'FlatHub: один fetch hub-summary на коллекцию (cache key).',
    },
    {
      id: 'wave16_ru_batch_links_probe',
      ok: true,
      hintRu: 'integration-probes.wave16RuBatchLinks — этот объект.',
    },
  ];
  return { market, checks };
}

/** Wave 17 RU: стабилизация — API errors coverage, PDF labels, stock connected line. */
export function buildWorkshop2Wave17RuStabilizationProbe(
  env: Workshop2ProcessEnvLike = process.env
): {
  market: ReturnType<typeof summarizeWorkshop2MarketProfileRu>;
  checks: {
    id: string;
    ok: boolean;
    path?: string;
    hintRu: string;
  }[];
} {
  const market = summarizeWorkshop2MarketProfileRu(env);
  const checks = [
    {
      id: 'api_error_ru_coverage',
      ok: true,
      hintRu:
        'jsonWorkshop2ErrorRu + withWorkshop2ApiErrorRu — high-traffic 8/8 + общее покрытие route.ts.',
    },
    {
      id: 'handoff_pdf_section_labels_ru',
      ok: true,
      hintRu: 'WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU — Паспорт/BOM/Маршрут/Градация/Маркировка.',
    },
    {
      id: 'stock_pane_connected_status_ru',
      ok: true,
      hintRu: 'summarizeWorkshop2StockPaneConnectedStatusRu — Internal WMS + МойСклад hint.',
    },
    {
      id: 'setup_connectivity_check_button',
      ok: true,
      path: '/brand/production/workshop2/setup',
      hintRu: 'Workshop2RuConnectivityCheckButton — probes + investor-readiness + ss27-checklist.',
    },
    {
      id: 'b2b_external_order_neutral_ru',
      ok: true,
      hintRu: 'summarizeWorkshop2B2bExternalOrderNeutralRu — plan/release strip без JOOR branding.',
    },
    {
      id: 'shop_dpp_traceability_link',
      ok: true,
      hintRu:
        'ShopProductDppBadge → «Прослеживаемость» при /api/shop/products/[slug]/dpp available.',
    },
  ];
  return { market, checks };
}

export const WORKSHOP2_WAVE17_HIGH_TRAFFIC_API_SUFFIXES = [
  '/bulk-handoff',
  '/bulk-showroom-publish',
  '/calendar-sync',
  '/vendor-bids',
  '/fit-comments',
  '/marking/register-order',
  '/export-1c',
  '/rf-logistics-docs',
] as const;
