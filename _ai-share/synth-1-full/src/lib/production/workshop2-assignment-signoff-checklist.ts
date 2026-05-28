/**
 * Чеклист задания: подписи секций ТЗ + ворота assignment.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2TzSectionFullySignedWithPassport,
  workshop2TzSignoffMetaIsCommitted,
} from '@/lib/production/workshop2-tz-signoff-complete';
import { resolveWorkshop2TechPackHandoffChecklistRow } from '@/lib/production/workshop2-tech-pack-handoff-resolve';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

const ASSIGNMENT_SIGNOFF_SECTIONS: readonly Workshop2TzSignoffSectionKey[] = [
  'general',
  'material',
  'construction',
  'visuals',
];

export type Workshop2AssignmentSignoffRow = {
  section: Workshop2TzSignoffSectionKey;
  labelRu: string;
  signed: boolean;
};

export type Workshop2AssignmentSignoffChecklistSummary = {
  sectionsSigned: number;
  sectionsTotal: number;
  assignmentSectionSigned: boolean;
  handoffBrandDispatched: boolean;
  handoffFactoryReceived: boolean;
  rows: Workshop2AssignmentSignoffRow[];
  state: 'blocked' | 'partial' | 'ready';
  hintRu?: string;
};

const SECTION_LABEL_RU: Record<Workshop2TzSignoffSectionKey, string> = {
  general: 'Паспорт',
  material: 'Материалы',
  construction: 'Конструкция',
  visuals: 'Визуал',
  assignment: 'Задание',
};

export function summarizeWorkshop2AssignmentSignoffChecklist(
  dossier: Workshop2DossierPhase1 | null | undefined
): Workshop2AssignmentSignoffChecklistSummary | null {
  if (!dossier) return null;

  const signoffs = dossier.sectionSignoffs;
  const rows: Workshop2AssignmentSignoffRow[] = ASSIGNMENT_SIGNOFF_SECTIONS.map((section) => ({
    section,
    labelRu: SECTION_LABEL_RU[section],
    signed: isWorkshop2TzSectionFullySignedWithPassport(section, signoffs, dossier),
  }));

  const sectionsSigned = rows.filter((r) => r.signed).length;
  const assignmentSectionSigned =
    isWorkshop2TzSectionFullySignedWithPassport('assignment', signoffs, dossier) ||
    workshop2TzSignoffMetaIsCommitted(signoffs?.assignment?.brand);

  const lastHandoff = resolveWorkshop2TechPackHandoffChecklistRow(dossier.techPackFactoryHandoffs);
  const handoffBrandDispatched = Boolean(lastHandoff?.brandDispatchedAt);
  const handoffFactoryReceived = Boolean(lastHandoff?.factoryReceivedAt);

  let state: Workshop2AssignmentSignoffChecklistSummary['state'] = 'blocked';
  if (
    sectionsSigned >= 4 &&
    assignmentSectionSigned &&
    handoffBrandDispatched &&
    handoffFactoryReceived
  ) {
    state = 'ready';
  } else if (sectionsSigned > 0 || assignmentSectionSigned) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  const missing = rows.filter((r) => !r.signed).map((r) => r.labelRu);
  if (missing.length > 0) {
    hintRu = `Не подписаны секции: ${missing.join(', ')}.`;
  } else if (!assignmentSectionSigned) {
    hintRu = 'Четыре секции подписаны — подтвердите чеклист на вкладке «Задание».';
  } else if (!handoffBrandDispatched) {
    hintRu = 'Подписи есть — отметьте передачу бренда в блоке handoff.';
  } else if (!handoffFactoryReceived) {
    hintRu = 'Бренд передал пакет — дождитесь ACK цеха (stub ERP/MES).';
  }

  return {
    sectionsSigned,
    sectionsTotal: ASSIGNMENT_SIGNOFF_SECTIONS.length,
    assignmentSectionSigned,
    handoffBrandDispatched,
    handoffFactoryReceived,
    rows,
    state,
    hintRu,
  };
}
