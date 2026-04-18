'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type {
  Workshop2PassportHubModel,
  WorkshopPassportTzPhase,
} from '@/lib/production/workshop2-passport-check';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  WORKSHOP2_DOSSIER_VIEW_HINTS,
  workshop2DossierViewUiCaps,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { Workshop2NineGapBacklogStrip } from '@/components/brand/production/Workshop2NineGapBacklogStrip';

const ONBOARD_LS = 'w2-passport-onboard-v1';

type Props = {
  model: Workshop2PassportHubModel;
  skuDraft: string;
  nameDraft: string;
  internalArticleCodeDisplay: string;
  categoryPathLabel?: string;
  onNavigate: (anchorId: string) => void;
  showPostSignoffDrift: boolean;
  onLogPostSignoffReminder: () => void;
  pulseLoggedReminder: boolean;
  onPulseLoggedReminder: () => void;
  tzWriteDisabled?: boolean;
  /** Текущий шаг ТЗ — для бейджа и согласованности с material BOM. */
  tzPhase?: WorkshopPassportTzPhase;
  /** Быстрый переход к другим вкладкам ТЗ (тот же артикул). */
  onJumpToVisualSection?: () => void;
  onJumpToMaterialSection?: () => void;
  /** Уточняющие переходы при разрыве BOM↔скетч (те же якоря, что в футере стрипа «до 9»). */
  onJumpToMaterialMatTable?: () => void;
  onJumpToSketchLineRefs?: () => void;
  onJumpToConstructionContour?: () => void;
  onJumpToQcRoute?: () => void;
  /** Режим ТЗ — для акцентов менеджеру / комплаенсу. */
  dossierViewProfile?: Workshop2DossierViewProfile;
  /** Строки журнала с критичными для паспорта изменениями (уже отфильтрованы). */
  passportCriticalAuditSummaries?: string[];
  /** Полная ссылка read-only для фабрики / цеха (?w2view=factory&sketchFloor=1…). */
  readOnlyShareUrl?: string | null;
  /** BOM-ref со скетча (master + листы) — сводка для маршрута. */
  sketchLinkedBomRefs?: string[];
  /** Ref со скетча, не найденные в строках mat (эвристика). */
  matSketchBomGapRefs?: string[];
  /** Быстрые переходы под стрипом «до 9 баллов». */
  nineGapFooter?: ReactNode;
  nineGapOnDossierJump?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  /**
   * Готовность вкладки «Паспорт» (секция general) по строкам каталога ТЗ — для подписи «Секция ≈ …%» у дорожной карты.
   * Если не задано, показывается combinedPct модели паспорт-хаба.
   */
  nineGapTzGeneralSectionPct?: number;
};

