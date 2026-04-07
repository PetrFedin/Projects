'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Store, Factory, ShoppingCart, Loader2, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const DISTRIBUTOR_ROLES = ['distributor', 'admin'];

export default function DistributorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = DISTRIBUTOR_ROLES.includes(role);

  const hubs = [
    { href: '/brand', hub: 'brand' as const, label: 'Brand', icon: Store },
    { href: '/shop', hub: 'shop' as const, label: 'Shop', icon: ShoppingCart },
    { href: '/factory', hub: 'factory' as const, label: 'Factory', icon: Factory },
  ].filter((h) => canAccessHub(role, h.hub));

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-[1400px] mx-auto px-8 py-12 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-slate-500 font-medium mb-2">Нет доступа к Distributor Hub для роли {role}</p>
        <p className="text-slate-400 text-sm mb-4">Доступ: distributor.</p>
        <Link href="/" className="text-indigo-600 hover:underline text-sm font-bold">
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
      <div className="flex w-full bg-[#f8fafc] min-h-screen font-sans pb-12">
        <aside className="hidden lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:z-30 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <HubSidebarHeader
            href="/distributor"
            icon={Briefcase}
            title="Distributor Hub"
            badge="DIST"
            badgeClass="bg-amber-50 text-amber-600"
            iconBgClass="bg-amber-900"
          />
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            <HubSidebar
              groups={distributorNavGroups}
              basePath="/distributor"
              accentClass="text-amber-600"
              activeBgClass="bg-amber-600"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0 gap-0 flex flex-col">
            <div className="pt-12 pb-0 shrink-0">
              <HubSidebarHeader
                href="/distributor"
                icon={Briefcase}
                title="Distributor Hub"
                badge="DIST"
                badgeClass="bg-amber-50 text-amber-600"
                iconBgClass="bg-amber-900"
              />
            </div>
            <div className="px-3 pb-2 border-b border-slate-100 shrink-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Навигация</p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <HubSidebar
                groups={distributorNavGroups}
                basePath="/distributor"
                accentClass="text-amber-600"
                activeBgClass="bg-amber-600"
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 min-w-0 lg:pl-52">
          <div className="pl-2 pr-4 lg:pl-3 lg:pr-6 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-11 w-11 rounded-[4px] shrink-0 hover:bg-slate-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                </Button>
                <div className="h-11 w-11 rounded-[4px] bg-amber-900 flex items-center justify-center text-white shrink-0">
                  <Briefcase className="h-5.5 w-5.5" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <h1 className="text-sm sm:text-base font-black uppercase tracking-tighter leading-none text-slate-900 truncate">
                    Distributor Hub
                  </h1>
                  <Badge variant="outline" className="text-[8px] font-bold border-amber-200 text-amber-700 capitalize shrink-0">
                    {role}
                  </Badge>
                </div>
              </div>
              <nav className="flex items-center gap-2 shrink-0 flex-wrap">
                {hubs.map((hub) => {
                  const HubIcon = hub.icon;
                  return (
                    <Link
                      key={hub.href}
                      href={hub.href}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2"
                    >
                      <HubIcon className="h-3.5 w-3.5" /> {hub.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] bg-amber-500 rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">{getCurrentLabel()}</h2>
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
