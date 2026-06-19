import { redirect } from 'next/navigation';
import { HomePageDynamic } from '@/components/home/HomePageDynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { getHomeCmsServerBaseline } from '@/lib/home/get-home-cms-server';
import { getHomeProductsServerBaseline } from '@/lib/home/get-home-products-server';
import { tid } from '@/lib/ui/test-ids';

export default function Home() {
  if (isPlatformCoreMode()) {
    redirect('/platform');
  }
  const initialCms = getHomeCmsServerBaseline();
  const initialProducts = getHomeProductsServerBaseline();

  return (
    <div data-testid={tid.page('public-home')}>
      <HomePageDynamic initialCms={initialCms} initialProducts={initialProducts} />
    </div>
  );
}
