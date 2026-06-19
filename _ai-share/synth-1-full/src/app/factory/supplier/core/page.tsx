import { PlatformCoreCabinetPage } from '@/components/platform/PlatformCoreCabinetPage';
import { ROUTES } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default function SupplierCoreCabinetPage() {
  return <PlatformCoreCabinetPage roleId="supplier" fallbackHref={ROUTES.factory.supplier} />;
}
