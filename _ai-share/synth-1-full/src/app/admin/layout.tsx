'use client';

import React, { Suspense, useState } from 'react';
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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const getCurrentLabel = () => {
    const sorted = adminNavGroups.flatMap((g) => g.links).sort((a, b) => b.href.length - a.href.length);
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
    .find((l) => pathname === l.href || (pathname || '').startsWith(l.href.replace(/\/$/, '') + '/'));

  return (
    <ErrorBoundary>
      <div className="flex w-full bg-[#f8fafc] min-h-screen font-sans pb-12">
        <aside className="hidden lg:flex lg:w-52 lg:shrink-0 lg:flex-col lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:z-30 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-4">
          <HubSidebarHeader
            href="/admin"
            icon={Shield}
            title="Админ-центр"
            badge="HQ"
            badgeClass="bg-amber-50 text-amber-600"
            iconBgClass="bg-slate-900"
          />
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            <HubSidebar
              groups={adminNavGroups}
              basePath="/admin"
              accentClass="text-amber-600"
              activeBgClass="bg-slate-900"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0 gap-0 flex flex-col">
            <div className="pt-12 pb-0 shrink-0">
              <HubSidebarHeader
                href="/admin"
                icon={Shield}
                title="Админ-центр"
                badge="HQ"
                badgeClass="bg-amber-50 text-amber-600"
                iconBgClass="bg-slate-900"
              />
            </div>
            <div className="px-3 pb-2 border-b border-slate-100 shrink-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Навигация</p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
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
                <div className="h-11 w-11 rounded-[4px] bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <Shield className="h-5.5 w-5.5" />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <h1 className="text-sm sm:text-base font-black uppercase tracking-tighter leading-none text-slate-900 truncate">
                    Админ-центр
                  </h1>
                  <Badge variant="outline" className="text-[8px] font-bold border-amber-200 text-amber-700 capitalize shrink-0">
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-[2px] bg-amber-500 rounded-full" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">{getCurrentLabel()}</h2>
              </div>
              {activeLink && (
                <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-200 rounded-[2px]">
                  {activeLink.label}
                </Badge>
              )}
            </div>

            <main className="animate-in fade-in duration-300">
              <ErrorBoundary>
                <Suspense fallback={null}>{children}</Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
