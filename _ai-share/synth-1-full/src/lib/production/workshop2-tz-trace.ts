import type { Workshop2DossierPhase1, Workshop2Phase1CategorySketchAnnotation } from './workshop2-dossier-phase1.types';
import { normalizeSketchSheets } from './workshop2-sketch-sheets';
import { resolveWorkshop2TechPackHandoffChecklistRow } from './workshop2-tech-pack-handoff-resolve';
import { buildWorkshop2TzGateSnapshot, type Workshop2TzGateCommentLike } from './workshop2-tz-gates';
import { buildWorkshop2ProductionPreflightSnapshot } from './workshop2-production-preflight';

export type Workshop2TzTraceRow = {
  id: string;
  label: string;
  status: 'ok' | 'warn';
  detail: string;
};

export type Workshop2TzPreflightIssue = {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  detail: string;
  fixHint: string;
  target:
    | 'visuals'
    | 'material'
    | 'construction'
    | 'assignment'
    | 'general'
    | 'comments';
  priority: number;
};

export type Workshop2TzPreflightReport = {
  ok: boolean;
  issues: Workshop2TzPreflightIssue[];
};

function detectMachineCodeFromMessage(detail: string): string | null {
  const m = detail.match(/\[(W2_[A-Z0-9_]+)\]/);
  return m?.[1] ?? null;
}

function collectAllPins(dossier: Workshop2DossierPhase1): Workshop2Phase1CategorySketchAnnotation[] {
  const out: Workshop2Phase1CategorySketchAnnotation[] = [];
  out.push(...(dossier.categorySketchAnnotations ?? []));
  for (const sh of normalizeSketchSheets(dossier.sketchSheets)) out.push(...sh.annotations);
  for (const slot of dossier.subcategorySketchSlots ?? []) out.push(...slot.annotations);
  return out;
}

export function buildWorkshop2TzTraceRows(
  dossier: Workshop2DossierPhase1,
  opts?: { commentsById?: Record<string, Workshop2TzGateCommentLike[]>; sessionBlobById?: Record<string, string> }
): Workshop2TzTraceRow[] {
  const gate = buildWorkshop2TzGateSnapshot(dossier, opts);
  const pins = collectAllPins(dossier);
  const linkedAttrPins = pins.filter((p) => Boolean(p.linkedAttributeId?.trim())).length;
  const linkedBomPins = pins.filter((p) => Boolean(p.linkedBomLineRef?.trim())).length;
  const handoff = resolveWorkshop2TechPackHandoffChecklistRow(dossier.techPackFactoryHandoffs);
  const launchType = dossier.passportProductionBrief?.plannedLaunchType ?? 'undecided';

  return [
    {
      id: 'trace-brief',
      label: 'Паспорт → запуск',
      status: launchType === 'undecided' ? 'warn' : 'ok',
      detail:
        launchType === 'undecided'
          ? 'тип запуска не выбран'
          : `тип запуска: ${launchType}`,
    },
    {
      id: 'trace-material-bom',
      label: 'ТЗ ↔ BOM',
      status: (dossier.materialAlternativeDrafts?.length ?? 0) + (dossier.bomLineDeltaDrafts?.length ?? 0) > 0 ? 'ok' : 'warn',
      detail:
        (dossier.materialAlternativeDrafts?.length ?? 0) + (dossier.bomLineDeltaDrafts?.length ?? 0) > 0
          ? `альтернатив: ${dossier.materialAlternativeDrafts?.length ?? 0}, дельт: ${dossier.bomLineDeltaDrafts?.length ?? 0}`
          : 'нет draft-связок материалов/BOM',
    },
    {
      id: 'trace-sketch-links',
      label: 'Скетч ↔ атрибут/BOM',
      /** Не дублируем предупреждение Pre-flight «метки без связей» — там источник правды для закрытия ворот. */
      status: 'ok',
      detail:
        pins.length === 0
          ? 'меток нет'
          : linkedAttrPins + linkedBomPins === 0
            ? `меток: ${pins.length}, связей с атрибутами/BOM пока нет (см. Pre-flight, если нужно закрыть контур)`
            : `меток: ${pins.length}, к атрибутам: ${linkedAttrPins}, к BOM: ${linkedBomPins}`,
    },
    {
      id: 'trace-cad-handoff',
      label: 'CAD ↔ передача',
      status: gate.techPackCount === 0 || gate.hasHandoffMarks ? 'ok' : 'warn',
      detail:
        gate.techPackCount === 0
          ? 'файлов CAD нет'
          : handoff
            ? `передача: ${handoff.packageRevisionLabel || 'R?'}`
            : 'передача не отмечена',
    },
  ];
}

