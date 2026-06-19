'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  buildPlatformCoreDemoTrail,
  getPlatformCoreDemo,
  getPlatformCoreCollectionLabel,
  PLATFORM_CORE_PILLARS,
} from '@/lib/platform-core-hub-matrix';

type Props = {
  collectionId?: string;
};

/** Компактный golden path на hub — один маршрут на столп. */
export function PlatformCoreDemoTrail({ collectionId }: Props) {
  const demo = getPlatformCoreDemo(collectionId);
  const trail = buildPlatformCoreDemoTrail(demo);
  const byPillar = PLATFORM_CORE_PILLARS.map((pillar) => ({
    pillar,
    links: trail.filter((t) => t.pillarId === pillar.id),
  })).filter((g) => g.links.length > 0);

  return (
    <section data-testid="platform-core-demo-trail" className="space-y-2">
      <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
        Маршрут цепочки · {getPlatformCoreCollectionLabel(demo.collectionId)}
      </p>
      <div className="border-border-subtle flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3">
        {byPillar.map((group, idx) => (
          <div key={group.pillar.id} className="flex flex-wrap items-center gap-1.5">
            {idx > 0 ? (
              <ArrowRight className="text-text-muted h-3 w-3 shrink-0" aria-hidden />
            ) : null}
            <span className="text-text-muted text-[10px] font-bold uppercase">
              {group.pillar.title}
            </span>
            {group.links.map((link, linkIdx) => (
              <Link
                key={link.href}
                href={link.href}
                title={`${group.pillar.title} · ${link.label}`}
                data-testid={`demo-trail-${group.pillar.id}-${linkIdx}`}
                className="border-border-subtle hover:bg-bg-surface2 rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
