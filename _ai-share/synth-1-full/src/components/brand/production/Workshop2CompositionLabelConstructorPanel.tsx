'use client';

import { useMemo, useRef, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Workshop2CompositionLabelCareSymbolPicker } from '@/components/brand/production/Workshop2CompositionLabelCareSymbolPicker';
import { Workshop2CompositionLabelDraftMockup } from '@/components/brand/production/Workshop2CompositionLabelDraftMockup';
import { Workshop2CompositionLabelFiberConstructorBlock } from '@/components/brand/production/Workshop2CompositionLabelFiberConstructorBlock';
import { Workshop2CompositionLabelDraftBlockEditors } from '@/components/brand/production/Workshop2CompositionLabelDraftBlockEditors';
import { Workshop2CompositionLabelIsoGuidanceCollapsible } from '@/components/brand/production/Workshop2CompositionLabelIsoGuidanceCollapsible';
import { Workshop2CompositionLabelMetadataBlock } from '@/components/brand/production/Workshop2CompositionLabelMetadataBlock';
import { Workshop2CompositionLabelTypographyControls } from '@/components/brand/production/Workshop2CompositionLabelTypographyControls';
import { compositionLabelDraftDisplayLines } from '@/lib/production/workshop2-composition-label-from-tz';
import { W2_COMPOSITION_LABEL_SHEET_LAYOUT_OPTIONS } from '@/lib/production/workshop2-composition-label-spec-constants';
import type {
  Workshop2CompositionLabelSheetLayout,
  Workshop2CompositionLabelSpec,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

const MAX_COMPOSITION_LABEL_LOGO_BYTES = 480 * 1024;

function CompositionLabelBlockStrip({
  kicker,
  children,
  className,
}: {
  kicker: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-border-subtle/90 space-y-2 rounded-lg border bg-white/90 p-3 shadow-sm',
        className
      )}
    >
      <p className="text-text-muted border-border-subtle/70 border-b pb-1.5 text-[10px] font-bold uppercase tracking-wide">
        {kicker}
      </p>
      {children}
    </div>
  );
}

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

export type Workshop2CompositionLabelConstructorSection = 2 | 3 | 4;

type Props = {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
  /** Красный заголовок секции «Макет…». */
  layoutHeadingAlert: boolean;
  /** Красный заголовок блока метаданных — источник из ТЗ включён, данных в досье нет. */
  sourcesTzAlert?: boolean;
  previewLines: string[];
  dossier?: Workshop2DossierPhase1 | null;
  /** Сумма долей конструктора ≠ 100%. */
  fiberSumAlert?: boolean;
  /** Красная подпись блока ухода — включён ТЗ, данных/ручного ввода нет. */
  careSectionAlert?: boolean;
  /** Красная подпись юр. блока — включён ТЗ по производителю, в досье пусто. */
  manufacturerSectionAlert?: boolean;
  /** Многостраничная раскладка без схемы — обязательно пояснить. */
  layoutSheetsNeed?: boolean;
  /** Фрагмент для карточки шага в SpecBlock. */
  onlySection: Workshop2CompositionLabelConstructorSection;
  /** Кнопка «Редактировать оформление бирки» — передаётся из SpecBlock в шаг 4. */
  children?: ReactNode;
};

