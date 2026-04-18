'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Store, Factory, ShoppingCart, Loader2, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { canAccessHub } from '@/lib/data/profile-page-features';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';
import { distributorNavGroups } from '@/lib/data/distributor-navigation';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  CabinetHubMain,
  CabinetHubSectionBar,
  CabinetHubTitleRow,
} from '@/components/layout/cabinet-hub-chrome';
import { cabinetRoleLabelRu } from '@/lib/ui/cabinet-role-labels';
import { cabinetSidebarLayout, cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';

const DISTRIBUTOR_ROLES = ['distributor', 'admin'];

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = DISTRIBUTOR_ROLES.includes(role);

  const hubs = [
    { href: ROUTES.brand.home, hub: 'brand' as const, label: 'Бренд', icon: Store },
    { href: ROUTES.shop.home, hub: 'shop' as const, label: 'Магазин', icon: ShoppingCart },
    {
      href: ROUTES.factory.production,
      hub: 'factory' as const,
      label: 'Производство',
      icon: Factory,
    },
    {
      href: ROUTES.factory.supplier,
      hub: 'supplier' as const,
      label: 'Поставщик',
      icon: Warehouse,
    },
  ].filter((h) => canAccessHub(role, h.hub));

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
<<<<<<< HEAD
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
=======
      <div className="bg-bg-surface flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-amber-600" />
>>>>>>> recover/cabinet-wip-from-stash
      </div>
    );
  }

  if (!hasAccess) {
    return (
<<<<<<< HEAD
      <div className="mx-auto flex min-h-[50vh] max-w-[1400px] flex-col items-center justify-center px-8 py-12 text-center">
        <p className="mb-2 font-medium text-slate-500">
          Нет доступа к Distributor Hub для роли {role}
        </p>
        <p className="mb-4 text-sm text-slate-400">Доступ: distributor.</p>
        <Link href="/" className="text-sm font-bold text-indigo-600 hover:underline">
=======
      <div className={cabinetSurface.hubAccessDeniedShell}>
        <p className="text-text-secondary mb-2 font-medium">
          Нет доступа к кабинету дистрибьютора для роли {role}
        </p>
        <p className="text-text-muted mb-4 text-sm">Доступ: роль «дистрибутор».</p>
        <Link href="/" className="text-accent-primary text-sm font-bold hover:underline">
>>>>>>> recover/cabinet-wip-from-stash
          На главную
        </Link>
      </div>
    );
  }

  const getCurrentLabel = () => {
    const flat = distributorNavGroups.flatMap((g) => g.links);
    const sorted = flat.sort((a, b) => b.href.length - a.href.length);
    const current = sorted.find((l) => {
      const p = (pathname || '').replace(/\/$/, '') || '/';
      const h = l.href.replace(/\/$/, '') || '/';
      return p === h || p.startsWith(h + '/');
    });
    return current?.label || 'Дашборд';
  };

  return (
    <ErrorBoundary>
<<<<<<< HEAD
      <div className="flex min-h-screen w-full bg-[#f8fafc] pb-12 font-sans">
        <aside className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
=======
      <div className="bg-bg-surface flex min-h-screen w-full pb-12 font-sans">
        <aside
          className={cn(
            'lg:border-border-subtle lg:bg-bg-surface hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:pt-4',
            cabinetSidebarLayout.asideWidthStandard
          )}
        >
>>>>>>> recover/cabinet-wip-from-stash
          <HubSidebarHeader
            href={ROUTES.distributor.home}
            icon={Briefcase}
            title="Кабинет дистрибьютора"
            badge="Опт"
            badgeClass="bg-amber-50 text-amber-600"
            iconBgClass="bg-amber-900"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={distributorNavGroups}
              basePath={ROUTES.distributor.home}
              accentClass="text-amber-600"
              activeBgClass="bg-amber-600"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href={ROUTES.distributor.home}
                icon={Briefcase}
                title="Кабинет дистрибьютора"
                badge="Опт"
                badgeClass="bg-amber-50 text-amber-600"
                iconBgClass="bg-amber-900"
              />
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
              <HubSidebar
                groups={distributorNavGroups}
                basePath={ROUTES.distributor.home}
                accentClass="text-amber-600"
                activeBgClass="bg-amber-600"
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

<<<<<<< HEAD
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-amber-900 text-white">
                  <Briefcase className="h-5.5 w-5.5" />
                </div>
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-sm font-black uppercase leading-none tracking-tighter text-slate-900 sm:text-base">
                    Distributor Hub
                  </h1>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-amber-200 text-[8px] font-bold capitalize text-amber-700"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
              <nav className="flex shrink-0 flex-wrap items-center gap-2">
                {hubs.map((hub) => {
                  const HubIcon = hub.icon;
                  return (
                    <Link
                      key={hub.href}
                      href={hub.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <HubIcon className="h-3.5 w-3.5" /> {hub.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] rounded-full bg-amber-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
                  {getCurrentLabel()}
                </h2>
              </div>
            </div>

=======
        <div className={cn('min-w-0 flex-1', cabinetSidebarLayout.mainPaddingLeftStandard)}>
          <CabinetHubMain className="space-y-2 pt-2">
            <CabinetHubTitleRow
              className="border-border-subtle gap-2 border-b pb-2"
              onOpenMobileNav={() => setSidebarOpen(true)}
              hubIcon={Briefcase}
              iconTileClassName="bg-amber-900 text-white shadow-sm ring-1 ring-border-subtle"
              title="Кабинет дистрибьютора"
              badges={
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-200 text-[8px] font-bold text-amber-700"
                >
                  {cabinetRoleLabelRu(role)}
                </Badge>
              }
              trailing={
                <nav className="flex flex-wrap items-center gap-2" aria-label="Переключение хабов">
                  {hubs.map((hub) => {
                    const HubIcon = hub.icon;
                    return (
                      <Link
                        key={hub.href}
                        href={hub.href}
                        className="text-text-secondary hover:bg-bg-surface2 hover:text-text-primary flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold"
                      >
                        <HubIcon className="size-3.5" aria-hidden /> {hub.label}
                      </Link>
                    );
                  })}
                </nav>
              }
            />
            <CabinetHubSectionBar
              accentClassName="bg-amber-500"
              breadcrumbItems={['Аккаунт', 'Кабинет дистрибьютора', getCurrentLabel()]}
              sectionTitle={getCurrentLabel()}
            />

>>>>>>> recover/cabinet-wip-from-stash
            <main className="duration-300 animate-in fade-in">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </CabinetHubMain>
        </div>
      </div>
    </ErrorBoundary>
  );
}
