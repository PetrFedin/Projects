import { z } from 'zod';
import { INTEGRATION_PLATFORMS, ORDER_SOURCE_PLATFORMS } from './integration-platform';

export const integrationPlatformZ = z.enum(INTEGRATION_PLATFORMS);
export const orderSourcePlatformZ = z.enum(ORDER_SOURCE_PLATFORMS);

export const integrationExternalRefSchema = z.object({
  platform: integrationPlatformZ,
  externalId: z.string().min(1),
  externalRevision: z.string().optional(),
  synthaEntityType: z.enum([
    'article',
    'collection',
    'sku',
    'wholesale_order',
    'po',
    'supplier',
    'material',
    'thread',
  ]),
  synthaEntityId: z.string().min(1),
  lastSyncedAt: z.string(),
  syncDirection: z.enum(['inbound', 'outbound', 'bidirectional']),
  payloadHash: z.string().optional(),
});

export type IntegrationExternalRef = z.infer<typeof integrationExternalRefSchema>;

export const operationalOrderIntegrationSchema = z.object({
  sourcePlatform: orderSourcePlatformZ.optional(),
  externalOrderId: z.string().optional(),
  externalStatus: z.string().optional(),
  lastSyncedAt: z.string().optional(),
  syncHealth: z.enum(['ok', 'degraded', 'error']).optional(),
});

export type OperationalOrderIntegration = z.infer<typeof operationalOrderIntegrationSchema>;

export const integrationSyncHealthZ = z.enum(['ok', 'degraded', 'error', 'unknown']);

export const integrationConnectorStatusSchema = z.object({
  id: z.string(),
  platform: integrationPlatformZ,
  label: z.string(),
  configured: z.boolean(),
  health: integrationSyncHealthZ,
  lastSync: z.string().optional(),
  lifecycle: z.enum(['stub', 'beta', 'live']),
  description: z.string().optional(),
});

export type IntegrationConnectorStatus = z.infer<typeof integrationConnectorStatusSchema>;

export const integrationsV1StatusSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    connectors: z.array(integrationConnectorStatusSchema),
  }),
  meta: z.object({
    requestId: z.string(),
    mode: z.enum(['demo', 'prod']),
    apiVersion: z.literal('v1'),
  }),
});

export const orderImportRequestSchema = z.object({
  externalOrderId: z.string().min(1).optional(),
  orders: z.array(z.record(z.unknown())).optional(),
  dryRun: z.boolean().optional(),
});

export const orderImportResultSchema = z.object({
  wholesaleOrderId: z.string(),
  externalOrderId: z.string(),
  platform: integrationPlatformZ,
  status: z.string(),
  created: z.boolean(),
  warnings: z.array(z.string()).optional(),
});

export const orderImportSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    results: z.array(orderImportResultSchema),
  }),
  meta: z.object({
    requestId: z.string(),
    mode: z.enum(['demo', 'prod']),
    apiVersion: z.literal('v1'),
  }),
});

export const eligibleGateSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    collectionId: z.string(),
    articleId: z.string(),
    eligibleForCollection: z.boolean(),
    reasons: z.array(z.string()),
    sources: z.array(z.enum(['syntha_signoff', 'centric_approved', 'lifecycle'])),
  }),
  meta: z.object({
    requestId: z.string(),
    mode: z.enum(['demo', 'prod']),
    apiVersion: z.literal('v1'),
  }),
});
