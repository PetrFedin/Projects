import type {
  Workshop2CategorySketchCompliance,
  Workshop2DossierSignoffMeta,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchPinThreadComment,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { buildSketchQrDataUrl } from '@/lib/production/sketch-qr-infra';

const TYPE_RU: Record<string, string> = {
  construction: 'Конструкция',
  material: 'Материал',
  fit: 'Посадка',
  finishing: 'Обработка',
  hardware: 'Фурнитура',
  labeling: 'Маркировка',
  qc: 'ОТК',
};

const PRIORITY_RU: Record<string, string> = {
  critical: 'Критично',
  important: 'Важно',
  note: 'Заметка',
};

const STAGE_RU: Record<string, string> = {
  tz: 'ТЗ',
  sample: 'Образец',
  prelaunch: 'Предзапуск',
  release: 'Выпуск',
  qc: 'ОТК',
};

/**
 * Двухстраничный лист передачи в цех: доска + таблица-легенда, ревизия, комплаенс, QR.
 */
function threadExcerpt(
  comments: Workshop2SketchPinThreadComment[] | undefined,
  max: number
): string {
  if (!comments?.length) return '—';
  const tail = [...comments].slice(-max);
  return tail
    .map(
      (c) => `${(c.by ?? '').trim()}: ${(c.body ?? '').trim().replace(/\s+/g, ' ').slice(0, 100)}`
    )
    .join(' | ');
}

export async function openSketchHandoffPackagePrint(opts: {
  title: string;
  sku: string;
  pathLabel: string;
  revisionLabel?: string;
  freezeUntilDate?: string;
  productionApproved?: Workshop2DossierSignoffMeta;
  compliance?: Workshop2CategorySketchCompliance;
  imageDataUrl?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  leafId: string;
  pageUrl?: string;
  /** Сцена + вид листа (печать), чтобы на бумаге не путали ракурсы. */
  sceneCaption?: string;
  /** Таблица BOM / MES / фрагмент треда для PLM и цеха. */
  includePlmAppendix?: boolean;
  /** Сколько последних сообщений треда включать в ячейку (на метку). */
  threadExcerptLines?: number;
}): Promise<void> {
  const own = opts.annotations.filter((a) => a.categoryLeafId === opts.leafId);
  const qrSrc = opts.pageUrl?.trim()
    ? ((await buildSketchQrDataUrl(opts.pageUrl.trim())) ?? '')
    : '';

  const pinsHtml = own
    .map((a, idx) => {
      const cls = a.priority === 'critical' ? 'critical' : a.stage === 'qc' ? 'qc' : 'norm';
      return `<div class="pin ${cls}" style="left:${a.xPct}%;top:${a.yPct}%"><span>${idx + 1}</span></div>`;
    })
    .join('');

  const bgStyle = opts.imageDataUrl
    ? `background-image:url(${opts.imageDataUrl});background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#fff;`
    : 'background:#e2e8f0;';

  const rows = own
    .map((a, idx) => {
      const text = escapeHtml((a.text ?? '').trim().slice(0, 200));
      const links = [
        a.linkedAttributeId ? `атр:${a.linkedAttributeId.slice(0, 8)}` : '',
        a.linkedTaskId ? `слот` : '',
        a.linkedQcZoneId ? `ОТК` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      return `<tr>
        <td>${idx + 1}</td>
        <td>${TYPE_RU[a.annotationType ?? 'construction'] ?? a.annotationType ?? '—'}</td>
        <td>${PRIORITY_RU[a.priority ?? 'important'] ?? '—'}</td>
        <td>${STAGE_RU[a.stage ?? 'tz'] ?? '—'}</td>
        <td class="t">${text || '—'}</td>
        <td>${escapeHtml(links || '—')}</td>
      </tr>`;
    })
    .join('');

  const rev = opts.revisionLabel?.trim()
    ? `<p><strong>Ревизия скетча:</strong> ${escapeHtml(opts.revisionLabel.trim())}</p>`
    : '';
  const fr = opts.freezeUntilDate?.trim()
    ? `<p><strong>Заморозка до:</strong> ${escapeHtml(opts.freezeUntilDate.trim())}</p>`
    : '';
  const appr = opts.productionApproved
    ? `<p><strong>Утверждено для производства:</strong> ${escapeHtml(opts.productionApproved.by)} · ${escapeHtml(opts.productionApproved.at)}</p>`
    : '';
  const c = opts.compliance;
  const comp =
    c && (c.approvedReferenceUrl || c.patternPackVersion || c.sampleAcceptanceActRef)
      ? `<div class="box"><strong>Комплаенс</strong>
        ${c.approvedReferenceUrl ? `<p>Референс: ${escapeHtml(c.approvedReferenceUrl)}</p>` : ''}
        ${c.patternPackVersion ? `<p>Версия лекал / пакета: ${escapeHtml(c.patternPackVersion)}</p>` : ''}
        ${c.sampleAcceptanceActRef ? `<p>Акт образца: ${escapeHtml(c.sampleAcceptanceActRef)}</p>` : ''}
        </div>`
      : '';

  const sceneLine = opts.sceneCaption?.trim()
    ? `<p><strong>Сцена / вид:</strong> ${escapeHtml(opts.sceneCaption.trim())}</p>`
    : '';
  const threadN = Math.min(6, Math.max(1, opts.threadExcerptLines ?? 2));
  const plmRows = opts.includePlmAppendix
    ? own
        .map((a, idx) => {
          const bom = escapeHtml((a.linkedBomLineRef ?? '').trim() || '—');
          const mat = escapeHtml((a.linkedMaterialNote ?? '').trim().slice(0, 80) || '—');
          const mes = escapeHtml((a.mesDefectCode ?? '').trim() || '—');
          const sh = escapeHtml((a.mesShiftId ?? '').trim() || '—');
          const thr = escapeHtml(threadExcerpt(a.sketchPinComments, threadN));
          return `<tr>
          <td class="num">${idx + 1}</td>
          <td class="t">${bom}</td>
          <td class="t">${mat}</td>
          <td>${mes}</td>
          <td>${sh}</td>
          <td class="t">${thr}</td>
        </tr>`;
        })
        .join('')
    : '';
  const plmSection = opts.includePlmAppendix
    ? `<h2>Приложение PLM / MES</h2>
<table><thead><tr><th class="num">№</th><th>BOM ref</th><th>Материал (текст)</th><th>Код MES</th><th>Смена</th><th>Тред (последние реплики)</th></tr></thead><tbody>${plmRows || '<tr><td colspan="6">Нет меток</td></tr>'}</tbody></table>
<p class="note">Коды и смена — как в экспорте CSV / webhook для согласованности с MES.</p>`
    : '';

  const html = `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"/><title>${escapeHtml(opts.title)} — передача</title>
<style>
@page { size: A4; margin: 12mm 14mm; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #111827; font-size: 9.5pt; line-height: 1.35; background: #fff; }
.page-break { page-break-after: always; }
.sheet { border-top: 3pt solid #111827; padding-top: 10pt; max-width: 180mm; margin: 0 auto; }
.brand { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4b5563; margin: 0 0 6pt; }
.doc-h1 { font-size: 13pt; font-weight: 700; margin: 0 0 8pt; letter-spacing: -0.02em; }
.head-row { display: flex; justify-content: space-between; gap: 12pt; align-items: flex-start; margin-bottom: 10pt; padding-bottom: 8pt; border-bottom: 0.5pt solid #9ca3af; }
.meta { font-size: 9pt; color: #374151; }
.meta p { margin: 0 0 3pt; }
.board-wrap { position: relative; width: 100%; aspect-ratio: 4/3; border: 0.75pt solid #111827; overflow: hidden; background: #f3f4f6; ${bgStyle} }
.pin { position: absolute; width: 22pt; height: 22pt; margin-left: -11pt; margin-top: -11pt; border-radius: 50%; border: 1.5pt solid #fff; display: flex; align-items: center; justify-content: center; background: #f9fafb; color: #111827; font-family: ui-monospace, monospace; font-weight: 700; font-size: 9pt; }
.pin.critical { box-shadow: 0 0 0 2pt #be123c; }
.pin.qc { box-shadow: 0 0 0 2pt #b45309; }
.pin.norm { box-shadow: 0 0 0 1.5pt #6b7280; }
.qr { width: 48pt; height: 48pt; flex-shrink: 0; border: 0.5pt solid #d1d5db; padding: 2pt; }
.box { margin-top: 10pt; padding: 8pt; border: 0.5pt solid #d1d5db; background: #f9fafb; font-size: 9pt; }
.box strong { display: block; margin-bottom: 4pt; font-size: 8pt; letter-spacing: 0.06em; text-transform: uppercase; color: #374151; }
h2 { font-size: 11pt; font-weight: 700; margin: 0 0 8pt; letter-spacing: -0.01em; }
table { width: 100%; border-collapse: collapse; font-size: 8pt; }
th, td { border: 0.5pt solid #6b7280; padding: 5pt 6pt; text-align: left; vertical-align: top; }
th { background: #e5e7eb; font-weight: 700; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.04em; color: #1f2937; }
td.t { max-width: 52mm; word-break: break-word; }
.num { font-family: ui-monospace, monospace; font-weight: 700; text-align: center; width: 8mm; }
footer { margin-top: 8pt; font-size: 7.5pt; color: #6b7280; border-top: 0.5pt solid #e5e7eb; padding-top: 6pt; }
.note { margin-top: 8pt; font-size: 8pt; color: #4b5563; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<section class="sheet">
<p class="brand">Лист передачи в производство</p>
<div class="head-row">
  <div>
    <h1 class="doc-h1">${escapeHtml(opts.title)}</h1>
    <div class="meta">
      <p><strong>SKU</strong> ${escapeHtml(opts.sku)}</p>
      <p>${escapeHtml(opts.pathLabel)}</p>
    </div>
    ${rev}${fr}${appr}${sceneLine}
  </div>
  ${qrSrc ? `<img class="qr" src="${escapeAttr(qrSrc)}" alt=""/>` : ''}
</div>
<div class="board-wrap">${pinsHtml}</div>
${comp}
${opts.pageUrl?.trim() ? `<footer>Электронная ссылка: ${escapeHtml(opts.pageUrl.trim())}</footer>` : ''}
</section>
<div class="page-break"></div>
<section class="sheet">
<h2>Легенда меток</h2>
<table><thead><tr><th class="num">№</th><th>Тип</th><th>Приоритет</th><th>Этап</th><th>Текст</th><th>Связи</th></tr></thead><tbody>${rows || '<tr><td colspan="6">Нет меток</td></tr>'}</tbody></table>
<p class="note">Обозначение приоритета на доске: красное кольцо — критично; янтарное — этап ОТК; серое — прочее.</p>
</section>
${plmSection ? `<div class="page-break"></div><section class="sheet">${plmSection}</section>` : ''}
<script>window.onload=function(){window.print();};</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
