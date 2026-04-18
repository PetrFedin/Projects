import React, { Suspense } from 'react';

<<<<<<< HEAD
import React, { useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Factory, Store, Briefcase, ShoppingCart, Loader2, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { canAccessHub } from '@/lib/data/profile-page-features';
import { ErrorBoundary } from '@/components/error-boundary';
import { cn } from '@/lib/utils';
import { manufacturerNavGroups, supplierNavGroups } from '@/lib/data/factory-navigation';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const FACTORY_ROLES = [
  'manufacturer',
  'supplier',
  'designer',
  'technologist',
  'production_manager',
  'admin',
];

function FactoryLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = FACTORY_ROLES.includes(role);

  const roleParam = searchParams?.get('role');
  const isSupplier =
    roleParam === 'supplier' || (roleParam !== 'manufacturer' && role === 'supplier');
  const navGroups = isSupplier ? supplierNavGroups : manufacturerNavGroups;
  const hubTitle = isSupplier ? 'Supplier Hub' : 'Factory Hub';
  const hubSubtitle = isSupplier ? 'Поставки материалов' : 'Производство и цепочка поставок';
  const displayRole = isSupplier ? 'Supplier' : 'Manufacturer';

  const hubs = [
    { href: '/brand', label: 'Brand', icon: Store, hub: 'brand' as const },
    { href: '/shop', label: 'Shop', icon: ShoppingCart, hub: 'shop' as const },
    { href: '/distributor', label: 'Distributor', icon: Briefcase, hub: 'distributor' as const },
  ].filter((h) => canAccessHub(role, h.hub));

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-[1400px] flex-col items-center justify-center px-8 py-12 text-center">
        <p className="mb-2 font-medium text-slate-500">Нет доступа к Factory Hub для роли {role}</p>
        <p className="mb-4 text-sm text-slate-400">
          Доступ: manufacturer, supplier, designer, technologist, production_manager.
        </p>
        <Link href="/" className="text-sm font-bold text-indigo-600 hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const getCurrentLabel = () => {
    const flat = navGroups.flatMap((g) => g.links);
    const sorted = flat.sort((a, b) => b.href.length - a.href.length);
    const basePath = isSupplier ? '/factory?role=supplier' : '/factory';
    const current = sorted.find((l) => {
      const p = (pathname || '') + (searchParams?.toString() ? '?' + searchParams.toString() : '');
      const h = l.href;
      return (
        p === h || (pathname || '').startsWith((h.split('?')[0] || '').replace(/\/$/, '') + '/')
      );
    });
    return current?.label || 'Дашборд';
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-[#f8fafc] pb-12 font-sans">
        <aside className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <HubSidebarHeader
            href={isSupplier ? '/factory?role=supplier' : '/factory'}
            icon={Factory}
            title={hubTitle}
            badge={displayRole}
            badgeClass="bg-emerald-50 text-emerald-600"
            iconBgClass="bg-emerald-900"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={navGroups}
              basePath="/factory"
              accentClass="text-emerald-600"
              activeBgClass="bg-emerald-600"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href={isSupplier ? '/factory?role=supplier' : '/factory'}
                icon={Factory}
                title={hubTitle}
                badge={displayRole}
                badgeClass="bg-emerald-50 text-emerald-600"
                iconBgClass="bg-emerald-900"
              />
            </div>
            <div className="shrink-0 border-b border-slate-100 px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HubSidebar
                groups={navGroups}
                basePath="/factory"
                accentClass="text-emerald-600"
                activeBgClass="bg-emerald-600"
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-emerald-900 text-white">
                  <Factory className="h-5.5 w-5.5" />
                </div>
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-sm font-black uppercase leading-none tracking-tighter text-slate-900 sm:text-base">
                    {hubTitle}
                  </h1>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-emerald-200 text-[8px] font-bold capitalize text-emerald-700"
                  >
                    {displayRole}
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
                {(['admin', 'manufacturer', 'supplier'] as const).includes(role as any) && (
                  <>
                    <Link
                      href="/factory"
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold',
                        !isSupplier
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      Production
                    </Link>
                    <Link
                      href="/factory?role=supplier"
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold',
                        isSupplier
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-500 hover:bg-slate-100'
                      )}
                    >
                      Supplier
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] rounded-full bg-emerald-500" />
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

export default function FactoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
=======
/** Общий сегмент завода: дочерние ветки — `/factory/production`, `/factory/supplier`. */
export default function FactoryRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-bg-surface text-text-muted flex min-h-screen flex-col items-center justify-center gap-3 text-xs font-medium uppercase tracking-widest">
          Загрузка…
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
