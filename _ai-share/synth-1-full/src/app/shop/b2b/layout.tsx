import { B2bWorkshopChrome } from '@/components/shop/b2b/B2bWorkshopChrome';
import { ShopB2bCoreLayoutGuard } from '@/app/shop/b2b/shop-b2b-core-layout-guard';

/** Wave 58: все /shop/b2b/* — единый B2bWorkshopChrome (investor + iPad path). */
export default function ShopB2bLayout({ children }: { children: React.ReactNode }) {
  return (
    <B2bWorkshopChrome>
      <ShopB2bCoreLayoutGuard>{children}</ShopB2bCoreLayoutGuard>
    </B2bWorkshopChrome>
  );
}
