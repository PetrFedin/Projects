/**
 * Wave 11 RU: единый resolver partnerId для B2B showroom/lookbooks — без hardcoded MOCK_PARTNER_ID.
 * Приоритет: session localStorage → активный org профиля → demo retail_msk_1 (RU territory map).
 */
import { getPartnerTerritories } from '@/lib/b2b/partner-territory-map';

export const B2B_ACTIVE_RETAIL_PARTNER_LS_KEY = 'b2b_active_retail_partner_id';

const DEFAULT_RU_DEMO_PARTNER_ID = 'retail_msk_1';

/** SS27 showroom campaigns в PG привязаны к invited retail partners из territory map. */
export function resolveRetailPartnerIdForB2bSession(input?: {
  activeOrganizationId?: string | null;
  /** Явный override (тесты, deep link). */
  explicitPartnerId?: string | null;
}): string {
  const explicit = input?.explicitPartnerId?.trim();
  if (explicit) return explicit;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(B2B_ACTIVE_RETAIL_PARTNER_LS_KEY)?.trim();
      if (stored) return stored;
    } catch {
      /* ignore */
    }
  }

  const org = input?.activeOrganizationId?.trim();
  if (org) {
    const territories = getPartnerTerritories();
    const match = territories.find((p) => p.partnerId === org || p.status === 'active');
    if (match?.partnerId) return match.partnerId;
  }

  return DEFAULT_RU_DEMO_PARTNER_ID;
}

export function persistRetailPartnerIdForSession(partnerId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(B2B_ACTIVE_RETAIL_PARTNER_LS_KEY, partnerId.trim());
  } catch {
    /* ignore */
  }
}
