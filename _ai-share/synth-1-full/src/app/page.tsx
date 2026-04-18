import { HomePageDynamic } from '@/components/home/HomePageDynamic';
import { tid } from '@/lib/ui/test-ids';

export default function Home() {
  return (
    <div data-testid={tid.page('public-home')}>
      <HomePageDynamic />
    </div>
  );
}
