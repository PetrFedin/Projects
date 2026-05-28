'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type {
  Workshop2DossierPhase1,
  Workshop2VisualReadinessChecklist,
  Workshop2VisualVersionLogEntry,
  Workshop2CanonicalSketchTarget,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  VISUAL_READINESS_LABELS,
  inferVisualReadinessChecklistFromFacts,
  visualReadinessProgress,
  visualReadinessHints,
} from '@/lib/production/workshop2-visual-excellence';
import { SKETCH_TZ_MATRIX_ROWS } from '@/lib/production/workshop2-sketch-tz-matrix';
import {
  buildVisualHandoffExportPayload,
  buildVisualHandoffPrintHtml,
  getVisualHandoffQuickSummary,
} from '@/lib/production/workshop2-visual-handoff-export';
import type { Workshop2VisualGateItem } from '@/lib/production/workshop2-visual-section-warnings';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';
import {
  formatSketchPinLinkFieldsPlainText,
  getVisualHandoffTargetsForProfile,
  W2_NINE_GAP_VISUAL_SKETCH_ROADMAP,
  W2_SKETCH_PIN_VISIBILITY_BY_SURFACE,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import { Workshop2NineGapBacklogStrip } from '@/components/brand/production/Workshop2NineGapBacklogStrip';
import {
  W2_SKETCH_EXPORT_SURFACE_LABELS,
  W2_SKETCH_PIN_LINK_FIELD_DOC,
  workshop2DossierViewUiCaps,
  type W2SketchExportSurface,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

const ONBOARD_LS = 'w2-visuals-onboard-v4';

const SKETCH_EXPORT_SURFACE_ORDER: readonly W2SketchExportSurface[] = [
  'workshop_floor',
  'merch_clean',
  'compliance_packet',
];

const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Общий реф', def: 'Сетка референсов: все превью сразу, удобно сравнивать.' },
  { term: 'Этап метки', def: 'Жизненный этап точки на скетче (ТЗ, образец, выпуск…).' },
  { term: 'Шаблоны и снимки', def: 'Сохранённые наборы меток и PNG-снимки для архива.' },
  { term: 'Режим цеха', def: 'Просмотр крупных номеров без правок; ссылка с ?sketchFloor=1.' },
  { term: 'Канон', def: 'Главное фото и главный скетч, которые подписываем и отдаём в линию.' },
  {
    term: 'Поля каталога',
    def: 'Атрибуты из attribute-catalog с секцией «Визуал»: цвет, палитра, силуэт, техпак — рядом с рефами и скетчем.',
  },
  {
    term: 'Обязательный контур',
    def: 'Минимум данных визуала для согласованного маршрута: поля каталога по листу (см. «Поля каталога»), референсы, скетч или метки, замысел. Совпадает с «готово к образцу» по блоку визуала.',
  },
  {
    term: 'Сводка (текст)',
    def: 'Один блок в буфере обмена: visualQuickSummary + строки открытого гейта (если панель передала контур) — для Slack, почты, Jira без JSON.',
  },
];

function newUuid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type Props = {
  dossier: Workshop2DossierPhase1;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  updatedByLabel: string;
  mediaRefIds: string[];
  sheetOptions: { sheetId: string; title: string }[];
  /** Для имени файла экспорта пакета визуала. */
  articleSku?: string;
  articleName?: string;
  /** Гейт визуала (те же правила, что readiness); кнопки ведут на якоря раздела. */
  visualGateItems?: Workshop2VisualGateItem[];
  onJumpToVisualAnchor?: (anchorId: string) => void;
  /** Полная ссылка: шаг 1 ТЗ, раздел visuals, якорь «Согласование» (можно вручную заменить # на w2-visuals-refs и т.д.). */
  visualShareAbsoluteUrl?: string;
  /** URL с ?sketchFloor=1 — для подсказок эталона цеха. */
  sketchFloorInUrl?: boolean;
  /** Шаг ТЗ (бейдж в шапке, как у паспорта и материалов). */
  tzPhase?: '1' | '2' | '3';
  onJumpToPassportSection?: () => void;
  onJumpToMaterialSection?: () => void;
  dossierViewProfile?: Workshop2DossierViewProfile;
  /** Переход на вкладку маршрута + скролл к секции (посадка, ОТК, снабжение). */
  onHandoffToRoute?: (tab: 'fit' | 'qc' | 'supply', domId: string) => void;
  /** Полная ссылка с `?w2pane=…` и hash секции — для кнопки «Ссылка». */
  buildRouteHandoffAbsoluteUrl?: (tab: 'fit' | 'qc' | 'supply', domId: string) => string;
  /** Доля готовности секции «Визуал» для стрипа «до 9 баллов». */
  nineGapSectionPct?: number;
  /** Быстрые переходы под стрипом «до 9 баллов». */
  nineGapFooter?: ReactNode;
  nineGapOnDossierJump?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
};

export function Workshop2VisualsExcellenceBlock({
  dossier,
  setDossier,
  updatedByLabel,
  mediaRefIds,
  sheetOptions,
  articleSku,
  articleName,
  visualGateItems,
  onJumpToVisualAnchor,
  visualShareAbsoluteUrl,
  sketchFloorInUrl,
  tzPhase = '1',
  onJumpToPassportSection,
  onJumpToMaterialSection,
  dossierViewProfile = 'full',
  onHandoffToRoute,
  buildRouteHandoffAbsoluteUrl,
  nineGapSectionPct,
  nineGapFooter,
  nineGapOnDossierJump,
}: Props) {
  const { toast } = useToast();
  const [showOnboard, setShowOnboard] = useState(false);
  const [versionLabelDraft, setVersionLabelDraft] = useState('');
  const [versionSummaryDraft, setVersionSummaryDraft] = useState('');

  const visCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );
  const showSketchExportSurfacesStrip = visCaps.visualSketchExportSurfacesStrip;
  const showSketchPinLinkFieldsStrip = visCaps.visualSketchPinLinkFieldsStrip;

  const visualHandoffTargets = useMemo(
    () => getVisualHandoffTargetsForProfile(dossierViewProfile),
    [dossierViewProfile]
  );

  const copySketchExportSurfacesGuide = useCallback(async () => {
    const lines = [
      'Скетч · поверхности выгрузки (PNG/PDF пакет)',
      ...(articleSku?.trim() ? [`SKU: ${articleSku.trim()}`] : []),
      '',
      ...SKETCH_EXPORT_SURFACE_ORDER.map((surf) => {
        const vis = W2_SKETCH_PIN_VISIBILITY_BY_SURFACE[surf];
        const tech = vis.showTechnicalPins ? 'тех.метки да' : 'тех.метки нет';
        const qc = vis.showQcCodes ? 'QC да' : 'QC нет';
        return `· ${W2_SKETCH_EXPORT_SURFACE_LABELS[surf]} — ${tech}, ${qc}`;
      }),
      '',
      'Режим цеха на странице: ?sketchFloor=1 (без правок меток).',
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({
        title: 'Гайд в буфере',
        description: 'Три поверхности экспорта + подсказка по цеху.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [articleSku, toast]);

  const copySketchPinLinkFieldsGuide = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatSketchPinLinkFieldsPlainText());
      toast({
        title: 'Поля связей в буфере',
        description: 'Список полей метки для материала, QC и ТЗ.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARD_LS)) setShowOnboard(true);
    } catch {
      setShowOnboard(true);
    }
  }, []);

  const copyOpenGateList = useCallback(async () => {
    if (!visualGateItems?.length) return;
    const skuLine = articleSku?.trim() ? `SKU: ${articleSku.trim()}` : null;
    const lines = [
      'Визуал / эскиз · открытые пункты контура',
      ...(skuLine ? [skuLine] : []),
      '',
      ...visualGateItems.map((g, i) => `${i + 1}. ${g.message}`),
      '',
      `Якоря: Согласование #w2-visuals-hub · Поля #w2-visuals-attributes · Референсы #w2-visuals-refs · Скетч #${W2_VISUALS_SKETCH_ANCHOR_ID} (конструкция)`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({
        title: 'Список скопирован',
        description: 'Удобно вставить в чат, задачу или письмо.',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать',
        description: 'Проверьте разрешения буфера обмена.',
        variant: 'destructive',
      });
    }
  }, [articleSku, toast, visualGateItems]);

  const copyVisualShareLink = useCallback(async () => {
    const url = visualShareAbsoluteUrl?.trim();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Ссылка скопирована', description: 'Откроется шаг 1 ТЗ и раздел «Визуал».' });
    } catch {
      toast({
        title: 'Не удалось скопировать',
        description: 'Выделите ссылку вручную или проверьте разрешения браузера.',
        variant: 'destructive',
      });
    }
  }, [toast, visualShareAbsoluteUrl]);

  const quickSummaryPlainText = useMemo(() => {
    const q = getVisualHandoffQuickSummary(dossier);
    const lines = [
      'Визуал · сводка',
      ...(articleSku?.trim() ? [`SKU: ${articleSku.trim()}`] : []),
      `Чеклист менеджера: ${q.checklistDone}/${q.checklistTotal}`,
      `Референсы: ${q.referenceCount}`,
      `Скетч: меток ${q.sketchPinTotal}, подложка: ${q.sketchHasSubstrate ? 'да' : 'нет'}`,
      `Замысел или brandNotes: ${q.intentOrNotesFilled ? 'да' : 'нет'}`,
      `Канон (фото+скетч): ${q.canonicalPhotoAndSketchSet ? 'да' : 'нет'}`,
    ];
    if (visualGateItems !== undefined) {
      if (visualGateItems.length > 0) {
        lines.push('', 'Открытый контур маршрута:');
        visualGateItems.forEach((g, i) => lines.push(`${i + 1}. ${g.message}`));
      } else {
        lines.push('', 'Контур маршрута по визуалу: закрыт');
      }
    }
    return lines.join('\n');
  }, [articleSku, dossier, visualGateItems]);

  const copyQuickSummaryPlain = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(quickSummaryPlainText);
      toast({
        title: 'Сводка скопирована',
        description: 'Текст для чата, почты или таск-трекера.',
      });
    } catch {
      toast({
        title: 'Не удалось скопировать',
        description: 'Проверьте разрешения буфера обмена.',
        variant: 'destructive',
      });
    }
  }, [quickSummaryPlainText, toast]);

  const dismissOnboard = useCallback(() => {
    try {
      localStorage.setItem(ONBOARD_LS, '1');
    } catch {
      /* ignore */
    }
    setShowOnboard(false);
  }, []);

  const visualRouteGateForExport = useMemo(
    () =>
      visualGateItems !== undefined
        ? {
            allClear: visualGateItems.length === 0,
            openMessages: visualGateItems.map((x) => x.message),
          }
        : undefined,
    [visualGateItems]
  );

  const downloadVisualHandoffJson = useCallback(() => {
    const payload = buildVisualHandoffExportPayload(dossier, {
      articleSku,
      visualRouteGate: visualRouteGateForExport,
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stem =
      (articleSku ?? 'article').replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 64) || 'article';
    a.href = url;
    a.download = `visual-handoff-${stem}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dossier, articleSku, visualRouteGateForExport]);

  const printVisualHandoff = useCallback(() => {
    const html = buildVisualHandoffPrintHtml(dossier, {
      articleSku,
      articleName: articleName?.trim() || undefined,
      visualRouteGate: visualRouteGateForExport,
    });
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    window.setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch {
        /* ignore */
      }
    }, 200);
  }, [dossier, articleSku, articleName, visualRouteGateForExport]);

  const patchChecklist = useCallback(
    (patch: Partial<Workshop2VisualReadinessChecklist>) => {
      setDossier((p) => ({
        ...p,
        visualReadinessChecklist: { ...(p.visualReadinessChecklist ?? {}), ...patch },
        updatedAt: new Date().toISOString(),
        updatedBy: updatedByLabel.slice(0, 120),
      }));
    },
    [setDossier, updatedByLabel]
  );

  const patchIntent = useCallback(
    (mood: string, bullets: string[]) => {
      setDossier((p) => ({
        ...p,
        designerIntent: { mood: mood.trim() || undefined, bullets },
        updatedAt: new Date().toISOString(),
        updatedBy: updatedByLabel.slice(0, 120),
      }));
    },
    [setDossier, updatedByLabel]
  );

  const vr = useMemo(() => visualReadinessProgress(dossier), [dossier]);
  const hints = useMemo(
    () => visualReadinessHints(dossier, { sketchFloorInUrl }),
    [dossier, sketchFloorInUrl]
  );
  const inferredFromFacts = useMemo(
    () => inferVisualReadinessChecklistFromFacts(dossier),
    [dossier]
  );
  const canApplyInferredChecklist = useMemo(() => {
    const cur = dossier.visualReadinessChecklist ?? {};
    for (const key of Object.keys(inferredFromFacts) as (keyof typeof inferredFromFacts)[]) {
      if (inferredFromFacts[key] === true && !cur[key]) return true;
    }
    return false;
  }, [dossier.visualReadinessChecklist, inferredFromFacts]);

  const applyInferredChecklist = useCallback(() => {
    patchChecklist(inferredFromFacts);
  }, [inferredFromFacts, patchChecklist]);

  const mood = dossier.designerIntent?.mood ?? '';
  const bullets = dossier.designerIntent?.bullets ?? ['', '', '', '', ''];

  const appendVersionLog = () => {
    const versionLabel =
      versionLabelDraft.trim() ||
      dossier.currentVisualVersionLabel?.trim() ||
      `v${(dossier.visualVersionLog?.length ?? 0) + 1}`;
    const changeSummary = versionSummaryDraft.trim();
    if (!changeSummary) return;
    const entry: Workshop2VisualVersionLogEntry = {
      entryId: newUuid(),
      at: new Date().toISOString(),
      by: updatedByLabel.slice(0, 120),
      versionLabel,
      changeSummary,
    };
    setDossier((p) => ({
      ...p,
      currentVisualVersionLabel: versionLabel,
      visualVersionLog: [...(p.visualVersionLog ?? []), entry].slice(-40),
      updatedAt: new Date().toISOString(),
      updatedBy: updatedByLabel.slice(0, 120),
    }));
    setVersionLabelDraft('');
    setVersionSummaryDraft('');
  };

  const canonicalSketch = dossier.canonicalMainSketchTarget ?? { kind: 'master' as const };

  const canonSketchSummary = useMemo(() => {
    const t = canonicalSketch;
    if (t.kind === 'master') return 'Главный (общая доска)';
    const title = sheetOptions.find((s) => s.sheetId === t.sheetId)?.title?.trim();
    return `Лист: ${title || t.sheetId.slice(0, 8)}`;
  }, [canonicalSketch, sheetOptions]);

  const lastVersionLog = useMemo(() => {
    const log = dossier.visualVersionLog ?? [];
    return log.length ? log[log.length - 1]! : undefined;
  }, [dossier.visualVersionLog]);

  const lastVersionLogLine = lastVersionLog
    ? `${lastVersionLog.versionLabel}: ${lastVersionLog.changeSummary.slice(0, 200)}${
        lastVersionLog.changeSummary.length > 200 ? '…' : ''
      }`
    : '';

  return (
    <div className="border-accent-primary/30 from-accent-primary/10 space-y-4 rounded-xl border bg-gradient-to-b to-white p-4 shadow-sm">
      <Collapsible defaultOpen={false} className="group/w2-visual-main space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="hover:bg-accent-primary/10 focus-visible:ring-accent-primary/80 flex min-w-0 flex-1 items-start gap-2 rounded-md p-1 text-left transition focus-visible:outline-none focus-visible:ring-2"
            >
              <LucideIcons.ChevronDown
                className="text-accent-primary mt-1.5 h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/w2-visual-main:rotate-180"
                aria-hidden
              />
              <div className="bg-accent-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm">
                <LucideIcons.Sparkles className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-text-primary text-sm font-semibold">
                    Визуал: согласование и полнота
                  </h3>
                  {tzPhase !== '1' ? (
                    <span className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                      Шаг {tzPhase} ТЗ
                    </span>
                  ) : null}
                </div>
                <p className="text-text-secondary mt-0.5 text-[10px] leading-snug">
                  Канон, гейт, формы и чеклист — ниже всегда; дорожная карта и описание блока —
                  разверните
                </p>
              </div>
            </button>
          </CollapsibleTrigger>
          <div className="flex flex-wrap items-center gap-1.5">
            {visualShareAbsoluteUrl ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 shrink-0 gap-1 text-[10px]"
                onClick={() => void copyVisualShareLink()}
              >
                <LucideIcons.Link2 className="h-3.5 w-3.5" aria-hidden />
                Ссылка на визуал
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 text-[10px]"
              title="Чеклист, рефы, скетч, канон и открытый контур маршрута одним текстом"
              onClick={() => void copyQuickSummaryPlain()}
            >
              <LucideIcons.ClipboardCopy className="h-3.5 w-3.5" aria-hidden />
              Сводка (текст)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 text-[10px]"
              onClick={downloadVisualHandoffJson}
            >
              <LucideIcons.Download className="h-3.5 w-3.5" aria-hidden />
              JSON пакета
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 text-[10px]"
              onClick={printVisualHandoff}
            >
              <LucideIcons.Printer className="h-3.5 w-3.5" aria-hidden />
              Печать / PDF
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 text-[10px]"
                >
                  <LucideIcons.BookOpen className="h-3.5 w-3.5" aria-hidden />
                  Термины
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-2 text-xs" align="end">
                <p className="text-text-primary font-semibold">Глоссарий</p>
                <ul className="space-y-2">
                  {GLOSSARY.map((g) => (
                    <li key={g.term}>
                      <span className="text-accent-primary font-medium">{g.term}</span>
                      <span className="text-text-secondary"> — {g.def}</span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 text-[10px]"
                >
                  <LucideIcons.Users className="h-3.5 w-3.5" aria-hidden />
                  Роли
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-3 text-xs" align="end">
                <div>
                  <p className="text-text-primary font-semibold">Дизайнер</p>
                  <p className="text-text-secondary mt-1 leading-snug">
                    Рефы, замысел, скетч с метками и канон — фиксируют образ для маршрута SKU;
                    чеклист помогает не уехать в согласованиях.
                  </p>
                </div>
                <div>
                  <p className="text-text-primary font-semibold">Мерч</p>
                  <p className="text-text-secondary mt-1 leading-snug">
                    Для витрины и лукбука используйте поверхность «мерч» (без технических меток);
                    канон и версию фиксируйте в блоке выше.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Менеджер</p>
                  <p className="text-text-secondary mt-1 leading-snug">
                    Чеклист готовности визуала и открытый гейт — что ещё блокирует «готово к
                    образцу»; сводка в буфер для статуса в почте или таск-трекере.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-teal-900">Технолог</p>
                  <p className="text-text-secondary mt-1 leading-snug">
                    Метки с привязкой к атрибуту/BOM и сроками на критичных точках снижают разрыв
                    между картинкой и исполнением; детали узлов — в материалах и конструкции.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <Workshop2NineGapBacklogStrip
            backlogItems={W2_NINE_GAP_VISUAL_SKETCH_ROADMAP}
            stripTitle="Визуал · дорожная карта"
            variant="violet"
            sectionPct={nineGapSectionPct}
            footer={nineGapFooter}
            onDossierJump={nineGapOnDossierJump}
          />
          <Collapsible
            defaultOpen={false}
            className="border-accent-primary/20 w-full min-w-0 rounded-md border bg-white/50 px-2 py-2"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="text-accent-primary hover:text-accent-primary text-left text-[10px] font-semibold underline-offset-2 hover:underline"
              >
                Описание блока, переходы и передача
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1.5 pt-1.5">
              <p className="text-text-secondary text-[11px] leading-snug">
                <span className="text-text-primary font-medium">Замысел</span> — только текст в этом
                блоке; <span className="text-text-primary font-medium">фото и видео</span> — в
                «Референсах» (звезда на превью = главное для канона);{' '}
                <span className="text-text-primary font-medium">канон</span> (главное фото + скетч)
                — справа здесь же. Атрибуты каталога «Визуал» — в{' '}
                <span className="text-accent-primary font-medium">«Поля каталога»</span> ниже.
              </p>
              {onJumpToPassportSection || onJumpToMaterialSection ? (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {onJumpToPassportSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="text-accent-primary h-auto p-0 text-[10px] font-semibold"
                      onClick={onJumpToPassportSection}
                    >
                      Паспорт →
                    </Button>
                  ) : null}
                  {onJumpToMaterialSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="text-accent-primary h-auto p-0 text-[10px] font-semibold"
                      onClick={onJumpToMaterialSection}
                    >
                      Материалы (BOM) →
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>

      <div
        id="w2-visuals-canon-version"
        className="border-accent-primary/30 bg-accent-primary/10 text-text-primary scroll-mt-24 rounded-lg border px-3 py-2.5 text-[11px] shadow-sm"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-accent-primary text-[9px] font-black uppercase tracking-wide">
              Канон и версия визуала
            </p>
            <p className="leading-snug">
              <span className="font-semibold">Скетч:</span> {canonSketchSummary}
              {dossier.currentVisualVersionLabel ? (
                <>
                  {' '}
                  · <span className="font-semibold">Метка версии:</span>{' '}
                  {dossier.currentVisualVersionLabel}
                </>
              ) : null}
            </p>
            {lastVersionLogLine ? (
              <p className="text-text-primary/90 text-[10px] leading-snug">
                <span className="font-semibold">Последняя запись журнала:</span>{' '}
                {lastVersionLogLine}
              </p>
            ) : (
              <p className="text-accent-primary/75 text-[10px] leading-snug">
                Журнал версий пуст — после согласованных правок добавьте запись ниже (дизайн /
                менеджер).
              </p>
            )}
          </div>
          {onJumpToVisualAnchor ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              onClick={() => onJumpToVisualAnchor(W2_VISUALS_SKETCH_ANCHOR_ID)}
            >
              К скетчу
            </Button>
          ) : null}
        </div>
      </div>

      {onHandoffToRoute && visualHandoffTargets.length > 0 ? (
        <div
          id="w2-visuals-handoff"
          className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary scroll-mt-24 rounded-lg border px-3 py-2.5 text-[11px] shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-accent-primary text-[9px] font-bold uppercase tracking-wide">
              Передача в маршрут
            </span>
            <div className="flex flex-wrap gap-1.5">
              {visualHandoffTargets.map((t) => (
                <div key={`${t.tab}-${t.domId}`} className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 px-2 text-[9px] font-semibold"
                    onClick={() => onHandoffToRoute(t.tab, t.domId)}
                  >
                    {t.label}
                  </Button>
                  {buildRouteHandoffAbsoluteUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 shrink-0 p-0"
                      title="Копировать ссылку на этап и секцию"
                      aria-label={`Копировать ссылку: ${t.label}`}
                      onClick={async () => {
                        const url = buildRouteHandoffAbsoluteUrl(t.tab, t.domId);
                        if (!url) return;
                        try {
                          await navigator.clipboard.writeText(url);
                          toast({
                            title: 'Ссылка скопирована',
                            description: 'В буфере — вкладка маршрута и якорь секции.',
                          });
                        } catch {
                          toast({
                            title: 'Не удалось скопировать',
                            description: url,
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <LucideIcons.Link2 className="h-3.5 w-3.5" aria-hidden />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showSketchExportSurfacesStrip ? (
        <div
          id="w2-visuals-sketch-export-surfaces"
          className="border-border-default/90 text-text-primary scroll-mt-24 rounded-lg border bg-white px-3 py-2.5 text-[11px] shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="text-text-secondary text-[9px] font-black uppercase tracking-wide">
                Экспорт скетча · поверхности
              </p>
              <p className="text-text-secondary text-[10px] leading-snug">
                Один PNG/PDF — три поверхности: цех (узлы+QC), мерч (чисто), комплаенс
                (техметки+QC).
              </p>
              <ul className="text-text-primary mt-1 space-y-1 text-[10px] leading-snug">
                {SKETCH_EXPORT_SURFACE_ORDER.map((surf) => {
                  const vis = W2_SKETCH_PIN_VISIBILITY_BY_SURFACE[surf];
                  return (
                    <li key={surf}>
                      <span className="text-text-primary font-semibold">
                        {W2_SKETCH_EXPORT_SURFACE_LABELS[surf]}
                      </span>
                      <span className="text-text-secondary">
                        {' '}
                        — тех.метки: {vis.showTechnicalPins ? 'да' : 'нет'}, QC-коды:{' '}
                        {vis.showQcCodes ? 'да' : 'нет'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 gap-1 text-[10px]"
              onClick={() => void copySketchExportSurfacesGuide()}
            >
              <LucideIcons.Copy className="h-3.5 w-3.5" aria-hidden />В буфер
            </Button>
          </div>
        </div>
      ) : null}

      {showSketchPinLinkFieldsStrip ? (
        <div
          id="w2-visuals-sketch-link-fields"
          className="scroll-mt-24 rounded-lg border border-cyan-200/85 bg-cyan-50/45 px-3 py-2.5 text-[11px] text-cyan-950 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-wide text-cyan-900">
                Метка ↔ материал / QC / ТЗ
              </p>
              <p className="text-[10px] leading-snug text-cyan-900/90">
                Ключи как у типа метки на скетче — свяжите BOM, QC и ТЗ с картинкой.
              </p>
              <div className="space-y-1.5 text-[9px] leading-relaxed">
                <p className="font-semibold text-cyan-950">К материалу / BOM</p>
                <p className="font-mono text-cyan-900/95">
                  {W2_SKETCH_PIN_LINK_FIELD_DOC.toMaterial.join(' · ')}
                </p>
                <p className="font-semibold text-cyan-950">К QC / MES</p>
                <p className="font-mono text-cyan-900/95">
                  {W2_SKETCH_PIN_LINK_FIELD_DOC.toQc.join(' · ')}
                </p>
                <p className="font-semibold text-cyan-950">К разделу ТЗ / маршруту</p>
                <p className="font-mono text-cyan-900/95">
                  {W2_SKETCH_PIN_LINK_FIELD_DOC.toTzSection.join(' · ')}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 gap-1 border-cyan-300/80 bg-white text-[10px] text-cyan-950"
              onClick={() => void copySketchPinLinkFieldsGuide()}
            >
              <LucideIcons.Copy className="h-3.5 w-3.5" aria-hidden />В буфер
            </Button>
          </div>
        </div>
      ) : null}

      {visualGateItems !== undefined ? (
        <div
          className={cn(
            'rounded-lg border px-3 py-2.5 text-[11px] shadow-sm',
            visualGateItems.length === 0
              ? 'border-emerald-200/90 bg-emerald-50/90 text-emerald-950'
              : 'border-amber-200/90 bg-amber-50/90 text-amber-950'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold leading-snug">
              {visualGateItems.length === 0
                ? 'Обязательный визуальный контур закрыт'
                : `Осталось по визуалу: ${visualGateItems.length}`}
            </p>
            {visualGateItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {onJumpToVisualAnchor ? (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="bg-accent-primary hover:bg-accent-primary h-7 gap-1 px-2.5 text-[10px] font-semibold text-white"
                    onClick={() => onJumpToVisualAnchor(visualGateItems[0]!.anchorId)}
                  >
                    <LucideIcons.CornerDownRight className="h-3.5 w-3.5 opacity-90" aria-hidden />
                    Закрыть следующий пункт
                  </Button>
                ) : null}
                {onJumpToVisualAnchor ? (
                  <span className="text-[9px] font-medium uppercase tracking-wide text-amber-800/90">
                    Далее — к блокам ниже
                  </span>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 border-amber-200/80 bg-white/90 px-2 text-[9px] font-semibold text-amber-950"
                  onClick={() => void copyOpenGateList()}
                >
                  <LucideIcons.ClipboardList className="mr-0.5 h-3 w-3 opacity-80" aria-hidden />
                  Скопировать список
                </Button>
              </div>
            ) : null}
          </div>
          {visualGateItems.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {visualGateItems.map((g) => (
                <li
                  key={g.id}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-amber-100/80 bg-white/60 px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 leading-snug">{g.message}</span>
                  {onJumpToVisualAnchor ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 shrink-0 gap-0.5 px-2 text-[10px] font-medium"
                      onClick={() => onJumpToVisualAnchor(g.anchorId)}
                    >
                      <LucideIcons.CornerDownRight className="h-3 w-3 opacity-70" aria-hidden />
                      {g.jumpLabel}
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[10px] leading-snug opacity-90">
              Дальше — чеклист менеджера, канон и журнал версий; для «готово к образцу» проверьте
              также материалы, мерки и подписи ТЗ.
            </p>
          )}
        </div>
      ) : null}

      {showOnboard ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-[11px] text-amber-950">
          <p className="font-semibold">Коротко: базовый путь</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>
              Закройте обязательный контур: блок «Поля каталога» (что именно попало в фазу 1 — от
              листа категории), референсы, скетч или метки, замысел.
            </li>
            <li>Выберите главное фото и главный скетч (канон для подписи).</li>
            <li>Отметьте чеклист после ревью с командой.</li>
            <li>При изменениях — запись в журнал версий (что поменялось).</li>
          </ol>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="mt-2 h-7 text-[10px]"
            onClick={dismissOnboard}
          >
            Понятно, не показывать
          </Button>
        </div>
      ) : (
        <button
          type="button"
          className="text-accent-primary text-[10px] font-medium underline-offset-2 hover:underline"
          onClick={() => setShowOnboard(true)}
        >
          Показать подсказку по шагам
        </button>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="border-border-default rounded-lg border bg-white/90 p-3 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
            Замысел дизайна
          </p>
          <Label className="text-text-secondary mt-2 text-[10px]">Mood / направление</Label>
          <Input
            className="mt-1 h-8 text-xs"
            placeholder="Например: мягкий минимализм, спорт-шик FW26"
            value={mood}
            onChange={(e) => patchIntent(e.target.value, bullets)}
          />
          <p className="text-text-secondary mt-2 text-[10px] font-semibold">Тезисы (до 5)</p>
          <div className="mt-1 space-y-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Input
                key={i}
                className="h-7 text-[11px]"
                placeholder={`Тезис ${i + 1}`}
                value={bullets[i] ?? ''}
                onChange={(e) => {
                  const next = [...(bullets.length ? bullets : ['', '', '', '', ''])];
                  next[i] = e.target.value;
                  patchIntent(mood, next);
                }}
              />
            ))}
          </div>
        </div>

        <div className="border-border-default rounded-lg border bg-white/90 p-3 shadow-sm">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
            Канон для подписи
          </p>
          <Label className="text-text-secondary mt-2 text-[10px]">Главное фото модели</Label>
          <select
            className="border-border-default mt-1 h-8 w-full rounded-md border bg-white px-2 text-[11px]"
            value={dossier.canonicalMainPhotoRefId ?? ''}
            onChange={(e) =>
              setDossier((p) => ({
                ...p,
                canonicalMainPhotoRefId: e.target.value || undefined,
                updatedAt: new Date().toISOString(),
                updatedBy: updatedByLabel.slice(0, 120),
              }))
            }
          >
            <option value="">— не выбрано —</option>
            {mediaRefIds.map((id) => (
              <option key={id} value={id}>
                {id.slice(0, 8)}…
              </option>
            ))}
          </select>
          <Label className="text-text-secondary mt-2 text-[10px]">Главный скетч</Label>
          <select
            className="border-border-default mt-1 h-8 w-full rounded-md border bg-white px-2 text-[11px]"
            value={canonicalSketch.kind === 'master' ? 'master' : canonicalSketch.sheetId}
            onChange={(e) => {
              const v = e.target.value;
              const next: Workshop2CanonicalSketchTarget =
                v === 'master' ? { kind: 'master' } : { kind: 'sheet', sheetId: v };
              setDossier((p) => ({
                ...p,
                canonicalMainSketchTarget: next,
                updatedAt: new Date().toISOString(),
                updatedBy: updatedByLabel.slice(0, 120),
              }));
            }}
          >
            <option value="master">Master-скетч (категория)</option>
            {sheetOptions.map((s) => (
              <option key={s.sheetId} value={s.sheetId}>
                Лист: {s.title || s.sheetId.slice(0, 6)}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap gap-2">
            <Input
              className="h-8 min-w-[6rem] flex-1 text-[11px]"
              placeholder="Подпись версии (v3…)"
              value={dossier.currentVisualVersionLabel ?? ''}
              onChange={(e) =>
                setDossier((p) => ({
                  ...p,
                  currentVisualVersionLabel: e.target.value.trim() || undefined,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div
        id="w2-visuals-checklist"
        className="border-border-default scroll-mt-24 rounded-lg border bg-white/90 p-3 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
            Готовность визуала (менеджер){' '}
            <span className="text-accent-primary tabular-nums">
              {vr.done}/{vr.total}
            </span>
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 shrink-0 gap-1 text-[10px]"
            disabled={!canApplyInferredChecklist}
            title={
              canApplyInferredChecklist
                ? 'Проставить галочки по уже заполненным данным (не снимает отметки и не закрывает треды по рефам)'
                : 'Нечего добавить: выводимые по фактам пункты уже отмечены'
            }
            onClick={applyInferredChecklist}
          >
            <LucideIcons.Wand2 className="h-3 w-3 opacity-80" aria-hidden />
            По фактам в досье
          </Button>
        </div>
        <p className="text-text-secondary mt-1 text-[10px] leading-snug">
          Кнопка подставляет только то, что однозначно следует из досье; пункты про треды и эталон
          цеха — по решению команды.
        </p>
        <ul className="mt-2 space-y-2">
          {VISUAL_READINESS_LABELS.map((row) => {
            const checked = Boolean(vr.checklist[row.key]);
            const hintExtra = hints[row.key];
            return (
              <li key={row.key} className="flex gap-2">
                <Checkbox
                  id={`vr-${row.key}`}
                  checked={checked}
                  onCheckedChange={(v) => patchChecklist({ [row.key]: v === true })}
                  className="mt-0.5"
                />
                <label
                  htmlFor={`vr-${row.key}`}
                  className="min-w-0 cursor-pointer text-[11px] leading-snug"
                >
                  <span className="text-text-primary font-medium">{row.label}</span>
                  <span className="text-text-secondary block">{row.hint}</span>
                  {hintExtra ? (
                    <span className="text-accent-primary mt-0.5 block text-[10px]">
                      {hintExtra}
                    </span>
                  ) : null}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-border-default rounded-lg border bg-white/90 p-3 shadow-sm">
        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">
          Журнал версий визуала
        </p>
        <p className="text-text-secondary mt-1 text-[10px]">
          Кратко: что изменилось, кто и когда (без бинарного diff).
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1">
            <Label className="text-[10px]">Метка версии в этой записи</Label>
            <Input
              className="h-8 text-[11px]"
              placeholder="v4 / handoff-2026-04-01"
              value={versionLabelDraft}
              onChange={(e) => setVersionLabelDraft(e.target.value)}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 text-[10px]"
            onClick={appendVersionLog}
          >
            Добавить запись
          </Button>
        </div>
        <Textarea
          className="mt-2 min-h-[56px] text-[11px]"
          placeholder="Что изменилось по сравнению с прошлой версией…"
          value={versionSummaryDraft}
          onChange={(e) => setVersionSummaryDraft(e.target.value)}
        />
        <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto text-[10px]">
          {[...(dossier.visualVersionLog ?? [])].reverse().map((e) => (
            <li
              key={e.entryId}
              className="border-border-subtle bg-bg-surface2/80 rounded border px-2 py-1.5"
            >
              <span className="text-text-primary font-semibold">{e.versionLabel}</span>
              <span className="text-text-secondary"> · {e.by} · </span>
              <span className="text-text-muted">{new Date(e.at).toLocaleString('ru-RU')}</span>
              <p className="text-text-primary mt-0.5">{e.changeSummary}</p>
            </li>
          ))}
        </ul>
      </div>

      <details className="border-border-default rounded-lg border bg-white/85 text-[11px] shadow-sm">
        <summary className="text-text-primary cursor-pointer list-none px-3 py-2 font-semibold [&::-webkit-details-marker]:hidden">
          Матрица: тип метки → раздел ТЗ (ориентир для критичных зон)
        </summary>
        <div className="border-border-subtle max-h-52 overflow-auto border-t px-2 py-2 sm:px-3">
          <table className="w-full border-collapse text-left text-[10px]">
            <thead>
              <tr className="border-border-default text-text-secondary border-b text-[9px] uppercase tracking-wide">
                <th className="py-1.5 pr-2 font-semibold">Тип метки</th>
                <th className="py-1.5 pr-2 font-semibold">Раздел</th>
                <th className="py-1.5 pr-2 font-semibold">Подсказка attributeId</th>
                <th className="py-1.5 font-semibold">Что проверить</th>
              </tr>
            </thead>
            <tbody>
              {SKETCH_TZ_MATRIX_ROWS.map((row) => (
                <tr
                  key={row.annotationType}
                  className="border-border-subtle border-b last:border-0"
                >
                  <td className="text-text-primary py-1.5 pr-2 align-top font-medium">
                    {row.typeLabel}
                  </td>
                  <td className="text-accent-primary py-1.5 pr-2 align-top">{row.sectionLabel}</td>
                  <td
                    className="text-text-primary max-w-[10rem] py-1.5 pr-2 align-top font-mono text-[9px] leading-snug"
                    title={row.suggestedAttributeIds.join(', ')}
                  >
                    {row.suggestedAttributeIds.slice(0, 3).join(', ')}
                    {row.suggestedAttributeIds.length > 3 ? '…' : ''}
                  </td>
                  <td className="text-text-secondary py-1.5 align-top">{row.managerHint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="text-text-secondary text-[10px]">
        Черновик в localStorage; тяжёлые data URL в рефах/скетче — сожмите или дайте ссылку (см.
        предупреждение у сохранения внизу ТЗ).
      </p>
      <p className="text-text-secondary text-[10px]">
        Метка ↔ раздел/этап — в карточке на доске; по ветке — «Задачи для производства». Экспорт:{' '}
        <span className="text-text-secondary font-medium">visualQuickSummary</span>,{' '}
        <span className="text-text-secondary font-medium">visualRouteGate</span> (без data URL).
        Якорь по умолчанию <span className="font-mono text-[10px]">#w2-visuals-hub</span> — при
        нужде <span className="font-mono text-[10px]">#w2-visuals-refs</span>,{' '}
        <span className="font-mono text-[10px]">#{W2_VISUALS_SKETCH_ANCHOR_ID}</span> (вкладка
        «Конструкция»)…
      </p>
    </div>
  );
}
