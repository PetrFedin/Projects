import { NextRequest, NextResponse } from 'next/server';

import { listWorkshop2BrandTenantRegistry } from '@/lib/production/workshop2-brand-tenant-registry';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

/** GET brand↔tenant registry для rep switcher и export filter. */
export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const brands = listWorkshop2BrandTenantRegistry();
  return NextResponse.json({
    ok: true,
    brands,
    labelRu: `${brands.length} бренд(ов) в tenant registry.`,
  });
}
