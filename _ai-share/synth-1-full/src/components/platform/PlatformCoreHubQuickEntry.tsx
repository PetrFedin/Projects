'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import {
  Factory,
  LayoutGrid,
  MessageSquare,
  PenLine,
  ShoppingBag,
  Store,
  Table2,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';
import {
  getActivePillarIdsForRole,
  getPlatformCoreHubRow,
  getRolePillarWorkspaceHref,
  PLATFORM_CORE_HUB_ROWS,
  PLATFORM_CORE_PILLARS,
  resolvePlatformCoreCollectionId,
  type CoreChainRoleId,
  type CoreHubPillarId,
} from '@/lib/platform-core-hub-matrix';
import { getPlatformCoreDemo } from '@/lib/platform-core-demo-context';
import { PLATFORM_CORE_HUB_CARD_ROW_ROLES } from '@/lib/platform-core-hub-carousel';
import { hubSectionLabelClassName, platformCoreHubLayout } from '@/lib/platform-core-hub-layout';
import { PlatformCoreHubQuickCard } from '@/components/platform/PlatformCoreHubQuickCard';

const ROLE_ICONS: Record<CoreChainRoleId, typeof Store> = {
  brand: Store,
  shop: ShoppingBag,
  manufacturer: Factory,
  supplier: Warehouse,
};

const ROLE_LEADS: Record<CoreChainRoleId, string> = {
  brand: 'Коллекции и цепочка',
  shop: 'Ассортимент и заказы',
  manufacturer: 'Производство и выпуск',
  supplier: 'Снабжение материалами',
};

const PILLAR_ICONS: Record<CoreHubPillarId, LucideIcon> = {
  development: PenLine,
  sample_collection: LayoutGrid,
  collection_order: Table2,
  order_production: Factory,
  comms: MessageSquare,
};

function SectionLabel({ children, className }: { children: string; className?: string }) {
  return <p className={hubSectionLabelClassName(className)}>{children}</p>;
}

/** Быстрый вход: роль → на том же месте сетка столпов роли; «Все роли» — назад. */
export function PlatformCoreHubQuickEntry() {
  const searchParams = useSearchParams();
  const collectionId = resolvePlatformCoreCollectionId(searchParams.get('collection'));
  const demo = useMemo(() => getPlatformCoreDemo(collectionId), [collectionId]);
  const [selectedRole, setSelectedRole] = useState<CoreChainRoleId | null>(null);

  const selectedRow = selectedRole ? getPlatformCoreHubRow(selectedRole) : null;
  const activePillarIds = selectedRole ? getActivePillarIdsForRole(selectedRole) : [];
  const showingPillars = Boolean(selectedRole && selectedRow);

  return (
    <section
      data-testid="platform-core-hub-quick-entry"
      aria-label="Быстрый вход"
      className={platformCoreHubLayout.sectionStack}
    >
      <SectionLabel>Быстрый вход</SectionLabel>

      <div className="space-y-2" data-testid="platform-core-role-blocks">
        <div className="flex min-h-[1.25rem] items-center justify-between gap-2 md:min-h-[1.375rem]">
          {showingPillars ? (
            <>
              <button
                type="button"
                data-testid="platform-core-hub-quick-back-roles"
                onClick={() => setSelectedRole(null)}
                className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                Все роли
              </button>
              <span
                data-testid="platform-core-hub-selected-role"
                className="text-text-primary truncate text-right text-[11px] font-bold md:text-xs"
              >
                {selectedRow!.label}
              </span>
            </>
          ) : (
            <p className="text-text-muted text-[11px] md:text-xs">Выберите роль</p>
          )}
        </div>

        {!showingPillars ? (
          <div
            role="list"
            aria-label="Роли"
            data-testid="platform-core-hub-quick-roles-panel"
            className={PLATFORM_CORE_HUB_CARD_ROW_ROLES}
          >
            {PLATFORM_CORE_HUB_ROWS.map((row) => (
              <PlatformCoreHubQuickCard
                key={row.id}
                as="button"
                testId={`role-block-${row.id}`}
                icon={ROLE_ICONS[row.id]}
                title={row.label}
                subtitle={ROLE_LEADS[row.id]}
                variant="role"
                onSelect={() => setSelectedRole(row.id)}
              />
            ))}
          </div>
        ) : (
          <div data-testid="platform-core-business-overview">
            <div
              role="list"
              aria-label={`Столпы роли ${selectedRow!.label}`}
              data-testid="platform-core-hub-quick-pillars-panel"
              className={PLATFORM_CORE_HUB_CARD_ROW_ROLES}
            >
              {PLATFORM_CORE_PILLARS.filter((pillar) =>
                activePillarIds.includes(pillar.id)
              ).map((pillar) => {
                const cell = selectedRow!.pillars[pillar.id];
                const href = getRolePillarWorkspaceHref(selectedRole!, pillar.id, demo);
                return (
                  <PlatformCoreHubQuickCard
                    key={pillar.id}
                    id={`pillar-${pillar.id}`}
                    href={href}
                    testId={`hub-pillar-${pillar.id}`}
                    icon={PILLAR_ICONS[pillar.id]}
                    title={pillar.title}
                    subtitle={cell.kind === 'active' ? cell.title : pillar.subtitle}
                    variant="role"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
