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
      <div className="max-w-[1600px] mx-auto px-8 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-slate-500 font-medium mb-2">Нет доступа к разделам Shop для вашей роли</p>
        <p className="text-slate-400 text-sm mb-4">Обратитесь к администратору для расширения прав.</p>
        <Link href="/" className="text-indigo-600 hover:underline text-sm font-bold">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex w-full bg-[#f8fafc] min-h-screen font-sans pb-12">
        {/* Вертикальная панель — desktop (как в Brand) */}
        <aside className="hidden lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:z-30 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <ShopSidebarHeader />
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            <ShopSidebar groups={filteredShopGroups} />
          </div>
        </aside>

        {/* Мобильное меню — Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0 gap-0 flex flex-col">
            <div className="pt-12 pb-0 shrink-0">
              <ShopSidebarHeader />
            </div>
            <div className="px-3 pb-2 border-b border-slate-100 shrink-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Навигация</p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ShopSidebar groups={filteredShopGroups} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Основная область */}
        <div className="flex-1 min-w-0 lg:pl-52">
          <div className="pl-2 pr-4 lg:pl-3 lg:pr-6 pt-6 space-y-4">
            {/* Header: Title Row (как в Brand) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-11 w-11 rounded-[4px] shrink-0 hover:bg-slate-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                  <span className="sr-only">Меню</span>
                </Button>
                <div className="h-11 w-11 rounded-[4px] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 ring-1 ring-slate-800 shrink-0">
                  <ShoppingCart className="h-5.5 w-5.5" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <h1 className="text-sm sm:text-base font-black uppercase tracking-tighter leading-none text-slate-900 truncate">
                    Ритейл-центр
                  </h1>
                  <Badge className="hidden sm:inline-flex bg-rose-50 text-rose-600 hover:bg-rose-50 border-none text-[8px] font-black tracking-widest px-2 py-0.5 rounded-[2px] shrink-0">
                    RETAIL_NODE
                  </Badge>
                  <Badge variant="outline" className="text-[8px] font-bold border-slate-200 text-slate-500 capitalize shrink-0">
                    {role}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <SearchBar />
              </div>
            </div>

            {/* Section badge row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] bg-rose-500 rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
                  {activeLink?.label || 'Дашборд'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {profile?.alerts?.map((alert: any, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="h-7 border-rose-100 bg-rose-50/30 text-rose-600 text-[7px] font-black uppercase tracking-widest px-2 animate-pulse"
                  >
                    {alert.message}
                  </Badge>
                ))}
              </div>
            </div>

            <main className="animate-in fade-in duration-300">
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          Загрузка…
        </div>
      }
    >
      <ShopLayoutContent>{children}</ShopLayoutContent>
    </Suspense>
  );
}
