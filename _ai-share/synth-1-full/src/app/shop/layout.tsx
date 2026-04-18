'use client';

import React, { useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  shopNavGroups,
  mainShopNavLinks,
  getMainShopNavTabValue,
  filterShopNavGroupsByTier,
  getShopNavDisplayMode,
} from '@/lib/data/shop-navigation-normalized';
import { useAuth } from '@/providers/auth-provider';
import { useRbac } from '@/hooks/useRbac';
import { canSeeShopNavGroup } from '@/lib/data/profile-page-features';
import { ErrorBoundary } from '@/components/error-boundary';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ShopSidebarHeader } from '@/components/shop/ShopSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SearchBar } from '@/components/search/SearchBar';
import {
  CabinetHubMain,
  CabinetHubSectionBar,
  CabinetHubTitleRow,
} from '@/components/layout/cabinet-hub-chrome';
import { cabinetRoleLabelRu } from '@/lib/ui/cabinet-role-labels';
import { cn } from '@/lib/utils';
import { cabinetSidebarLayout } from '@/lib/ui/cabinet-surface';

function ShopLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const { profile } = useAuth();
  const { role, can } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rbacFiltered = shopNavGroups.filter((g) => canSeeShopNavGroup(role, g.id, can));
  /** Если матрица RBAC не даёт ни одной группы (напр. designer/technologist), не блокируем весь Shop — показываем полное меню как в демо. */
  const afterRbac = rbacFiltered.length > 0 ? rbacFiltered : shopNavGroups;
  const sidebarGroups = filterShopNavGroupsByTier(afterRbac, getShopNavDisplayMode());

  const getShopCurrentTab = () => getMainShopNavTabValue(pathname);

  const activeTab = getShopCurrentTab();
  const activeLink = mainShopNavLinks.find((l) => l.value === activeTab);

  return (
    <ErrorBoundary>
      <div className="bg-bg-surface flex min-h-screen w-full pb-12 font-sans">
        {/* Desktop-сайдбар: `cabinetSidebarLayout` в cabinet-surface.ts */}
        <aside
          className={cn(
            'lg:border-border-subtle lg:bg-bg-surface hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:pt-4',
            cabinetSidebarLayout.asideWidthStandard
          )}
        >
          <ShopSidebarHeader />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <ShopSidebar groups={sidebarGroups} />
          </div>
        </aside>

        {/* Мобильное меню — Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <ShopSidebarHeader />
            </div>
            <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ShopSidebar groups={sidebarGroups} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Основная область */}
        <div className={cn('min-w-0 flex-1', cabinetSidebarLayout.mainPaddingLeftStandard)}>
          <CabinetHubMain className="space-y-2 pt-2">
            <CabinetHubTitleRow
              className="border-border-subtle gap-2 border-b pb-2"
              onOpenMobileNav={() => setSidebarOpen(true)}
              hubIcon={ShoppingCart}
              iconTileClassName="bg-text-primary text-text-inverse shadow-xl shadow-black/15 ring-1 ring-border-subtle"
              title="Ритейл-центр"
              badges={
                <>
                  <Badge className="hidden shrink-0 rounded-sm border-none bg-rose-50 px-2 py-0.5 text-[8px] font-black tracking-widest text-rose-600 hover:bg-rose-50 sm:inline-flex">
                    Магазин
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-border-subtle text-text-secondary shrink-0 text-[8px] font-bold"
                  >
                    {cabinetRoleLabelRu(role)}
                  </Badge>
                </>
              }
              trailing={<SearchBar />}
            />
            <CabinetHubSectionBar
              accentClassName="bg-rose-500"
              breadcrumbItems={['Аккаунт', 'Кабинет магазина', activeLink?.label || 'Дашборд']}
              sectionTitle={activeLink?.label || 'Дашборд'}
              trailing={
                <>
                  {profile?.alerts?.map((alert: any, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="h-7 animate-pulse border-rose-100 bg-rose-50/30 px-2 text-[7px] font-black uppercase tracking-widest text-rose-600"
                    >
                      {alert.message}
                    </Badge>
                  ))}
                </>
              }
            />

            <main className="duration-300 animate-in fade-in">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </CabinetHubMain>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-surface text-text-muted flex min-h-screen items-center justify-center text-xs font-medium uppercase tracking-widest">
          Загрузка…
        </div>
      }
    >
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </Suspense>
  );
}
