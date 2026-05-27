'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { W2_COMPOSITION_LABEL_FONT_PRESETS } from '@/lib/production/workshop2-composition-label-spec-constants';
import {
  buildDefaultCompositionLabelLayoutElements,
  ensureCompositionLabelLayoutElements,
  newCompositionLabelTextElement,
  normalizeCompositionLabelLayoutElement,
} from '@/lib/production/workshop2-composition-label-layout';
import { Workshop2CompositionLabelLayoutPreviewBody } from '@/components/brand/production/Workshop2CompositionLabelLayoutPreviewBody';
import type {
  Workshop2CompositionLabelFontPreset,
  Workshop2CompositionLabelLayoutElement,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

const CORE_TEXT_ID = 'layout-el-text';

function fontCssStack(preset: Workshop2CompositionLabelFontPreset | '' | undefined): string {
  const row = W2_COMPOSITION_LABEL_FONT_PRESETS.find((x) => x.id === (preset ?? ''));
  return row?.cssStack ?? 'system-ui, sans-serif';
}

function num(v: string, fallback: number): number {
  const n = Number.parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

function layoutElementListTitle(
  el: Workshop2CompositionLabelLayoutElement,
  elementsSorted: Workshop2CompositionLabelLayoutElement[]
): string {
  if (el.kind === 'logo') return 'Логотип';
  if (el.kind === 'careStrip') return 'Полоса ухода (ISO)';
  const texts = elementsSorted.filter((e) => e.kind === 'text');
  const idx = texts.findIndex((e) => e.elementId === el.elementId);
  return texts.length > 1 ? `Текст ${idx + 1}` : 'Текст черновика';
}

function layoutElementSubtitle(el: Workshop2CompositionLabelLayoutElement): string {
  return `X ${el.xPct}% · Y ${el.yPct}% · ${el.wPct}×${el.hPct}%`;
}

export function Workshop2CompositionLabelLayoutEditorDialog({
  open,
  onOpenChange,
  spec,
  displayLines,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spec: Workshop2CompositionLabelSpec;
  displayLines: string[];
  onApply: (next: Workshop2CompositionLabelSpec) => void;
}) {
  const [draftSpec, setDraftSpec] = useState<Workshop2CompositionLabelSpec>(spec);
  const [elements, setElements] = useState<Workshop2CompositionLabelLayoutElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const elementsRef = useRef(elements);
  const selectedIdRef = useRef(selectedId);
  elementsRef.current = elements;
  selectedIdRef.current = selectedId;

  const patchDraft = useCallback((patch: Partial<Workshop2CompositionLabelSpec>) => {
    setDraftSpec((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!open) return;
    setDraftSpec({ ...spec });
    setElements(ensureCompositionLabelLayoutElements(spec.layoutElements));
    setSelectedId((prev) => {
      const list = ensureCompositionLabelLayoutElements(spec.layoutElements);
      if (prev && list.some((e) => e.elementId === prev)) return prev;
      return list[0]?.elementId ?? null;
    });
    setZoom(1);
  }, [open, spec]);

  const sortedForList = useMemo(
    () => [...elements].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
    [elements]
  );

  const selected = useMemo(
    () => elements.find((e) => e.elementId === selectedId) ?? null,
    [elements, selectedId]
  );

  const wMm = num(draftSpec.labelWidthMm ?? '', 0);
  const hMm = num(draftSpec.labelHeightMm ?? '', 0);
  const ratio = wMm > 0 && hMm > 0 ? `${(hMm / wMm) * 100}%` : '56.25%';

  const patchSelected = useCallback((patch: Partial<Workshop2CompositionLabelLayoutElement>) => {
    const sid = selectedIdRef.current;
    if (!sid) return;
    setElements((prev) =>
      prev.map((e) =>
        e.elementId === sid ? normalizeCompositionLabelLayoutElement({ ...e, ...patch }) : e
      )
    );
  }, []);

  const nudgeSelected = useCallback((dxPct: number, dyPct: number) => {
    const sid = selectedIdRef.current;
    if (!sid) return;
    setElements((prev) =>
      prev.map((e) => {
        if (e.elementId !== sid) return e;
        return normalizeCompositionLabelLayoutElement({
          ...e,
          xPct: e.xPct + dxPct,
          yPct: e.yPct + dyPct,
        });
      })
    );
  }, []);

  const centerSelectedHorizontally = useCallback(() => {
    const sid = selectedIdRef.current;
    if (!sid) return;
    setElements((prev) =>
      prev.map((e) => {
        if (e.elementId !== sid) return e;
        return normalizeCompositionLabelLayoutElement({
          ...e,
          xPct: (100 - e.wPct) / 2,
        });
      })
    );
  }, []);

  const bodyPt = num(draftSpec.typographyBodyPt ?? '', 9);
  const baseFontPx = Number.isFinite(bodyPt) ? `${Math.max(6, bodyPt) * 1.33}px` : '11px';

  const bumpBodyPt = (delta: number) => {
    const cur = num(draftSpec.typographyBodyPt ?? '', 9);
    const next = Math.round(Math.max(6, Math.min(24, cur + delta)) * 10) / 10;
    patchDraft({ typographyBodyPt: String(next) });
  };

  const handleSave = () => {
    onApply({
      ...draftSpec,
      layoutElements: elements.map(normalizeCompositionLabelLayoutElement),
    });
    onOpenChange(false);
  };

  const handleResetLayout = () => {
    setElements(buildDefaultCompositionLabelLayoutElements());
    setSelectedId('layout-el-text');
  };

  const addTextBlock = () => {
    const next = newCompositionLabelTextElement(elements.filter((e) => e.kind === 'text').length);
    setElements((prev) => [...prev, next]);
    setSelectedId(next.elementId);
  };

  const duplicateSelectedTextBlock = useCallback(() => {
    const sid = selectedIdRef.current;
    const list = elementsRef.current;
    const sel = list.find((e) => e.elementId === sid);
    if (!sel || sel.kind !== 'text') return;
    const textCount = list.filter((e) => e.kind === 'text').length;
    const nextEl = newCompositionLabelTextElement(textCount);
    const normalized = normalizeCompositionLabelLayoutElement({
      ...nextEl,
      xPct: sel.xPct + 2,
      yPct: sel.yPct + 2,
      wPct: sel.wPct,
      hPct: sel.hPct,
      fontSizePx: sel.fontSizePx ?? 11,
      fontWeight: sel.fontWeight === 'bold' ? 'bold' : 'normal',
    });
    setElements((prev) => [...prev, normalized]);
    setSelectedId(normalized.elementId);
  }, []);

  const removeSelectedTextBlock = useCallback(() => {
    const sid = selectedIdRef.current;
    if (!sid) return;
    setElements((prev) => {
      const el = prev.find((e) => e.elementId === sid);
      if (!el || el.kind !== 'text' || el.elementId === CORE_TEXT_ID) return prev;
      const next = prev.filter((e) => e.elementId !== sid);
      const nextSel = next.find((e) => e.kind === 'text')?.elementId ?? next[0]?.elementId ?? null;
      queueMicrotask(() => setSelectedId(nextSel));
      return next;
    });
  }, []);

  /** Поменять местами z-index с соседом в порядке слоёв (как в списке блоков). */
  const reorderSelectedZ = useCallback((direction: 'forward' | 'back') => {
    const sid = selectedIdRef.current;
    if (!sid) return;
    setElements((prev) => {
      const ordered = [...prev].sort((a, b) => {
        const dz = (a.zIndex ?? 0) - (b.zIndex ?? 0);
        if (dz !== 0) return dz;
        return a.elementId.localeCompare(b.elementId);
      });
      const idx = ordered.findIndex((e) => e.elementId === sid);
      if (idx < 0) return prev;
      const swapIdx = direction === 'forward' ? idx + 1 : idx - 1;
      if (swapIdx < 0 || swapIdx >= ordered.length) return prev;
      const a = ordered[idx];
      const b = ordered[swapIdx];
      const az = a.zIndex ?? 0;
      const bz = b.zIndex ?? 0;
      return prev.map((e) => {
        if (e.elementId === a.elementId)
          return normalizeCompositionLabelLayoutElement({ ...e, zIndex: bz });
        if (e.elementId === b.elementId)
          return normalizeCompositionLabelLayoutElement({ ...e, zIndex: az });
        return e;
      });
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el?.closest(
          'input, textarea, [contenteditable="true"], select, [data-slot="select-content"]'
        )
      )
        return;
      const sid = selectedIdRef.current;
      if (!sid) return;
      const step = e.shiftKey ? 5 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudgeSelected(-step, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudgeSelected(step, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeSelected(0, -step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeSelected(0, step);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, nudgeSelected]);

  const draftText = displayLines.join('\n');
  const textBlockCount = elements.filter((e) => e.kind === 'text').length;
  const canRemoveSelectedText =
    selected?.kind === 'text' && selected.elementId !== CORE_TEXT_ID && textBlockCount > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ariaTitle="Редактор оформления бирки"
        className="flex max-h-[min(92vh,760px)] max-w-5xl flex-col gap-0 p-0 sm:max-w-5xl"
      >
        <DialogHeader className="border-border-subtle shrink-0 border-b px-4 py-3">
          <DialogTitle className="text-text-primary text-base">
            Редактировать оформление бирки
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-text-secondary text-xs leading-snug">
              Слева — макет в пропорциях мм. Справа — блоки (можно выбрать из списка), позиция и
              типографика. Стрелки на клавиатуре сдвигают выбранный блок на 1% (с Shift — 5%), если
              фокус не в поле ввода. Порядок наложения — поле «Слой» или кнопки «Выше / Ниже» рядом
              с ним.
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[1fr_min(22rem,40%)]">
          <div className="border-border-subtle flex min-h-[280px] flex-col gap-2 border-b p-3 md:border-b-0 md:border-r">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-text-primary text-xs font-medium">Предпросмотр</p>
                {wMm > 0 && hMm > 0 ? (
                  <p className="text-text-muted text-xs tabular-nums">
                    {wMm} × {hMm} мм
                  </p>
                ) : (
                  <p className="text-text-muted text-xs">Задайте ширину и высоту бирки в шаге 1</p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 shrink-0 px-0 text-xs"
                  onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
                  aria-label="Уменьшить масштаб"
                >
                  −
                </Button>
                <span className="text-text-secondary w-11 text-center text-xs tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 shrink-0 px-0 text-xs"
                  onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.1) * 10) / 10))}
                  aria-label="Увеличить масштаб"
                >
                  +
                </Button>
              </div>
            </div>
            <div
              className="min-h-0 flex-1 overflow-auto rounded-md border bg-neutral-100/80 p-3"
              onClick={() => setSelectedId(null)}
            >
              <div
                className="mx-auto origin-top transition-transform"
                style={{
                  transform: `scale(${zoom})`,
                  width: zoom < 1 ? `${100 / zoom}%` : '100%',
                  maxWidth: 440,
                }}
              >
                <div
                  className="border-border-default relative w-full overflow-hidden rounded-md border-2 border-dashed bg-white shadow-inner"
                  style={{ paddingBottom: ratio }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      fontFamily: fontCssStack(draftSpec.typographyFontPreset),
                      fontSize: baseFontPx,
                    }}
                  >
                    <Workshop2CompositionLabelLayoutPreviewBody
                      spec={draftSpec}
                      elements={elements}
                      draftText={draftText}
                      selectedId={selectedId}
                      onSelectElement={setSelectedId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex max-h-[min(72vh,640px)] flex-col gap-3 overflow-y-auto p-3">
            <div className="space-y-2">
              <p className="text-text-primary text-xs font-medium">Блоки на макете</p>
              <p className="text-text-muted text-xs leading-snug">
                Нажмите строку — блок выделится на превью. Удобнее, чем попадать курсором в узкую
                рамку.
              </p>
              <ul className="flex flex-col gap-1.5 p-0">
                {sortedForList.map((el) => {
                  const active = el.elementId === selectedId;
                  return (
                    <li key={el.elementId} className="list-none">
                      <button
                        type="button"
                        onClick={() => setSelectedId(el.elementId)}
                        className={cn(
                          'border-border-default flex w-full flex-col items-start gap-0.5 rounded-md border px-2.5 py-2 text-left transition-colors',
                          active
                            ? 'border-accent-primary bg-accent-primary/5 ring-accent-primary/25 ring-1'
                            : 'bg-white hover:bg-neutral-50'
                        )}
                      >
                        <span className="text-text-primary text-xs font-medium">
                          {layoutElementListTitle(el, sortedForList)}
                        </span>
                        <span className="text-text-muted font-mono text-[11px] leading-tight">
                          {layoutElementSubtitle(el)}
                          {el.kind === 'text' ? ` · ${el.fontSizePx ?? 11}px` : ''}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-border-subtle space-y-3 border-t pt-3">
              <p className="text-text-primary text-xs font-medium">Типографика (весь черновик)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Кегль, pt</Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 shrink-0 px-0"
                      onClick={() => bumpBodyPt(-0.5)}
                      aria-label="Меньше"
                    >
                      −
                    </Button>
                    <Input
                      type="text"
                      inputMode="decimal"
                      className="h-9 flex-1 text-xs tabular-nums"
                      value={draftSpec.typographyBodyPt ?? ''}
                      onChange={(e) => patchDraft({ typographyBodyPt: e.target.value })}
                      placeholder="9"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 shrink-0 px-0"
                      onClick={() => bumpBodyPt(0.5)}
                      aria-label="Больше"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Гарнитура</Label>
                  <Select
                    value={(draftSpec.typographyFontPreset ?? '') || 'unset'}
                    onValueChange={(v) =>
                      patchDraft({
                        typographyFontPreset:
                          v === 'unset' ? '' : (v as Workshop2CompositionLabelFontPreset),
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Пресет" />
                    </SelectTrigger>
                    <SelectContent>
                      {W2_COMPOSITION_LABEL_FONT_PRESETS.map((o) => (
                        <SelectItem
                          key={o.id || 'unset'}
                          value={o.id || 'unset'}
                          className="text-xs"
                        >
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-medium">Своя гарнитура (название)</Label>
                  <Input
                    className="h-9 text-xs"
                    disabled={(draftSpec.typographyFontPreset ?? '') !== 'custom'}
                    value={draftSpec.typographyCustomFontName ?? ''}
                    onChange={(e) => patchDraft({ typographyCustomFontName: e.target.value })}
                    placeholder="При выборе «Своя гарнитура»"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <Checkbox
                    checked={Boolean(draftSpec.typographyBoldFiberBlock)}
                    onCheckedChange={(v) => patchDraft({ typographyBoldFiberBlock: v === true })}
                  />
                  <span>Жирный блок состава (в списке строк без раскладки)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <Checkbox
                    checked={Boolean(draftSpec.typographyBoldCareBlock)}
                    onCheckedChange={(v) => patchDraft({ typographyBoldCareBlock: v === true })}
                  />
                  <span>Жирный блок ухода</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Межстрочный интервал, %</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    className="h-9 text-xs tabular-nums"
                    value={draftSpec.typographyLineHeightPct ?? ''}
                    onChange={(e) => patchDraft({ typographyLineHeightPct: e.target.value })}
                    placeholder="130"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Межбуквенный, em</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    className="h-9 text-xs tabular-nums"
                    value={draftSpec.typographyLetterSpacingEm ?? ''}
                    onChange={(e) => patchDraft({ typographyLetterSpacingEm: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Сгиб, зоны, SKU — текстом для цеха</Label>
                <Textarea
                  className="min-h-[52px] text-xs"
                  value={draftSpec.layoutPlacementNotes ?? ''}
                  onChange={(e) => patchDraft({ layoutPlacementNotes: e.target.value })}
                  placeholder="Лицо: логотип сверху… Сгиб; оборот…"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Логотип — мм и отступы для типографии</Label>
                <Textarea
                  className="min-h-[44px] text-xs"
                  value={draftSpec.brandLogoPlacementNote ?? ''}
                  onChange={(e) => patchDraft({ brandLogoPlacementNote: e.target.value })}
                  placeholder="Высота знака 12 мм, отступ от края…"
                />
              </div>
            </div>

            {selected ? (
              <div className="border-border-subtle space-y-3 border-t pt-3">
                <p className="text-text-primary text-xs font-medium">
                  Выбранный блок: {layoutElementListTitle(selected, sortedForList)}
                </p>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Сдвиг, % (или стрелки — 1%, Shift+стрелка — 5%)
                  </Label>
                  <div className="flex max-w-[11rem] flex-col items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-full text-xs"
                      onClick={() => nudgeSelected(0, -1)}
                      aria-label="Вверх на 1%"
                    >
                      ↑ Вверх
                    </Button>
                    <div className="grid w-full grid-cols-3 gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs"
                        onClick={() => nudgeSelected(-1, 0)}
                        aria-label="Влево"
                      >
                        ←
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-1 text-[11px] leading-tight"
                        onClick={centerSelectedHorizontally}
                        title="Выровнять по центру по горизонтали"
                      >
                        Центр
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs"
                        onClick={() => nudgeSelected(1, 0)}
                        aria-label="Вправо"
                      >
                        →
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 w-full text-xs"
                      onClick={() => nudgeSelected(0, 1)}
                      aria-label="Вниз на 1%"
                    >
                      ↓ Вниз
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">X %</Label>
                    <Input
                      type="number"
                      className="h-9 text-xs"
                      value={selected.xPct}
                      onChange={(e) => patchSelected({ xPct: num(e.target.value, selected.xPct) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Y %</Label>
                    <Input
                      type="number"
                      className="h-9 text-xs"
                      value={selected.yPct}
                      onChange={(e) => patchSelected({ yPct: num(e.target.value, selected.yPct) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Ширина %</Label>
                    <Input
                      type="number"
                      className="h-9 text-xs"
                      value={selected.wPct}
                      onChange={(e) => patchSelected({ wPct: num(e.target.value, selected.wPct) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Высота %</Label>
                    <Input
                      type="number"
                      className="h-9 text-xs"
                      value={selected.hPct}
                      onChange={(e) => patchSelected({ hPct: num(e.target.value, selected.hPct) })}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-medium">Поворот °</Label>
                    <Input
                      type="number"
                      className="h-9 text-xs"
                      value={selected.rotationDeg ?? 0}
                      onChange={(e) =>
                        patchSelected({
                          rotationDeg: num(e.target.value, selected.rotationDeg ?? 0),
                        })
                      }
                    />
                  </div>
                </div>

                {selected.kind === 'text' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Кегль блока, px</Label>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 shrink-0 px-0 text-xs"
                          onClick={() =>
                            patchSelected({
                              fontSizePx: Math.max(6, Math.round((selected.fontSizePx ?? 11) - 1)),
                            })
                          }
                        >
                          −
                        </Button>
                        <Input
                          type="number"
                          className="h-9 flex-1 text-xs"
                          value={selected.fontSizePx ?? 11}
                          onChange={(e) =>
                            patchSelected({
                              fontSizePx: num(e.target.value, selected.fontSizePx ?? 11),
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 shrink-0 px-0 text-xs"
                          onClick={() =>
                            patchSelected({
                              fontSizePx: Math.min(36, Math.round((selected.fontSizePx ?? 11) + 1)),
                            })
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Начертание</Label>
                      <Select
                        value={selected.fontWeight === 'bold' ? 'bold' : 'normal'}
                        onValueChange={(v) =>
                          patchSelected({ fontWeight: v === 'bold' ? 'bold' : 'normal' })
                        }
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal" className="text-xs">
                            Обычный
                          </SelectItem>
                          <SelectItem value="bold" className="text-xs">
                            Жирный
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs font-medium">Выравнивание текста в блоке</Label>
                      <Select
                        value={selected.textAlign ?? 'left'}
                        onValueChange={(v) =>
                          patchSelected({
                            textAlign: v === 'left' || v === 'center' || v === 'right' ? v : 'left',
                          })
                        }
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left" className="text-xs">
                            По левому краю
                          </SelectItem>
                          <SelectItem value="center" className="text-xs">
                            По центру
                          </SelectItem>
                          <SelectItem value="right" className="text-xs">
                            По правому краю
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Непрозрачность блока, %</Label>
                  <Input
                    type="number"
                    className="h-9 text-xs"
                    min={0}
                    max={100}
                    value={selected.opacityPct ?? 100}
                    onChange={(e) =>
                      patchSelected({
                        opacityPct: Math.round(
                          Math.max(
                            0,
                            Math.min(100, num(e.target.value, selected.opacityPct ?? 100))
                          )
                        ),
                      })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Слой (поверх других)</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      className="h-9 min-w-0 flex-1 text-xs"
                      value={selected.zIndex ?? 1}
                      onChange={(e) =>
                        patchSelected({
                          zIndex: Math.round(num(e.target.value, selected.zIndex ?? 1)),
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 shrink-0 px-2 text-xs"
                      title="Поверх соседа в списке слоёв"
                      onClick={() => reorderSelectedZ('forward')}
                    >
                      Выше
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 shrink-0 px-2 text-xs"
                      title="Под соседа в списке слоёв"
                      onClick={() => reorderSelectedZ('back')}
                    >
                      Ниже
                    </Button>
                  </div>
                </div>

                {selected.kind === 'text' ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={duplicateSelectedTextBlock}
                    >
                      <LucideIcons.Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                      Дублировать текстовый блок
                    </Button>
                    {canRemoveSelectedText ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 border-red-200 text-xs text-red-700 hover:bg-red-50"
                        onClick={removeSelectedTextBlock}
                      >
                        <LucideIcons.Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                        Удалить этот текстовый блок
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="text-text-secondary border-border-subtle border-t pt-3 text-xs">
                Выберите блок в списке выше или на превью.
              </p>
            )}

            <div className="border-border-subtle mt-auto space-y-2 border-t pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-full text-xs"
                onClick={addTextBlock}
              >
                <LucideIcons.Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Добавить текстовый блок
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-text-muted h-9 w-full text-xs"
                onClick={handleResetLayout}
              >
                Сбросить раскладку к шаблону
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border-subtle shrink-0 border-t px-4 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button type="button" size="sm" className="h-9" onClick={handleSave}>
            <LucideIcons.Save className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Сохранить в досье
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
