import type {
  Workshop2DossierPhase1,
  Workshop2VisualRefTakeawayAspect,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  VISUAL_READINESS_LABELS,
  takeawayAspectLabel,
  visualReadinessProgress,
} from '@/lib/production/workshop2-visual-excellence';

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function canonicalSketchHuman(dossier: Workshop2DossierPhase1): string {
  const t = dossier.canonicalMainSketchTarget;
  if (!t) return '—';
  if (t.kind === 'master') return 'Master-скетч (категория)';
  const sh = dossier.sketchSheets?.find((s) => s.sheetId === t.sheetId);
  const label = sh?.title?.trim() || sh?.viewKind || t.sheetId.slice(0, 8);
  return `Лист: ${label}`;
}

export type VisualHandoffVisualRouteGate = {
  allClear: boolean;
  openMessages: string[];
};

export type VisualHandoffQuickSummary = {
  checklistDone: number;
  checklistTotal: number;
  referenceCount: number;
  sketchPinTotal: number;
  sketchHasSubstrate: boolean;
  intentOrNotesFilled: boolean;
  canonicalPhotoAndSketchSet: boolean;
};

export function getVisualHandoffQuickSummary(
  dossier: Workshop2DossierPhase1
): VisualHandoffQuickSummary {
  const vr = visualReadinessProgress(dossier);
  let sheetPins = 0;
  for (const s of dossier.sketchSheets ?? []) {
    sheetPins += s.annotations?.length ?? 0;
  }
  const masterPins = dossier.categorySketchAnnotations?.length ?? 0;
  return {
    checklistDone: vr.done,
    checklistTotal: vr.total,
    referenceCount: dossier.visualReferences?.length ?? 0,
    sketchPinTotal: masterPins + sheetPins,
    sketchHasSubstrate:
      Boolean(dossier.categorySketchImageDataUrl) ||
      Boolean(dossier.sketchSheets?.some((s) => Boolean(s.imageDataUrl))),
    intentOrNotesFilled:
      Boolean(dossier.designerIntent?.mood?.trim()) ||
      Boolean(dossier.designerIntent?.bullets?.some((b) => b.trim())) ||
      Boolean(dossier.brandNotes?.trim()),
    canonicalPhotoAndSketchSet: Boolean(
      dossier.canonicalMainPhotoRefId && dossier.canonicalMainSketchTarget
    ),
  };
}

export type VisualHandoffExportPayload = {
  schema: 'workshop2-visual-handoff-v1';
  exportedAt: string;
  articleSku?: string;
  /** Совпадает с гейтом раздела «Визуал» / readiness (если передан при экспорте). */
  visualRouteGate?: VisualHandoffVisualRouteGate;
  /** Сводка для навигации визуала и внешних интеграций (без вычислений на стороне клиента). */
  visualQuickSummary: VisualHandoffQuickSummary;
  designerIntent?: Workshop2DossierPhase1['designerIntent'];
  canonicalMainPhotoRefId?: string;
  canonicalMainSketchTarget?: Workshop2DossierPhase1['canonicalMainSketchTarget'];
  currentVisualVersionLabel?: string;
  visualVersionLog?: Workshop2DossierPhase1['visualVersionLog'];
  visualReadinessChecklist?: Workshop2DossierPhase1['visualReadinessChecklist'];
  passportVisualSource?: Workshop2DossierPhase1['passportVisualSource'];
  references: {
    refId: string;
    title: string;
    takeawayAspects?: Workshop2VisualRefTakeawayAspect[];
    takeawayNote?: string;
    externalUrl?: string;
  }[];
  masterPinCount: number;
  sheetPinCountTotal: number;
};

export function buildVisualHandoffExportPayload(
  dossier: Workshop2DossierPhase1,
  opts?: { articleSku?: string; visualRouteGate?: VisualHandoffVisualRouteGate }
): VisualHandoffExportPayload {
  let sheetPinCountTotal = 0;
  for (const s of dossier.sketchSheets ?? []) {
    sheetPinCountTotal += s.annotations?.length ?? 0;
  }
  const visualQuickSummary = getVisualHandoffQuickSummary(dossier);
  return {
    schema: 'workshop2-visual-handoff-v1',
    exportedAt: new Date().toISOString(),
    articleSku: opts?.articleSku?.trim() || undefined,
    ...(opts?.visualRouteGate
      ? {
          visualRouteGate: {
            allClear: opts.visualRouteGate.allClear,
            openMessages: [...opts.visualRouteGate.openMessages],
          },
        }
      : {}),
    designerIntent: dossier.designerIntent,
    canonicalMainPhotoRefId: dossier.canonicalMainPhotoRefId,
    canonicalMainSketchTarget: dossier.canonicalMainSketchTarget,
    currentVisualVersionLabel: dossier.currentVisualVersionLabel,
    visualVersionLog: dossier.visualVersionLog,
    visualReadinessChecklist: dossier.visualReadinessChecklist,
    passportVisualSource: dossier.passportVisualSource,
    references: (dossier.visualReferences ?? []).map((r) => ({
      refId: r.refId,
      title: r.title,
      takeawayAspects: r.takeawayAspects,
      takeawayNote: r.takeawayNote,
      externalUrl: r.externalUrl,
    })),
    masterPinCount: dossier.categorySketchAnnotations?.length ?? 0,
    sheetPinCountTotal,
    visualQuickSummary,
  };
}

