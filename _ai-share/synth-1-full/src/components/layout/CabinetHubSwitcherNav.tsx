'use client';

import Link from 'next/link';
import { Briefcase, Factory, ShoppingCart, Store, Warehouse, type LucideIcon } from 'lucide-react';
import type { HubKey } from '@/lib/data/profile-page-features';
import { canAccessHub } from '@/lib/data/profile-page-features';
import type { CabinetHubSwitcherEntry } from '@/lib/layout/cabinet-hub-switcher-config';
import { cabinetHubLayout } from '@/lib/ui/cabinet-surface';

const HUB_ICONS: Partial<Record<HubKey, LucideIcon>> = {
  brand: Store,
  shop: ShoppingCart,
  distributor: Briefcase,
  factory: Factory,
  supplier: Warehouse,
};

type CabinetHubSwitcherNavProps = {
  role: string;
  hubs: readonly CabinetHubSwitcherEntry[];
};

/** Переключатель кабинетов — lucide только в этом lazy chunk. */
export function CabinetHubSwitcherNav({ role, hubs }: CabinetHubSwitcherNavProps) {
  const visible = hubs.filter((h) => canAccessHub(role, h.hub));

  if (visible.length === 0) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="Переключение хабов">
      {visible.map((hub) => {
        const HubIcon = HUB_ICONS[hub.hub];
        return (
          <Link key={hub.href} href={hub.href} className={cabinetHubLayout.hubSwitcherLink}>
            {HubIcon ? <HubIcon className="size-3.5" aria-hidden /> : null} {hub.label}
          </Link>
        );
      })}
    </nav>
  );
}
