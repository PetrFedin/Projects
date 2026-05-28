'use client';

import { useMemo, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Workshop2CompositionLabelConstructorPanel } from '@/components/brand/production/Workshop2CompositionLabelConstructorPanel';
import { Workshop2CompositionLabelLayoutEditorDialog } from '@/components/brand/production/Workshop2CompositionLabelLayoutEditorDialog';
import { Workshop2CompositionLabelDimensionsSection } from '@/components/brand/production/Workshop2CompositionLabelDimensionsSection';
import {
  compositionLabelDraftDisplayLines,
  compositionLabelDraftPreviewLines,
  compositionLabelSpecMissingSections,
  compositionLabelWorkflowProgress,
  type Workshop2CompositionLabelSectionNeed,
} from '@/lib/production/workshop2-composition-label-from-tz';
import { downloadCompositionLabelDraftPdf } from '@/lib/production/workshop2-composition-label-pdf-export';
import {
  downloadCompositionLabelDraftPng,
  downloadCompositionLabelDraftSvg,
} from '@/lib/production/workshop2-composition-label-asset-export';
import type {
  Workshop2CompositionLabelSpec,
  Workshop2DossierPhase1,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import { cn } from '@/lib/utils';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

const EMPTY_COMPOSITION_LABEL_SPEC: Workshop2CompositionLabelSpec = {
  labelWidthMm: '',
  labelHeightMm: '',
  labelBleedMm: '',
  labelSafeInsetMm: '',
  physicalMaterial: '',
  includeFiberCompositionFromTz: false,
  includeCareSymbolsFromTz: false,
  includeManufacturerFromTz: false,
  extraLegalLines: '',
  technologistNotes: '',
  showTrimBleedInDraft: false,
  showTrimMarksOnDraft: false,
  showEacPlaceholderOnDraft: false,
  printOnReverse: false,
  sheetLayout: '',
  layoutPlacementNotes: '',
  brandFaceLines: '',
  brandLogoPlacementNote: '',
  typographyFontPreset: '',
  typographyCustomFontName: '',
  typographyBodyPt: '',
  typographyLineHeightPct: '',
  typographyLetterSpacingEm: '',
  printColorMode: '',
  printDpiNote: '',
  typographyBoldFiberBlock: false,
  typographyBoldCareBlock: false,
  careSymbolIds: [],
  careSymbolsLayoutDensity: 'normal',
  careInstructionsSupplement: '',
  reverseFaceLines: '',
  includeInFactoryAssignment: false,
  labelSizePresetId: '',
  physicalMaterialNote: '',
  compositionLabelLogoDataUrl: '',
  draftTextManual: '',
  constructorFiberRows: [],
  constructorDisplayLanguage: 'ru',
  labelOriginPresetId: '',
  labelGarmentSizeText: '',
  labelArticleSkuText: '',
  labelBarcodeText: '',
  labelQrUrl: '',
};

function CompositionLabelStepShell({
  stepNum,
  title,
  subtitle,
  children,
  defaultOpen = false,
  showAttentionDot = false,
  className,
}: {
  stepNum: number;
  title: string;
  /** Строка под заголовком — что входит в шаг (свернуто в триггере). */
  subtitle?: string;
  children: ReactNode;
  /** Раскрыть при первом показе (например, если по шагу есть ворота). */
  defaultOpen?: boolean;
  /** Красная точка — есть несоответствие ТЗ или обязательные поля по шагу. */
  showAttentionDot?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'border-border-default overflow-hidden rounded-lg border bg-white shadow-sm',
        className
      )}
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="border-border-subtle hover:bg-bg-surface2/40 flex min-h-9 w-full items-start gap-2 border-b px-3 py-2.5 text-left transition-colors"
        >
          <span className="text-accent-primary bg-accent-primary/10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums">
            {stepNum}
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-text-primary block text-xs font-semibold leading-tight">
              {title}
            </span>
            {subtitle ? (
              <span className="text-text-muted mt-0.5 line-clamp-2 block text-[10px] font-normal leading-snug">
                {subtitle}
              </span>
            ) : null}
          </span>
          {showAttentionDot ? (
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500"
              title="Требуется внимание по ТЗ или обязательным полям"
              aria-hidden
            />
          ) : (
            <span className="w-2 shrink-0" aria-hidden />
          )}
          <LucideIcons.ChevronDown
            className={cn(
              'text-text-muted mt-1 h-4 w-4 shrink-0 transition-transform',
              open && 'rotate-180'
            )}
            aria-hidden
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="border-border-subtle/80 border-l-accent-primary/25 bg-bg-surface2/20 border-l-[3px] px-3 pb-3 pl-4 pt-3">
        <div className="space-y-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const constructorPanelProps = (args: {
  spec: Workshop2CompositionLabelSpec;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  ro: boolean;
  need: Set<Workshop2CompositionLabelSectionNeed>;
  sourcesTzAlert: boolean;
  previewLines: string[];
  dossier: Workshop2DossierPhase1 | null;
  fiberSumAlert: boolean;
  careSectionAlert: boolean;
  manufacturerSectionAlert: boolean;
  layoutSheetsNeed: boolean;
}) => ({
  spec: args.spec,
  onChange: args.onChange,
  readOnly: args.ro,
  layoutHeadingAlert: args.need.has('layout_sheets') || args.need.has('reverse_copy'),
  sourcesTzAlert: args.sourcesTzAlert,
  previewLines: args.previewLines,
  dossier: args.dossier,
  fiberSumAlert: args.fiberSumAlert,
  careSectionAlert: args.careSectionAlert,
  manufacturerSectionAlert: args.manufacturerSectionAlert,
  layoutSheetsNeed: args.layoutSheetsNeed,
});

