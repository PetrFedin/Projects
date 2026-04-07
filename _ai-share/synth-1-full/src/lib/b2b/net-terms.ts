/**
 * Net Terms — отсрочка платежа 30/60/90 дней. Стандарт B2B опта в РФ.
 */

export type NetTermId = 'net0' | 'net14' | 'net30' | 'net60' | 'net90';

export interface NetTerm {
  id: NetTermId;
  days: number;
  label: string;
  labelRu: string;
}

const NET_TERMS: NetTerm[] = [
  { id: 'net0', days: 0, label: 'Prepay', labelRu: 'Предоплата' },
  { id: 'net14', days: 14, label: 'Net 14', labelRu: '14 дней' },
  { id: 'net30', days: 30, label: 'Net 30', labelRu: '30 дней' },
  { id: 'net60', days: 60, label: 'Net 60', labelRu: '60 дней' },
  { id: 'net90', days: 90, label: 'Net 90', labelRu: '90 дней' },
];

export function getNetTerms(): NetTerm[] {
  return NET_TERMS;
}

export function getNetTermById(id: NetTermId | string): NetTerm | undefined {
  return NET_TERMS.find((t) => t.id === id);
}

export function getNetTermByDays(days: number): NetTerm | undefined {
  return NET_TERMS.find((t) => t.days === days);
}

export function formatDueDate(createdAt: string, netTermDays: number): string {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + netTermDays);
  return d.toISOString().slice(0, 10);
}
