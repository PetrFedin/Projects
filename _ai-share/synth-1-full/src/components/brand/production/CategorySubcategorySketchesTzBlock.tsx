'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { CategorySketchTemplateSvg } from '@/lib/production/category-sketch-template';
import type { CategorySketchAnnotatorContext } from '@/components/brand/production/CategorySketchAnnotator';
import {
  BRANCH_CATALOG_SLOT_ROLE,
  buildTzAttributesDimensionsSnapshotText,
  createAnnotationTaskLine,
  getInheritedTaskSourceLevel,
  normalizeSubcategorySketchSlots,
  patchSubcategorySketchSlot,
} from '@/lib/production/workshop2-tz-subcategory-sketches';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1ProductionTaskDetail,
  Workshop2Phase1SubcategorySketchSlot,
  Workshop2ProductionTaskPriority,
  Workshop2ProductionTaskStage,
  Workshop2ProductionTaskStatus,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Copy, Upload } from 'lucide-react';

const MAX_ANNOTATIONS_PER_SLOT = 24;
const MAX_IMAGE_CHARS = 900_000;

const TASK_PRIORITY_LABELS: Record<Workshop2ProductionTaskPriority, string> = {
  critical: 'Критично',
  high: 'Высокий',
  normal: 'Нормально',
};

const TASK_STATUS_LABELS: Record<Workshop2ProductionTaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Готово',
  blocked: 'Заблокирована',
};

const TASK_STAGE_LABELS: Record<Workshop2ProductionTaskStage, string> = {
  tz: 'ТЗ',
  supply: 'Снабжение',
  fit: 'Посадка',
  plan: 'План',
  release: 'Выпуск',
  qc: 'ОТК',
};

function newUuid(): string {
  return crypto.randomUUID();
}

/** Строка из JSON/Radix не совпадает с number в `slot.level` — иначе `find` даёт undefined. */
function coerceSubcategorySketchLevel(v: unknown): 1 | 2 | 3 {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : Number(v);
  return n === 1 || n === 2 || n === 3 ? (n as 1 | 2 | 3) : 3;
}

function readFileAsDataUrlLimited(file: File, maxChars: number): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

const TASK_SNIPPETS: {
  label: string;
  field: keyof Workshop2Phase1ProductionTaskDetail;
  text: string;
}[] = [
  {
    label: 'Швы · ОТК',
    field: 'watchAttention',
    text: 'Проверить ровность стежка, закрепки узлов, отсутствие пропусков и стягивания по натяжению.',
  },
  {
    label: 'Посадка',
    field: 'whatToDo',
    text: 'Сверить посадку с эталоном базового размера; зафиксировать отличия по длине/объёму.',
  },
  {
    label: 'Фурнитура',
    field: 'watchAttention',
    text: 'Проверить установку фурнитуры: молнии, кнопки, люверсы — без заеданий и перекоса.',
  },
  {
    label: 'Материал',
    field: 'change',
    text: 'Если фактический материал отличается от ТЗ — согласовать замену и отметить в партии.',
  },
];

type Props = {
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  articleSku: string;
  articleName: string;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  sketchContext?: CategorySketchAnnotatorContext;
  /** Метки master-скетча — можно скопировать в слот «линия / группа / модель». */
  masterSketchAnnotations?: Workshop2Phase1CategorySketchAnnotation[];
  /** Уровень задаётся вкладками родителя — переключение всегда меняет данные слота. */
  activeLevel: 1 | 2 | 3;
  /** Синхронно с мастер-скетчем: режим цеха (?sketchFloor=1 / RBAC). */
  sketchViewFloor?: boolean;
};

