'use client';

/**
 * Единая оболочка личного кабинета клиента: сайдбар, шапка хаба, контент.
 * Используется в `app/client/layout.tsx` и в корневых layout’ах `/orders`, `/academy`, `/wallet`
 * (экспорт `UserCabinetRouteLayout` — то же самое).
 */
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { cabinetHubLayout, cabinetSidebarLayout, cabinetSurface } from '@/lib/ui/cabinet-surface';
import { nuOrderDeskShell } from '@/lib/ui/nuorder-desk-shell';
import { resolveCabinetActiveNavLink } from '@/lib/ui/cabinet-nav-active';
import { ROUTES } from '@/lib/routes';

const CLIENT_ROLES = ['client', 'admin'];

export function ClientCabinetShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const { loading } = useAuth();
  const { role } = useRbac();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasAccess = CLIENT_ROLES.includes(role);

  if (loading && HUB_AUTH_FULLSCREEN_SPINNER) {
    return (
      <div className={cabinetHubLayout.loadingShell}>
        <Loader2 className="text-muted-foreground size-8 animate-spin" aria-hidden />
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

  const sectionLabel =
    resolveCabinetActiveNavLink(pathname, clientNavGroups)?.label ?? 'Главная';

  /** NuOrder/JOOR-плотность только для сегмента `/client/*` (не для orders/academy/wallet через алиас). */
  const clientNuOrderHub = pathname.startsWith('/client');

  return (
    <ErrorBoundary>
      <div
        className={cn(
          cabinetHubLayout.rootShell,
          clientNuOrderHub && nuOrderDeskShell.clientCabinetHubScope
        )}
        data-client-cabinet-nuorder={clientNuOrderHub ? 'true' : undefined}
      >
        <aside className={cn(cabinetHubLayout.asideChrome, cabinetSidebarLayout.asideWidthStandard)}>
          <HubSidebarHeader
            href={ROUTES.client.home}
            icon={User}
            title="Личный кабинет"
            badge="Клиент"
            badgeClass={
              clientNuOrderHub
                ? 'bg-[#0b63ce]/12 text-[#0b63ce] border border-[#0b63ce]/25'
                : 'bg-accent-primary/10 text-accent-primary'
            }
            iconBgClass={
              clientNuOrderHub ? nuOrderDeskShell.clientCabinetHubIconTile : 'bg-accent-primary'
            }
          />
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
            <HubSidebar
              groups={clientNavGroups}
              basePath={ROUTES.client.home}
              accentClass={clientNuOrderHub ? 'text-[#0b63ce]' : 'text-accent-primary'}
              activeBgClass={clientNuOrderHub ? 'bg-[#0b63ce]' : 'bg-accent-primary'}
            />
          </div>
        </aside>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className={cn(
              'flex w-72 flex-col gap-0 p-0',
              clientNuOrderHub && 'border-[#c5ccd6] bg-[#eef0f4]'
            )}
          >
            <div className="shrink-0 pb-0 pt-12">
              <HubSidebarHeader
                href={ROUTES.client.home}
                icon={User}
                title="Личный кабинет"
                badge="Клиент"
                badgeClass={
                  clientNuOrderHub
                    ? 'bg-[#0b63ce]/12 text-[#0b63ce] border border-[#0b63ce]/25'
                    : 'bg-accent-primary/10 text-accent-primary'
                }
                iconBgClass={
                  clientNuOrderHub ? nuOrderDeskShell.clientCabinetHubIconTile : 'bg-accent-primary'
                }
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
                accentClass={clientNuOrderHub ? 'text-[#0b63ce]' : 'text-accent-primary'}
                activeBgClass={clientNuOrderHub ? 'bg-[#0b63ce]' : 'bg-accent-primary'}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        <div className={cn('min-w-0 flex-1', cabinetSidebarLayout.mainPaddingLeftStandard)}>
          <CabinetHubMain
            className={cn(
              'space-y-2 pt-2 !px-2 lg:!px-3',
              clientNuOrderHub && 'rounded-sm border border-[#c5ccd6]/70 bg-[#eceff3] lg:rounded-tl-none'
            )}
          >
            <CabinetHubTitleRow
              className="border-border-subtle gap-2 border-b pb-2"
              onOpenMobileNav={() => setSidebarOpen(true)}
              hubIcon={User}
              iconTileClassName={
                clientNuOrderHub
                  ? nuOrderDeskShell.clientCabinetHubIconTile
                  : 'bg-accent-primary text-white shadow-sm ring-1 ring-border-subtle'
              }
              title="Личный кабинет"
              badges={
                <Badge
                  variant="outline"
                  className={
                    clientNuOrderHub
                      ? 'shrink-0 border-[#0b63ce]/30 text-[#0b63ce] text-[8px] font-bold'
                      : 'border-accent-primary/25 text-accent-primary shrink-0 text-[8px] font-bold'
                  }
                >
                  {cabinetRoleLabelRu(role)}
                </Badge>
              }
            />
            {/*
              Полный путь: Аккаунт › Личный кабинет › … Под крошками без второго заголовка —
              название дублируется в контенте страницы (иконка + подпись).
            */}
            <CabinetHubSectionBar
              accentClassName={
                clientNuOrderHub ? nuOrderDeskShell.clientCabinetHubAccentRail : 'bg-accent-primary'
              }
              breadcrumbItems={['Аккаунт', 'Личный кабинет', sectionLabel]}
            />

            <main className={cabinetHubLayout.mainInner}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </CabinetHubMain>
        </div>
      </div>
    </ErrorBoundary>
  );
}

/** Алиас: тот же хаб, что и `ClientCabinetShell`, для маршрутов вне сегмента `/client`. */
export const UserCabinetRouteLayout = ClientCabinetShell;
