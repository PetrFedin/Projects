'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Store, ShoppingCart, Heart, Loader2, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { canAccessHub } from '@/lib/data/profile-page-features';
import { ErrorBoundary } from '@/components/error-boundary';
import { clientNavGroups } from '@/lib/data/client-navigation';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const CLIENT_ROLES = ['client', 'admin'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = CLIENT_ROLES.includes(role);
  const canShop = canAccessHub(role, 'shop');

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1400px] flex-col items-center justify-center px-8 py-12 text-center">
        <p className="mb-2 font-medium text-slate-500">
          Нет доступа к личному кабинету для роли {role}
        </p>
        <p className="mb-4 text-sm text-slate-400">Доступ: client.</p>
        <Link href="/" className="text-sm font-bold text-indigo-600 hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const getCurrentLabel = () => {
    const flat = clientNavGroups.flatMap((g) => g.links);
    const sorted = flat.sort((a, b) => b.href.length - a.href.length);
    const current = sorted.find((l) => {
      const p = (pathname || '').replace(/\/$/, '') || '/';
      const h = (l.href || '').replace(/\/$/, '') || '/';
      return p === h || p.startsWith(h + '/');
    });
    return current?.label || 'Главная';
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-[#f8fafc] pb-12 font-sans">
        <aside className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <HubSidebarHeader
            href="/client"
            icon={User}
            title="Личный кабинет"
            badge="CLIENT"
            badgeClass="bg-violet-50 text-violet-600"
            iconBgClass="bg-violet-900"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={clientNavGroups}
              basePath="/client"
              accentClass="text-violet-600"
              activeBgClass="bg-violet-600"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href="/client"
                icon={User}
                title="Личный кабинет"
                badge="CLIENT"
                badgeClass="bg-violet-50 text-violet-600"
                iconBgClass="bg-violet-900"
              />
            </div>
            <div className="shrink-0 border-b border-slate-100 px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HubSidebar
                groups={clientNavGroups}
                basePath="/client"
                accentClass="text-violet-600"
                activeBgClass="bg-violet-600"
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1 lg:pl-52">
          <div className="space-y-4 pl-2 pr-4 pt-6 lg:pl-3 lg:pr-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-[4px] hover:bg-slate-100 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                </Button>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-violet-900 text-white">
                  <User className="h-5.5 w-5.5" />
                </div>
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-sm font-black uppercase leading-none tracking-tighter text-slate-900 sm:text-base">
                    Личный кабинет
                  </h1>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-violet-200 text-[8px] font-bold capitalize text-violet-700"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
              <nav className="flex shrink-0 flex-wrap items-center gap-2">
                <Link
                  href="/client"
                  className="rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Главная
                </Link>
                <Link
                  href="/client/wardrobe"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Store className="h-3.5 w-3.5" /> Гардероб
                </Link>
                <Link
                  href="/client/wishlist"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Heart className="h-3.5 w-3.5" /> Избранное
                </Link>
                <Link
                  href="/client/catalog"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Store className="h-3.5 w-3.5" /> Каталог
                </Link>
                {canShop && (
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Shop
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] rounded-full bg-violet-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
                  {getCurrentLabel()}
                </h2>
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
