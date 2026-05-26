import { HomePageDynamic } from '@/components/home/HomePageDynamic';
import { getHomeCmsServerBaseline } from '@/lib/home/get-home-cms-server';
import { tid } from '@/lib/ui/test-ids';

export default function Home() {
  const initialCms = getHomeCmsServerBaseline();

  return (
    <div data-testid={tid.page('public-home')}>
      <HomePageDynamic initialCms={initialCms} />
    </div>
  );
}
