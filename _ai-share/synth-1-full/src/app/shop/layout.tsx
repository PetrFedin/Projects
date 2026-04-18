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

<<<<<<< HEAD
  if (hasNoAccess) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1600px] flex-col items-center justify-center px-8 py-12 text-center">
        <p className="mb-2 font-medium text-slate-500">
          Нет доступа к разделам Shop для вашей роли
        </p>
        <p className="mb-4 text-sm text-slate-400">
          Обратитесь к администратору для расширения прав.
        </p>
        <Link href="/" className="text-sm font-bold text-indigo-600 hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-[#f8fafc] pb-12 font-sans">
        {/* Вертикальная панель — desktop (как в Brand) */}
        <aside className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <ShopSidebarHeader />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <ShopSidebar groups={filteredShopGroups} />
=======
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
>>>>>>> recover/cabinet-wip-from-stash
          </div>
        </aside>

        {/* Мобильное меню — Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <ShopSidebarHeader />
            </div>
<<<<<<< HEAD
            <div className="shrink-0 border-b border-slate-100 px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
<<<<<<< HEAD
              <ShopSidebar groups={filteredShopGroups} onNavigate={() => setSidebarOpen(false)} />
=======
              <ShopSidebar groups={sidebarGroups} onNavigate={() => setSidebarOpen(false)} />
>>>>>>> recover/cabinet-wip-from-stash
            </div>
          </SheetContent>
        </Sheet>

        {/* Основная область */}
<<<<<<< HEAD
        <div className="min-w-0 flex-1 lg:pl-52">
          <div className="space-y-4 pl-2 pr-4 pt-6 lg:pl-3 lg:pr-6">
            {/* Header: Title Row (как в Brand) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-[4px] hover:bg-slate-100 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                  <span className="sr-only">Меню</span>
                </Button>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-slate-900 text-white shadow-xl shadow-slate-200 ring-1 ring-slate-800">
                  <ShoppingCart className="h-5.5 w-5.5" />
                </div>
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-sm font-black uppercase leading-none tracking-tighter text-slate-900 sm:text-base">
                    Ритейл-центр
                  </h1>
                  <Badge className="hidden shrink-0 rounded-[2px] border-none bg-rose-50 px-2 py-0.5 text-[8px] font-black tracking-widest text-rose-600 hover:bg-rose-50 sm:inline-flex">
                    RETAIL_NODE
                  </Badge>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-slate-200 text-[8px] font-bold capitalize text-slate-500"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <SearchBar />
              </div>
            </div>

            {/* Section badge row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] rounded-full bg-rose-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
                  {activeLink?.label || 'Дашборд'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {profile?.alerts?.map((alert: any, idx: number) => (
=======
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
>>>>>>> recover/cabinet-wip-from-stash
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="h-7 animate-pulse border-rose-100 bg-rose-50/30 px-2 text-[7px] font-black uppercase tracking-widest text-rose-600"
=======
                    className="border-border-subtle text-text-secondary shrink-0 text-[8px] font-bold"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xs font-medium uppercase tracking-widest text-slate-400">
=======
        <div className="bg-bg-surface text-text-muted flex min-h-screen items-center justify-center text-xs font-medium uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
          Загрузка…
        </div>
      }
    >
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </Suspense>
  );
}