export function CategorySubcategorySketchesTzBlock({
  currentLeaf,
  dossier,
  articleSku,
  articleName,
  setDossier,
  sketchContext,
  masterSketchAnnotations = [],
  activeLevel: activeLevelRaw,
  sketchViewFloor = false,
}: Props) {
  const readOnly = sketchViewFloor;
  const level = coerceSubcategorySketchLevel(activeLevelRaw);
  const slotNodeName = useMemo(
    () =>
      level === 1 ? currentLeaf.l1Name : level === 2 ? currentLeaf.l2Name : currentLeaf.l3Name,
    [level, currentLeaf.l1Name, currentLeaf.l2Name, currentLeaf.l3Name]
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const overlayBoardRef = useRef<HTMLDivElement>(null);
  const slotSketchFileInputRef = useRef<HTMLInputElement>(null);
  const [sketchOverlayOpen, setSketchOverlayOpen] = useState(false);
  const [placeMode, setPlaceMode] = useState(false);
  const [activeAnnId, setActiveAnnId] = useState<string | null>(null);
  useEffect(() => {
    setPlaceMode(false);
    setActiveAnnId(null);
  }, [level]);

  useEffect(() => {
    if (readOnly) setPlaceMode(false);
  }, [readOnly]);

  const slots = useMemo(
    () => normalizeSubcategorySketchSlots(dossier.subcategorySketchSlots),
    [dossier.subcategorySketchSlots]
  );

  const activeSlot = useMemo(() => {
    const hit = slots.find((s) => s.level === level);
    if (hit) return hit;
    const fresh = normalizeSubcategorySketchSlots(undefined);
    return fresh.find((s) => s.level === level) ?? fresh[2];
  }, [slots, level]);

  const activeTaskSourceLevel = getInheritedTaskSourceLevel(slots, level);
  const leafId = currentLeaf.leafId;

  const masterPinsOnLeaf = useMemo(
    () => masterSketchAnnotations.filter((a) => a.categoryLeafId === leafId),
    [masterSketchAnnotations, leafId]
  );

  const masterPinLabel = useCallback(
    (annotationId: string) => {
      const idx = masterPinsOnLeaf.findIndex((a) => a.annotationId === annotationId);
      if (idx >= 0) return `#${idx + 1}`;
      return annotationId.length > 12 ? `${annotationId.slice(0, 10)}…` : annotationId;
    },
    [masterPinsOnLeaf]
  );

  const pinCountByLevel = useMemo(() => {
    const count = (lv: 1 | 2 | 3) =>
      slots.find((s) => s.level === lv)?.annotations.filter((a) => a.categoryLeafId === leafId)
        .length ?? 0;
    return { 1: count(1), 2: count(2), 3: count(3) };
  }, [leafId, slots]);

  const visibleAnn = useMemo(
    () => activeSlot.annotations.filter((a) => a.categoryLeafId === leafId),
    [activeSlot.annotations, leafId]
  );

  const updateSlot = useCallback(
    (level: 1 | 2 | 3, patch: Partial<Workshop2Phase1SubcategorySketchSlot>) => {
      setDossier((d) => ({
        ...d,
        subcategorySketchSlots: patchSubcategorySketchSlot(
          d.subcategorySketchSlots ?? [],
          level,
          patch
        ),
      }));
    },
    [setDossier]
  );

  /** Всегда из актуального `d` — без устаревших closure после быстрых кликов. */
  const patchActiveSlotTasks = useCallback(
    (
      recipe: (slot: Workshop2Phase1SubcategorySketchSlot) => Workshop2Phase1ProductionTaskDetail
    ) => {
      setDossier((d) => {
        const slots = normalizeSubcategorySketchSlots(d.subcategorySketchSlots);
        const slot = slots.find((s) => s.level === level);
        if (!slot) return d;
        return {
          ...d,
          subcategorySketchSlots: patchSubcategorySketchSlot(slots, level, {
            productionTasks: recipe(slot),
          }),
        };
      });
    },
    [level, setDossier]
  );

  const setAnnotations = useCallback(
    (level: 1 | 2 | 3, next: Workshop2Phase1CategorySketchAnnotation[]) => {
      updateSlot(level, { annotations: next });
    },
    [updateSlot]
  );

  const placeAnnotationFromBoard = useCallback(
    (boardEl: HTMLElement, clientX: number, clientY: number) => {
      if (readOnly) return;
      const rect = boardEl.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      const xPct = Math.min(98, Math.max(2, x));
      const yPct = Math.min(98, Math.max(2, y));
      const all = activeSlot.annotations;
      if (all.length >= MAX_ANNOTATIONS_PER_SLOT) return;
      const na: Workshop2Phase1CategorySketchAnnotation = {
        annotationId: newUuid(),
        categoryLeafId: leafId,
        xPct,
        yPct,
        text: '',
      };
      setAnnotations(level, [...all, na]);
      setActiveAnnId(na.annotationId);
      setPlaceMode(false);
    },
    [readOnly, activeSlot.annotations, leafId, level, setAnnotations]
  );

  const onOverlayBoardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!placeMode || !overlayBoardRef.current) return;
    placeAnnotationFromBoard(overlayBoardRef.current, e.clientX, e.clientY);
  };

  const onPreviewBoardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (placeMode) {
      if (boardRef.current) placeAnnotationFromBoard(boardRef.current, e.clientX, e.clientY);
      return;
    }
    setSketchOverlayOpen(true);
  };

  const updateAnnText = (id: string, text: string) => {
    setAnnotations(
      level,
      activeSlot.annotations.map((a) => (a.annotationId === id ? { ...a, text } : a))
    );
  };

  const removeAnn = (id: string) => {
    setAnnotations(
      level,
      activeSlot.annotations.filter((a) => a.annotationId !== id)
    );
    if (activeAnnId === id) setActiveAnnId(null);
  };

  const onPickImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    const u = await readFileAsDataUrlLimited(f, MAX_IMAGE_CHARS);
    updateSlot(level, {
      imageDataUrl: u,
      imageFileName: f.name,
    });
  };

  const clearImage = () => {
    updateSlot(level, { imageDataUrl: undefined, imageFileName: undefined });
  };

  const setTaskField = <K extends keyof Workshop2Phase1ProductionTaskDetail>(
    key: K,
    value: Workshop2Phase1ProductionTaskDetail[K]
  ) => {
    patchActiveSlotTasks((slot) => ({ ...slot.productionTasks, [key]: value }));
  };

  const appendTaskSnippet = useCallback(
    (field: keyof Workshop2Phase1ProductionTaskDetail, snippet: string) => {
      patchActiveSlotTasks((slot) => {
        const cur = String(slot.productionTasks[field] ?? '').trim();
        const next = cur ? `${cur}\n${snippet}` : snippet;
        return { ...slot.productionTasks, [field]: next };
      });
    },
    [patchActiveSlotTasks]
  );

  const masterPinsForLeaf = useMemo(
    () => masterSketchAnnotations.filter((a) => a.categoryLeafId === leafId),
    [leafId, masterSketchAnnotations]
  );

  const importMasterPinsToActiveLevel = useCallback(() => {
    if (masterPinsForLeaf.length === 0) return;
    const room = MAX_ANNOTATIONS_PER_SLOT - activeSlot.annotations.length;
    if (room <= 0) return;
    const copies = masterPinsForLeaf.slice(0, room).map((a) => ({
      ...a,
      annotationId: newUuid(),
      linkedTaskId: undefined,
      linkedQcZoneId: undefined,
      linkedAttributeId: undefined,
    }));
    setAnnotations(level, [...activeSlot.annotations, ...copies]);
  }, [level, activeSlot.annotations, masterPinsForLeaf, setAnnotations]);

  const mergePinsFromLevel = useCallback(
    (fromLevel: 1 | 2 | 3) => {
      if (fromLevel === level) return;
      const fromSlot = slots.find((s) => s.level === fromLevel);
      if (!fromSlot) return;
      const source = fromSlot.annotations.filter((a) => a.categoryLeafId === leafId);
      if (source.length === 0) return;
      const room = MAX_ANNOTATIONS_PER_SLOT - activeSlot.annotations.length;
      if (room <= 0) return;
      const copies = source.slice(0, room).map((a) => ({
        ...a,
        annotationId: newUuid(),
        linkedTaskId: undefined,
        linkedQcZoneId: undefined,
        linkedAttributeId: undefined,
      }));
      setAnnotations(level, [...activeSlot.annotations, ...copies]);
    },
    [level, activeSlot.annotations, leafId, setAnnotations, slots]
  );

  const clearAllPinsOnLevel = useCallback(() => {
    if (activeSlot.annotations.length === 0) return;
    if (
      !window.confirm(
        `Удалить все ${activeSlot.annotations.length} меток в слоте «${BRANCH_CATALOG_SLOT_ROLE[level].label}: ${slotNodeName}»?`
      )
    )
      return;
    setAnnotations(level, []);
    setActiveAnnId(null);
  }, [level, activeSlot.annotations.length, setAnnotations, slotNodeName]);

  const copyTasksBlock = useCallback(async () => {
    const t = activeSlot.productionTasks;
    const slotTitle = `${BRANCH_CATALOG_SLOT_ROLE[level].label}: ${slotNodeName}`;
    const lines = [
      `## Задачи · ${slotTitle} (${articleSku})`,
      t.whatToDo?.trim() && `**Сделать:** ${t.whatToDo.trim()}`,
      t.improve?.trim() && `**Улучшить:** ${t.improve.trim()}`,
      t.change?.trim() && `**Изменить:** ${t.change.trim()}`,
      t.watchAttention?.trim() && `**Внимание:** ${t.watchAttention.trim()}`,
      t.acceptanceCriteria?.trim() && `**Приёмка:** ${t.acceptanceCriteria.trim()}`,
    ].filter(Boolean) as string[];
    const text = lines.join('\n\n');
    try {
      await navigator.clipboard.writeText(text || `## Задачи · ${slotTitle} — блок пуст`);
    } catch {
      /* ignore */
    }
  }, [level, activeSlot.productionTasks, articleSku, slotNodeName]);

  const adoptInheritedTasks = (sourceLevel: 1 | 2) => {
    const sourceSlot = slots.find((slot) => slot.level === sourceLevel);
    if (!sourceSlot) return;
    const srcName =
      sourceLevel === 1
        ? currentLeaf.l1Name
        : sourceLevel === 2
          ? currentLeaf.l2Name
          : currentLeaf.l3Name;
    updateSlot(level, {
      productionTasks: {
        ...sourceSlot.productionTasks,
        inheritedFromLevel: sourceLevel,
        overrideReason:
          level === sourceLevel
            ? undefined
            : `Принято с «${srcName}» (${BRANCH_CATALOG_SLOT_ROLE[sourceLevel].label})`,
      },
    });
  };

  const pushAnnotationIntoTask = (annotation: Workshop2Phase1CategorySketchAnnotation) => {
    const line = createAnnotationTaskLine(annotation);
    const current = activeSlot.productionTasks.watchAttention.trim();
    const lines = current
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    if (!lines.includes(line)) lines.push(line);
    updateSlot(level, {
      productionTasks: {
        ...activeSlot.productionTasks,
        watchAttention: lines.join('\n'),
        linkedAnnotationIds: [
          ...new Set([
            ...(activeSlot.productionTasks.linkedAnnotationIds ?? []),
            annotation.annotationId,
          ]),
        ],
        status:
          activeSlot.productionTasks.status === 'done'
            ? 'in_progress'
            : activeSlot.productionTasks.status,
      },
    });
  };

  const refreshSnapshot = () => {
    setDossier((d) => {
      const text = buildTzAttributesDimensionsSnapshotText(d, {
        articleSku,
        articleName,
        pathLabel: currentLeaf.pathLabel,
      });
      return {
        ...d,
        subcategorySketchSlots: patchSubcategorySketchSlot(d.subcategorySketchSlots ?? [], level, {
          attributesDimensionsSnapshot: text,
          attributesDimensionsSnapshotUpdatedAt: new Date().toISOString(),
        }),
      };
    });
  };

  const branchSlotMetaByLevel = useMemo(
    () =>
      ([1, 2, 3] as const).map((lv) => ({
        level: lv,
        role: BRANCH_CATALOG_SLOT_ROLE[lv],
      })),
    []
  );
  const activeBranchSlot = branchSlotMetaByLevel.find((x) => x.level === level)!;

  function AnnotationPinsLayer() {
    return (
      <>
        {visibleAnn.map((a, idx) => {
          const inTaskBlock = activeSlot.productionTasks.linkedAnnotationIds?.includes(
            a.annotationId
          );
          return (
            <Tooltip key={a.annotationId} delayDuration={200}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'bg-accent-primary hover:bg-accent-primary absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md',
                    activeAnnId === a.annotationId && 'ring-2 ring-amber-400 ring-offset-1'
                  )}
                  style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setActiveAnnId(a.annotationId);
                  }}
                  aria-label={`Метка ${idx + 1}, наведите для описания`}
                >
                  {idx + 1}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="border-border-default text-text-primary max-w-xs bg-white p-3 text-left shadow-lg"
              >
                <div className="space-y-1.5 text-[11px] leading-snug">
                  <p className="text-text-primary font-semibold">Метка #{idx + 1}</p>
                  <p className="text-text-primary">
                    {a.text?.trim()
                      ? a.text.trim()
                      : 'Описание не заполнено — уточните в списке «Метки на скетче» ниже.'}
                  </p>
                  {inTaskBlock ? (
<<<<<<< HEAD
                    <p className="border-t border-slate-100 pt-1.5 text-[10px] font-medium text-indigo-800">
=======
                    <p className="border-border-subtle text-accent-primary border-t pt-1.5 text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                      Строка добавлена в «На что обратить внимание» (задачи слота «
                      {activeBranchSlot.role.label}»).
                    </p>
                  ) : (
<<<<<<< HEAD
                    <p className="border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
=======
                    <p className="border-border-subtle text-text-secondary border-t pt-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                      Задачи слота — в колонке справа; «В задачу» переносит текст в «На что обратить
                      внимание».
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </>
    );
  }

  function AnnotationsPanel() {
    return (
      <div className="border-border-default bg-bg-surface2/40 space-y-3 rounded-lg border p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant={placeMode ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            disabled={readOnly}
            onClick={() => setPlaceMode((v) => !v)}
          >
            {placeMode ? 'Клик по полю…' : '+ Метка на скетче'}
          </Button>
          <span className="text-text-secondary text-[10px]">Меток: {visibleAnn.length}</span>
        </div>
        {masterPinsForLeaf.length > 0 ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 w-full text-[10px] sm:w-auto"
            disabled={visibleAnn.length >= MAX_ANNOTATIONS_PER_SLOT || readOnly}
            onClick={importMasterPinsToActiveLevel}
          >
            Скопировать метки с «Общий» в слот «{activeBranchSlot.role.label}» (
            {masterPinsForLeaf.length})
          </Button>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {level === 2 && pinCountByLevel[1] > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[10px]"
              disabled={activeSlot.annotations.length >= MAX_ANNOTATIONS_PER_SLOT || readOnly}
              onClick={() => mergePinsFromLevel(1)}
            >
              + Метки с линии ({pinCountByLevel[1]})
            </Button>
          ) : null}
          {level === 3 && pinCountByLevel[1] > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[10px]"
              disabled={activeSlot.annotations.length >= MAX_ANNOTATIONS_PER_SLOT || readOnly}
              onClick={() => mergePinsFromLevel(1)}
            >
              + С линии ({pinCountByLevel[1]})
            </Button>
          ) : null}
          {level === 3 && pinCountByLevel[2] > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[10px]"
              disabled={activeSlot.annotations.length >= MAX_ANNOTATIONS_PER_SLOT || readOnly}
              onClick={() => mergePinsFromLevel(2)}
            >
              + С группы ({pinCountByLevel[2]})
            </Button>
          ) : null}
          {visibleAnn.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[10px] text-red-700 hover:text-red-800"
              disabled={readOnly}
              onClick={clearAllPinsOnLevel}
            >
              Очистить метки слота
            </Button>
          ) : null}
        </div>

        <div className="border-border-default/80 space-y-1 border-t pt-3">
          <p className="text-text-secondary text-[10px] font-semibold uppercase">Метки на скетче</p>
          {visibleAnn.length === 0 ? (
            <p className="text-text-secondary text-[11px]">Нет меток в этом слоте.</p>
          ) : (
            <ul className="max-h-[min(22rem,50vh)] space-y-2 overflow-y-auto pr-1">
              {visibleAnn.map((a, idx) => (
                <li
                  key={a.annotationId}
                  className={cn(
                    'rounded-md border p-2 text-xs',
                    activeAnnId === a.annotationId
<<<<<<< HEAD
                      ? 'border-indigo-300 bg-indigo-50/40'
                      : 'border-slate-100 bg-white'
=======
                      ? 'border-accent-primary/30 bg-accent-primary/10'
                      : 'border-border-subtle bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-text-primary font-semibold">#{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary h-7 px-2 text-[10px]"
                        disabled={readOnly}
                        onClick={() => pushAnnotationIntoTask(a)}
                      >
                        В задачу
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] text-red-600"
                        disabled={readOnly}
                        onClick={() => removeAnn(a.annotationId)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    className="min-h-[44px] text-xs"
                    placeholder="Уточнение к точке на модели…"
                    value={a.text}
                    readOnly={readOnly}
                    onChange={(e) => updateAnnText(a.annotationId, e.target.value)}
                    onFocus={() => setActiveAnnId(a.annotationId)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {readOnly ? (
        <div
          className="rounded-lg border border-teal-200 bg-teal-50/90 px-3 py-2 text-[11px] text-teal-950"
          role="status"
        >
          <p className="font-semibold">Режим цеха</p>
          <p className="mt-0.5 text-[10px] text-teal-900/90">
            Слоты «линия / группа / модель» только для просмотра.
          </p>
        </div>
      ) : null}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div
            ref={boardRef}
            role="region"
            aria-label={
              readOnly
                ? `Мини-скетч: ${activeBranchSlot.role.label}`
                : placeMode
                  ? `Мини-скетч: ${activeBranchSlot.role.label}, режим метки`
                  : `Мини-скетч: ${activeBranchSlot.role.label}. Нажмите на поле, чтобы открыть увеличенный вид.`
            }
            className={cn(
<<<<<<< HEAD
              'relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200 bg-white',
              placeMode && !readOnly && 'cursor-crosshair ring-2 ring-indigo-500 ring-offset-2',
=======
              'border-border-default relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-white',
              placeMode && !readOnly && 'ring-accent-primary cursor-crosshair ring-2 ring-offset-2',
>>>>>>> recover/cabinet-wip-from-stash
              !placeMode && !readOnly && 'cursor-zoom-in'
            )}
            onClick={readOnly ? undefined : onPreviewBoardClick}
          >
            {activeSlot.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL
              <img
                src={activeSlot.imageDataUrl}
                alt=""
                className="pointer-events-none h-full w-full object-contain"
              />
            ) : (
              <CategorySketchTemplateSvg
                leaf={currentLeaf}
                sketchContext={sketchContext}
                className="pointer-events-none h-full w-full"
              />
            )}
            <AnnotationPinsLayer />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={slotSketchFileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-hidden
              tabIndex={-1}
              disabled={readOnly}
              onChange={(e) => void onPickImage(e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={readOnly}
              title={
                readOnly
                  ? 'В режиме цеха загрузка отключена'
                  : 'Заменить типовой силуэт своим изображением'
              }
              onClick={() => slotSketchFileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Загрузить свой скетч
            </Button>
            {activeSlot.imageFileName ? (
              <>
                <span
<<<<<<< HEAD
                  className="max-w-[min(100%,14rem)] truncate text-[10px] text-slate-600"
=======
                  className="text-text-secondary max-w-[min(100%,14rem)] truncate text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                  title={activeSlot.imageFileName}
                >
                  {activeSlot.imageFileName}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[10px] text-red-600"
                  disabled={readOnly}
                  onClick={clearImage}
                >
                  Сбросить подложку
                </Button>
              </>
            ) : (
<<<<<<< HEAD
              <span className="text-[10px] text-slate-500">
=======
              <span className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                Без файла — на доске типовой силуэт по ветке каталога.
              </span>
            )}
          </div>

          <AnnotationsPanel />
        </div>

        <div className="w-full min-w-0 space-y-3 lg:w-[min(100%,380px)] lg:shrink-0">
<<<<<<< HEAD
          <div className="space-y-2 rounded-md border border-slate-100 bg-white/80 p-2">
            <p className="text-[10px] font-bold uppercase text-slate-500">
=======
          <div className="border-border-subtle space-y-2 rounded-md border bg-white/80 p-2">
            <p className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
              Задачи для производства
            </p>
            {activeTaskSourceLevel && activeSlot.productionTasks.inheritedFromLevel == null ? (
              <div className="rounded-md border border-amber-100 bg-amber-50/60 p-2 text-[10px] text-amber-900">
                В слоте «
                {branchSlotMetaByLevel.find((x) => x.level === activeTaskSourceLevel)?.role.label ??
                  '…'}
                » уже есть текст задач. Можно подтянуть его в «{activeBranchSlot.role.label}» и
                править дальше.
                <div className="mt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px]"
                    disabled={readOnly}
                    onClick={() => adoptInheritedTasks(activeTaskSourceLevel)}
                  >
                    Принять оттуда
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-text-muted w-full text-[9px] font-semibold uppercase tracking-wide">
                Шаблоны в задачи
              </span>
              {TASK_SNIPPETS.map((s) => (
                <Button
                  key={s.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 text-[10px]"
                  disabled={readOnly}
                  onClick={() => appendTaskSnippet(s.field, s.text)}
                >
                  + {s.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-[10px]"
                onClick={() => void copyTasksBlock()}
              >
                <Copy className="h-3 w-3" />
                Скопировать блок
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeSlot.productionTasks.linkedAnnotationIds?.length ? (
                <div className="border-accent-primary/20 bg-accent-primary/10 rounded-md border p-2 sm:col-span-2">
                  <p className="text-accent-primary text-[9px] font-bold uppercase tracking-wide">
                    Метки master, закрывающие этот узел
                  </p>
                  <p className="text-accent-primary/85 mt-0.5 text-[10px] leading-snug">
                    Номера совпадают с панелью выбора метки на доске категории.
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {activeSlot.productionTasks.linkedAnnotationIds.map((id) => (
                      <span
                        key={id}
                        className="text-accent-primary ring-accent-primary/30 inline-flex items-center rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ring-1"
                        title={id}
                      >
                        {masterPinLabel(id)}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Ответственный</Label>
                <Input
                  className="h-8 text-[11px]"
                  placeholder="Технолог / ОТК"
                  value={activeSlot.productionTasks.owner ?? ''}
                  readOnly={readOnly}
                  onChange={(e) => setTaskField('owner', e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Критерий приемки</Label>
                <Input
                  className="h-8 text-[11px]"
                  placeholder="Что считаем готовым"
                  value={activeSlot.productionTasks.acceptanceCriteria ?? ''}
                  readOnly={readOnly}
                  onChange={(e) => setTaskField('acceptanceCriteria', e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Приоритет</Label>
                <select
                  className="border-border-default h-8 w-full rounded-md border bg-white px-2 text-[11px] disabled:opacity-60"
                  value={activeSlot.productionTasks.priority ?? 'normal'}
                  disabled={readOnly}
                  onChange={(e) =>
                    setTaskField('priority', e.target.value as Workshop2ProductionTaskPriority)
                  }
                >
                  <option value="critical">{TASK_PRIORITY_LABELS.critical}</option>
                  <option value="high">{TASK_PRIORITY_LABELS.high}</option>
                  <option value="normal">{TASK_PRIORITY_LABELS.normal}</option>
                </select>
              </label>
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Статус</Label>
                <select
                  className="border-border-default h-8 w-full rounded-md border bg-white px-2 text-[11px] disabled:opacity-60"
                  value={activeSlot.productionTasks.status ?? 'new'}
                  disabled={readOnly}
                  onChange={(e) =>
                    setTaskField('status', e.target.value as Workshop2ProductionTaskStatus)
                  }
                >
                  <option value="new">{TASK_STATUS_LABELS.new}</option>
                  <option value="in_progress">{TASK_STATUS_LABELS.in_progress}</option>
                  <option value="done">{TASK_STATUS_LABELS.done}</option>
                  <option value="blocked">{TASK_STATUS_LABELS.blocked}</option>
                </select>
              </label>
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Этап</Label>
                <select
                  className="border-border-default h-8 w-full rounded-md border bg-white px-2 text-[11px] disabled:opacity-60"
                  value={activeSlot.productionTasks.linkedStage ?? 'tz'}
                  disabled={readOnly}
                  onChange={(e) =>
                    setTaskField('linkedStage', e.target.value as Workshop2ProductionTaskStage)
                  }
                >
                  <option value="tz">{TASK_STAGE_LABELS.tz}</option>
                  <option value="supply">{TASK_STAGE_LABELS.supply}</option>
                  <option value="fit">{TASK_STAGE_LABELS.fit}</option>
                  <option value="plan">{TASK_STAGE_LABELS.plan}</option>
                  <option value="release">{TASK_STAGE_LABELS.release}</option>
                  <option value="qc">{TASK_STAGE_LABELS.qc}</option>
                </select>
              </label>
              <label className="space-y-1">
                <Label className="text-text-secondary text-[10px]">Причина override</Label>
                <Input
                  className="h-8 text-[11px]"
                  placeholder="Чем отличается от узла выше по ветке"
                  value={activeSlot.productionTasks.overrideReason ?? ''}
                  readOnly={readOnly}
                  onChange={(e) => setTaskField('overrideReason', e.target.value)}
                />
              </label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-text-secondary text-[10px]">Что сделать</Label>
              <Textarea
                className="min-h-[48px] text-xs"
                placeholder="Конкретные операции пошива, узлы…"
                value={activeSlot.productionTasks.whatToDo}
                readOnly={readOnly}
                onChange={(e) => setTaskField('whatToDo', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-text-secondary text-[10px]">Что улучшить</Label>
              <Textarea
                className="min-h-[48px] text-xs"
                placeholder="Качество, аккуратность, сравнение с эталоном…"
                value={activeSlot.productionTasks.improve}
                readOnly={readOnly}
                onChange={(e) => setTaskField('improve', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-text-secondary text-[10px]">Что изменить</Label>
              <Textarea
                className="min-h-[48px] text-xs"
                placeholder="Отличия от прошлой версии, правки лекал…"
                value={activeSlot.productionTasks.change}
                readOnly={readOnly}
                onChange={(e) => setTaskField('change', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-text-secondary text-[10px]">На что обратить внимание</Label>
              <Textarea
                className="min-h-[48px] text-xs"
                placeholder="КБ, швы, фурнитура, симметрия, маркировка…"
                value={activeSlot.productionTasks.watchAttention}
                readOnly={readOnly}
                onChange={(e) => setTaskField('watchAttention', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
<<<<<<< HEAD
              <Label className="text-[10px] font-semibold text-slate-600">
=======
              <Label className="text-text-secondary text-[10px] font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
                Сводка габаритов и атрибутов артикула
              </Label>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 text-[10px]"
                disabled={readOnly}
                onClick={refreshSnapshot}
              >
                Обновить сводку
              </Button>
            </div>
            {activeSlot.attributesDimensionsSnapshotUpdatedAt ? (
<<<<<<< HEAD
              <p className="text-[9px] text-slate-400">
=======
              <p className="text-text-muted text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                Обновлено:{' '}
                {new Date(activeSlot.attributesDimensionsSnapshotUpdatedAt).toLocaleString('ru-RU')}
              </p>
            ) : null}
            <Textarea
              className="min-h-[120px] font-mono text-[10px] leading-relaxed"
              placeholder="Нажмите «Обновить сводку» — подставятся выбранные атрибуты и таблица мерок из этого досье."
              value={activeSlot.attributesDimensionsSnapshot ?? ''}
              readOnly={readOnly}
              onChange={(e) => updateSlot(level, { attributesDimensionsSnapshot: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={sketchOverlayOpen}
        onOpenChange={(open) => {
          setSketchOverlayOpen(open);
          if (!open) setPlaceMode(false);
        }}
      >
        <DialogContent
          className="max-h-[min(96vh,900px)] w-[min(96vw,56rem)] max-w-none gap-4 overflow-y-auto p-4 sm:p-6"
          ariaTitle={`Скетч · ${activeBranchSlot.role.label}: ${slotNodeName}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div
              ref={overlayBoardRef}
              role="region"
              aria-label={`Увеличенный скетч: ${activeBranchSlot.role.label}`}
              className={cn(
                'border-border-default relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-lg border bg-white lg:max-w-[min(100%,42rem)] lg:flex-1',
                placeMode &&
                  !readOnly &&
                  'ring-accent-primary cursor-crosshair ring-2 ring-offset-2'
              )}
              onClick={readOnly ? undefined : onOverlayBoardClick}
            >
              {activeSlot.imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL
                <img
                  src={activeSlot.imageDataUrl}
                  alt=""
                  className="pointer-events-none h-full w-full object-contain"
                />
              ) : (
                <CategorySketchTemplateSvg
                  leaf={currentLeaf}
                  sketchContext={sketchContext}
                  className="pointer-events-none h-full w-full"
                />
              )}
              <AnnotationPinsLayer />
            </div>
            <div className="w-full min-w-0 lg:w-[min(100%,22rem)] lg:shrink-0">
              <AnnotationsPanel />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