export function buildWorkshop2TzPreflightReport(
  dossier: Workshop2DossierPhase1,
  opts?: { commentsById?: Record<string, Workshop2TzGateCommentLike[]>; sessionBlobById?: Record<string, string> }
): Workshop2TzPreflightReport {
  const gate = buildWorkshop2TzGateSnapshot(dossier, opts);
  const pins = collectAllPins(dossier);
  const linkedPins = pins.filter(
    (p) => Boolean(p.linkedAttributeId?.trim()) || Boolean(p.linkedBomLineRef?.trim())
  ).length;

  const issues: Workshop2TzPreflightIssue[] = [];
  for (const blocker of gate.blockers) {
    issues.push({
      id: `gate-${blocker.id}`,
      severity: blocker.id === 'critical_comments' ? 'critical' : 'warning',
      title: blocker.label,
      detail: blocker.detail,
      fixHint:
        blocker.id === 'sketch'
          ? 'Добавьте канон или лист с изображением.'
          : blocker.id === 'zip_bytes'
            ? 'Проверьте файлы CAD: у каждого должны быть байты для ZIP.'
            : blocker.id === 'composition_label'
              ? 'Заполните блок «Бирка состава» во вкладке «Материалы» (якорь «Бирка»).'
            : blocker.id === 'production_preflight'
              ? 'Закройте блокеры производственного pre-flight (материалы, мерки, скетч, узлы).'
              : blocker.id === 'section_signoffs'
                ? 'Соберите подписи бренд+тех по всем 4 секциям.'
                : blocker.id === 'handoff_marks'
                  ? 'Зафиксируйте отметки бренд/цех и строку передачи.'
                  : 'Закройте или resolve критичные комментарии.',
      target:
        blocker.id === 'sketch'
          ? 'construction'
          : blocker.id === 'zip_bytes'
            ? 'construction'
            : blocker.id === 'composition_label'
              ? 'material'
              : blocker.id === 'production_preflight'
                ? 'assignment'
              : blocker.id === 'section_signoffs' || blocker.id === 'handoff_marks'
                ? 'assignment'
                : 'comments',
      priority: blocker.priority,
    });
  }

  const sectionOrder: ('general' | 'material' | 'construction')[] = [
    'general',
    'material',
    'construction',
  ];
  let fallbackRuleCounter = 0;
  for (const section of sectionOrder) {
    const errs = gate.sectionMinimumErrors[section] ?? [];
    for (const detail of errs) {
      const machine = detectMachineCodeFromMessage(detail) ?? `W2_RULE_${++fallbackRuleCounter}`;
      issues.push({
        id: `rule-${machine.toLowerCase()}`,
        severity: 'critical',
        title: `Минимальный стандарт · ${section}`,
        detail,
        fixHint: 'Исправьте поле/связь в указанной секции и повторите проверку.',
        target: section,
        priority: 29,
      });
    }
  }

  if (pins.length > 0 && linkedPins === 0) {
    issues.push({
      id: 'trace-pins-without-links',
      severity: 'warning',
      title: 'Метки без связей',
      detail: `Метки: ${pins.length}, но нет связей с атрибутами/BOM`,
      fixHint: 'Привяжите метки к атрибутам или BOM-строкам.',
      target: 'construction',
      priority: 35,
    });
  }

  const preflight = buildWorkshop2ProductionPreflightSnapshot(dossier);
  for (const w of preflight.warnings) {
    issues.push({
      id: `preflight-${w.id}`,
      severity: 'warning',
      title: w.label,
      detail: w.detail,
      fixHint: 'Уточните данные перед передачей в цех.',
      target: w.section === 'passport' ? 'general' : w.section === 'materials' ? 'material' : w.section === 'sketch' ? 'construction' : 'construction',
      priority: 36,
    });
  }

  issues.sort((a, b) => a.priority - b.priority);
  return { ok: issues.length === 0, issues };
}
