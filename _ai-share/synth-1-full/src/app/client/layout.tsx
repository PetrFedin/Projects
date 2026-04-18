'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRbac } from '@/hooks/useRbac';
import { useAuth } from '@/providers/auth-provider';
import { HUB_AUTH_FULLSCREEN_SPINNER } from '@/lib/syntha-api-mode';
import { ErrorBoundary } from '@/components/error-boundary';
import { clientNavGroups } from '@/lib/data/client-navigation';
import { HubSidebar } from '@/components/hub/HubSidebar';
import { HubSidebarHeader } from '@/components/hub/HubSidebarHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  CabinetHubMain,
  CabinetHubSectionBar,
  CabinetHubTitleRow,
} from '@/components/layout/cabinet-hub-chrome';
import { cabinetRoleLabelRu } from '@/lib/ui/cabinet-role-labels';
import { cn } from '@/lib/utils';
import { cabinetSidebarLayout, cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';

const CLIENT_ROLES = ['client', 'admin'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = CLIENT_ROLES.includes(role);

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className="bg-bg-surface flex min-h-screen items-center justify-center">
        <Loader2 className="text-accent-primary size-8 animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={cabinetSurface.hubAccessDeniedShell}>
        <p className="text-text-secondary mb-2 font-medium">
          Нет доступа к личному кабинету для роли {role}
        </p>
        <p className="text-text-muted mb-4 text-sm">Доступ: роль «клиент».</p>
        <Link href="/" className="text-accent-primary text-sm font-bold hover:underline">
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

  const activeLink = clientNavGroups
    .flatMap((g) => g.links)
    .find(
      (l) => pathname === l.href || (pathname || '').startsWith(l.href.replace(/\/$/, '') + '/')
    );

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
            href={ROUTES.client.home}
            icon={User}
            title="Личный кабинет"
            badge="Клиент"
            badgeClass="bg-accent-primary/10 text-accent-primary"
            iconBgClass="bg-accent-primary"
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={clientNavGroups}
              basePath={ROUTES.client.home}
              accentClass="text-accent-primary"
              activeBgClass="bg-accent-primary"
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href={ROUTES.client.home}
                icon={User}
                title="Личный кабинет"
                badge="Клиент"
                badgeClass="bg-accent-primary/10 text-accent-primary"
                iconBgClass="bg-accent-primary"
              />
            </div>
            <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Навигация
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <HubSidebar
                groups={clientNavGroups}
                basePath={ROUTES.client.home}
                accentClass="text-accent-primary"
                activeBgClass="bg-accent-primary"
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
              hubIcon={User}
              iconTileClassName="bg-accent-primary text-white shadow-sm ring-1 ring-border-subtle"
              title="Личный кабинет"
              badges={
                <Badge
                  variant="outline"
                  className="border-accent-primary/25 text-accent-primary shrink-0 text-[8px] font-bold"
                >
                  {cabinetRoleLabelRu(role)}
                </Badge>
              }
            />
            <CabinetHubSectionBar
              accentClassName="bg-accent-primary"
              breadcrumbItems={['Аккаунт', 'Кабинет клиента', getCurrentLabel()]}
              sectionTitle={getCurrentLabel()}
              trailing={
                activeLink ? (
                  <Badge
                    variant="outline"
                    className="border-border-subtle rounded-sm text-[9px] font-black uppercase"
                  >
                    {activeLink.label}
                  </Badge>
                ) : undefined
              }
            />

            <main className="duration-300 animate-in fade-in [&_.container]:mx-0 [&_.container]:max-w-none [&_.container]:px-2 lg:[&_.container]:px-3">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </CabinetHubMain>
        </div>
      </div>
    </ErrorBoundary>
  );
}
