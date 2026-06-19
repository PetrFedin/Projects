/** B2B OAuth inbound providers (JOOR | NuOrder). */
export const WORKSHOP2_B2B_OAUTH_PROVIDERS = ['joor', 'nuorder'] as const;

export type Workshop2B2bOAuthProviderId = (typeof WORKSHOP2_B2B_OAUTH_PROVIDERS)[number];
