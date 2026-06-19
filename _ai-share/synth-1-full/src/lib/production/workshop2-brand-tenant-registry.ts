/**
 * Wave 52: multi-tenant brand registry — env JSON, cart scope, checkout tenant validate.
 */
import type { Workshop2B2bCartSession } from '@/lib/production/workshop2-b2b-wave23-parity';

export type Workshop2BrandTenantEntry = {
  brandId: string;
  tenantId: string;
  labelRu: string;
  active?: boolean;
};

const DEFAULT_REGISTRY: Workshop2BrandTenantEntry[] = [
  { brandId: 'demo-brand', tenantId: 'tenant-demo', labelRu: 'Demo Brand SS27', active: true },
];

function parseRegistryJson(raw: string | undefined): Workshop2BrandTenantEntry[] {
  if (!raw?.trim()) return DEFAULT_REGISTRY;
  try {
    const parsed = JSON.parse(raw) as Workshop2BrandTenantEntry[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_REGISTRY;
    return parsed.filter((e) => e.brandId && e.tenantId);
  } catch {
    return DEFAULT_REGISTRY;
  }
}

/** Registry from WORKSHOP2_BRAND_TENANT_REGISTRY_JSON env. */
export function listWorkshop2BrandTenantRegistry(
  env: Record<string, string | undefined> = process.env
): Workshop2BrandTenantEntry[] {
  return parseRegistryJson(env.WORKSHOP2_BRAND_TENANT_REGISTRY_JSON).filter(
    (e) => e.active !== false
  );
}

export function resolveWorkshop2BrandTenant(
  brandId: string,
  env: Record<string, string | undefined> = process.env
): Workshop2BrandTenantEntry | null {
  const id = brandId.trim();
  if (!id) return null;
  return listWorkshop2BrandTenantRegistry(env).find((e) => e.brandId === id) ?? null;
}

export function validateWorkshop2B2bCartLineBrandScope(input: {
  session: Pick<Workshop2B2bCartSession, 'lines' | 'brandId'>;
  lineBrandId: string;
}): { ok: true } | { ok: false; messageRu: string } {
  const lineBrand = input.lineBrandId.trim() || 'demo-brand';
  const sessionBrand =
    input.session.brandId?.trim() ||
    input.session.lines.find((l) => l.brandId)?.brandId?.trim() ||
    '';
  if (!sessionBrand || sessionBrand === lineBrand) return { ok: true };
  return {
    ok: false,
    messageRu: `Смешение брендов в корзине: ${sessionBrand} и ${lineBrand}. Оформите отдельно.`,
  };
}

export function validateWorkshop2B2bCheckoutBrandTenant(input: {
  session: Workshop2B2bCartSession;
}): { ok: true; brandId: string; tenantId: string } | { ok: false; messageRu: string } {
  const brandId =
    input.session.brandId?.trim() ||
    input.session.lines.find((l) => l.brandId)?.brandId?.trim() ||
    'demo-brand';
  const entry = resolveWorkshop2BrandTenant(brandId);
  if (!entry) {
    return {
      ok: false,
      messageRu: `Бренд «${brandId}» не зарегистрирован в tenant registry.`,
    };
  }
  return { ok: true, brandId: entry.brandId, tenantId: entry.tenantId };
}
