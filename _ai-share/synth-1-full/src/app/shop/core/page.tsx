import { PlatformCoreCabinetPage } from '@/components/platform/PlatformCoreCabinetPage';
import { ROUTES } from '@/lib/routes';

export const dynamic = 'force-dynamic';

export default function ShopCoreCabinetPage() {
  return <PlatformCoreCabinetPage roleId="shop" fallbackHref={ROUTES.shop.home} />;
}
