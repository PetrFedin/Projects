'use client';

import { useCallback, useMemo } from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { CategorySketchAnnotatorContext } from '@/components/brand/production/CategorySketchAnnotator';
import {
  BRANCH_CATALOG_SLOT_ROLE,
  getInheritedTaskSourceLevel,
  normalizeSubcategorySketchSlots,
  patchSubcategorySketchSlot,
} from '@/lib/production/workshop2-tz-subcategory-sketches';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1ProductionTaskDetail,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type Props = {
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  articleSku: string;
  articleName: string;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  sketchContext?: CategorySketchAnnotatorContext;
};

export function SubcategorySketchTasksRibbon({
  currentLeaf,
  dossier,
  articleSku,
  articleName,
  setDossier,
  sketchContext: _sketchContext,
}: Props) {
  const slots = useMemo(
    () => normalizeSubcategorySketchSlots(dossier.subcategorySketchSlots),
    [dossier.subcategorySketchSlots]
  );

  const levelNames = useMemo(
    () => ({
      1: currentLeaf.l1Name,
      2: currentLeaf.l2Name,
      3: currentLeaf.l3Name,
    }),
    [currentLeaf.l1Name, currentLeaf.l2Name, currentLeaf.l3Name]
  );

  const patchTasks = useCallback(
    (
      level: 1 | 2 | 3,
      recipe: (t: Workshop2Phase1ProductionTaskDetail) => Workshop2Phase1ProductionTaskDetail
    ) => {
      setDossier((d) => {
        const norm = normalizeSubcategorySketchSlots(d.subcategorySketchSlots);
        const slot = norm.find((s) => s.level === level);
        if (!slot) return d;
        return {
          ...d,
          subcategorySketchSlots: patchSubcategorySketchSlot(norm, level, {
            productionTasks: recipe(slot.productionTasks),
          }),
        };
      });
    },
    [setDossier]
  );

  return (
    <div className="space-y-3 text-[11px] leading-snug text-slate-800">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        Задачи по узлам ветки (линия · группа · модель) — один артикул, разная детализация
        формулировок
      </p>
      <p className="text-[10px] text-slate-600">
        Артикул <span className="font-mono font-semibold text-slate-900">{articleSku}</span>
        {articleName.trim() ? ` · ${articleName.trim()}` : null}
      </p>
      <ol className="relative space-y-0 border-l border-zinc-300 pl-4">
        {([1, 2, 3] as const).map((level) => {
          const slot = slots.find((s) => s.level === level)!;
          const t = slot.productionTasks;
          const inheritedFrom = getInheritedTaskSourceLevel(slots, level);
          const preview = (t.whatToDo ?? '').trim().split('\n')[0] ?? '';
          return (
            <li key={level} className="relative pb-4 pl-1 last:pb-0">
              <span
                className="absolute -left-[21px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-400 bg-white text-[9px] font-bold uppercase text-zinc-800"
                aria-hidden
                title={BRANCH_CATALOG_SLOT_ROLE[level].label}
              >
                {BRANCH_CATALOG_SLOT_ROLE[level].label.slice(0, 1)}
              </span>
              <details
                className="group rounded-lg border border-zinc-200 bg-zinc-50/80 open:bg-white"
                open={level === 3}
              >
                <summary
                  className={cn(
                    'flex cursor-pointer list-none items-start justify-between gap-2 px-2.5 py-2 text-left',
                    '[&::-webkit-details-marker]:hidden'
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-zinc-900">
                      {BRANCH_CATALOG_SLOT_ROLE[level].label}: {levelNames[level]}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-zinc-600">
                      {BRANCH_CATALOG_SLOT_ROLE[level].hint}
                    </span>
                    {inheritedFrom ? (
                      <span className="mt-1 block text-[9px] text-amber-800">
                        Можно подтянуть текст из «{BRANCH_CATALOG_SLOT_ROLE[inheritedFrom].label}:{' '}
                        {levelNames[inheritedFrom]}»
                      </span>
                    ) : level > 1 ? (
                      <span className="mt-1 block text-[9px] text-zinc-500">
                        Нет заполненного родителя для автонаследования
                      </span>
                    ) : null}
                    {preview ? (
                      <span className="mt-1 line-clamp-2 block text-[10px] text-zinc-600">
                        {preview}
                      </span>
                    ) : (
                      <span className="mt-1 block text-[10px] italic text-zinc-400">
                        Пока пусто — разверните и введите «Что сделать»
                      </span>
                    )}
                  </span>
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-2 border-t border-zinc-100 px-2.5 pb-2.5 pt-2">
                  {level > 1 && inheritedFrom ? (
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-[10px]"
                        onClick={() => {
                          const src = slots.find((s) => s.level === inheritedFrom);
                          if (!src) return;
                          patchTasks(level, () => ({
                            ...src.productionTasks,
                            inheritedFromLevel: inheritedFrom,
                            overrideReason: `Принято с «${levelNames[inheritedFrom]}» (${BRANCH_CATALOG_SLOT_ROLE[inheritedFrom].label})`,
                          }));
                        }}
                      >
                        Подтянуть из «{levelNames[inheritedFrom]}»
                      </Button>
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <Label className="text-[10px] text-zinc-600">Что сделать</Label>
                    <Textarea
                      className="min-h-[72px] text-[11px]"
                      value={t.whatToDo ?? ''}
                      onChange={(e) =>
                        patchTasks(level, (cur) => ({ ...cur, whatToDo: e.target.value }))
                      }
                    />
                  </div>
                  <details className="rounded border border-zinc-100 bg-zinc-50/50 p-2 text-[10px]">
                    <summary className="cursor-pointer font-medium text-zinc-700">
                      Ещё поля (улучшить, изменить, внимание)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[9px] text-zinc-500">Улучшить</Label>
                        <Textarea
                          className="min-h-[48px] text-[11px]"
                          value={t.improve ?? ''}
                          onChange={(e) =>
                            patchTasks(level, (cur) => ({ ...cur, improve: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] text-zinc-500">Изменить</Label>
                        <Textarea
                          className="min-h-[48px] text-[11px]"
                          value={t.change ?? ''}
                          onChange={(e) =>
                            patchTasks(level, (cur) => ({ ...cur, change: e.target.value }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] text-zinc-500">На что обратить внимание</Label>
                        <Textarea
                          className="min-h-[48px] text-[11px]"
                          value={t.watchAttention ?? ''}
                          onChange={(e) =>
                            patchTasks(level, (cur) => ({ ...cur, watchAttention: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
