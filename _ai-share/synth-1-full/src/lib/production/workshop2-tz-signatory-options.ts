/**
 * Кандидаты для закрепления подписей ТЗ: сотрудники бренда и связанных организаций (партнёры).
 * Демо-данные из `team-data`; при появлении API список заменяется без смены контракта досье.
 */
import { organizations, partnerTeams } from '@/components/team/_fixtures/team-data';
import type { TeamMember } from '@/lib/types';
import type {
  Workshop2TzPerRoleStageFlags,
  Workshop2TzSignatoryBindings,
  Workshop2TzSignatoryExtraRow,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID = 'org-brand-001';

export type WorkshopTzSignatoryPickerOption = {
  value: string;
  label: string;
  sublabel?: string;
  group: string;
};

function memberLabel(m: TeamMember): string {
  const a = `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim();
  return a || m.email || m.id;
}

function pushOrgMembers(
  orgId: string,
  groupTitle: string,
  out: WorkshopTzSignatoryPickerOption[],
  seen: Set<string>
): void {
  const list = partnerTeams[orgId];
  if (!list?.length) return;
  for (const m of list) {
    const label = memberLabel(m);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push({
      value: label,
      label,
      sublabel: m.role,
      group: groupTitle,
    });
  }
}

/** Список для выпадающих полей при создании артикула. */
export function getWorkshopTzSignatoryPickerOptions(
  brandOrgId: string = WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID
): WorkshopTzSignatoryPickerOption[] {
  const out: WorkshopTzSignatoryPickerOption[] = [];
  const seen = new Set<string>();
  const brand = organizations[brandOrgId];
  const brandName = brand?.name ?? 'Бренд';
  pushOrgMembers(brandOrgId, `Команда · ${brandName}`, out, seen);
  const linked = brand?.linkedPartners ?? [];
  for (const pid of linked) {
    const po = organizations[pid];
    const title = po ? `Партнёр · ${po.name}` : `Партнёр · ${pid}`;
    pushOrgMembers(pid, title, out, seen);
  }
  return out.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
}

/** Нормализация для сравнения с `updatedByLabel` / `displayName`. */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Разрешена ли подпись от имени `actorLabel`, если закреплено за `designatedLabel`.
 * Пустое `designatedLabel` — без закрепления (достаточно права роли).
 */
export function workshopTzSignerAllowed(
  actorLabel: string,
  designatedLabel?: string | null
): boolean {
  const d = designatedLabel?.trim();
  if (!d) return true;
  const a = norm(actorLabel);
  const dn = norm(d);
  if (!a || !dn) return false;
  if (a === dn) return true;
  if (a.includes(dn) || dn.includes(a)) return true;
  return false;
}

/** Порядок этапов маршрута для флагов участия / подписи. */
export const WORKSHOP2_TZ_SIGNOFF_STAGE_IDS: readonly Workshop2TzSignoffStageId[] = [
  'tz',
  'sample',
  'supply',
  'fit',
  'plan',
  'release',
  'qc',
];

/** Короткие подписи этапов (паспорт ↔ разделы досье). */
export const WORKSHOP2_TZ_STAGE_LABEL_RU: Record<Workshop2TzSignoffStageId, string> = {
  tz: 'ТЗ',
  sample: 'Образец',
  supply: 'Снабжение',
  fit: 'Посадка',
  plan: 'План',
  release: 'Выпуск',
  qc: 'ОТК',
};

/** Текст про отмеченные в паспорте этапы для одной роли (глобальная цифровая подпись). */
export function workshopTzRoleStageSummaryRu(
  flags: Workshop2TzPerRoleStageFlags | undefined
): string {
  const explicit = normalizeStageFlags(flags);
  if (!explicit) return 'все этапы';
  const on = WORKSHOP2_TZ_SIGNOFF_STAGE_IDS.filter((id) =>
    workshopTzParticipatesOnStage(flags, id)
  );
  if (on.length === WORKSHOP2_TZ_SIGNOFF_STAGE_IDS.length) return 'все этапы';
  if (on.length === 0) return 'этапы сняты';
  return on.map((id) => WORKSHOP2_TZ_STAGE_LABEL_RU[id]).join(', ');
}

function normalizeStageFlags(
  f?: Workshop2TzPerRoleStageFlags | null
): Workshop2TzPerRoleStageFlags | undefined {
  if (!f || typeof f !== 'object') return undefined;
  const out: Workshop2TzPerRoleStageFlags = {};
  for (const k of WORKSHOP2_TZ_SIGNOFF_STAGE_IDS) {
    if (f[k] === false) out[k] = false;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Участник отмечен на этапе (по умолчанию — да, если явно не снято). */
export function workshopTzParticipatesOnStage(
  flags: Workshop2TzPerRoleStageFlags | undefined,
  stage: Workshop2TzSignoffStageId
): boolean {
  return flags?.[stage] !== false;
}

export function workshopTzSelectedStageIds(
  flags: Workshop2TzPerRoleStageFlags | undefined,
  order: readonly Workshop2TzSignoffStageId[] = WORKSHOP2_TZ_SIGNOFF_STAGE_IDS
): Workshop2TzSignoffStageId[] {
  return order.filter((id) => workshopTzParticipatesOnStage(flags, id));
}

export function workshopTzSignStagesFromSelection(
  selected: readonly Workshop2TzSignoffStageId[],
  order: readonly Workshop2TzSignoffStageId[] = WORKSHOP2_TZ_SIGNOFF_STAGE_IDS
): Workshop2TzPerRoleStageFlags | undefined {
  const sel = new Set(selected);
  const allOn = order.every((id) => sel.has(id));
  if (allOn) return undefined;
  const next: Workshop2TzPerRoleStageFlags = {};
  for (const id of order) {
    if (!sel.has(id)) next[id] = false;
  }
  return next;
}

/** Совпадение ФИО в паспорте и в списке подписантов (без регистра, допускает частичное вхождение). */
export function workshopTzLabelsMatch(a: string, b: string): boolean {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.includes(nb) || nb.includes(na);
}

/** Кто из закреплённых должен участвовать в подписи на указанном этапе. */
export function workshopTzStageExpectedSigners(
  bindings: Workshop2TzSignatoryBindings | undefined,
  stage: Workshop2TzSignoffStageId
): { role: string; name: string }[] {
  if (!bindings) return [];
  const out: { role: string; name: string }[] = [];
  const push = (
    role: string,
    name: string | undefined,
    flags: Workshop2TzPerRoleStageFlags | undefined
  ) => {
    const n = name?.trim();
    if (!n) return;
    if (!workshopTzParticipatesOnStage(flags, stage)) return;
    out.push({ role, name: n });
  };
  push('Дизайн', bindings.designerDisplayLabel, bindings.designerSignStages);
  push('Технолог', bindings.technologistDisplayLabel, bindings.technologistSignStages);
  push('Менеджер', bindings.managerDisplayLabel, bindings.managerSignStages);
  for (const ex of bindings.extraAssigneeRows ?? []) {
    push(ex.roleTitle || 'Роль', ex.assigneeDisplayLabel, ex.signStages);
  }
  return out;
}

/**
 * Готовые доп. роли паспорта (не дублируют слоты дизайнер / технолог / менеджер).
 * По умолчанию без участия в цифровой подписи на этапе «ТЗ» — включите этап в паспорте при необходимости.
 */
export const WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS = [
  {
    id: 'product',
    roleTitle: 'Продакт',
    signStages: { tz: false } as Workshop2TzPerRoleStageFlags,
  },
  {
    id: 'supply',
    roleTitle: 'Снабжение',
    signStages: { tz: false } as Workshop2TzPerRoleStageFlags,
  },
  { id: 'qc', roleTitle: 'ОТК', signStages: { tz: false } as Workshop2TzPerRoleStageFlags },
  {
    id: 'marking',
    roleTitle: 'Маркировка',
    signStages: { tz: false } as Workshop2TzPerRoleStageFlags,
  },
  {
    id: 'production_contact',
    roleTitle: 'Производственный контакт',
    signStages: { tz: false } as Workshop2TzPerRoleStageFlags,
  },
] as const;

export type Workshop2TzExtraRolePresetId =
  (typeof WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS)[number]['id'];

/** Кнопки в UI: короткая подпись; полное имя роли — в `roleTitle` строки досье. */
export const WORKSHOP2_TZ_EXTRA_ROLE_PRESET_BUTTON_LABEL_RU: Record<
  Workshop2TzExtraRolePresetId,
  string
> = {
  product: 'Продакт',
  supply: 'Снабжение',
  qc: 'ОТК',
  marking: 'Маркировка',
  production_contact: 'Произв. контакт',
};

export function workshop2TzExtraRowFromPreset(
  presetId: Workshop2TzExtraRolePresetId
): Workshop2TzSignatoryExtraRow {
  const def = WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS.find((d) => d.id === presetId);
  if (!def) {
    throw new Error(`Unknown TZ extra role preset: ${String(presetId)}`);
  }
  return {
    rowId: `w2-tz-extra-${def.id}-${Date.now().toString(36)}`,
    roleTitle: def.roleTitle,
    signStages: { ...def.signStages },
  };
}

function normalizeExtraRows(
  rows?: Workshop2TzSignatoryExtraRow[] | null
): Workshop2TzSignatoryExtraRow[] | undefined {
  if (!Array.isArray(rows) || !rows.length) return undefined;
  const out: Workshop2TzSignatoryExtraRow[] = [];
  for (const r of rows) {
    const rowId = r.rowId?.trim();
    if (!rowId) continue;
    const roleTitle = r.roleTitle?.trim() || 'Роль';
    const assignee = r.assigneeDisplayLabel?.trim();
    const stages = normalizeStageFlags(r.signStages);
    out.push({
      rowId,
      roleTitle,
      ...(assignee ? { assigneeDisplayLabel: assignee } : {}),
      ...(stages ? { signStages: stages } : {}),
    });
  }
  return out.length ? out : undefined;
}

/** Доп. роли с закреплённым исполнителем и участием на этапе «ТЗ» — нужна строка подписи в досье. */
export function workshopTzExtraRowsRequiringTzSignoff(
  bindings: Workshop2TzSignatoryBindings | undefined
): Workshop2TzSignatoryExtraRow[] {
  return (bindings?.extraAssigneeRows ?? []).filter(
    (ex) =>
      Boolean(ex.assigneeDisplayLabel?.trim()) && workshopTzParticipatesOnStage(ex.signStages, 'tz')
  );
}

/** Нужна ли цифровая подпись ТЗ для роли (этап tz; по умолчанию да). */
export function workshopTzSignoffRequiredForRole(
  bindings: Workshop2TzSignatoryBindings | undefined,
  role: 'designer' | 'technologist' | 'manager'
): boolean {
  const flags =
    role === 'designer'
      ? bindings?.designerSignStages
      : role === 'technologist'
        ? bindings?.technologistSignStages
        : bindings?.managerSignStages;
  return flags?.tz !== false;
}

export function normalizeWorkshopTzSignatoryBindings(
  b?: Workshop2TzSignatoryBindings | null
): Workshop2TzSignatoryBindings | undefined {
  if (!b) return undefined;
  const out: Workshop2TzSignatoryBindings = {};
  if (b.designerDisplayLabel?.trim()) out.designerDisplayLabel = b.designerDisplayLabel.trim();
  if (b.technologistDisplayLabel?.trim())
    out.technologistDisplayLabel = b.technologistDisplayLabel.trim();
  if (b.managerDisplayLabel?.trim()) out.managerDisplayLabel = b.managerDisplayLabel.trim();
  const ds = normalizeStageFlags(b.designerSignStages);
  const ts = normalizeStageFlags(b.technologistSignStages);
  const ms = normalizeStageFlags(b.managerSignStages);
  if (ds) out.designerSignStages = ds;
  if (ts) out.technologistSignStages = ts;
  if (ms) out.managerSignStages = ms;
  const extras = normalizeExtraRows(b.extraAssigneeRows);
  if (extras) out.extraAssigneeRows = extras;
  return Object.keys(out).length ? out : undefined;
}
