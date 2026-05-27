import {
  calculateDossierReadiness,
  type DossierSection,
} from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';

/** Вкладки маршрута артикула (не «ТЗ» и не «Обзор»). */
export const WORKSHOP2_OPERATIONAL_PIPELINE_TABS = [
  'supply',
  'fit',
  'plan',
  'release',
  'qc',
  'stock',
  'vault',
] as const;
export type Workshop2OperationalPipelineTab = (typeof WORKSHOP2_OPERATIONAL_PIPELINE_TABS)[number];

/** Разделы ТЗ, от которых в первую очередь зависит вкладка (для % и предупреждений). */
export const TAB_SOURCE_SECTIONS: Record<
  Workshop2OperationalPipelineTab,
  readonly DossierSection[]
> = {
  supply: ['material', 'general'],
  fit: ['construction', 'measurements', 'visuals'],
  plan: ['assignment', 'material', 'b2b_sales'],
  release: ['assignment', 'construction'],
  qc: ['construction', 'material'],
  stock: ['sample_intake', 'packaging', 'general'],
  vault: ['general'],
};

const TAB_CONTRACT: Record<Workshop2OperationalPipelineTab, string> = {
  supply:
    'Канон: материалы, состав и паспорт в ТЗ. Здесь — исполнение: BOM в закупке, брони и сроки.',
  fit: 'Канон: табель мер, визуал и конструкция в ТЗ. Здесь — сессии примерки, дельты и эталон.',
  plan: 'Канон: «Задание» и материальная увязка в ТЗ. Здесь — PO, вложенность и календарь (T&A).',
  release: 'Канон: переданное задание и конструкция. Здесь — техпроцесс, SASH и выпуск партии.',
  qc: 'Канон: требования из материалов и конструкции. Здесь — партии, AQL и фиксация брака.',
  stock:
    'Канон: приёмка сэмпла и упаковка в ТЗ. Здесь — складские движения, остатки и факт прихода.',
  vault: 'Канон: паспорт и реквизиты. Здесь — финансовые и юридические документы.',
};

function avgPct(
  sections: readonly DossierSection[],
  getter: (s: DossierSection) => number
): number {
  if (sections.length === 0) return 0;
  return Math.round(sections.reduce((a, s) => a + getter(s), 0) / sections.length);
}

export function buildWorkshop2OperationalTzBridge(
  tab: Workshop2OperationalPipelineTab,
  dossier: Workshop2DossierPhase1 | null,
  leaf: HandbookCategoryLeaf | null | undefined
): {
  contractLine: string;
  overallLine: string;
  focusPctLabel: string;
  blockerLines: string[];
} {
  const contractLine = TAB_CONTRACT[tab];

  if (!dossier) {
    return {
      contractLine,
      overallLine:
        'Досье ТЗ в этой сессии не загружено — откройте вкладку «Техническое задание» и сохраните карточку.',
      focusPctLabel: '—',
      blockerLines: ['Нет локального досье: проверьте, что артикул открыт после сохранения ТЗ.'],
    };
  }

  const r = calculateDossierReadiness(dossier, leaf ?? null);
  const secs = TAB_SOURCE_SECTIONS[tab];
  const pct = avgPct(secs, (s) => r.sections[s]?.pct ?? 0);
  const warnings = secs.flatMap((s) => r.sections[s]?.warnings ?? []);
  const dedup = [...new Set(warnings)].slice(0, 8);

  const pulse = getWorkshop2ReadinessSnapshot({ dossier, leaf: leaf ?? null });
  const dev = dossier.articleDevelopmentStateMirror;

  const handoffLine = dev
    ? `critical path: ${dev.criticalPathReady ? 'готов' : 'не готов'} · ${dev.hintRu ?? ''}`
    : `ворота передачи: ${r.overall.readyForHandoff ? 'пройдены' : 'не пройдены'}`;

  return {
    contractLine,
    overallLine: `Готовность ТЗ ${pulse.tzOverallPct}% · пульс ${pulse.preflightScore} · ${handoffLine}`,
    focusPctLabel: `Связанные разделы ТЗ (среднее): ${pct}% · единый % ТЗ: ${pulse.tzOverallPct}%`,
    blockerLines: dedup,
  };
}

/** Параметр `w2sec` для перехода на релевантную секцию ТЗ. */
export function workshop2OperationalTabToTzW2Sec(tab: Workshop2OperationalPipelineTab): string {
  const map: Record<Workshop2OperationalPipelineTab, string> = {
    supply: 'material',
    fit: 'construction',
    plan: 'assignment',
    release: 'assignment',
    qc: 'construction',
    stock: 'general',
    vault: 'general',
  };
  return map[tab];
}
