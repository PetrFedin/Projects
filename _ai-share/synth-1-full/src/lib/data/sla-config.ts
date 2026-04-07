/**
 * SLA конфигурация по этапам производства
 * Дни на этап — для расчёта просрочек и уведомлений
 */
export const SLA_STAGES = {
  Proto1: { days: 7, label: 'Proto 1' },
  Proto2: { days: 5, label: 'Proto 2' },
  SMS: { days: 3, label: 'Salesman Sample' },
  PP: { days: 10, label: 'Pre-Production' },
  SizeSet: { days: 14, label: 'Size Set' },
  TOP: { days: 5, label: 'Top of Production' },
} as const;

export type SlaStageKey = keyof typeof SLA_STAGES;

export function getSlaDays(stage: string): number {
  return SLA_STAGES[stage as SlaStageKey]?.days ?? 5;
}

export function isOverdue(dueDate: string | null, stage: string): boolean {
  if (!dueDate) return false;
  const d = parseDate(dueDate);
  if (!d) return false;
  return d < new Date();
}

function parseDate(s: string): Date | null {
  // Поддержка форматов: 2026-03-15, 15.03.2026, 15/03/2026
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  const m2 = s.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (m2) return new Date(parseInt(m2[3]), parseInt(m2[2]) - 1, parseInt(m2[1]));
  return null;
}