export function Workshop2PassportHubPanel({
  model,
  skuDraft,
  nameDraft,
  internalArticleCodeDisplay,
  categoryPathLabel,
  onNavigate,
  showPostSignoffDrift,
  onLogPostSignoffReminder,
  pulseLoggedReminder,
  onPulseLoggedReminder,
  tzWriteDisabled = false,
  tzPhase = '1',
  onJumpToVisualSection,
  onJumpToMaterialSection,
  onJumpToMaterialMatTable,
  onJumpToSketchLineRefs,
  onJumpToConstructionContour,
  onJumpToQcRoute,
  dossierViewProfile = 'full',
  passportCriticalAuditSummaries = [],
  readOnlyShareUrl = null,
  sketchLinkedBomRefs = [],
  matSketchBomGapRefs = [],
  nineGapFooter,
  nineGapOnDossierJump,
  nineGapTzGeneralSectionPct,
}: Props) {
  const { toast } = useToast();
  const [showOnboard, setShowOnboard] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !localStorage.getItem(ONBOARD_LS)) setShowOnboard(true);
    } catch {
      setShowOnboard(true);
    }
  }, []);

  const dismissOnboard = useCallback(() => {
    try {
      localStorage.setItem(ONBOARD_LS, '1');
    } catch {
      /* ignore */
    }
    setShowOnboard(false);
  }, []);

  const copySkuName = useCallback(async () => {
    const sku = skuDraft.trim() || '—';
    const name = nameDraft.trim() || '—';
    const text = `SKU: ${sku}\nНазвание: ${name}`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Скопировано', description: 'SKU и рабочее название в буфере.' });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [nameDraft, skuDraft, toast]);

  const copyReadOnlyLink = useCallback(async () => {
    const url = readOnlyShareUrl?.trim();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Ссылка скопирована',
        description: 'Режим фабрики + пол скетча — только просмотр, без правок.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [readOnlyShareUrl, toast]);

  const copyCard = useCallback(async () => {
    const lines = [
      'Карточка артикула (кратко)',
      `Внутр. №: ${internalArticleCodeDisplay}`,
      `SKU: ${skuDraft.trim() || '—'}`,
      `Название: ${nameDraft.trim() || '—'}`,
      categoryPathLabel ? `Категория: ${categoryPathLabel}` : null,
      '',
      `Паспорт для маршрута: ≈ ${model.combinedPct}% (старт ${model.startPct}%, рынок/коды ${model.preSamplePct}%)`,
    ].filter(Boolean) as string[];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast({
        title: 'Карточка в буфере',
        description: 'Можно вставить в Jira, почту или мессенджер.',
      });
    } catch {
      toast({ title: 'Не удалось скопировать', variant: 'destructive' });
    }
  }, [
    categoryPathLabel,
    internalArticleCodeDisplay,
    model.combinedPct,
    model.preSamplePct,
    model.startPct,
    nameDraft,
    skuDraft,
    toast,
  ]);

  const doneCp = model.checkpoints.filter((c) => c.done).length;
  const totalCp = model.checkpoints.length;

  const passCaps = useMemo(
    () => workshop2DossierViewUiCaps(dossierViewProfile),
    [dossierViewProfile]
  );

  const showMatSketchRibbon = useMemo(() => {
    return passCaps.passportSketchBomRefsRibbon && sketchLinkedBomRefs.length > 0;
  }, [passCaps.passportSketchBomRefsRibbon, sketchLinkedBomRefs.length]);

  const auditRoleOk = passCaps.passportCriticalAuditStrip;

  const showMatSketchGapRibbon = useMemo(() => {
    return passCaps.passportMatSketchGapRibbon && matSketchBomGapRefs.length > 0;
  }, [passCaps.passportMatSketchGapRibbon, matSketchBomGapRefs.length]);

  return (
    <div
      id="w2-passport-hub"
      className="scroll-mt-24 space-y-4 rounded-xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 to-white p-4 shadow-sm"
    >
      <Collapsible defaultOpen={false} className="group/w2-passport-main space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-start gap-2 rounded-md p-1 text-left transition hover:bg-indigo-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/80"
            >
              <LucideIcons.ChevronDown
                className="mt-1.5 h-4 w-4 shrink-0 text-indigo-600 transition-transform duration-200 group-data-[state=open]/w2-passport-main:rotate-180"
                aria-hidden
              />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <LucideIcons.Fingerprint className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">Паспорт: маршрут SKU</h3>
                  {tzPhase !== '1' ? (
                    <span className="rounded border border-indigo-300/80 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-indigo-900">
                      Шаг {tzPhase} ТЗ
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
                  Прогресс по блокам и гейты — ниже всегда; дорожная карта, аудит и справка —
                  разверните
                </p>
              </div>
            </button>
          </CollapsibleTrigger>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-[10px]"
              onClick={() => void copySkuName()}
            >
              <LucideIcons.Copy className="h-3.5 w-3.5" aria-hidden />
              SKU + название
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-[10px]"
              onClick={() => void copyCard()}
            >
              <LucideIcons.ClipboardList className="h-3.5 w-3.5" aria-hidden />
              Карточка в буфер
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-[10px]">
                  <LucideIcons.Users className="h-3.5 w-3.5" aria-hidden />
                  Подсказки по ролям
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-3 text-xs" align="end">
                <div>
                  <p className="font-semibold text-violet-900">Дизайнер / бренд</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    Закрепите аудиторию и карточку модели (L3), затем бриф и обязательные поля
                    старта — чтобы визуал и материалы ссылались на ту же ветку каталога.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-amber-900">Менеджер</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    Даты, MOQ, ответственный и критичность срока — якорь для SLA и пульса; копируйте
                    SKU в переписку одной кнопкой.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-teal-900">Технолог</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    Паспорт задаёт контекст изделия; исполнимость узлов и состава проверяйте в
                    материалах, мерках и конструкции после закрытия стартовых полей.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-orange-950">Снабжение / PD</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    В материалах — BOM-ref со скетча, нормы, дельта к образцу и поток замен; в
                    паспорте держите SKU и коды синхронно с закупкой.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-rose-900">ОТК</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    Критичный аудит паспорта и метки qc/construction на скетче должны сходиться;
                    handoff из визуала ведёт на вкладку ОТК.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Производство</p>
                  <p className="mt-1 leading-snug text-slate-600">
                    Режим цеха для скетча и блок норм BOM — чтобы строки сырья совпадали с тем, что
                    уходит в раскрой.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CollapsibleContent className="space-y-4 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <Collapsible
            defaultOpen={false}
            className="w-full min-w-0 rounded-md border border-indigo-100/80 bg-white/50 px-2 py-2"
          >
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="text-left text-[10px] font-semibold text-indigo-700 underline-offset-2 hover:text-indigo-900 hover:underline"
              >
                Описание маршрута и переходы
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1.5 pt-1.5">
              <p className="text-[11px] leading-snug text-slate-600">
                Одна ось для визуала, материалов и мерок: без расхождений в справочнике и сроках по
                коллекции.
              </p>
              {dossierViewProfile !== 'full' ? (
                <p
                  className="border-l-2 border-indigo-200/90 pl-2 text-[10px] font-medium leading-snug text-indigo-900/95"
                  title="Режим просмотра ТЗ (w2view)"
                >
                  {WORKSHOP2_DOSSIER_VIEW_HINTS[dossierViewProfile]}
                </p>
              ) : null}
              {onJumpToVisualSection || onJumpToMaterialSection ? (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {onJumpToVisualSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-[10px] font-semibold text-indigo-700"
                      onClick={onJumpToVisualSection}
                    >
                      Визуал и эскиз →
                    </Button>
                  ) : null}
                  {onJumpToMaterialSection ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-[10px] font-semibold text-indigo-700"
                      onClick={onJumpToMaterialSection}
                    >
                      Материалы (BOM) →
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </CollapsibleContent>
          </Collapsible>

          <Workshop2NineGapBacklogStrip
            areas={['passport']}
            stripTitle="Паспорт · дорожная карта"
            variant="indigo"
            sectionPct={nineGapTzGeneralSectionPct ?? model.combinedPct}
            footer={nineGapFooter}
            onDossierJump={nineGapOnDossierJump}
          />

          {showPostSignoffDrift ? (
            <div className="rounded-lg border border-amber-300/90 bg-amber-50/95 px-3 py-2.5 text-[11px] text-amber-950">
              <p className="font-semibold">Досье менялось после подписи ТЗ</p>
              <p className="mt-1 leading-snug">
                Если правили паспорт, бриф или ключевые поля SKU — согласуйте повторное
                подтверждение подписей или зафиксируйте версию в переписке.
              </p>
              {!pulseLoggedReminder ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2 h-7 text-[10px]"
                  disabled={tzWriteDisabled}
                  onClick={() => {
                    onLogPostSignoffReminder();
                    onPulseLoggedReminder();
                  }}
                >
                  Записать напоминание в журнал ТЗ
                </Button>
              ) : (
                <p className="mt-2 text-[10px] text-amber-800/90">
                  Напоминание уже добавлено в эту сессию.
                </p>
              )}
            </div>
          ) : null}

          <div
            id="w2-passport-audit"
            className={cn(
              'scroll-mt-28 rounded-lg border px-3 py-2.5 text-[11px]',
              auditRoleOk && passportCriticalAuditSummaries.length > 0
                ? 'border-rose-200/90 bg-rose-50/90 text-rose-950'
                : 'border-slate-200/90 bg-slate-50/80 text-slate-800'
            )}
          >
            <p className="font-semibold">Аудит паспорта (фильтр журнала по критичным полям)</p>
            {!auditRoleOk ? (
              <p className="mt-1.5 leading-snug text-slate-600">
                Сводка по ключевым словам{' '}
                <span className="font-mono text-[10px] text-slate-500">
                  W2_PASSPORT_AUDIT_SUMMARY_KEYWORDS
                </span>{' '}
                доступна в режимах ТЗ: менеджер, комплаенс, технолог, финансы — переключите{' '}
                <span className="font-semibold">w2view</span> в шапке артикула.
              </p>
            ) : passportCriticalAuditSummaries.length > 0 ? (
              <>
                <ul className="mt-1.5 list-inside list-disc space-y-0.5 leading-snug">
                  {passportCriticalAuditSummaries.slice(0, 8).map((line, i) => (
                    <li key={`${i}-${line.slice(0, 24)}`}>{line}</li>
                  ))}
                </ul>
                {passportCriticalAuditSummaries.length > 8 ? (
                  <p className="mt-1 text-[10px] text-rose-800/80">
                    …и ещё строки в полной истории ТЗ.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-1.5 leading-snug text-slate-600">
                Сейчас нет строк журнала, совпадающих с фильтром критичных полей паспорта (
                <span className="font-mono text-[10px]">filterPassportCriticalAuditLines</span>).
              </p>
            )}
          </div>

          <div
            id="w2-passport-readonly"
            className="flex scroll-mt-28 flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-700"
          >
            {readOnlyShareUrl ? (
              <>
                <p className="min-w-0 leading-snug">
                  <span className="font-semibold text-slate-800">Внешняя сторона:</span> ссылка с
                  режимом фабрики и просмотром скетча — для цеха или контрагента без редактирования
                  (
                  <span className="font-mono text-[10px]">
                    buildWorkshop2ExternalReadOnlyParams
                  </span>
                  ).
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 shrink-0 gap-1 text-[10px]"
                  onClick={() => void copyReadOnlyLink()}
                >
                  <LucideIcons.Link className="h-3.5 w-3.5" aria-hidden />
                  Копировать ссылку
                </Button>
              </>
            ) : (
              <p className="min-w-0 leading-snug text-slate-600">
                <span className="font-semibold text-slate-800">Read-only выдача:</span> ссылка с{' '}
                <span className="font-mono text-[10px]">w2view=factory</span> и полом скетча
                появляется, когда она сформирована для артикула; при необходимости сформируйте из
                полного режима или проверьте права.
              </p>
            )}
          </div>

          {showMatSketchGapRibbon ? (
            <div
              id="w2-passport-mat-sketch-gap"
              className="scroll-mt-28 rounded-lg border border-amber-300/90 bg-amber-50/95 px-3 py-2.5 text-[11px] text-amber-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">Скетч ↔ mat: ref не найдены в строках материала</p>
                  <p className="mt-1 text-[10px] leading-snug text-amber-900/90">
                    Проверка по вхождению текста (без API). При необходимости поправьте mat или
                    подписи на метках.
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] leading-relaxed">
                    {matSketchBomGapRefs.slice(0, 10).join(' · ')}
                    {matSketchBomGapRefs.length > 10
                      ? ` · +${matSketchBomGapRefs.length - 10}`
                      : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  {onJumpToMaterialSection ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToMaterialSection}
                    >
                      Материалы
                    </Button>
                  ) : null}
                  {onJumpToMaterialMatTable ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToMaterialMatTable}
                    >
                      Таблица mat
                    </Button>
                  ) : null}
                  {(onJumpToSketchLineRefs ?? onJumpToVisualSection) ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToSketchLineRefs ?? onJumpToVisualSection}
                    >
                      Скетч · lineRef
                    </Button>
                  ) : null}
                  {onJumpToConstructionContour ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToConstructionContour}
                    >
                      Конструкция
                    </Button>
                  ) : null}
                  {onJumpToQcRoute ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToQcRoute}
                    >
                      ОТК
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : showMatSketchRibbon ? (
            <div
              id="w2-passport-sketch-bom-refs"
              className="scroll-mt-28 rounded-lg border border-blue-200/85 bg-blue-50/55 px-3 py-2.5 text-[11px] text-blue-950 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">BOM-ref на скетче</p>
                  <p className="mt-1 font-mono text-[10px] leading-relaxed text-blue-950/95">
                    {sketchLinkedBomRefs.length} шт. · {sketchLinkedBomRefs.slice(0, 8).join(' · ')}
                    {sketchLinkedBomRefs.length > 8 ? '…' : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1">
                  {onJumpToVisualSection ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToVisualSection}
                    >
                      Скетч →
                    </Button>
                  ) : null}
                  {onJumpToMaterialSection ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={onJumpToMaterialSection}
                    >
                      Mat →
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </CollapsibleContent>
      </Collapsible>

      <div className="rounded-lg border border-slate-200 bg-white/90 p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            Паспорт для маршрута · {doneCp}/{totalCp} блоков
          </p>
          <span className="text-[11px] font-semibold tabular-nums text-indigo-800">
            ≈ {model.combinedPct}%
          </span>
        </div>
        <p className="mt-1 text-[10px] leading-snug text-slate-500">
          Старт: {model.startPct}% · Рынок и коды: {model.preSamplePct}%
        </p>
        <ul className="mt-2 space-y-1.5">
          {model.checkpoints.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 text-[11px]"
            >
              <button
                type="button"
                className={cn(
                  'min-w-0 flex-1 text-left leading-snug underline-offset-2 hover:underline',
                  c.done ? 'text-emerald-800' : 'text-slate-800'
                )}
                onClick={() => onNavigate(c.anchorId)}
              >
                {c.done ? '✓ ' : '○ '}
                {c.label}
              </button>
              {!c.done ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 shrink-0 px-2 text-[9px] text-indigo-700"
                  onClick={() => onNavigate(c.anchorId)}
                >
                  Перейти
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {model.gateItems.length > 0 ? (
        <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[10px] leading-snug text-amber-950">
          <p className="font-semibold">Осталось для маршрута SKU</p>
          <p className="mt-1 text-[9px] text-amber-900/90">
            Нажмите пункт — прокрутит к полю. Полный список — в блоке ниже.
          </p>
          <ul className="mt-1.5 space-y-1">
            {model.gateItems.slice(0, 5).map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className="w-full text-left text-[10px] font-medium text-amber-950 underline-offset-2 hover:underline"
                  onClick={() => onNavigate(g.anchorId)}
                >
                  → {g.message}
                </button>
              </li>
            ))}
          </ul>
          {model.gateItems.length > 5 ? (
            <p className="mt-1 text-[9px] text-amber-800/85">
              + ещё {model.gateItems.length - 5} пунктов в списке блокеров.
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          'rounded-lg border px-3 py-2.5 text-[11px] shadow-sm',
          model.gateItems.length === 0
            ? 'border-emerald-200/90 bg-emerald-50/90 text-emerald-950'
            : 'border-amber-200/90 bg-amber-50/90 text-amber-950'
        )}
      >
        <p className="font-semibold">
          {model.gateItems.length === 0
            ? 'Открытых блокеров паспорта нет'
            : `Мини-гейт паспорта: ${model.gateItems.length} пункт(ов)`}
        </p>
        {model.gateItems.length > 0 ? (
          <ul className="mt-2 max-h-[14rem] space-y-2 overflow-y-auto pr-1">
            {model.gateItems.map((g) => (
              <li
                key={g.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-amber-100/80 bg-white/60 px-2 py-1.5"
              >
                <span className="min-w-0 flex-1 leading-snug">{g.message}</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 shrink-0 gap-0.5 px-2 text-[10px] font-medium"
                  onClick={() => onNavigate(g.anchorId)}
                >
                  <LucideIcons.CornerDownRight className="h-3 w-3 opacity-70" aria-hidden />
                  {g.jumpLabel}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {showOnboard ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-[11px] text-amber-950">
          <p className="font-semibold">Коротко: базовый путь (паспорт)</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>Кто модель: аудитория, L1–L3, SKU и рабочее название.</li>
            <li>Бриф до образца: ответственный, тип запуска, целевая дата, критичность срока.</li>
            <li>Старт по каталогу: обязательные поля справочника для этой ветки.</li>
            <li>Рынок и коды можно дозаполнять позже — они не должны блокировать старт визуала.</li>
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
          className="text-[10px] font-medium text-indigo-700 underline-offset-2 hover:underline"
          onClick={() => setShowOnboard(true)}
        >
          Показать подсказку по шагам (паспорт)
        </button>
      )}

      <p className="text-[10px] leading-snug text-slate-500">
        Локальное сохранение: досье хранится в браузере (localStorage). Тяжёлые фото в референсах и
        скетче могут не сохраниться — сожмите файлы или выгрузите внешними ссылками; при ошибке
        квоты появится предупреждение у метки времени сохранения.
      </p>
    </div>
  );
}
