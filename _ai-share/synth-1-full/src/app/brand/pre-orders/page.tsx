import { redirect } from 'next/navigation';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ROUTES } from '@/lib/routes';
import { PreOrdersLegacyClient } from '@/app/brand/pre-orders/pre-orders-legacy-client';

/** Core: golden path — реестр B2B; legacy pre-orders только вне platform core. */
export default function PreOrdersPage() {
  if (isPlatformCoreMode()) {
    redirect(ROUTES.brand.b2bOrders);
  }
  return <PreOrdersLegacyClient />;
}
