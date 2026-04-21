'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { RouteGuard } from '@/components/route-guard';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { TooltipProvider } from '../ui/tooltip';
import { LeftSidebarNav } from './left-sidebar-nav';
import { OfflineBanner } from '@/components/brand/production/OfflineBanner';
import { RegisterServiceWorker } from '@/components/pwa/RegisterServiceWorker';
import { NuqsProvider } from '@/components/providers/nuqs-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import GlobalPodcastPlayer from './global-podcast-player';

const AiStylist = dynamic(() => import('@/components/ai-stylist'), { ssr: false });
const CartSheet = dynamic(() => import('@/components/layout/cart-sheet'), { ssr: false });
const WishlistSheet = dynamic(() => import('@/components/layout/wishlist-sheet'), { ssr: false });
const PreOrderSheet = dynamic(() => import('@/components/layout/pre-order-sheet'), { ssr: false });
const ComparisonPanel = dynamic(() => import('../comparison-panel'), { ssr: false });
const RolePanel = dynamic(() => import('./role-panel'), { ssr: false });

const CABINET_ROUTES = [
  ROUTES.brand.home,
  ROUTES.admin.home,
  ROUTES.shop.home,
  ROUTES.factory.home,
  ROUTES.distributor.home,
  ROUTES.client.home,
];

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCabinet = pathname && CABINET_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <NuqsProvider>
      <ThemeProvider>
        <TooltipProvider>
          <RouteGuard>
            <RegisterServiceWorker />
            <div className="relative flex min-h-screen flex-col">
              <OfflineBanner />
              <GlobalPodcastPlayer />
              {/* Верхняя панель показывается везде, включая кабинеты */}
              <Header />
              {/* Иначе fixed z-[100] перекрывает собственный сайдбар кабинета (бренд z-30) и «съедает» клики слева. */}
              {!isCabinet ? <LeftSidebarNav /> : null}
              <main className={cn('flex-1', isCabinet ? '' : 'pb-32')}>{children}</main>
              {!isCabinet && <Footer />}
              <CartSheet />
              <WishlistSheet />
              <PreOrderSheet />
              <AiStylist />
              <ComparisonPanel />
              <RolePanel />
              <Toaster />
            </div>
          </RouteGuard>
        </TooltipProvider>
      </ThemeProvider>
    </NuqsProvider>
  );
}
