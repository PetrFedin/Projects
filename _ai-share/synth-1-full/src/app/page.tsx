import { HomePageDynamic } from '@/components/home/HomePageDynamic';
import { getHomeCmsServerBaseline } from '@/lib/home/get-home-cms-server';
import { getHomeProductsServerBaseline } from '@/lib/home/get-home-products-server';
import { tid } from '@/lib/ui/test-ids';

export default function Home() {
  const initialCms = getHomeCmsServerBaseline();
  const initialProducts = getHomeProductsServerBaseline();

  return (
    <div data-testid={tid.page('public-home')}>
      <HomePageDynamic initialCms={initialCms} initialProducts={initialProducts} />
    </div>
  );
}