/** Текстовый отчёт для печати / PDF из браузера (без вложенных изображений). */
export function buildVisualHandoffPrintHtml(
  dossier: Workshop2DossierPhase1,
  opts?: {
    articleSku?: string;
    articleName?: string;
    visualRouteGate?: VisualHandoffVisualRouteGate;
  }
): string {
  const sku = opts?.articleSku?.trim();
  const name = opts?.articleName?.trim();
  const gate = opts?.visualRouteGate;
  const payload = buildVisualHandoffExportPayload(dossier, {
    articleSku: sku,
    visualRouteGate: gate,
  });
  const checklist = dossier.visualReadinessChecklist ?? {};
  const checklistRows = VISUAL_READINESS_LABELS.map(
    (row) => `<tr><td>${escHtml(row.label)}</td><td>${checklist[row.key] ? 'Да' : 'Нет'}</td></tr>`
  ).join('');
  const intentBullets = (dossier.designerIntent?.bullets ?? [])
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => `<li>${escHtml(b)}</li>`)
    .join('');
  const logRows = [...(dossier.visualVersionLog ?? [])]
    .reverse()
    .map(
      (e) =>
        `<tr><td>${escHtml(e.versionLabel)}</td><td>${escHtml(e.by)}</td><td>${escHtml(
          new Date(e.at).toLocaleString('ru-RU')
        )}</td><td>${escHtml(e.changeSummary)}</td></tr>`
    )
    .join('');
  const gateSection = gate
    ? `<h2>Обязательный контур визуала (маршрут)</h2>
  <p><strong>Статус:</strong> ${gate.allClear ? 'закрыт' : 'есть открытые пункты'}</p>
  ${
    gate.openMessages.length
      ? `<ul>${gate.openMessages.map((m) => `<li>${escHtml(m)}</li>`).join('')}</ul>`
      : '<p class="muted">Нет открытых пунктов по правилам гейта.</p>'
  }`
    : '';

  const q = payload.visualQuickSummary;
  const quickSection = `<h2>Сводка по визуалу</h2>
  <ul>
    <li><strong>Чеклист менеджера:</strong> ${q.checklistDone} / ${q.checklistTotal}</li>
    <li><strong>Референсы (шт.):</strong> ${q.referenceCount}</li>
    <li><strong>Скетч:</strong> меток ${q.sketchPinTotal}${q.sketchHasSubstrate ? ', подложка есть' : ', подложки нет'}</li>
    <li><strong>Замысел / заметки:</strong> ${q.intentOrNotesFilled ? 'есть' : 'нет'}</li>
    <li><strong>Канон (фото + скетч):</strong> ${q.canonicalPhotoAndSketchSet ? 'выбран' : 'не выбран'}</li>
  </ul>`;

  const refRows = payload.references
    .map((r) => {
      const aspects = (r.takeawayAspects ?? []).map((a) => takeawayAspectLabel(a)).join(', ');
      const note = r.takeawayNote?.trim() ?? '';
      return `<tr><td>${escHtml(r.title || r.refId.slice(0, 8))}</td><td>${escHtml(aspects || '—')}</td><td>${escHtml(
        note || '—'
      )}</td></tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Пакет визуала${sku ? ` · ${escHtml(sku)}` : ''}</title>
  <style>
    body { font-family: system-ui, sans-serif; font-size: 12px; color: #111; margin: 16px; max-width: 720px; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    h2 { font-size: 14px; margin: 16px 0 6px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; vertical-align: top; }
    th { background: #f5f5f5; font-size: 11px; }
    ul { margin: 4px 0; padding-left: 18px; }
    .muted { color: #555; font-size: 11px; }
  </style>
</head>
<body>
  <h1>Пакет визуала (handoff)</h1>
  <p class="muted">Сформировано: ${escHtml(new Date(payload.exportedAt).toLocaleString('ru-RU'))}</p>
  ${sku ? `<p><strong>SKU:</strong> ${escHtml(sku)}</p>` : ''}
  ${name ? `<p><strong>Название:</strong> ${escHtml(name)}</p>` : ''}
  <p><strong>Версия визуала:</strong> ${escHtml(dossier.currentVisualVersionLabel?.trim() || '—')}</p>
  <p><strong>Источник превью паспорта:</strong> ${escHtml(dossier.passportVisualSource ?? '—')}</p>
  <p><strong>Главное фото (refId):</strong> ${escHtml(dossier.canonicalMainPhotoRefId?.slice(0, 12) ?? '—')}…</p>
  <p><strong>Главный скетч:</strong> ${escHtml(canonicalSketchHuman(dossier))}</p>
  <p><strong>Метки:</strong> master ${payload.masterPinCount}, по листам ${payload.sheetPinCountTotal}</p>

  ${quickSection}

  ${gateSection}

  <h2>Замысел</h2>
  <p><strong>Mood:</strong> ${escHtml(dossier.designerIntent?.mood?.trim() || '—')}</p>
  ${intentBullets ? `<ul>${intentBullets}</ul>` : '<p class="muted">Тезисы не заполнены.</p>'}

  <h2>Чеклист готовности (менеджер)</h2>
  <table><thead><tr><th>Пункт</th><th>Готово</th></tr></thead><tbody>${checklistRows}</tbody></table>

  <h2>Референсы (решение, без файлов)</h2>
  <table><thead><tr><th>Название</th><th>Смыслы</th><th>Заметка</th></tr></thead><tbody>${
    refRows || '<tr><td colspan="3">—</td></tr>'
  }</tbody></table>

  <h2>Журнал версий визуала</h2>
  <table><thead><tr><th>Версия</th><th>Кто</th><th>Когда</th><th>Изменения</th></tr></thead><tbody>${
    logRows || '<tr><td colspan="4">—</td></tr>'
  }</tbody></table>
</body>
</html>`;
}
