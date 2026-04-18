'use client';

import React, { useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Factory, Store, Briefcase, ShoppingCart, Loader2, Warehouse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { canAccessHub } from '@/lib/data/profile-page-features';
import { ErrorBoundary } from '@/components/error-boundary';
import { supplierNavGroups } from '@/lib/data/factory-navigation';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  CabinetHubMain,
  CabinetHubSectionBar,
  CabinetHubTitleRow,
} from '@/components/layout/cabinet-hub-chrome';
import { cn } from '@/lib/utils';
import { cabinetSidebarLayout, cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';

const SUPPLIER_HUB_ROLES = ['supplier', 'admin', 'platform_admin'];

function SupplierLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = SUPPLIER_HUB_ROLES.includes(role);

  const hubs = [
    { href: ROUTES.brand.home, label: 'Бренд', icon: Store, hub: 'brand' as const },
    { href: ROUTES.shop.home, label: 'Магазин', icon: ShoppingCart, hub: 'shop' as const },
    {
      href: ROUTES.distributor.home,
      label: 'Дистрибьютор',
      icon: Briefcase,
      hub: 'distributor' as const,
    },
    {
      href: ROUTES.factory.production,
      label: 'Производство',
      icon: Factory,
      hub: 'factory' as const,
    },
  ].filter((h) => canAccessHub(role, h.hub));

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="bg-bg-surface flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={cabinetSurface.hubAccessDeniedShell}>
        <p className="text-text-secondary mb-2 font-medium">
          Нет доступа к кабинету поставщика для роли {role}
        </p>
        <p className="text-text-muted mb-4 text-sm">Доступ: роль «поставщик».</p>
        <Link href="/" className="text-accent-primary text-sm font-bold hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const getCurrentLabel = () => {
    const flat = supplierNavGroups.flatMap((g) => g.links);
    const sorted = flat.sort((a, b) => b.href.length - a.href.length);
    const current = sorted.find((l) => {
      const p = (pathname || '').replace(/\/$/, '') || '/';
      const h = (l.href.split('?')[0] || '').replace(/\/$/, '') || '/';
      return p === h || p.startsWith(h + '/');
    });
    return current?.label || 'Дашборд';
  };

  return (
    <ErrorBoundary>
      <div className="bg-bg-surface flex min-h-screen w-full pb-12 font-sans">
        <aside
          className={cn(
            'lg:border-border-subtle lg:bg-bg-surface hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:pt-4',
            cabinetSidebarLayout.asideWidthStandard
          )}
        >
          <HubSidebarHeader
            href={ROUTES.factory.supplier}
            icon={Warehouse}
            title="Кабинет поставщика"
            badge="Поставщик"
            badgeClass="bg-emerald-50 text-emerald-600"
            iconBgClass="bg-emerald-900"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={supplierNavGroups}
              basePath={ROUTES.factory.supplier}
              accentClass="text-emerald-600"
              activeBgClass="bg-emerald-600"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href={ROUTES.factory.supplier}
                icon={Warehouse}
                title="Кабинет поставщика"
                badge="Поставщик"
                badgeClass="bg-emerald-50 text-emerald-600"
                iconBgClass="bg-emerald-900"
              />
            </div>
            <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HubSidebar
                groups={supplierNavGroups}
                basePath={ROUTES.factory.supplier}
                accentClass="text-emerald-600"
                activeBgClass="bg-emerald-600"
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className={cn('min-w-0 flex-1', cabinetSidebarLayout.mainPaddingLeftStandard)}>
          <CabinetHubMain className="space-y-2 pt-2">
            <CabinetHubTitleRow
              className="border-border-subtle gap-2 border-b pb-2"
              onOpenMobileNav={() => setSidebarOpen(true)}
              hubIcon={Warehouse}
              iconTileClassName="bg-emerald-900 text-white shadow-sm ring-1 ring-border-subtle"
              title="Кабинет поставщика"
              badges={
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-200 text-[8px] font-bold text-emerald-700"
                >
                  Поставщик
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
              accentClassName="bg-emerald-500"
              breadcrumbItems={['Аккаунт', 'Кабинет поставщика', getCurrentLabel()]}
              sectionTitle={getCurrentLabel()}
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

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-surface text-text-muted flex min-h-screen flex-col items-center justify-center gap-3 text-xs font-medium uppercase tracking-widest">
          <Loader2 className="size-8 animate-spin text-emerald-600" aria-hidden />
          Загрузка…
        </div>
      }
    >
      <SupplierLayoutContent>{children}</SupplierLayoutContent>
    </Suspense>
  );
}
