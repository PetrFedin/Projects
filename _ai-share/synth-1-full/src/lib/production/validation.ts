/**
 * Production validation logic — pure functions for unit tests
 */

export interface CollectionFormStep1 {
  name: string;
  deadline: string;
}

export interface CollectionFormStep2 {
  dropName: string;
  dropDate: string;
  drops: Array<{ name: string; date: string }>;
}

export interface CollectionFormStep3 {
  materials: number;
  sewing: number;
  logistics: number;
}

export interface SampleForPO {
  skuId: string;
  skuName: string;
  collection: string;
  status: string;
  approved: boolean;
}

/** Validate collection step 1: name, deadline */
export function validateCollectionStep1(
  form: CollectionFormStep1,
  existingNames: string[] = []
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name?.trim()) {
    errors.name = 'Введите название';
  } else if (existingNames.some((n) => n.toLowerCase() === form.name.trim().toLowerCase())) {
    errors.name = 'Коллекция с таким названием уже есть';
  }
  if (form.deadline && isNaN(Date.parse(form.deadline))) {
    errors.deadline = 'Некорректная дата';
  }
  return errors;
}

/** Validate collection step 2: at least one drop */
export function validateCollectionStep2(form: CollectionFormStep2): Record<string, string> {
  const errors: Record<string, string> = {};
  const drops =
    form.drops?.length > 0
      ? form.drops
      : form.dropName && form.dropDate
        ? [{ name: form.dropName, date: form.dropDate }]
        : [];
  if (drops.length === 0) {
    errors.dropName = 'Добавьте хотя бы один Drop';
  } else {
    drops.forEach((d, i) => {
      if (!d.name?.trim()) errors[`drop_${i}`] = 'Название';
      if (d.date && isNaN(Date.parse(d.date))) errors[`dropdate_${i}`] = 'Дата';
    });
  }
  return errors;
}

/** Validate collection step 3: budget */
export function validateCollectionStep3(form: CollectionFormStep3): Record<string, string> {
  const errors: Record<string, string> = {};
  const total = form.materials + form.sewing + form.logistics;
  if (total <= 0) {
    errors.budget = 'Укажите хотя бы одну сумму';
  }
  if (form.materials < 0 || form.sewing < 0 || form.logistics < 0) {
    errors.budget = 'Суммы не могут быть отрицательными';
  }
  return errors;
}

/** Can create PO: approved samples + materials ok */
export function canCreatePOFromSamples(
  approvedSamples: SampleForPO[],
  materialsOk: boolean
): boolean {
  return approvedSamples.length > 0 && materialsOk;
}

/** Generate collection ID from name */
export function collectionIdFromName(name: string): string {
  return (name || 'NEW')
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/** Format budget for display */
export function formatBudget(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  return String(v);
}

/** Can approve sample (for PO gate): status must be approved */
export function canOrderPOForSample(status: string): boolean {
  return status === 'approved';
}
