'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1, Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2MeasurementsHubChecks,
  WORKSHOP2_MEASUREMENTS_TABLE_ROLE_BLOCKS,
  workshop2MeasurementsHubScore,
} from '@/lib/production/workshop2-measurements-table-hub';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import * as LucideIcons from 'lucide-react';

export type Workshop2MeasurementsTableHubProps = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  handbookWarnings: readonly string[];
  onJumpToTzAnchor: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  /** Для подсказки «готовность секции конструкция» */
  constructionSectionPct?: number;
};

export function Workshop2MeasurementsTableHub({
  dossier,
  currentLeaf,
  handbookWarnings,
  onJumpToTzAnchor,
  constructionSectionPct,
}: Workshop2MeasurementsTableHubProps) {
  const checks = useMemo(
    () => buildWorkshop2MeasurementsHubChecks(dossier, currentLeaf, handbookWarnings),
    [dossier, currentLeaf, handbookWarnings]
  );
  const score = useMemo(() => workshop2MeasurementsHubScore(checks), [checks]);

  return (
    <div className="space-y-3 rounded-xl border border-cyan-200/90 bg-gradient-to-br from-cyan-50/90 via-white to-slate-50/80 p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-sm">
              <LucideIcons.Ruler className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Табель мер: хаб ТЗ</h3>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-600">
                Единая таблица для образца, фабрики, fit и ОТК. Ниже — 10 контрольных пунктов и роли, которые на неё
                опираются.
              </p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[10px] font-bold tabular-nums text-cyan-900">
            {score.done}/{score.total} · {score.pct}%
          </span>
          {typeof constructionSectionPct === 'number' ? (
            <span className="text-[9px] tabular-nums text-slate-500">Секция «Конструкция» ≈ {constructionSectionPct}%</span>
          ) : null}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-[10px]"
                title="Кто использует табель мер при сборке ТЗ"
              >
                <LucideIcons.Users className="h-3 w-3 shrink-0" aria-hidden />
                Роли · {WORKSHOP2_MEASUREMENTS_TABLE_ROLE_BLOCKS.length}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[min(26rem,calc(100vw-1.5rem))] max-h-[min(32rem,70vh)] space-y-3 overflow-y-auto text-xs"
              align="end"
            >
              <p className="text-[10px] font-semibold leading-snug text-slate-700">
                Табель мер — источник правды по числам для всех этапов маршрута SKU. Каждая роль читает те же ячейки; правки
                согласуйте через ТЗ и подписи секции.
              </p>
              {WORKSHOP2_MEASUREMENTS_TABLE_ROLE_BLOCKS.map((row) => (
                <div key={row.title}>
                  <p className={cn('font-semibold', row.titleClass)}>{row.title}</p>
                  <p className="mt-1 leading-snug text-slate-600">{row.body}</p>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ol className="grid gap-1.5 sm:grid-cols-2">
        {checks.map((c, i) => (
          <li
            key={c.id}
            className={cn(
              'flex gap-2 rounded-lg border px-2 py-1.5 text-[10px] leading-snug',
              c.done ? 'border-emerald-200/90 bg-emerald-50/50 text-emerald-950' : 'border-slate-200/90 bg-white/80 text-slate-700'
            )}
          >
            <span className="mt-0.5 shrink-0 font-black tabular-nums text-slate-400">{i + 1}.</span>
            <div className="min-w-0">
              <span className={cn('font-semibold', c.done ? 'text-emerald-900' : 'text-slate-800')}>{c.label}</span>
              {!c.done && c.hint ? <p className="mt-0.5 text-[9px] text-slate-500">{c.hint}</p> : null}
            </div>
            {c.done ? (
              <LucideIcons.Check className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <LucideIcons.Circle className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-1.5 border-t border-cyan-100/80 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-7 text-[10px]"
          onClick={() => onJumpToTzAnchor('construction', 'w2-measurements-table')}
        >
          К таблице
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px]"
          onClick={() => onJumpToTzAnchor('construction', 'w2-construction-contour')}
        >
          Контур: BOM · скетч
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px]"
          onClick={() => onJumpToTzAnchor('material', 'w2-material-hub')}
        >
          Материалы
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px]"
          onClick={() => onJumpToTzAnchor('construction', W2_VISUALS_SKETCH_ANCHOR_ID)}
        >
          Скетч
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-[10px]"
          onClick={() => onJumpToTzAnchor('general', 'w2-passport-hub')}
        >
          Паспорт · лимиты
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] text-slate-600"
          onClick={() => onJumpToTzAnchor('construction', 'w2-construction-signoff')}
        >
          Подпись секции
        </Button>
      </div>
    </div>
  );
}