export function Workshop2CompositionLabelSpecBlock({
  spec,
  onChange,
  tzWriteDisabled,
  dossier,
  className,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  tzWriteDisabled?: boolean;
  dossier?: Workshop2DossierPhase1 | null;
  className?: string;
}) {
  const ro = Boolean(tzWriteDisabled);
  const s = spec ?? {};

  const needs = compositionLabelSpecMissingSections(dossier ?? null, s);
  const need = new Set(needs);

  const previewLines = compositionLabelDraftPreviewLines(dossier ?? null, s);
  const listLines = useMemo(
    () => compositionLabelDraftDisplayLines(s, previewLines),
    [s.draftTextManual, previewLines]
  );
  const fiberSumAlert = needs.includes('fiber_constructor_sum');
  const sourcesTzAlert =
    need.has('fiber_tz_gap') || need.has('care_tz_gap') || need.has('manufacturer_tz_gap');
  const [layoutEditorOpen, setLayoutEditorOpen] = useState(false);

  const cp = constructorPanelProps({
    spec: s,
    onChange,
    ro,
    need,
    sourcesTzAlert,
    previewLines,
    dossier: dossier ?? null,
    fiberSumAlert,
    careSectionAlert: need.has('care_tz_gap'),
    manufacturerSectionAlert: need.has('manufacturer_tz_gap'),
    layoutSheetsNeed: need.has('layout_sheets'),
  });

  const step1Attention =
    need.has('dimensions') ||
    need.has('physical') ||
    need.has('fiber_tz_gap') ||
    need.has('care_tz_gap') ||
    need.has('manufacturer_tz_gap');
  const step2Attention = needs.includes('fiber_constructor_sum') || need.has('care_tz_gap');
  const step3Attention =
    need.has('layout_sheets') || need.has('reverse_copy') || need.has('manufacturer_tz_gap');
  const step4Attention = sourcesTzAlert || fiberSumAlert;
  const workflow = compositionLabelWorkflowProgress(dossier ?? null, s);
  const stepDone = workflow.stepDone;
  const stepsDoneCount = workflow.doneCount;
  const stepsDonePct = workflow.pct;
  const compactReadinessItems = [
    {
      id: 'tz-source',
      label: 'Данные из ТЗ',
      done: !sourcesTzAlert,
    },
    {
      id: 'label-core',
      label: 'Состав и уход',
      done: !need.has('fiber_constructor_sum') && !need.has('care_tz_gap'),
    },
    {
      id: 'assignment',
      label: 'Включено в задание',
      done: Boolean(s.includeInFactoryAssignment),
    },
  ] as const;

  return (
    <div
      id={W2_MATERIAL_SUBPAGE_ANCHORS.compositionLabel}
      className={cn(
        'border-border-subtle scroll-mt-24 space-y-3 rounded-lg border bg-white/80 p-3',
        className
      )}
    >
      <div className="flex w-full min-w-0 items-start gap-3 pb-1">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Tag className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">
            Бирка состава и ухода (составник)
          </h2>
          <p className="text-text-secondary w-full min-w-0 text-[11px] leading-snug">
            Формирование составника в 4 шага: от габаритов и состава до печати и макета.
            Обязательные для ТЗ шаги отмечены красным. Внизу — PDF и задание цеху.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-semibold',
                stepsDonePct === 100
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-amber-300 bg-amber-50 text-amber-700'
              )}
            >
              Готовность составника: {stepsDonePct}% ({stepsDoneCount}/4)
            </span>
            {stepDone.map((ok, idx) => (
              <span
                key={`w2-comp-step-${idx + 1}`}
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                  ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                )}
              >
                Шаг {idx + 1} {ok ? '✓' : '•'}
              </span>
            ))}
          </div>
          <div className="border-border-subtle bg-bg-surface2/40 mt-1 rounded-md border px-2.5 py-2">
            <p className="text-text-primary text-[10px] font-semibold">Быстрая готовность</p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {compactReadinessItems.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'rounded px-1.5 py-0.5 text-[10px] font-medium',
                    item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  )}
                >
                  {item.done ? '✓' : '○'} {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="border-border-subtle/90 flex flex-col gap-4 border-t pt-3"
        role="group"
        aria-label="Шаги мастера составника"
      >
        <p className="text-text-muted text-[10px] font-semibold">Шаги 1–4</p>

        <CompositionLabelStepShell
          stepNum={1}
          title="Габариты, полотно и источники из ТЗ"
          subtitle="мм, припуски, цветность печати, что подтянуть из ТЗ: состав, уход, реквизиты"
          defaultOpen={false}
          showAttentionDot={step1Attention}
        >
          <Workshop2CompositionLabelDimensionsSection
            spec={s}
            onChange={onChange}
            readOnly={ro}
            need={need}
            dossierMissing={!dossier}
          />
        </CompositionLabelStepShell>

        <CompositionLabelStepShell
          stepNum={2}
          title="Состав волокон и уход"
          subtitle="ISO 3758, конструктор долей, знаки, плотность сетки, доп. инструкции"
          defaultOpen={false}
          showAttentionDot={step2Attention}
        >
          <Workshop2CompositionLabelConstructorPanel {...cp} onlySection={2} />
        </CompositionLabelStepShell>

        <CompositionLabelStepShell
          stepNum={3}
          title="Печать и данные на бирке"
          subtitle="размер, артикул, код, QR, обрез, логотип, раскладка, лицо/оборот"
          defaultOpen={false}
          showAttentionDot={step3Attention}
        >
          <Workshop2CompositionLabelConstructorPanel {...cp} onlySection={3} />
        </CompositionLabelStepShell>

        <CompositionLabelStepShell
          stepNum={4}
          title="Оформление, черновик и макет"
          subtitle="кегль, жирные блоки, визуальный черновик, сетка в диалоге, ручной текст"
          defaultOpen={false}
          showAttentionDot={step4Attention}
        >
          <Workshop2CompositionLabelConstructorPanel {...cp} onlySection={4}>
            {!ro ? (
              <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t border-dotted pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => setLayoutEditorOpen(true)}
                >
                  <LucideIcons.LayoutGrid className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Редактировать оформление бирки
                </Button>
                <span className="text-text-muted max-w-md text-[10px] leading-snug">
                  Блоки, позиции, зоны безопасной печати — в диалоге; при необходимости дублируйте
                  краткие пояснения в шаге 3.
                </span>
              </div>
            ) : null}
          </Workshop2CompositionLabelConstructorPanel>
        </CompositionLabelStepShell>
      </div>

      <Workshop2CompositionLabelLayoutEditorDialog
        open={layoutEditorOpen}
        onOpenChange={setLayoutEditorOpen}
        spec={patchSpec(s, {})}
        displayLines={listLines}
        onApply={onChange}
      />

      {!ro ? (
        <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 text-xs"
            disabled={!listLines.some((l) => l.trim())}
            onClick={() =>
              downloadCompositionLabelDraftPdf({
                spec: s,
                lines: listLines,
                fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
              })
            }
          >
            Скачать PDF черновика (мм)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs"
            disabled={!listLines.some((l) => l.trim())}
            onClick={() =>
              downloadCompositionLabelDraftSvg({
                spec: s,
                lines: listLines,
                fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                showGuides: true,
              })
            }
          >
            Скачать SVG макета
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs"
            disabled={!listLines.some((l) => l.trim())}
            onClick={() =>
              void downloadCompositionLabelDraftPng({
                spec: s,
                lines: listLines,
                fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                showGuides: true,
              })
            }
          >
            Скачать PNG макета
          </Button>
          {s.printOnReverse ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={!listLines.some((l) => l.trim())}
                onClick={() =>
                  downloadCompositionLabelDraftSvg({
                    spec: s,
                    lines: listLines,
                    fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                    panel: 'face',
                    showGuides: true,
                  })
                }
              >
                SVG лицо
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={!listLines.some((l) => l.trim())}
                onClick={() =>
                  void downloadCompositionLabelDraftPng({
                    spec: s,
                    lines: listLines,
                    fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                    panel: 'face',
                    showGuides: true,
                  })
                }
              >
                PNG лицо
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={!listLines.some((l) => l.trim())}
                onClick={() =>
                  downloadCompositionLabelDraftSvg({
                    spec: s,
                    lines: listLines,
                    fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                    panel: 'reverse',
                    showGuides: true,
                  })
                }
              >
                SVG оборот
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 text-xs"
                disabled={!listLines.some((l) => l.trim())}
                onClick={() =>
                  void downloadCompositionLabelDraftPng({
                    spec: s,
                    lines: listLines,
                    fileBase: (s.labelArticleSkuText ?? '').trim() || 'composition-label',
                    panel: 'reverse',
                    showGuides: true,
                  })
                }
              >
                PNG оборот
              </Button>
            </>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 text-xs"
            onClick={() => onChange({ ...EMPTY_COMPOSITION_LABEL_SPEC })}
          >
            Очистить блок
          </Button>
          <Button
            type="button"
            size="sm"
            className={cn(
              'h-9 text-xs',
              s.includeInFactoryAssignment ? 'bg-emerald-700 hover:bg-emerald-800' : ''
            )}
            variant={s.includeInFactoryAssignment ? 'default' : 'outline'}
            onClick={() =>
              onChange(patchSpec(s, { includeInFactoryAssignment: !s.includeInFactoryAssignment }))
            }
          >
            {s.includeInFactoryAssignment ? 'Составник в задании ✓' : 'Вкл составник в задание'}
          </Button>
          {s.includeInFactoryAssignment ? (
            <span className="text-text-muted text-xs leading-snug">
              В блоке «Отправка» отображается отметка для цеха.
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
