/**
 * Логистика образца: этапы цепочки, роли участников, подписи для UI и journal.
 */
import type { Workshop2LogisticsShipment } from '@/lib/server/workshop2-logistics-repository';

export const WORKSHOP2_LOGISTICS_STEPS = [
  { id: 'factory', label: 'Производство', sublabel: 'Фабрика / Бишкек', icon: 'factory' as const },
  { id: 'truck_load', label: 'Погрузка', sublabel: 'Фура / экспедитор', icon: 'truck' as const },
  { id: 'transit', label: 'Перевозка', sublabel: 'В пути (авто)', icon: 'route' as const },
  { id: 'customs', label: 'Таможня', sublabel: 'ЕАЭС / декларант', icon: 'customs' as const },
  { id: 'warehouse', label: 'Склад', sublabel: 'Приёмка / Москва', icon: 'warehouse' as const },
] as const;

export type Workshop2LogisticsStepId = (typeof WORKSHOP2_LOGISTICS_STEPS)[number]['id'];

export type Workshop2LogisticsActorRole =
  | 'brand_logist'
  | 'brand_prod'
  | 'supplier'
  | 'carrier_tms'
  | 'partner';

export const WORKSHOP2_LOGISTICS_ACTOR_LABELS_RU: Record<Workshop2LogisticsActorRole, string> = {
  brand_logist: 'Логист бренда',
  brand_prod: 'Продакшн-менеджер',
  supplier: 'Поставщик / фабрика',
  carrier_tms: 'TMS / перевозчик (API)',
  partner: 'Партнёр / 3PL',
};

export const WORKSHOP2_LOGISTICS_SYNC_LABELS_RU = {
  manual: 'Вручную в кабинете',
  tms: 'Синхронизация TMS',
  partner_portal: 'Портал партнёра',
} as const;

export type Workshop2LogisticsAddressBookEntry = {
  id: string;
  label: string;
  address: string;
  company?: string;
  contactName?: string;
  contactPhone?: string;
};

export type Workshop2LogisticsPrefs = {
  addressBook: Workshop2LogisticsAddressBookEntry[];
  defaultOriginId?: string;
  defaultDestinationId?: string;
};

export function workshop2LogisticsStepIndex(stepId?: string): number {
  const idx = WORKSHOP2_LOGISTICS_STEPS.findIndex((s) => s.id === stepId);
  return idx >= 0 ? idx : 0;
}

export function workshop2LogisticsStepLabel(stepId?: string): string {
  const step = WORKSHOP2_LOGISTICS_STEPS.find((s) => s.id === stepId);
  return step ? `${step.label} · ${step.sublabel}` : '—';
}

export function workshop2LogisticsStatusLabel(
  status?: Workshop2LogisticsShipment['status'],
  stepId?: string
): string {
  if (status === 'delivered' || stepId === 'warehouse') return 'Прибыло на склад';
  if (status === 'cancelled') return 'Отменено';
  if (status === 'draft') return 'Черновик отгрузки';
  if (stepId === 'factory') return 'На производстве';
  if (stepId === 'truck_load') return 'Погрузка';
  if (stepId === 'customs') return 'Таможня';
  return 'В пути';
}

export const WORKSHOP2_LOGISTICS_WORKFLOW_HINT_RU =
  'Этапы задаёт логист бренда вручную или TMS (если WORKSHOP2_TMS_API_URL настроен). Каждый переход пишется в journal с ролью, датой и комментарием. Отгрузка привязана к заказу образца; движение на складе — вкладка «Stock».';

/** Служебная запись journal для shippedAt/eta/notes без миграции PG. */
export const WORKSHOP2_LOGISTICS_META_STEP_ID = '_meta';

export type Workshop2LogisticsShipmentMeta = {
  shippedAt?: string;
  etaAt?: string;
  notes?: string;
  originContact?: string;
  destinationContact?: string;
  attachmentNote?: string;
};

export function encodeWorkshop2LogisticsMeta(meta: Workshop2LogisticsShipmentMeta): string {
  return JSON.stringify(meta);
}

export function decodeWorkshop2LogisticsMeta(
  journal: { stepId: string; desc?: string }[] | undefined
): Workshop2LogisticsShipmentMeta {
  const row = journal?.find((e) => e.stepId === WORKSHOP2_LOGISTICS_META_STEP_ID);
  if (!row?.desc) return {};
  try {
    return JSON.parse(row.desc) as Workshop2LogisticsShipmentMeta;
  } catch {
    return {};
  }
}

export function mergeWorkshop2LogisticsJournalMeta(
  journal: { stepId: string; title: string; desc?: string; at: string }[],
  meta: Workshop2LogisticsShipmentMeta
) {
  const withoutMeta = journal.filter((e) => e.stepId !== WORKSHOP2_LOGISTICS_META_STEP_ID);
  return [
    {
      stepId: WORKSHOP2_LOGISTICS_META_STEP_ID,
      title: 'meta',
      desc: encodeWorkshop2LogisticsMeta(meta),
      at: new Date().toISOString(),
    },
    ...withoutMeta,
  ];
}

export function visibleWorkshop2LogisticsJournal<T extends { stepId: string }>(journal: T[]): T[] {
  return journal.filter((e) => e.stepId !== WORKSHOP2_LOGISTICS_META_STEP_ID);
}