export function Workshop2CompositionLabelConstructorPanel({
  spec,
  onChange,
  readOnly,
  layoutHeadingAlert,
  sourcesTzAlert = false,
  previewLines,
  dossier,
  fiberSumAlert = false,
  careSectionAlert = false,
  manufacturerSectionAlert = false,
  layoutSheetsNeed = false,
  onlySection,
  children,
}: Props) {
  const ro = readOnly;
  const s = spec ?? {};
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoErr, setLogoErr] = useState<string | null>(null);

  const displayLines = useMemo(
    () => compositionLabelDraftDisplayLines(s, previewLines),
    [s.draftTextManual, previewLines]
  );

  const commitLineEdit = (lineIndex: number, text: string) => {
    const base = [...compositionLabelDraftDisplayLines(s, previewLines)];
    while (base.length <= lineIndex) base.push('');
    base[lineIndex] = text;
    onChange(patchSpec(s, { draftTextManual: base.join('\n') }));
  };

  const onPickLogo = (file: File | null) => {
    setLogoErr(null);
    if (!file) return;
    if (file.size > MAX_COMPOSITION_LABEL_LOGO_BYTES) {
      setLogoErr(
        `Файл слишком большой (макс. ${Math.round(MAX_COMPOSITION_LABEL_LOGO_BYTES / 1024)} КБ).`
      );
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      const url = typeof r.result === 'string' ? r.result : '';
      if (!url.startsWith('data:image/')) {
        setLogoErr('Нужен файл изображения (PNG, JPEG, WebP, SVG…).');
        return;
      }
      onChange(patchSpec(s, { compositionLabelLogoDataUrl: url }));
    };
    r.onerror = () => setLogoErr('Не удалось прочитать файл.');
    r.readAsDataURL(file);
  };

  if (onlySection === 2) {
    return (
      <div className="space-y-4">
        <CompositionLabelBlockStrip kicker="Справка ISO 3758">
          <p className="text-text-muted text-xs leading-snug">
            Блок по умолчанию свёрнут. Основной ввод — доли волокон и знаки ухода в соседних
            полосах.
          </p>
          <Workshop2CompositionLabelIsoGuidanceCollapsible />
        </CompositionLabelBlockStrip>

        <CompositionLabelBlockStrip kicker="Состав волокон (конструктор)">
          <Workshop2CompositionLabelFiberConstructorBlock
            spec={s}
            onChange={onChange}
            readOnly={ro}
            sumAlert={fiberSumAlert}
            embedded
          />
        </CompositionLabelBlockStrip>

        <CompositionLabelBlockStrip kicker="Уход: знаки и доп. текст">
          <Workshop2CompositionLabelCareSymbolPicker
            spec={s}
            onChange={onChange}
            readOnly={ro}
            titleAlert={careSectionAlert}
            embedded
          />
          <div className="space-y-1.5">
            <Label className={cn('text-xs font-medium', careSectionAlert ? 'text-red-600' : '')}>
              Доп. текст по уходу / обслуживанию
            </Label>
            <Textarea
              className="min-h-[52px] text-xs"
              disabled={ro}
              value={s.careInstructionsSupplement ?? ''}
              onChange={(e) =>
                onChange(patchSpec(s, { careInstructionsSupplement: e.target.value }))
              }
              placeholder="Сухая чистка щёткой, не замачивать декор, хранение на плечиках…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Сетка знаков на черновике</Label>
            <Select
              disabled={ro}
              value={s.careSymbolsLayoutDensity ?? 'normal'}
              onValueChange={(v) =>
                onChange(
                  patchSpec(s, {
                    careSymbolsLayoutDensity: v as 'tight' | 'normal' | 'loose',
                  })
                )
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tight" className="text-xs">
                  Плотная (мало места на бирке)
                </SelectItem>
                <SelectItem value="normal" className="text-xs">
                  Обычная
                </SelectItem>
                <SelectItem value="loose" className="text-xs">
                  Свободная (крупнее шаг между знаками)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CompositionLabelBlockStrip>
      </div>
    );
  }

  if (onlySection === 3) {
    return (
      <div className="mx-auto min-w-0 max-w-4xl space-y-4">
        <p className="text-text-primary text-xs font-medium">Данные на бирке и печать</p>

        <CompositionLabelBlockStrip kicker="Поля бирки (SKU, размер, страна, коды)">
          <Workshop2CompositionLabelMetadataBlock
            spec={s}
            onChange={onChange}
            readOnly={ro}
            dossier={dossier}
            titleAlert={sourcesTzAlert}
            embedded
          />
        </CompositionLabelBlockStrip>

        <CompositionLabelBlockStrip kicker="Черновик: припуски, оборот, метки, EAC">
          <p
            className={cn(
              'text-text-secondary text-xs leading-snug',
              layoutHeadingAlert ? 'text-red-600' : ''
            )}
          >
            Визуал — в шаге 4; тонкую сетку блоков — в диалоге «Редактировать оформление бирки».
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-text-secondary flex cursor-pointer items-start gap-2 text-xs leading-snug">
              <Checkbox
                disabled={ro}
                checked={Boolean(s.showTrimBleedInDraft)}
                onCheckedChange={(v) =>
                  onChange(patchSpec(s, { showTrimBleedInDraft: v === true }))
                }
              />
              <span>Контур припусков в черновике (рамка печати).</span>
            </label>
            <label className="text-text-secondary flex cursor-pointer items-start gap-2 text-xs leading-snug">
              <Checkbox
                disabled={ro}
                checked={Boolean(s.printOnReverse)}
                onCheckedChange={(v) => onChange(patchSpec(s, { printOnReverse: v === true }))}
              />
              <span>Печать на обороте — второй слой.</span>
            </label>
            <label className="text-text-secondary flex cursor-pointer items-start gap-2 text-xs leading-snug">
              <Checkbox
                disabled={ro}
                checked={Boolean(s.showTrimMarksOnDraft)}
                onCheckedChange={(v) =>
                  onChange(patchSpec(s, { showTrimMarksOnDraft: v === true }))
                }
              />
              <span>Метки реза по углам.</span>
            </label>
            <label className="text-text-secondary flex cursor-pointer items-start gap-2 text-xs leading-snug">
              <Checkbox
                disabled={ro}
                checked={Boolean(s.showEacPlaceholderOnDraft)}
                onCheckedChange={(v) =>
                  onChange(patchSpec(s, { showEacPlaceholderOnDraft: v === true }))
                }
              />
              <span>Плейсхолдер EAC на лице (не юр. файл).</span>
            </label>
          </div>
        </CompositionLabelBlockStrip>

        <CompositionLabelBlockStrip kicker="Раскладка: листы, сгиб, логотип">
          <div className="space-y-1.5">
            <Label className={cn('text-xs font-medium', layoutSheetsNeed ? 'text-red-600' : '')}>
              Раскладка по листам
            </Label>
            <Select
              disabled={ro}
              value={(s.sheetLayout ?? '') || 'unset'}
              onValueChange={(v) =>
                onChange(
                  patchSpec(s, {
                    sheetLayout: v === 'unset' ? '' : (v as Workshop2CompositionLabelSheetLayout),
                  })
                )
              }
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                {W2_COMPOSITION_LABEL_SHEET_LAYOUT_OPTIONS.map((o) => (
                  <SelectItem key={o.id || 'unset'} value={o.id || 'unset'} className="text-xs">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Как стыкуются листы, где сгиб, порядок чтения
            </Label>
            <Textarea
              className="min-h-[56px] text-xs"
              disabled={ro}
              value={s.layoutPlacementNotes ?? ''}
              onChange={(e) => onChange(patchSpec(s, { layoutPlacementNotes: e.target.value }))}
              placeholder="Напр.: лицо — состав+уход, оборот — EAC+юр.; сгиб сверху; 2-я плоскость — только уход…"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Логотип: зона, размер, отступы (кратко для цеха)
            </Label>
            <Textarea
              className="min-h-[44px] text-xs"
              disabled={ro}
              value={s.brandLogoPlacementNote ?? ''}
              onChange={(e) => onChange(patchSpec(s, { brandLogoPlacementNote: e.target.value }))}
              placeholder="Верхняя треть, max 20 мм, отступ от обреза 3 мм…"
            />
          </div>
        </CompositionLabelBlockStrip>

        <CompositionLabelBlockStrip kicker="Текст на лице, файл логотипа, оборот">
          <div className="space-y-1.5">
            <Label
              className={cn('text-xs font-medium', manufacturerSectionAlert ? 'text-red-600' : '')}
            >
              Текст бренда / юр. блок на лице
            </Label>
            <Textarea
              className="min-h-[56px] text-xs"
              disabled={ro}
              value={s.brandFaceLines ?? ''}
              onChange={(e) => onChange(patchSpec(s, { brandFaceLines: e.target.value }))}
              placeholder="ТМ, адрес, ИНН, телефон горячей линии, артикул на бирке…"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Логотип — файл для черновика</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={ro}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                onPickLogo(f);
                e.target.value = '';
              }}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={ro}
                onClick={() => fileInputRef.current?.click()}
              >
                Загрузить изображение
              </Button>
              {(s.compositionLabelLogoDataUrl ?? '').trim() ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-red-700 hover:text-red-800"
                  disabled={ro}
                  onClick={() => onChange(patchSpec(s, { compositionLabelLogoDataUrl: '' }))}
                >
                  Убрать логотип
                </Button>
              ) : null}
            </div>
            {logoErr ? <p className="text-xs text-red-600">{logoErr}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label
              className={cn(
                'text-xs font-medium',
                s.printOnReverse && !(s.reverseFaceLines ?? '').trim() ? 'text-red-600' : ''
              )}
            >
              Текст для оборота
            </Label>
            <Textarea
              className="min-h-[56px] text-xs"
              disabled={ro}
              value={s.reverseFaceLines ?? ''}
              onChange={(e) => onChange(patchSpec(s, { reverseFaceLines: e.target.value }))}
              placeholder="Полный текст второй стороны: уход, состав подкладки, EAC…"
            />
          </div>
        </CompositionLabelBlockStrip>
      </div>
    );
  }

  if (onlySection === 4) {
    return (
      <div className="space-y-4">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] xl:items-start">
          <div className="min-w-0 space-y-4">
            <p className="text-text-primary text-xs font-medium">Оформление и черновик</p>

            <CompositionLabelBlockStrip kicker="Типографика (кегль, гарнитура, жирные блоки)">
              <Workshop2CompositionLabelTypographyControls
                spec={s}
                onChange={onChange}
                readOnly={ro}
              />
            </CompositionLabelBlockStrip>

            <Collapsible
              defaultOpen={false}
              className="border-border-subtle group rounded-lg border border-dashed border-neutral-300/80 bg-neutral-50/50"
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="text-text-primary flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-white/80"
                >
                  <span className="min-w-0">
                    <span className="font-medium">Доп. правка текстов по блокам</span>
                    <span className="text-text-muted block text-[11px] leading-snug">
                      Юр. строки, состав, низ бирки — дубль полей шагов 1–2; правьте вместе с превью
                      справа
                    </span>
                  </span>
                  <LucideIcons.ChevronDown className="text-text-muted h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-border-subtle space-y-2 border-t px-2 pb-3 pt-2">
                <Workshop2CompositionLabelDraftBlockEditors
                  spec={s}
                  onChange={onChange}
                  readOnly={ro}
                  fiberSumAlert={fiberSumAlert}
                  careSectionAlert={careSectionAlert}
                  variant="nested"
                />
              </CollapsibleContent>
            </Collapsible>

            {children}

            <CompositionLabelBlockStrip kicker="Полный текст черновика (многострочно, вручную)">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Подмена авто-текста из ТЗ</Label>
                <Textarea
                  className="min-h-[88px] font-mono text-xs leading-snug"
                  disabled={ro}
                  value={s.draftTextManual ?? ''}
                  onChange={(e) => onChange(patchSpec(s, { draftTextManual: e.target.value }))}
                  placeholder="Пусто — авто из ТЗ. Заполнение вручную заменяет строки; на макете строки можно править кликом."
                />
                {(s.draftTextManual ?? '').trim() ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-xs text-neutral-600"
                    disabled={ro}
                    onClick={() => onChange(patchSpec(s, { draftTextManual: '' }))}
                  >
                    Сбросить ручной текст (снова авто из ТЗ)
                  </Button>
                ) : null}
              </div>
            </CompositionLabelBlockStrip>
          </div>

          <div className="bg-bg-surface2/30 border-border-subtle min-w-0 space-y-3 rounded-lg border p-3 xl:sticky xl:top-2 xl:self-start">
            <p className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Превью
            </p>
            <Workshop2CompositionLabelDraftMockup
              spec={s}
              displayLines={displayLines}
              readOnly={ro}
              onCommitLine={ro ? undefined : commitLineEdit}
            />
            <p className="text-text-muted text-[10px] leading-snug">
              Клик по строке в превью — быстрая правка (как в макете).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
