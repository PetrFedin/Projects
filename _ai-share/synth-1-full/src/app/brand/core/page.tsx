import { PlatformCoreCabinetPage } from '@/components/platform/PlatformCoreCabinetPage';
import { ROUTES } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default function BrandCoreCabinetPage() {
  return <PlatformCoreCabinetPage roleId="brand" fallbackHref={ROUTES.brand.dashboard} />;
}
