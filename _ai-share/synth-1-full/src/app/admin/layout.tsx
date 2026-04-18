'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Loader2, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/error-boundary';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { adminNavGroups } from '@/lib/data/admin-navigation-normalized';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRbac();
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const getCurrentLabel = () => {
    const sorted = adminNavGroups
      .flatMap((g) => g.links)
      .sort((a, b) => b.href.length - a.href.length);
    const current = sorted.find((link) => {
      const p = (pathname || '').replace(/\/$/, '') || '/';
      const h = link.href.replace(/\/$/, '') || '/';
      if (h === '/admin') return p === '/admin';
      return p === h || p.startsWith(h + '/');
    });
    const group = adminNavGroups.find((g) => g.links.some((l) => l.value === current?.value));
    return group?.label || 'Контроль';
  };

  const activeLink = adminNavGroups
    .flatMap((g) => g.links)
    .find(
      (l) => pathname === l.href || (pathname || '').startsWith(l.href.replace(/\/$/, '') + '/')
    );

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-[#f8fafc] pb-12 font-sans">
        <aside className="hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <HubSidebarHeader
            href="/admin"
            icon={Shield}
            title="Админ-центр"
            badge="HQ"
            badgeClass="bg-amber-50 text-amber-600"
            iconBgClass="bg-slate-900"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={adminNavGroups}
              basePath="/admin"
              accentClass="text-amber-600"
              activeBgClass="bg-slate-900"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href="/admin"
                icon={Shield}
                title="Админ-центр"
                badge="HQ"
                badgeClass="bg-amber-50 text-amber-600"
                iconBgClass="bg-slate-900"
              />
            </div>
            <div className="shrink-0 border-b border-slate-100 px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HubSidebar
                groups={adminNavGroups}
                basePath="/admin"
                accentClass="text-amber-600"
                activeBgClass="bg-slate-900"
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-slate-900 text-white">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <h1 className="truncate text-sm font-black uppercase leading-none tracking-tighter text-slate-900 sm:text-base">
                    Админ-центр
                  </h1>
                  <Badge
                    variant="outline"
                    className="shrink-0 border-amber-200 text-[8px] font-bold capitalize text-amber-700"
                  >
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] rounded-full bg-amber-500" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
                  {getCurrentLabel()}
                </h2>
              </div>
              {activeLink && (
                <Badge
                  variant="outline"
                  className="rounded-[2px] border-slate-200 text-[9px] font-black uppercase"
                >
                  {activeLink.label}
                </Badge>
              )}
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
