'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import type { WorkshopPassportTzPhase } from '@/lib/production/workshop2-passport-check';
import {
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import * as LucideIcons from 'lucide-react';

const MATERIAL_NAV_CORE: { id: string; label: string }[] = [
  { id: W2_MATERIAL_SUBPAGE_ANCHORS.hub, label: 'Хаб' },
  { id: W2_MATERIAL_SUBPAGE_ANCHORS.mat, label: 'Mat' },
  { id: W2_MATERIAL_SUBPAGE_ANCHORS.composition, label: 'Состав' },
  { id: W2_MATERIAL_SUBPAGE_ANCHORS.catalog, label: 'Каталог' },
];

export type Workshop2MaterialTzStickySubnavProps = {
  activeAnchorId: string | null;
  onNavigate: (anchorId: string) => void;
  onJumpToPulse: () => void;
  combinedPct: number;
  gateOpenCount: number;
  tzPhase?: WorkshopPassportTzPhase;
  /** Пункт «Комплаенс» в хабе (чеклист в досье, persist с «Сохранить»). */
  showComplianceNav?: boolean;
  dossierViewProfile?: Workshop2DossierViewProfile;
  /** Ref со скетча не в mat — якорь w2-material-mat-sketch-gap в хабе. */
  matSketchGapCount?: number;
  /** Пункт «Нормы» → w2-material-bom-norms. */
  showBomNormsNav?: boolean;
  /** Пункт «Замены» → w2-material-supply-route (дельта + альтернативы). */
  showSupplyRouteNav?: boolean;
  /** Пункт «Costing» → w2-material-costing-hints. */
  showCostingHintsNav?: boolean;
  /** Пункт «Черновики» → панель снабжения (альтернативы / дельта / costing в досье). */
  showSupplyDraftsNav?: boolean;
};

export function Workshop2MaterialTzStickySubnav({
  activeAnchorId,
  onNavigate,
  onJumpToPulse,
  combinedPct,
  gateOpenCount,
  tzPhase = '1',
  showComplianceNav = false,
  dossierViewProfile = 'full',
  matSketchGapCount = 0,
  showBomNormsNav = false,
  showSupplyRouteNav = false,
  showCostingHintsNav = false,
  showSupplyDraftsNav = false,
}: Workshop2MaterialTzStickySubnavProps) {
  const showMatSketchGapNav =
    workshop2DossierViewUiCaps(dossierViewProfile).materialMatSketchGapStrip &&
    matSketchGapCount > 0;

  const bomNormsItem = { id: W2_MATERIAL_SUBPAGE_ANCHORS.bomNorms, label: 'Нормы' } as const;
  const supplyRouteItem = { id: W2_MATERIAL_SUBPAGE_ANCHORS.supplyRoute, label: 'Замены' } as const;
  const costingHintsItem = {
    id: W2_MATERIAL_SUBPAGE_ANCHORS.costingHints,
    label: 'Costing',
  } as const;
  const supplyDraftsItem = {
    id: W2_MATERIAL_SUBPAGE_ANCHORS.supplyDrafts,
    label: 'Черновики',
  } as const;

  const navItems = (() => {
    const items: { id: string; label: string }[] = [MATERIAL_NAV_CORE[0]!];
    if (showComplianceNav) {
      items.push({ id: W2_MATERIAL_SUBPAGE_ANCHORS.compliance, label: 'Комплаенс' });
    }
    if (showSupplyDraftsNav) items.push(supplyDraftsItem);
    if (showBomNormsNav) items.push(bomNormsItem);
    if (showSupplyRouteNav) items.push(supplyRouteItem);
    if (showCostingHintsNav) items.push(costingHintsItem);
    items.push(...MATERIAL_NAV_CORE.slice(1));
    return items;
  })();

  return (
    <div
      className="sticky top-0 z-30 -mx-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-amber-200/90 bg-white/95 px-2 py-2 shadow-sm backdrop-blur-sm sm:gap-1 sm:py-1.5"
      role="navigation"
      aria-label="Подразделы «Материалы / BOM»"
    >
      <span
        className="flex w-full flex-wrap items-center gap-1 pl-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700/90 sm:w-auto sm:pr-1"
        title="Контур BOM для маршрута SKU"
      >
        <span>Материалы</span>
        {tzPhase !== '1' ? (
          <span className="rounded border border-amber-300/80 bg-amber-50 px-1 py-0 text-[8px] font-black normal-case tracking-wide text-amber-950">
            Шаг {tzPhase}
          </span>
        ) : null}
        <span
          className={cn(
            'normal-case tabular-nums',
            gateOpenCount === 0 ? 'text-emerald-600' : 'text-amber-800'
          )}
        >
          {gateOpenCount === 0 ? '· контур OK' : `· открыто ${gateOpenCount}`}
        </span>
        <span className="font-normal normal-case text-slate-400">(~{combinedPct}%)</span>
      </span>
      {navItems.map((x) => {
        const isCurrent = activeAnchorId === x.id;
        return (
          <Button
            key={x.id}
            type="button"
            variant="outline"
            size="sm"
            aria-current={isCurrent ? 'location' : undefined}
            className={cn(
              'min-h-9 min-w-0 border-amber-200/80 bg-white px-2.5 py-1.5 text-[10px] font-medium text-amber-950 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0',
              isCurrent && 'border-amber-400 bg-amber-50 text-amber-950 ring-1 ring-amber-300'
            )}
            onClick={() => onNavigate(x.id)}
            title={`Маршрут SKU · материалы ≈ ${combinedPct}%`}
          >
            {x.label}
          </Button>
        );
      })}
      {showMatSketchGapNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 gap-1 border-amber-400/80 bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-950 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={() => onNavigate(W2_MATERIAL_SUBPAGE_ANCHORS.matSketchGap)}
          title="В хабе: ref со скетча не найдены в mat"
        >
          <LucideIcons.Unlink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Скетч↔mat
          <span className="tabular-nums">({matSketchGapCount})</span>
        </Button>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="min-h-9 gap-1 border-amber-200 bg-amber-50/90 px-2.5 py-1.5 text-[10px] font-semibold text-amber-950 shadow-none sm:ml-auto sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
        onClick={onJumpToPulse}
        title="Пульс артикула: SLA, подписи ТЗ"
      >
        <LucideIcons.Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />К пульсу / SLA
      </Button>
    </div>
  );
}
