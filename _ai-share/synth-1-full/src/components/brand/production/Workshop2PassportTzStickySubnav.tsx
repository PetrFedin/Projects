'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  W2_PASSPORT_SUBPAGE_ANCHORS,
  type WorkshopPassportTzPhase,
} from '@/lib/production/workshop2-passport-check';
import {
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import * as LucideIcons from 'lucide-react';

const ITEMS: { id: string; label: string }[] = [
  { id: W2_PASSPORT_SUBPAGE_ANCHORS.hub, label: 'Хаб' },
  { id: W2_PASSPORT_SUBPAGE_ANCHORS.identity, label: 'Идентификация' },
  { id: W2_PASSPORT_SUBPAGE_ANCHORS.brief, label: 'Бриф до образца' },
  { id: W2_PASSPORT_SUBPAGE_ANCHORS.start, label: 'Старт по каталогу' },
  { id: W2_PASSPORT_SUBPAGE_ANCHORS.market, label: 'Рынок и коды' },
];

export type Workshop2PassportTzStickySubnavProps = {
  activeAnchorId: string | null;
  onNavigate: (anchorId: string) => void;
  onJumpToPulse: () => void;
  combinedPct: number;
  gateOpenCount: number;
  tzPhase?: WorkshopPassportTzPhase;
  /** Записей критичного аудита в хабе — кнопка «Аудит». */
  auditHitCount?: number;
  /** Показать переход к блоку внешней ссылки (фабрика / read-only). */
  showReadOnlyNav?: boolean;
  dossierViewProfile?: Workshop2DossierViewProfile;
  /** Кол-во ref со скетча, не найденных в mat — якорь w2-passport-mat-sketch-gap. */
  sketchBomGapCount?: number;
  /** Кол-во уникальных BOM-ref на скетче — якорь w2-passport-sketch-bom-refs (если gap=0). */
  sketchBomRefCount?: number;
};

export function Workshop2PassportTzStickySubnav({
  activeAnchorId,
  onNavigate,
  onJumpToPulse,
  combinedPct,
  gateOpenCount,
  tzPhase = '1',
  auditHitCount = 0,
  showReadOnlyNav = false,
  dossierViewProfile = 'full',
  sketchBomGapCount = 0,
  sketchBomRefCount = 0,
}: Workshop2PassportTzStickySubnavProps) {
  const passCaps = workshop2DossierViewUiCaps(dossierViewProfile);
  const showSketchGapNav = passCaps.passportMatSketchGapRibbon && sketchBomGapCount > 0;
  const showSketchBomRefsNav =
    passCaps.passportSketchBomRefsRibbon && sketchBomRefCount > 0 && sketchBomGapCount === 0;

  return (
    <div
      className="sticky top-0 z-30 -mx-1 flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2 py-2 shadow-sm backdrop-blur-sm sm:gap-1 sm:py-1.5"
      role="navigation"
      aria-label="Подразделы «Паспорт»"
    >
      <span
        className="flex w-full flex-wrap items-center gap-1 pl-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:w-auto sm:pr-1"
        title="Открытые блокеры паспорта для маршрута SKU"
      >
        <span>Паспорт</span>
        {tzPhase !== '1' ? (
          <span className="rounded border border-indigo-200/80 bg-indigo-50 px-1 py-0 text-[8px] font-black normal-case tracking-wide text-indigo-900">
            Шаг {tzPhase}
          </span>
        ) : null}
        <span
          className={cn(
            'tabular-nums normal-case',
            gateOpenCount === 0 ? 'text-emerald-600' : 'text-amber-700'
          )}
        >
          {gateOpenCount === 0 ? '· контур OK' : `· осталось ${gateOpenCount}`}
        </span>
        <span className="font-normal normal-case text-slate-400">(~{combinedPct}%)</span>
      </span>
      {ITEMS.map((x) => {
        const isCurrent = activeAnchorId === x.id;
        const navTitle = `Маршрут SKU · заполнено ≈ ${combinedPct}%`;
        return (
          <Button
            key={x.id}
            type="button"
            variant="outline"
            size="sm"
            aria-current={isCurrent ? 'location' : undefined}
            className={cn(
              'min-h-9 min-w-0 border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-700 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0',
              isCurrent && 'border-indigo-300 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200'
            )}
            onClick={() => onNavigate(x.id)}
            title={navTitle}
          >
            {x.label}
          </Button>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          'min-h-9 gap-1 px-2.5 py-1.5 text-[10px] font-semibold shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0',
          auditHitCount > 0
            ? 'border-rose-200 bg-rose-50/90 text-rose-900'
            : 'border-slate-200 bg-white text-slate-700'
        )}
        onClick={() => onNavigate(W2_PASSPORT_SUBPAGE_ANCHORS.audit)}
        title="Фильтр критичных полей паспорта по журналу сохранений"
      >
        <LucideIcons.AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Аудит
        {auditHitCount > 0 ? <span className="tabular-nums">({auditHitCount})</span> : null}
      </Button>
      {showReadOnlyNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 gap-1 border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-800 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={() => onNavigate(W2_PASSPORT_SUBPAGE_ANCHORS.readOnly)}
          title="Ссылка для внешней стороны (read-only, w2view=factory)"
        >
          <LucideIcons.Link className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Внешняя ссылка
        </Button>
      ) : null}
      {showSketchGapNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 gap-1 border-amber-300/90 bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-950 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={() => onNavigate('w2-passport-mat-sketch-gap')}
          title="Ref на скетче не видны в строках mat (эвристика)"
        >
          <LucideIcons.Unlink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Скетч↔mat
          <span className="tabular-nums">({sketchBomGapCount})</span>
        </Button>
      ) : null}
      {showSketchBomRefsNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 gap-1 border-blue-200/90 bg-blue-50/90 px-2.5 py-1.5 text-[10px] font-semibold text-blue-950 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={() => onNavigate('w2-passport-sketch-bom-refs')}
          title="Сводка BOM-ref с master и листов скетча"
        >
          <LucideIcons.Package className="h-3.5 w-3.5 shrink-0" aria-hidden />
          BOM-ref
          <span className="tabular-nums">({sketchBomRefCount})</span>
        </Button>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="min-h-9 gap-1 border-indigo-200 bg-indigo-50/90 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-900 shadow-none sm:ml-auto sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
        onClick={onJumpToPulse}
        title="Пульс артикула: SLA по ролям, подписи ТЗ, PDF"
      >
        <LucideIcons.Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />
        К пульсу / SLA
      </Button>
    </div>
  );
}
