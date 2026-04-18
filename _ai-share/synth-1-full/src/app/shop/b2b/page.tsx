import { redirect } from 'next/navigation';

/** Корень `/shop/b2b` — редирект на дашборд; сценарии опта в сайдбаре `/shop`. */
export default function ShopB2BRootPage() {
  redirect('/shop');
}
