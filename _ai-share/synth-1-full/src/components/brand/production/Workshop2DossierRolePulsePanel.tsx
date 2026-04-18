'use client';

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2TzActionLogEntry,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  workshopTzExtraRowsRequiringTzSignoff,
  workshopTzSignoffRequiredForRole,
} from '@/lib/production/workshop2-tz-signatory-options';
import * as LucideIcons from 'lucide-react';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';

function parseLocalYmd(iso: string | undefined): Date | null {
  const t = iso?.trim();
  if (!t || !/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [y, m, d] = t.split('-').map(Number);
  return new Date(y!, m! - 1, d!);
}

function isPastDue(iso: string | undefined): boolean {
  const dt = parseLocalYmd(iso);
  if (!dt) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dt < today;
}

export type Workshop2DossierRolePulsePanelProps = {
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setActiveSection: (id: Workshop2TzSignoffSectionKey) => void;
  /** Вкладка ТЗ + якорь (паспорт, хаб материалов, мерки и т.д.) */
  onJumpToTzAnchor?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
  onJumpToBrandNotes: () => void;
  onExportHandoffPdf: () => void | Promise<void>;
  handoffPdfBusy?: boolean;
};

function hasPackagingMarkingCareAssignments(dossier: Workshop2DossierPhase1): boolean {
  const ids = new Set([
    'packaging',
    'labeling',
    'barcode',
    'careWashingClassOptions',
    'temperatureOptions',
    'packagingDimensionsClassOptions',
    'articleWeightPackagingClassOptions',
  ]);
  return dossier.assignments.some((a) =>
    Boolean(a.attributeId && ids.has(a.attributeId) && a.values.length > 0)
  );
}

function jumpTz(
  section: Workshop2TzSignoffSectionKey,
  anchorId: string,
  setActiveSection: (id: Workshop2TzSignoffSectionKey) => void,
  onJumpToTzAnchor?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void
) {
  if (onJumpToTzAnchor) onJumpToTzAnchor(section, anchorId);
  else {
    setActiveSection(section);
    queueMicrotask(() => {
      document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

function formatTzLogLine(e: Workshop2TzActionLogEntry): string {
  const a = e.action;
  switch (a.type) {
    case 'tz_global_signoff':
      return `${a.role}: подпись ${a.set ? 'проставлена' : 'снята'}`;
    case 'tz_extra_signoff':
      return `${a.roleTitle}: ${a.set ? 'подпись' : 'снята'}`;
    case 'section_signoff':
      return `Секция ${a.section}: ${a.role} ${a.set ? 'подтвердил' : 'снял'}`;
    case 'dossier_edit':
      return a.summaries[0] ?? 'Правка досье';
    case 'sketch_labels_snapshot':
      return `Снимок меток (${a.masterPins}+${a.sheetPinsTotal})`;
    case 'sketch_labels_restore':
      return `Восстановление меток`;
    default:
      return a.type;
  }
}

function CheckRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2 text-[11px] leading-snug text-slate-700">
      {done ? (
        <LucideIcons.CheckCircle2
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
          aria-hidden
        />
      ) : (
        <LucideIcons.Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
      )}
      <span className={cn(!done && 'text-slate-500')}>{label}</span>
    </li>
  );
}

export function Workshop2DossierRolePulsePanel({
  dossier,
  currentLeaf,
  setDossier,
  setActiveSection,
  onJumpToTzAnchor,
  onJumpToBrandNotes,
  onExportHandoffPdf,
  handoffPdfBusy = false,
}: Workshop2DossierRolePulsePanelProps) {
  const [tzNotifPerm, setTzNotifPerm] = useState<NotificationPermission | 'unsupported'>(
    'unsupported'
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setTzNotifPerm(Notification.permission);
  }, []);

  const readiness = useMemo(
    () => calculateDossierReadiness(dossier, currentLeaf),
    [dossier, currentLeaf]
  );
  const { summary, overall } = readiness;
  const visualsCp = readiness.sections.visuals.controlPoints;
  const generalCp = readiness.sections.general.controlPoints.filter((cp) => cp.label !== 'SKU');
  const constructionCp = readiness.sections.construction.controlPoints;
  const materialPct = readiness.sections.material.pct;
  const generalPct = readiness.sections.general.pct;

  const tzB = dossier.tzSignatoryBindings;
  const reqD = workshopTzSignoffRequiredForRole(tzB, 'designer');
  const reqT = workshopTzSignoffRequiredForRole(tzB, 'technologist');
  const reqM = workshopTzSignoffRequiredForRole(tzB, 'manager');
  const extrasTz = workshopTzExtraRowsRequiringTzSignoff(tzB);
  const extrasSigned = (rowId: string) => Boolean(dossier.extraTzSignoffsByRowId?.[rowId]);

  const leafId = currentLeaf.leafId;
  const masterPins = useMemo(
    () => (dossier.categorySketchAnnotations ?? []).filter((a) => a.categoryLeafId === leafId),
    [dossier.categorySketchAnnotations, leafId]
  );
  const criticalMaster = masterPins.filter((a) => a.priority === 'critical').length;
  const qcMaster = masterPins.filter((a) => (a.stage ?? 'tz') === 'qc').length;
  const bomLinkedPins = masterPins.filter((a) =>
    Boolean(a.linkedBomLineRef?.trim() || a.linkedMaterialNote?.trim())
  ).length;
  const altDrafts = dossier.materialAlternativeDrafts?.length ?? 0;
  const deltaDrafts = dossier.bomLineDeltaDrafts?.length ?? 0;
  const costingHints = dossier.bomLineCostingHints?.length ?? 0;
  const canonReady = Boolean(dossier.canonicalMainPhotoRefId && dossier.canonicalMainSketchTarget);
  const packagingCareReady = hasPackagingMarkingCareAssignments(dossier);

  const patchRoleDue = (role: 'designer' | 'technologist' | 'manager', value: string) => {
    const v = value.trim() || undefined;
    setDossier((prev) => ({
      ...prev,
      passportProductionBrief: {
        ...prev.passportProductionBrief,
        tzRoleResponseDue: {
          ...prev.passportProductionBrief?.tzRoleResponseDue,
          [role]: v,
        },
      },
    }));
  };

  const sla = dossier.passportProductionBrief?.tzRoleResponseDue;

  const brief = dossier.passportProductionBrief;
  const targetDate = brief?.targetSampleOrPilotDate?.trim();
  const dateLabel = targetDate
    ? new Date(targetDate + 'T12:00:00').toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;
  const critLabel =
    brief?.deadlineCriticality === 'hard'
      ? 'жёсткий'
      : brief?.deadlineCriticality === 'flexible'
        ? 'гибкий'
        : brief?.deadlineCriticality === 'tbd'
          ? 'уточняется'
          : null;

  const signLine = (required: boolean, done: boolean, role: string) => (
    <div className="flex items-center justify-between gap-2 text-[10px]">
      <span className="text-slate-600">{role}</span>
      {!required ? (
        <span className="text-slate-400">не требуется</span>
      ) : done ? (
        <Badge
          variant="outline"
          className="h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800"
        >
          есть
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-900"
        >
          ждём
        </Badge>
      )}
    </div>
  );

  const topWarnings = summary.warnings.slice(0, 3);
  const recentLog = (dossier.tzActionLog ?? []).slice(-4).reverse();

  return (
    <details className="group rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50/80 shadow-sm open:shadow-md">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
          <LucideIcons.Radar className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900">Пульс артикула: роли и секции ТЗ</p>
          <p className="mt-0.5 text-[10px] leading-snug text-slate-600">
            Три опоры маршрута — бренд-дизайнер, технолог, менеджмент; ниже — снабжение, ОТК,
            комплаенс и мерч как смежные контуры при сборке ТЗ (паспорт, визуал, материалы,
            конструкция).
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge
            variant="outline"
            className={cn(
              'text-[10px]',
              summary.readyForSample
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            )}
          >
            {summary.readyForSample ? 'Чеклист ТЗ закрыт' : 'Есть пробелы'}
          </Badge>
          <span className="text-[10px] font-semibold tabular-nums text-slate-600">
            {overall.pct}% · досье
          </span>
        </div>
        <LucideIcons.ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-indigo-100/80 px-4 pb-4 pt-2">
        <div className="grid gap-3 md:grid-cols-3">
          {/* Дизайнер */}
          <div className="rounded-lg border border-violet-100 bg-white/90 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.Palette className="h-4 w-4 text-violet-600" aria-hidden />
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-violet-950">
                Бренд-дизайнер
              </h3>
            </div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-violet-800/90">
              Паспорт
            </p>
            <ul className="space-y-1.5">
              {generalCp.map((cp) => (
                <CheckRow key={`g-${cp.label}`} done={cp.done} label={cp.label} />
              ))}
            </ul>
            <p className="mb-1.5 mt-2 text-[9px] font-semibold uppercase tracking-wide text-violet-800/90">
              Визуал / эскиз
            </p>
            <ul className="space-y-1.5">
              {visualsCp.map((cp) => (
                <CheckRow key={cp.label} done={cp.done} label={cp.label} />
              ))}
              <CheckRow
                done={Boolean(dossier.sketchBrandbookConstraints?.trim())}
                label="Ограничения брендбука на скетче"
              />
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() =>
                  jumpTz('general', 'w2-passport-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                Паспорт
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={onJumpToBrandNotes}
              >
                Замысел и референсы
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-slate-600"
                onClick={() =>
                  jumpTz('visuals', 'w2-visuals-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                Визуал / эскиз
              </Button>
            </div>
          </div>

          {/* Технолог */}
          <div className="rounded-lg border border-teal-100 bg-white/90 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.Wrench className="h-4 w-4 text-teal-700" aria-hidden />
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-teal-950">
                Технолог
              </h3>
            </div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-teal-900/90">
              Материалы (BOM)
            </p>
            <ul className="space-y-1.5">
              <CheckRow done={summary.materialReady} label="Основной материал (mat)" />
              <CheckRow
                done={packagingCareReady}
                label="Упаковка / маркировка / уход (вкладка материалов)"
              />
              <CheckRow
                done={deltaDrafts === 0}
                label={
                  deltaDrafts > 0
                    ? `Черновики дельты BOM к образцу (${deltaDrafts}) — согласовать или очистить`
                    : 'Дельта BOM: нет висящих черновиков'
                }
              />
              <CheckRow
                done={altDrafts === 0}
                label={
                  altDrafts > 0
                    ? `Альтернативы материалов в работе (${altDrafts})`
                    : 'Альтернативы: нет открытых черновиков'
                }
              />
            </ul>
            <p className="mt-1 text-[10px] leading-snug text-slate-600">
              <span className="font-medium text-slate-700">Costing (необязательно):</span>{' '}
              {costingHints > 0
                ? `${costingHints} подсказок по строкам BOM`
                : 'подсказок нет — задайте в блоке материалов при подготовке к costing'}
            </p>
            <p className="mb-1.5 mt-2 text-[9px] font-semibold uppercase tracking-wide text-teal-900/90">
              Конструкция и мерки
            </p>
            <ul className="space-y-1.5">
              {constructionCp.map((cp) => (
                <CheckRow key={`c-${cp.label}`} done={cp.done} label={cp.label} />
              ))}
            </ul>
            <p className="mb-1.5 mt-2 text-[9px] font-semibold uppercase tracking-wide text-teal-900/90">
              Скетч
            </p>
            <ul className="space-y-1.5">
              <CheckRow
                done={masterPins.length > 0}
                label={`Метки на общем скетче (${masterPins.length})`}
              />
              <CheckRow
                done={criticalMaster > 0}
                label={
                  criticalMaster > 0
                    ? `Критичные узлы отмечены (${criticalMaster})`
                    : 'Критичные узлы на скетче'
                }
              />
              <CheckRow
                done={qcMaster > 0}
                label={
                  qcMaster > 0
                    ? `Точки этапа ОТК (${qcMaster})`
                    : 'Контроль ОТК на скетче (по необходимости)'
                }
              />
              <CheckRow
                done={Boolean(dossier.categorySketchProductionApproved?.at)}
                label="Утверждение скетча к производству (PLM-блок)"
              />
              <CheckRow
                done={bomLinkedPins > 0}
                label={
                  bomLinkedPins > 0
                    ? `Метки с привязкой к BOM / материалу (${bomLinkedPins})`
                    : 'Привязка меток к строке BOM (по необходимости)'
                }
              />
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() =>
                  jumpTz('material', 'w2-material-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                Материалы (BOM)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() =>
                  jumpTz('construction', 'w2-construction-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                Конструкция
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-[10px]"
                onClick={() =>
                  jumpTz(
                    'construction',
                    'w2-measurements-fields',
                    setActiveSection,
                    onJumpToTzAnchor
                  )
                }
              >
                Табель мер
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-slate-600"
                onClick={() =>
                  jumpTz(
                    'construction',
                    W2_VISUALS_SKETCH_ANCHOR_ID,
                    setActiveSection,
                    onJumpToTzAnchor
                  )
                }
              >
                Общий скетч
              </Button>
            </div>
          </div>

          {/* Менеджер */}
          <div className="rounded-lg border border-amber-100 bg-white/90 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <LucideIcons.Briefcase className="h-4 w-4 text-amber-700" aria-hidden />
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-amber-950">
                Менеджмент
              </h3>
            </div>
            {dateLabel ? (
              <p className="mb-2 text-[11px] leading-snug text-slate-800">
                <span className="font-semibold">Целевая дата образца / пилота:</span> {dateLabel}
                {critLabel ? <span className="text-slate-500"> · {critLabel}</span> : null}
              </p>
            ) : (
              <p className="mb-2 text-[11px] text-slate-500">
                В паспорте не задана целевая дата — уточните в разделе «Паспорт».
              </p>
            )}
            <div className="mb-3 rounded-md border border-slate-200 bg-white p-2">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
                SLA ответа по ролям (ТЗ)
              </p>
              <p className="mb-2 text-[9px] leading-snug text-slate-500">
                Целевая дата ответа по роли; если срок прошёл, а подпись ещё нужна — подсветка
                «просрочено».
              </p>
              {tzNotifPerm !== 'unsupported' ? (
                <div className="mb-2 flex flex-wrap items-center gap-2 rounded-md border border-indigo-100 bg-indigo-50/50 px-2 py-1.5">
                  <p className="min-w-0 flex-1 text-[9px] leading-snug text-slate-700">
                    Напоминания о сроках (просрочка / сегодня / завтра) — через уведомления
                    браузера, пока вкладка открыта.
                  </p>
                  {tzNotifPerm === 'granted' ? (
                    <span className="text-[9px] font-medium text-emerald-800">
                      Уведомления включены
                    </span>
                  ) : tzNotifPerm === 'denied' ? (
                    <span className="text-[9px] text-rose-800">
                      Заблокированы в настройках браузера
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 shrink-0 text-[9px]"
                      onClick={() => {
                        void Notification.requestPermission().then((p) => setTzNotifPerm(p));
                      }}
                    >
                      Включить напоминания
                    </Button>
                  )}
                </div>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-[9px] text-slate-600">Дизайн</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="date"
                      className="h-8 text-[10px]"
                      value={sla?.designer ?? ''}
                      onChange={(e) => patchRoleDue('designer', e.target.value)}
                    />
                    {reqD && !dossier.isVerifiedByDesigner && isPastDue(sla?.designer) ? (
                      <Badge
                        variant="outline"
                        className="h-5 shrink-0 border-rose-200 bg-rose-50 px-1 text-[8px] text-rose-900"
                      >
                        !
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] text-slate-600">Технолог</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="date"
                      className="h-8 text-[10px]"
                      value={sla?.technologist ?? ''}
                      onChange={(e) => patchRoleDue('technologist', e.target.value)}
                    />
                    {reqT && !dossier.isVerifiedByTechnologist && isPastDue(sla?.technologist) ? (
                      <Badge
                        variant="outline"
                        className="h-5 shrink-0 border-rose-200 bg-rose-50 px-1 text-[8px] text-rose-900"
                      >
                        !
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] text-slate-600">Менеджер</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="date"
                      className="h-8 text-[10px]"
                      value={sla?.manager ?? ''}
                      onChange={(e) => patchRoleDue('manager', e.target.value)}
                    />
                    {reqM && !dossier.isVerifiedByManager && isPastDue(sla?.manager) ? (
                      <Badge
                        variant="outline"
                        className="h-5 shrink-0 border-rose-200 bg-rose-50 px-1 text-[8px] text-rose-900"
                      >
                        !
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              Подписи ТЗ (этап)
            </p>
            <div className="space-y-1 rounded-md border border-slate-100 bg-slate-50/80 p-2">
              {signLine(reqD, Boolean(dossier.isVerifiedByDesigner), 'Дизайн')}
              {signLine(reqT, Boolean(dossier.isVerifiedByTechnologist), 'Технолог')}
              {signLine(reqM, Boolean(dossier.isVerifiedByManager), 'Менеджер')}
              {extrasTz.map((ex) => (
                <div key={ex.rowId} className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-slate-600">{ex.roleTitle?.trim() || 'Роль'}</span>
                  {extrasSigned(ex.rowId) ? (
                    <Badge
                      variant="outline"
                      className="h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800"
                    >
                      есть
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="h-4 border-amber-200 bg-amber-50 px-1.5 text-[9px] text-amber-900"
                    >
                      ждём
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {topWarnings.length > 0 ? (
              <div className="mt-2">
                <p className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-amber-800">
                  <LucideIcons.AlertCircle className="h-3 w-3" aria-hidden />
                  Риски по досье
                </p>
                <ul className="space-y-1">
                  {topWarnings.map((w) => (
                    <li key={w} className="text-[10px] leading-snug text-amber-950/90">
                      · {w}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-[10px] text-emerald-800">
                Критичных предупреждений движка готовности нет.
              </p>
            )}
            {recentLog.length > 0 ? (
              <div className="mt-2 border-t border-slate-100 pt-2">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  Последние действия ТЗ
                </p>
                <ul className="max-h-[4.5rem] space-y-0.5 overflow-y-auto text-[9px] text-slate-600">
                  {recentLog.map((e) => {
                    const line = formatTzLogLine(e);
                    return (
                      <li key={e.entryId} className="truncate" title={line}>
                        {e.at?.slice(0, 10)} · {e.by?.trim() || '—'} · {line}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <div className="mt-3 flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-full text-[10px]"
                onClick={() =>
                  jumpTz('general', 'w2-passport-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                Паспорт · сроки и MOQ
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-full gap-1.5 text-[10px]"
                disabled={handoffPdfBusy}
                onClick={() => void onExportHandoffPdf()}
              >
                <LucideIcons.FileDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {handoffPdfBusy ? 'PDF…' : 'PDF для передачи (все доски)'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-full text-[10px]"
                onClick={() => {
                  document
                    .getElementById('w2-tz-digital-signoffs')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                К подписям ТЗ
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200/90 bg-slate-50/80 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-700">
            Смежные роли при сборке ТЗ
          </p>
          <p className="mt-1 text-[9px] leading-snug text-slate-600">
            Не обязательные подписанты по умолчанию, но их вопросы закрываются теми же секциями
            досье.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-white/80 bg-white/90 p-2 shadow-sm">
              <div className="mb-1.5 flex items-center gap-1.5">
                <LucideIcons.Truck className="h-3.5 w-3.5 text-amber-700" aria-hidden />
                <span className="text-[10px] font-bold text-slate-900">Снабжение / PD</span>
              </div>
              <ul className="space-y-1">
                <CheckRow done={summary.materialReady} label="Mat и BOM в ТЗ" />
                <CheckRow
                  done={materialPct >= 80}
                  label={`Поля каталога материалов ≈ ${materialPct}%`}
                />
              </ul>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-6 w-full text-[9px]"
                onClick={() =>
                  jumpTz('material', 'w2-material-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                К BOM
              </Button>
            </div>
            <div className="rounded-md border border-white/80 bg-white/90 p-2 shadow-sm">
              <div className="mb-1.5 flex items-center gap-1.5">
                <LucideIcons.ShieldCheck className="h-3.5 w-3.5 text-teal-700" aria-hidden />
                <span className="text-[10px] font-bold text-slate-900">ОТК / качество</span>
              </div>
              <ul className="space-y-1">
                <CheckRow done={qcMaster > 0} label="Метки qc на скетче" />
                <CheckRow done={summary.measurementsReady} label="Табель мер для приёмки" />
              </ul>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-6 w-full text-[9px]"
                onClick={() =>
                  jumpTz(
                    'construction',
                    W2_VISUALS_SKETCH_ANCHOR_ID,
                    setActiveSection,
                    onJumpToTzAnchor
                  )
                }
              >
                К скетчу
              </Button>
            </div>
            <div className="rounded-md border border-white/80 bg-white/90 p-2 shadow-sm">
              <div className="mb-1.5 flex items-center gap-1.5">
                <LucideIcons.Scale className="h-3.5 w-3.5 text-indigo-700" aria-hidden />
                <span className="text-[10px] font-bold text-slate-900">Комплаенс</span>
              </div>
              <ul className="space-y-1">
                <CheckRow
                  done={generalPct >= 70}
                  label={`Паспорт (коды, рынок) ≈ ${generalPct}%`}
                />
                <CheckRow done={packagingCareReady} label="Маркировка / уход в материалах" />
              </ul>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-6 w-full text-[9px]"
                onClick={() =>
                  jumpTz('general', 'w2-passport-market', setActiveSection, onJumpToTzAnchor)
                }
              >
                Рынок и коды
              </Button>
            </div>
            <div className="rounded-md border border-white/80 bg-white/90 p-2 shadow-sm">
              <div className="mb-1.5 flex items-center gap-1.5">
                <LucideIcons.Store className="h-3.5 w-3.5 text-violet-700" aria-hidden />
                <span className="text-[10px] font-bold text-slate-900">Мерч / e-com</span>
              </div>
              <ul className="space-y-1">
                <CheckRow
                  done={Boolean(dossier.visualReferences?.length)}
                  label="Витринные референсы"
                />
                <CheckRow done={canonReady} label="Канон: фото + скетч" />
              </ul>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2 h-6 w-full text-[9px]"
                onClick={() =>
                  jumpTz('visuals', 'w2-visuals-hub', setActiveSection, onJumpToTzAnchor)
                }
              >
                К визуалу
              </Button>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
