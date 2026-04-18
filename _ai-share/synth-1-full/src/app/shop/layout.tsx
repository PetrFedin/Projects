'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { shopNavGroups, mainShopNavLinks } from '@/lib/data/shop-navigation-normalized';
import { useAuth } from '@/providers/auth-provider';
import { useRbac } from '@/hooks/useRbac';
import { canSeeShopNavGroup } from '@/lib/data/profile-page-features';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ShopSidebarHeader } from '@/components/shop/ShopSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SearchBar } from '@/components/search/SearchBar';

function ShopLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { role, can } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredShopGroups = shopNavGroups.filter((g) => canSeeShopNavGroup(role, g.id, can));
  const hasNoAccess = filteredShopGroups.length === 0;

  const getShopCurrentTab = () => {
    const sortedLinks = [...mainShopNavLinks].sort((a, b) => b.href.length - a.href.length);
    const currentBase = sortedLinks.find((link) => {
      const normalizedPath = pathname.replace(/\/$/, '') || '/';
      const normalizedLink = link.href.replace(/\/$/, '') || '/';
      if (normalizedLink === '/shop') return normalizedPath === '/shop';
      return normalizedPath === normalizedLink || normalizedPath.startsWith(normalizedLink + '/');
    });
    return currentBase?.value || 'dashboard';
  };

  const activeTab = getShopCurrentTab();
  const activeLink = mainShopNavLinks.find((l) => l.value === activeTab);

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
          </div>
        </aside>

        {/* Мобильное меню — Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <ShopSidebarHeader />
            </div>
            <div className="shrink-0 border-b border-slate-100 px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ShopSidebar groups={filteredShopGroups} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Основная область */}
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
                  <Badge
                    key={idx}
                    variant="outline"
                    className="h-7 animate-pulse border-rose-100 bg-rose-50/30 px-2 text-[7px] font-black uppercase tracking-widest text-rose-600"
                  >
                    {alert.message}
                  </Badge>
                ))}
              </div>
            </div>

            <main className="duration-300 animate-in fade-in">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xs font-medium uppercase tracking-widest text-slate-400">
          Загрузка…
        </div>
      }
    >
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </Suspense>
  );
}
