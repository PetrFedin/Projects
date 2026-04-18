'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { MaterialBomHubModel } from '@/lib/production/workshop2-material-bom-check';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-check';
import type { MaterialSketchBomStrip } from '@/lib/production/workshop2-material-bom-sketch-strip';
import type { MaterialBomExportInput } from '@/lib/production/workshop2-material-bom-export';
import {
  formatMaterialBomPlainText,
  formatMaterialBomTsv,
} from '@/lib/production/workshop2-material-bom-export';
import { useToast } from '@/hooks/use-toast';
import {
  formatBomSampleDeltaGuidePlainText,
  formatCostingHintsGuidePlainText,
  formatFactoryBomCsvHeaderRow,
  formatMaterialAlternativeStatusFlowPlainText,
  W2_BOM_COSTING_HINT_FIELDS,
  W2_BOM_PRODUCTION_NORM_FIELDS,
  W2_BOM_SAMPLE_DELTA_KIND_LABELS,
  W2_MATERIAL_COMPLIANCE_FLOW_STEPS,
  W2_MATERIAL_ALTERNATIVE_STATUS_FLOW,
  W2_NINE_GAP_MATERIAL_BOM_ROADMAP,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import {
  WORKSHOP2_DOSSIER_VIEW_HINTS,
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
  type Workshop2MaterialAlternativeStatus,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { Workshop2NineGapBacklogStrip } from '@/components/brand/production/Workshop2NineGapBacklogStrip';

const ONBOARD_LS = 'w2-material-onboard-v1';

export type Workshop2MaterialHubPanelProps = {
  model: MaterialBomHubModel;
  l2Name: string;
  matHint: string;
  categoryNotes: string[];
  sketchBomStrip: MaterialSketchBomStrip | null;
  bomExport: MaterialBomExportInput;
  onNavigate: (anchorId: string) => void;
  onOpenVisualSketch: () => void;
  tzWriteDisabled?: boolean;
  onJumpToPassportSection?: () => void;
  onJumpToVisualSection?: () => void;
  /** Ключ для sessionStorage чеклиста комплаенса (напр. collectionId:articleId). */
  articleScopedKey?: string;
  /** Чеклист комплаенса из досье (персистится с «Сохранить»). */
  materialComplianceChecklist?: Record<string, boolean>;
  onMaterialComplianceChecklistChange?: (next: Record<string, boolean>) => void;
  dossierViewProfile?: Workshop2DossierViewProfile;
  /** Уникальные linkedBomLineRef с master-скетча и листов (для снабжения / технолога). */
  sketchLinkedBomRefs?: string[];
  /** Ref со скетча, не найденные в mat (считает родитель). */
  matSketchBomGapRefs?: string[];
  /** Готовность секции «Материалы» для стрипа «до 9 баллов». */
  nineGapSectionPct?: number;
  /** Быстрые переходы под стрипом «до 9 баллов». */
  nineGapFooter?: ReactNode;
  nineGapOnDossierJump?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  /** При разрыве BOM↔скетч — маршрут в конструкцию / ОТК (те же якоря, что в паспорте). */
  onJumpToConstructionContour?: () => void;
  onJumpToQcRoute?: () => void;
};

export function Workshop2MaterialHubPanel({
  model,
  l2Name,
  matHint,
  categoryNotes,
  sketchBomStrip,
  bomExport,
  onNavigate,
  onOpenVisualSketch,
  tzWriteDisabled = false,
  onJumpToPassportSection,
  onJumpToVisualSection,
  articleScopedKey,
  materialComplianceChecklist = {},
  onMaterialComplianceChecklistChange,
  dossierViewProfile = 'full',
  sketchLinkedBomRefs = [],
  matSketchBomGapRefs = [],
  nineGapSectionPct,
  nineGapFooter,
  nineGapOnDossierJump,
  onJumpToConstructionContour,
  onJumpToQcRoute,
}: Workshop2MaterialHubPanelProps) {
  const { toast } = useToast();
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARD_LS)) setShowOnboard(true);
  }, []);

  const matCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );

  const showMaterialComplianceStrip = matCaps.materialComplianceStrip;

  const showSketchBomRefsStrip = useMemo(() => {
    if (sketchLinkedBomRefs.length === 0) return false;
    return matCaps.materialSketchBomRefsStrip;
  }, [matCaps.materialSketchBomRefsStrip, sketchLinkedBomRefs.length]);

  const showMatSketchGapStrip = useMemo(() => {
    if (matSketchBomGapRefs.length === 0) return false;
    return matCaps.materialMatSketchGapStrip;
  }, [matCaps.materialMatSketchGapStrip, matSketchBomGapRefs.length]);

  const showBomNormsStrip = matCaps.materialBomNormsStrip;

  const showMaterialSupplyRouteStrip = matCaps.materialSupplyRouteStrip;

  const showCostingHintsStrip = matCaps.materialCostingHintsStrip;

  const altStatusRu = useMemo(
    (): Record<Workshop2MaterialAlternativeStatus, string> => ({
      proposed: 'Предложена',
      approved: 'Согласована',
      rejected: 'Отклонена',
      superseded: 'Снята заменой',
    }),
    []
  );

  const copyBomNormsReminder = useCallback(async () => {
    const lines = [
      'BOM · нормы и потери (памятка для строк материала)',
      `SKU: ${bomExport.sku}`,
      '',
      ...W2_BOM_PRODUCTION_NORM_FIELDS.map((f) => `· ${f.labelRu} (${f.key})`),
      '',
      'Заполните в таблице закупки / MRP или в комментарии к строке — без отдельного API.',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({ title: 'Памятка в буфере', description: 'Нормы, единицы и потери для BOM.' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [bomExport.sku, toast]);

  const copySupplyRouteGuides = useCallback(async () => {
    const text = `${formatBomSampleDeltaGuidePlainText()}\n\n${formatMaterialAlternativeStatusFlowPlainText()}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Скопировано',
        description: 'Дельта BOM и поток статусов альтернатив — для задачи или письма.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [toast]);

  const copyCostingHintsGuide = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatCostingHintsGuidePlainText());
      toast({
        title: 'Costing-шаблон в буфере',
        description: 'Поля строки для локальной таблицы без API.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [toast]);

  const copySketchBomRefs = useCallback(async () => {
    const text = sketchLinkedBomRefs.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Коды BOM из меток', description: 'Список linkedBomLineRef в буфере.' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [sketchLinkedBomRefs, toast]);

  const copyFactoryCsvHeader = useCallback(async () => {
    const row = formatFactoryBomCsvHeaderRow(';');
    try {
      await navigator.clipboard.writeText(row);
      toast({
        title: 'Шапка CSV',
        description: 'Строка заголовков для фабричной таблицы (разделитель ;).',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [toast]);

  const dismissOnboard = useCallback(() => {
    try {
      localStorage.setItem(ONBOARD_LS, '1');
    } catch {
      /* ignore */
    }
    setShowOnboard(false);
  }, []);

  const copyBom = useCallback(async () => {
    const text = formatMaterialBomPlainText(bomExport);
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'BOM скопирован',
        description: 'Текст в буфере — можно вставить в Excel или чат.',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать',
        description: 'Разрешите доступ к буферу или скачайте файл.',
        variant: 'destructive',
      });
    }
  }, [bomExport, toast]);

  const copyBomTsv = useCallback(async () => {
    const tsv = `\ufeff${formatMaterialBomTsv(bomExport)}`;
    try {
      await navigator.clipboard.writeText(tsv);
      toast({
        title: 'TSV в буфере',
        description: 'Вставьте в Excel / Google Таблицы (UTF-8 BOM).',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать TSV',
        description: 'Скачайте файл .tsv.',
        variant: 'destructive',
      });
    }
  }, [bomExport, toast]);

  const triggerDownload = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const downloadBomTxt = useCallback(() => {
    const text = formatMaterialBomPlainText(bomExport);
    const safeSku = bomExport.sku.replace(/[^\w\-]+/g, '_').slice(0, 48) || 'sku';
    triggerDownload(new Blob([text], { type: 'text/plain;charset=utf-8' }), `BOM-${safeSku}.txt`);
    toast({ title: 'Текст скачан', description: 'Человекочитаемый BOM (.txt).' });
  }, [bomExport, toast, triggerDownload]);

  const downloadBomTsv = useCallback(() => {
    const tsv = formatMaterialBomTsv(bomExport);
    const safeSku = bomExport.sku.replace(/[^\w\-]+/g, '_').slice(0, 48) || 'sku';
    triggerDownload(
      new Blob([`\ufeff${tsv}`], { type: 'text/tab-separated-values;charset=utf-8' }),
      `BOM-${safeSku}.tsv`
    );
    toast({ title: 'TSV скачан', description: 'Таблица для Excel / закупок (UTF-8 BOM).' });
  }, [bomExport, toast, triggerDownload]);

  const open = model.gateItems.length;

  if (dossierViewProfile === 'merch') {
    const sumPct = bomExport.linkedComposition
      ? bomExport.composition.reduce((s, r) => s + r.pct, 0)
      : null;
    return (
      <div className="space-y-3 rounded-xl border border-amber-200/85 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-text-primary text-sm font-semibold">Материалы для витрины</h3>
            <p className="text-text-secondary mt-1 max-w-xl text-[11px] leading-snug">
              Канон и состав без операционного шума: только читаемый BOM и ссылки на паспорт /
              визуал.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[10px]"
              onClick={() => void copyBom()}
            >
              <LucideIcons.Copy className="mr-1 h-3.5 w-3.5" aria-hidden />
              Текст BOM
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-[10px]"
              onClick={() => void copyBomTsv()}
            >
              <LucideIcons.Table className="mr-1 h-3.5 w-3.5" aria-hidden />
              TSV
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold">
          {onJumpToPassportSection ? (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-amber-900"
              onClick={onJumpToPassportSection}
            >
              Паспорт →
            </Button>
          ) : null}
          {onJumpToVisualSection ? (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-amber-900"
              onClick={onJumpToVisualSection}
            >
              Канон и эскиз →
            </Button>
          ) : null}
        </div>
        <div className="border-border-default/90 overflow-x-auto rounded-lg border bg-white/95">
          <table className="w-full min-w-[280px] border-collapse text-[11px]">
            <tbody>
              <tr className="border-border-subtle border-b">
                <th className="text-text-secondary w-28 py-2 pl-3 pr-2 text-left font-bold">SKU</th>
                <td className="text-text-primary py-2 pr-3 font-mono">{bomExport.sku}</td>
              </tr>
              <tr className="border-border-subtle border-b">
                <th className="text-text-secondary py-2 pl-3 pr-2 text-left font-bold">Изделие</th>
                <td className="text-text-primary py-2 pr-3">{bomExport.productName}</td>
              </tr>
              <tr className="border-border-subtle border-b">
                <th className="text-text-secondary py-2 pl-3 pr-2 text-left align-top font-bold">
                  Mat
                </th>
                <td className="text-text-primary py-2 pr-3">
                  {bomExport.matLines.length ? (
                    <ul className="list-inside list-disc space-y-0.5">
                      {bomExport.matLines.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="text-text-secondary py-2 pl-3 pr-2 text-left align-top font-bold">
                  Состав
                </th>
                <td className="text-text-primary py-2 pr-3">
                  {!bomExport.linkedComposition ? (
                    <span className="text-text-secondary">Не связан с mat</span>
                  ) : bomExport.composition.length === 0 ? (
                    <span className="text-text-secondary">—</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {bomExport.composition.map((r, i) => (
                        <li key={i}>
                          {r.label}: <span className="font-semibold tabular-nums">{r.pct}%</span>
                        </li>
                      ))}
                      <li className="text-text-secondary text-[10px]">Σ {sumPct}%</li>
                    </ul>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const stripStateClass =
    sketchBomStrip?.state === 'ok'
      ? 'border-emerald-200/90 bg-emerald-50/50'
      : sketchBomStrip?.state === 'warn'
        ? 'border-amber-300/90 bg-amber-50/40'
        : 'border-border-default/90 bg-bg-surface2/80';

  return (
    <div className="space-y-4 rounded-xl border border-amber-200/85 bg-gradient-to-b from-amber-50/50 to-white p-4 shadow-sm">
      <Collapsible defaultOpen={false} className="group/w2-material-main space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-start gap-2 rounded-md p-1 text-left transition hover:bg-amber-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
            >
              <LucideIcons.ChevronDown
                className="mt-1.5 h-4 w-4 shrink-0 text-amber-700 transition-transform duration-200 group-data-[state=open]/w2-material-main:rotate-180"
                aria-hidden
              />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
                <LucideIcons.Layers className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-text-primary text-sm font-semibold">Материалы и BOM</h3>
                  {bomExport.tzPhase && bomExport.tzPhase !== '1' ? (
                    <span className="rounded border border-amber-300/80 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
                      Шаг {bomExport.tzPhase} ТЗ
                    </span>
                  ) : null}
                </div>
                <p className="text-text-secondary mt-0.5 text-[10px] leading-snug">
                  Mat, прогресс секции и блокеры — ниже всегда; дорожная карта и контекст категории
                  — разверните
                </p>
              </div>
            </button>
          </CollapsibleTrigger>
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-[10px]">
                <LucideIcons.Users className="h-3.5 w-3.5" aria-hidden />
                Роли
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-3 text-xs" align="end">
              <div>
                <p className="text-text-primary font-semibold">Дизайнер / бренд</p>
                <p className="text-text-secondary mt-1 leading-snug">
                  Согласуйте ощущение ткани с рефами; при смене материала обновите визуал и описание
                  замысла.
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-900">Менеджер / продакт</p>
                <p className="text-text-secondary mt-1 leading-snug">
                  MOQ и сроки снабжения завязаны на зафиксированный BOM; закрывайте состав до
                  передачи в образец.
                </p>
              </div>
              <div>
                <p className="font-semibold text-teal-900">Технолог / ОТК</p>
                <p className="text-text-secondary mt-1 leading-snug">
                  Исполнимость узлов и допуски по слоям проверяйте против скетча и конструкции после
                  заполнения mat/BOM.
                </p>
              </div>
              <div>
                <p className="font-semibold text-orange-950">Цех и снабжение</p>
                <p className="text-text-secondary mt-1 leading-snug">
                  Блок «Нормы BOM» и шапка фабричного CSV — чтобы норма на изделие, единица и потери
                  совпадали с выгрузкой в производство.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <Workshop2NineGapBacklogStrip
            backlogItems={W2_NINE_GAP_MATERIAL_BOM_ROADMAP}
            stripTitle="Материалы · дорожная карта"
            variant="amber"
            sectionPct={nineGapSectionPct}
            footer={nineGapFooter}
            onDossierJump={nineGapOnDossierJump}
          />
          <Collapsible
            defaultOpen={false}
            className="w-full min-w-0 rounded-md border border-amber-100/90 bg-white/50 px-2 py-2"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="text-left text-[10px] font-semibold text-amber-900 underline-offset-2 hover:text-amber-950 hover:underline"
              >
                Контекст BOM, категория и переходы
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1.5 pt-1.5">
              <p className="text-text-secondary text-[11px] leading-snug">
                <span className="text-text-primary font-medium">Для маршрута SKU:</span> один контур
                сырья с визуалом и конструкцией — снабжение и производство смотрят в те же строки,
                что и ТЗ-скетч.
              </p>
              {dossierViewProfile !== 'full' ? (
                <p
                  className="border-l-2 border-amber-200/90 pl-2 text-[10px] font-medium leading-snug text-amber-950/95"
                  title="Режим просмотра ТЗ (w2view)"
                >
                  {WORKSHOP2_DOSSIER_VIEW_HINTS[dossierViewProfile]}
                </p>
              ) : null}
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                Категория: {l2Name}
              </p>
              <p className="text-text-primary text-[11px] leading-snug">{matHint}</p>
              {onJumpToPassportSection || onJumpToVisualSection ? (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {onJumpToPassportSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-[10px] font-semibold text-amber-900"
                      onClick={onJumpToPassportSection}
                    >
                      Паспорт →
                    </Button>
                  ) : null}
                  {onJumpToVisualSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-[10px] font-semibold text-amber-900"
                      onClick={onJumpToVisualSection}
                    >
                      Визуал и эскиз →
                    </Button>
                  ) : null}
                </div>
              ) : null}
              {categoryNotes.length > 0 ? (
                <ul className="text-text-secondary list-disc space-y-0.5 pl-4 text-[10px] leading-snug">
                  {categoryNotes.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>

      {showMaterialComplianceStrip ? (
        <div
          id="w2-material-compliance"
          className="scroll-mt-28 rounded-lg border border-teal-200/80 bg-teal-50/40 px-3 py-2.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-teal-900">
            Комплаенс и сырьё (чеклист в досье)
          </p>
          <ul className="mt-2 space-y-1.5">
            {W2_MATERIAL_COMPLIANCE_FLOW_STEPS.map((step) => (
              <li
                key={step.stepId}
                className="text-text-primary flex items-start gap-2 text-[11px]"
              >
                <Checkbox
                  id={`w2-mat-comp-${step.stepId}`}
                  checked={Boolean(materialComplianceChecklist[step.stepId])}
                  disabled={!onMaterialComplianceChecklistChange}
                  onCheckedChange={(v) => {
                    if (!onMaterialComplianceChecklistChange) return;
                    const next = { ...materialComplianceChecklist, [step.stepId]: v === true };
                    onMaterialComplianceChecklistChange(next);
                  }}
                  className="mt-0.5"
                />
                <label
                  htmlFor={`w2-mat-comp-${step.stepId}`}
                  className="cursor-pointer leading-snug"
                >
                  {step.labelRu}
                </label>
              </li>
            ))}
          </ul>
          <p className="text-text-secondary mt-1.5 text-[9px] leading-snug">
            Сохраняется в досье вместе с кнопкой «Сохранить» (localStorage этого артикула).
          </p>
        </div>
      ) : null}

      {showBomNormsStrip ? (
        <div
          id="w2-material-bom-norms"
          className="border-border-default/80 bg-bg-surface2/90 text-text-primary scroll-mt-28 rounded-lg border px-3 py-2.5 text-[11px]"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-primary text-[9px] font-bold uppercase tracking-wide">
                Нормы BOM (цех / закупка / финмодель)
              </p>
              <p className="text-text-primary mt-1 leading-snug">
                Перед серией согласуйте норму на изделие, единицу учёта и потери — те же поля, что в
                фабричном CSV.
              </p>
              <ul className="text-text-secondary mt-1.5 list-inside list-disc space-y-0.5 text-[10px]">
                {W2_BOM_PRODUCTION_NORM_FIELDS.map((f) => (
                  <li key={f.key}>{f.labelRu}</li>
                ))}
              </ul>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              onClick={() => void copyBomNormsReminder()}
            >
              Копировать памятку
            </Button>
          </div>
        </div>
      ) : null}

      {showCostingHintsStrip ? (
        <div
          id="w2-material-costing-hints"
          className="scroll-mt-28 rounded-lg border border-emerald-200/85 bg-emerald-50/50 px-3 py-2.5 text-[11px] text-emerald-950 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-900">
                Costing по строке BOM
              </p>
              <p className="mt-1 text-[10px] leading-snug text-emerald-900/90">
                Локальная таблица или заметка к артикулу: сшивайте подсказки по{' '}
                <span className="font-mono">lineRef</span> с основным BOM; отдельного API нет.
              </p>
              <ul className="mt-1.5 list-inside list-disc space-y-0.5 font-mono text-[9px] text-emerald-900/95">
                {W2_BOM_COSTING_HINT_FIELDS.map((f) => (
                  <li key={f.key}>
                    <span className="font-semibold">{f.key}</span> — {f.labelRu}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              onClick={() => void copyCostingHintsGuide()}
            >
              Шаблон в буфер
            </Button>
          </div>
        </div>
      ) : null}

      {showMaterialSupplyRouteStrip ? (
        <div
          id="w2-material-supply-route"
          className="border-accent-primary/25 bg-accent-primary/10 text-text-primary scroll-mt-28 space-y-3 rounded-lg border px-3 py-2.5 text-[11px] shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-text-primary text-[9px] font-bold uppercase tracking-wide">
                Закупка и производство · дельта BOM
              </p>
              <p className="text-text-primary/90 mt-1 text-[10px] leading-snug">
                Три опорные точки сравнения строк: что в ТЗ, что сошлось на образце, что уходит в
                серию. Фиксируйте в таблице или задаче — отдельного API нет.
              </p>
              <ul className="text-text-primary/85 mt-1.5 list-inside list-disc space-y-0.5 text-[10px]">
                {(['tz_baseline', 'sample_actual', 'production_series'] as const).map((k) => (
                  <li key={k}>{W2_BOM_SAMPLE_DELTA_KIND_LABELS[k]}</li>
                ))}
              </ul>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              onClick={() => void copySupplyRouteGuides()}
            >
              Копировать гайд
            </Button>
          </div>
          <div className="border-accent-primary/25 border-t pt-2">
            <p className="text-text-primary text-[9px] font-bold uppercase tracking-wide">
              Согласование замен
            </p>
            <p className="text-text-primary/90 mt-1 text-[10px] leading-snug">
              Переходы статуса альтернативы (предложена → согласована / отклонена / снята) — единая
              логика для снабжения и комплаенса.
            </p>
            <ul className="text-text-primary/95 mt-1.5 space-y-0.5 font-mono text-[9px] leading-relaxed">
              {(
                Object.entries(W2_MATERIAL_ALTERNATIVE_STATUS_FLOW) as [
                  Workshop2MaterialAlternativeStatus,
                  readonly Workshop2MaterialAlternativeStatus[],
                ][]
              ).map(([from, tos]) => (
                <li key={from}>
                  {altStatusRu[from]}
                  {tos.length ? ` → ${tos.map((t) => altStatusRu[t]).join(' | ')}` : ' — финал'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {showSketchBomRefsStrip ? (
        <div className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary rounded-lg border px-3 py-2 text-[11px]">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-accent-primary text-[9px] font-bold uppercase tracking-wide">
                С меток скетча (BOM-ref)
              </p>
              <p className="text-accent-primary/95 mt-1 font-mono text-[10px] leading-relaxed">
                {sketchLinkedBomRefs.slice(0, 12).join(' · ')}
                {sketchLinkedBomRefs.length > 12 ? ` · +${sketchLinkedBomRefs.length - 12}` : ''}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              onClick={() => void copySketchBomRefs()}
            >
              Копировать список
            </Button>
          </div>
        </div>
      ) : null}

      {showMatSketchGapStrip ? (
        <div
          id={W2_MATERIAL_SUBPAGE_ANCHORS.matSketchGap}
          className="scroll-mt-28 rounded-lg border border-amber-300/90 bg-amber-50/95 px-3 py-2 text-[11px] text-amber-950"
        >
          <p className="font-semibold">Расхождение: ref на скетче не видны в выбранном mat</p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed">
            {matSketchBomGapRefs.slice(0, 12).join(' · ')}
            {matSketchBomGapRefs.length > 12 ? ` · +${matSketchBomGapRefs.length - 12}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => onNavigate(W2_MATERIAL_SUBPAGE_ANCHORS.mat)}
            >
              К таблице mat
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => onOpenVisualSketch()}
            >
              К скетчу · lineRef
            </Button>
            {onJumpToConstructionContour ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/80 bg-white text-[10px] text-amber-950 hover:bg-amber-100/80"
                onClick={onJumpToConstructionContour}
              >
                Конструкция · контур
              </Button>
            ) : null}
            {onJumpToQcRoute ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 border-amber-400/80 bg-white text-[10px] text-amber-950 hover:bg-amber-100/80"
                onClick={onJumpToQcRoute}
              >
                ОТК · вкладка
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        id="w2-material-bom-factory-export"
        className="border-border-default/80 bg-bg-surface2/40 flex scroll-mt-24 flex-wrap gap-2 rounded-md border px-2 py-2"
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={copyBom}
          title="Текстовый BOM в буфер"
        >
          <LucideIcons.Copy className="h-3.5 w-3.5" aria-hidden />
          Текст
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={copyBomTsv}
          title="TSV с заголовком UTF-8 BOM для Excel"
        >
          <LucideIcons.Table className="h-3.5 w-3.5" aria-hidden />
          TSV
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={() => void copyFactoryCsvHeader()}
          title="Заголовки колонок под фабричный CSV"
        >
          <LucideIcons.Factory className="h-3.5 w-3.5" aria-hidden />
          Шапка CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={downloadBomTxt}
          title="Человекочитаемый BOM"
        >
          <LucideIcons.FileText className="h-3.5 w-3.5" aria-hidden />
          .txt
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={downloadBomTsv}
          title="Таблица для Excel (UTF-8 BOM)"
        >
          <LucideIcons.Table className="h-3.5 w-3.5" aria-hidden />
          .tsv
        </Button>
      </div>

      {sketchBomStrip ? (
        <div className={cn('rounded-lg border px-3 py-2.5 shadow-sm', stripStateClass)}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-text-primary text-[11px] font-semibold">{sketchBomStrip.title}</p>
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 px-2 text-[10px]"
                onClick={() =>
                  sketchBomStrip.primaryTarget === 'material'
                    ? onNavigate(sketchBomStrip.anchorId)
                    : onOpenVisualSketch()
                }
              >
                {sketchBomStrip.jumpLabel}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-text-secondary h-7 px-2 text-[10px]"
                onClick={() => onNavigate(W2_MATERIAL_SUBPAGE_ANCHORS.mat)}
              >
                К mat
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-text-secondary h-7 px-2 text-[10px]"
                onClick={onOpenVisualSketch}
              >
                К скетчу
              </Button>
            </div>
          </div>
          <ul className="text-text-primary mt-1.5 space-y-0.5 text-[10px] leading-snug">
            {sketchBomStrip.bullets.map((b, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-text-muted">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="border-border-default/90 rounded-lg border bg-white/90 px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-text-primary text-[11px] font-semibold">Прогресс секции «Материалы»</p>
          <span className="text-[11px] font-bold tabular-nums text-amber-800">
            {model.combinedPct}%
          </span>
        </div>
        <div className="bg-bg-surface2 mt-2 h-1.5 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-amber-500 transition-[width] duration-300"
            style={{ width: `${model.combinedPct}%` }}
          />
        </div>
        <ul className="text-text-secondary mt-2 space-y-1 text-[10px]">
          {model.checkpoints.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              {c.done ? (
                <LucideIcons.Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <LucideIcons.Circle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
              )}
              <button
                type="button"
                className={cn(
                  'min-w-0 flex-1 text-left underline-offset-2 hover:underline',
                  c.done
                    ? 'text-text-secondary decoration-border-default line-through'
                    : 'text-text-primary'
                )}
                onClick={() => onNavigate(c.anchorId)}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open > 0 ? (
        <div className="rounded-lg border border-amber-200/90 bg-amber-50/90 px-3 py-2.5 text-[11px] text-amber-950 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold leading-snug">Осталось по BOM: {open}</p>
            <Button
              type="button"
              size="sm"
              className="h-7 gap-1 bg-amber-700 px-2.5 text-[10px] font-semibold text-white hover:bg-amber-800"
              onClick={() => onNavigate(model.gateItems[0]!.anchorId)}
            >
              <LucideIcons.CornerDownRight className="h-3.5 w-3.5 opacity-90" aria-hidden />
              Закрыть следующий пункт
            </Button>
          </div>
          <ul className="mt-2 space-y-2">
            {model.gateItems.map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-amber-100/90 bg-white/70 px-2 py-1.5"
              >
                <span className="min-w-0 flex-1 leading-snug">{g.message}</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-[10px]"
                  onClick={() => onNavigate(g.anchorId)}
                >
                  {g.jumpLabel}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-lg border border-emerald-200/90 bg-emerald-50/80 px-3 py-2 text-[11px] font-medium text-emerald-950">
          Контур BOM в этой секции закрыт — можно усилить проверку справочника и перейти к меркам
          или конструкции.
        </p>
      )}

      {showOnboard && !tzWriteDisabled ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/95 px-3 py-2.5 text-[11px] text-amber-950">
          <p className="font-semibold">Коротко: базовый путь BOM</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>Выберите основной материал из справочника (mat).</li>
            <li>При связке с составом доведите сумму процентов до 100%.</li>
            <li>Заполните остальные поля секции (утеплитель, фурнитура и т.д.).</li>
            <li>Сверьте с визуалом и скетчем перед подписью ТЗ.</li>
          </ol>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 h-8 text-[10px]"
            onClick={dismissOnboard}
          >
            Понятно, скрыть
          </Button>
        </div>
      ) : null}

      <p className="text-text-secondary text-[10px] leading-snug">
        Якоря: хаб{' '}
        <code className="bg-bg-surface2 rounded px-1">#{W2_MATERIAL_SUBPAGE_ANCHORS.hub}</code> ·
        mat <code className="bg-bg-surface2 rounded px-1">#{W2_MATERIAL_SUBPAGE_ANCHORS.mat}</code>{' '}
        · состав{' '}
        <code className="bg-bg-surface2 rounded px-1">
          #{W2_MATERIAL_SUBPAGE_ANCHORS.composition}
        </code>{' '}
        · каталог{' '}
        <code className="bg-bg-surface2 rounded px-1">#{W2_MATERIAL_SUBPAGE_ANCHORS.catalog}</code>
      </p>
    </div>
  );
}
