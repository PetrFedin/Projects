'use client';

import type { UserProfile } from '@/lib/types';
import { sanitizeFetchRequestHeaders } from '@/lib/production/workshop2-api-header-codec';

export type Workshop2ApiClientContext = {
  user: UserProfile | null;
  canEditProduction: boolean;
  canViewProduction: boolean;
  organizationId?: string;
  updatedByLabel?: string;
  /** Платформенная роль (technologist, manager, …) для ACL справочников. */
  platformRole?: string;
};

let clientContext: Workshop2ApiClientContext | null = null;

/** Регистрирует actor/RBAC для fetch `/api/workshop2/*` (вызывать из workspace). */
export function setWorkshop2ApiClientContext(ctx: Workshop2ApiClientContext | null): void {
  clientContext = ctx;
}

export function getWorkshop2ApiClientContext(): Workshop2ApiClientContext | null {
  return clientContext;
}

/** Заголовки actor + org для enterprise API. */
export function buildWorkshop2ApiRequestHeaders(
  extra?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    ...extra,
  };
  const ctx = clientContext;
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('syntha_access_token')?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (!ctx) return sanitizeFetchRequestHeaders(headers);

  const label =
    ctx.updatedByLabel?.trim() || ctx.user?.displayName?.trim() || ctx.user?.email?.trim() || '';
  if (label) {
    headers['x-w2-updated-by'] = label;
    headers['x-w2-actor-label'] = label;
  }
  if (ctx.user?.uid) {
    headers['x-w2-actor-id'] = ctx.user.uid;
  }
  if (ctx.user?.activeOrganizationId || ctx.organizationId) {
    const org = ctx.organizationId ?? ctx.user?.activeOrganizationId ?? '';
    if (org) {
      headers['x-w2-actor-org'] = org;
      headers['x-w2-organization-id'] = org;
    }
  }
  const roles: string[] = [];
  if (ctx.canEditProduction) roles.push('production:edit');
  if (ctx.canViewProduction) roles.push('production:view');
  const platformRole = ctx.platformRole?.trim().toLowerCase();
  if (platformRole && platformRole !== 'admin') roles.push(platformRole);
  if (ctx.canEditProduction) {
    roles.push('w2:audit_read', 'w2:events_read');
  } else if (ctx.canViewProduction) {
    roles.push('w2:audit_read');
  }
  if (roles.length) headers['x-w2-actor-roles'] = [...new Set(roles)].join(',');

  return sanitizeFetchRequestHeaders(headers);
}
